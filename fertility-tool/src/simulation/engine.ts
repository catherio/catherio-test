import type {
  Archetype,
  ArchetypeOutcome,
  Geounit,
  GeounitOutcome,
  Intervention,
  Policy,
  SimulationResult,
} from '../types';
import { getArchetypeById } from '../data/archetypes';
import { geounits, totalEmiratiPopulation } from '../data/geounits';
import { interventionConfigs } from '../data/interventions';
import { calculateCombinedEffect } from './effects';

// Calculate fertility intention from desire and feasibility
// Using a modified geometric mean that emphasizes bottlenecks
const calculateIntention = (desire: number, feasibility: number): number => {
  // Intention requires both desire and feasibility
  // If either is very low, intention is low
  const bottleneck = Math.min(desire, feasibility);
  const average = Math.sqrt(desire * feasibility);

  // Weight toward the bottleneck
  return 0.4 * bottleneck + 0.6 * average;
};

// Convert intention to fertility rate
// This is a simplified model - in reality would need calibration to actual data
const intentionToFertilityRate = (intention: number, baseRate: number = 1.4): number => {
  // Intention of 0.5 maps to baseline rate
  // Higher intention increases rate, lower decreases
  const multiplier = 0.6 + (intention * 0.8); // Range: 0.6 to 1.4 multiplier
  return baseRate * multiplier;
};

// Calculate outcomes for a single archetype
const calculateArchetypeOutcome = (
  archetype: Archetype,
  interventions: Intervention[],
  populationCount: number
): ArchetypeOutcome => {
  const baselineIntention = calculateIntention(
    archetype.baseFertilityDesire,
    archetype.baseFertilityFeasibility
  );

  const effects = calculateCombinedEffect(interventions, archetype);

  const projectedDesire = Math.min(1, archetype.baseFertilityDesire * effects.desireModifier);
  const projectedFeasibility = Math.min(1, archetype.baseFertilityFeasibility * effects.feasibilityModifier);
  const projectedIntention = calculateIntention(projectedDesire, projectedFeasibility);

  const intentionDelta = projectedIntention - baselineIntention;
  const intentionDeltaPercent = baselineIntention > 0
    ? (intentionDelta / baselineIntention) * 100
    : 0;

  return {
    archetypeId: archetype.id,
    archetypeName: archetype.name,
    populationCount,
    baselineDesire: archetype.baseFertilityDesire,
    baselineFeasibility: archetype.baseFertilityFeasibility,
    baselineIntention,
    projectedDesire,
    projectedFeasibility,
    projectedIntention,
    intentionDelta,
    intentionDeltaPercent,
  };
};

// Calculate outcomes for a single geounit
const calculateGeounitOutcome = (
  geounit: Geounit,
  interventions: Intervention[]
): GeounitOutcome => {
  const archetypeOutcomes: ArchetypeOutcome[] = [];

  let totalBaselineIntention = 0;
  let totalProjectedIntention = 0;
  let totalPopulation = 0;

  for (const { archetypeId, count } of geounit.archetypeDistribution) {
    const archetype = getArchetypeById(archetypeId);
    if (!archetype) continue;

    const outcome = calculateArchetypeOutcome(archetype, interventions, count);
    archetypeOutcomes.push(outcome);

    totalBaselineIntention += outcome.baselineIntention * count;
    totalProjectedIntention += outcome.projectedIntention * count;
    totalPopulation += count;
  }

  const avgBaselineIntention = totalPopulation > 0
    ? totalBaselineIntention / totalPopulation
    : 0;
  const avgProjectedIntention = totalPopulation > 0
    ? totalProjectedIntention / totalPopulation
    : 0;

  const baselineFertilityRate = intentionToFertilityRate(avgBaselineIntention);
  const projectedFertilityRate = intentionToFertilityRate(avgProjectedIntention);
  const deltaFertilityRate = projectedFertilityRate - baselineFertilityRate;
  const deltaPercent = baselineFertilityRate > 0
    ? (deltaFertilityRate / baselineFertilityRate) * 100
    : 0;

  // Estimate additional births (simplified: assume ~25% of population is women of childbearing age)
  const womenOfChildbearingAge = totalPopulation * 0.25;
  const projectedAdditionalBirths = womenOfChildbearingAge * deltaFertilityRate;

  return {
    geounitId: geounit.id,
    geounitName: geounit.name,
    totalPopulation,
    baselineFertilityRate,
    projectedFertilityRate,
    deltaFertilityRate,
    deltaPercent,
    projectedAdditionalBirths: Math.round(projectedAdditionalBirths),
    archetypeOutcomes,
  };
};

// Calculate total policy cost
const calculatePolicyCost = (interventions: Intervention[]): number => {
  let totalCost = 0;

  for (const intervention of interventions) {
    const config = interventionConfigs[intervention.type];
    if (!config) continue;

    // Estimate affected population based on targeting
    let affectedPopulation = totalEmiratiPopulation;

    // If targeting specific criteria, reduce affected population
    if (intervention.targetCriteria) {
      // Rough estimate: each targeting criterion reduces population by 30-50%
      const criteriaCount = Object.keys(intervention.targetCriteria).length;
      affectedPopulation *= Math.pow(0.4, criteriaCount);
    }

    // Calculate cost based on intervention value and affected population
    const unitCost = config.costPerUnit * intervention.value;
    totalCost += unitCost * affectedPopulation;
  }

  return Math.round(totalCost);
};

// Aggregate archetype outcomes across all geounits
const aggregateArchetypeOutcomes = (
  geounitOutcomes: GeounitOutcome[]
): ArchetypeOutcome[] => {
  const aggregated: Map<string, ArchetypeOutcome> = new Map();

  for (const geounit of geounitOutcomes) {
    for (const outcome of geounit.archetypeOutcomes) {
      const existing = aggregated.get(outcome.archetypeId);

      if (existing) {
        // Weighted average by population
        const totalPop = existing.populationCount + outcome.populationCount;
        const weight1 = existing.populationCount / totalPop;
        const weight2 = outcome.populationCount / totalPop;

        aggregated.set(outcome.archetypeId, {
          ...existing,
          populationCount: totalPop,
          baselineIntention: existing.baselineIntention * weight1 + outcome.baselineIntention * weight2,
          projectedIntention: existing.projectedIntention * weight1 + outcome.projectedIntention * weight2,
          projectedDesire: existing.projectedDesire * weight1 + outcome.projectedDesire * weight2,
          projectedFeasibility: existing.projectedFeasibility * weight1 + outcome.projectedFeasibility * weight2,
          intentionDelta: existing.intentionDelta * weight1 + outcome.intentionDelta * weight2,
          intentionDeltaPercent: existing.intentionDeltaPercent * weight1 + outcome.intentionDeltaPercent * weight2,
        });
      } else {
        aggregated.set(outcome.archetypeId, { ...outcome });
      }
    }
  }

  return Array.from(aggregated.values());
};

// Main simulation function
export const runSimulation = (policy: Policy): SimulationResult => {
  const geounitOutcomes = geounits.map(g =>
    calculateGeounitOutcome(g, policy.interventions)
  );

  // Calculate national aggregates
  let totalBaselineWeighted = 0;
  let totalProjectedWeighted = 0;
  let totalAdditionalBirths = 0;
  let totalPop = 0;

  for (const outcome of geounitOutcomes) {
    totalBaselineWeighted += outcome.baselineFertilityRate * outcome.totalPopulation;
    totalProjectedWeighted += outcome.projectedFertilityRate * outcome.totalPopulation;
    totalAdditionalBirths += outcome.projectedAdditionalBirths;
    totalPop += outcome.totalPopulation;
  }

  const baselineNationalFertilityRate = totalPop > 0
    ? totalBaselineWeighted / totalPop
    : 0;
  const projectedNationalFertilityRate = totalPop > 0
    ? totalProjectedWeighted / totalPop
    : 0;
  const nationalDeltaPercent = baselineNationalFertilityRate > 0
    ? ((projectedNationalFertilityRate - baselineNationalFertilityRate) / baselineNationalFertilityRate) * 100
    : 0;

  const estimatedAnnualCost = calculatePolicyCost(policy.interventions);
  const costPerAdditionalBirth = totalAdditionalBirths > 0
    ? estimatedAnnualCost / totalAdditionalBirths
    : 0;

  const aggregateArchetypes = aggregateArchetypeOutcomes(geounitOutcomes);

  return {
    policyId: policy.id,
    policyName: policy.name,
    timestamp: new Date(),
    totalPopulation: totalPop,
    baselineNationalFertilityRate,
    projectedNationalFertilityRate,
    nationalDeltaPercent,
    totalAdditionalBirths: Math.round(totalAdditionalBirths),
    estimatedAnnualCost,
    costPerAdditionalBirth: Math.round(costPerAdditionalBirth),
    geounitOutcomes,
    aggregateArchetypeOutcomes: aggregateArchetypes,
  };
};

// Create an empty/baseline simulation result
export const createBaselineResult = (): SimulationResult => {
  return runSimulation({
    id: 'baseline',
    name: 'Baseline (No Policy)',
    description: 'Current state without any new interventions',
    interventions: [],
  });
};
