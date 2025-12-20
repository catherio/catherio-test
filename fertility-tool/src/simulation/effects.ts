import type { Archetype, Intervention, InterventionType } from '../types';

interface EffectModifiers {
  desireModifier: number;
  feasibilityModifier: number;
}

// Effect calculation functions for each intervention type
// These return multipliers (1.0 = no change, 1.1 = 10% increase, etc.)

const calculateCashTransferEffect = (
  value: number,
  archetype: Archetype
): EffectModifiers => {
  // Cash transfers primarily affect feasibility
  // Effect is stronger for lower income groups
  const incomeMultiplier = {
    low: 1.5,
    medium: 1.2,
    high: 0.8,
    very_high: 0.4,
  }[archetype.traits.incomeLevel];

  // Diminishing returns: sqrt scaling
  const normalizedValue = value / 5000; // Normalize to 5000 AED baseline
  const feasibilityBoost = Math.sqrt(normalizedValue) * 0.15 * incomeMultiplier;

  // Small effect on desire (financial security improves outlook)
  const desireBoost = Math.sqrt(normalizedValue) * 0.05 * incomeMultiplier;

  return {
    desireModifier: 1 + desireBoost,
    feasibilityModifier: 1 + feasibilityBoost,
  };
};

const calculateHousingSubsidyEffect = (
  value: number,
  archetype: Archetype
): EffectModifiers => {
  // Housing subsidies strongly affect feasibility for renters
  const housingMultiplier = {
    owns_home: 0.2, // Already owns, less benefit
    rents: 1.5, // Maximum benefit
    family_home: 0.8, // Some benefit (may want to move out)
  }[archetype.traits.housingStatus];

  const normalizedValue = value / 50; // Normalize to 50% coverage
  const feasibilityBoost = Math.sqrt(normalizedValue) * 0.18 * housingMultiplier;

  // Housing stability can affect desire to have children
  const desireBoost = Math.sqrt(normalizedValue) * 0.08 * housingMultiplier;

  return {
    desireModifier: 1 + desireBoost,
    feasibilityModifier: 1 + feasibilityBoost,
  };
};

const calculateChildcareSubsidyEffect = (
  value: number,
  archetype: Archetype
): EffectModifiers => {
  // Childcare subsidies most benefit working parents with poor access
  const accessMultiplier = {
    excellent: 0.3,
    good: 0.7,
    limited: 1.3,
    poor: 1.6,
  }[archetype.traits.childcareAccess];

  // Employed individuals benefit more
  const employmentMultiplier = {
    employed: 1.4,
    self_employed: 1.2,
    homemaker: 0.3, // Little benefit, already caring for children
    unemployed: 0.5,
  }[archetype.traits.employmentStatus];

  const normalizedValue = value / 50;
  const combinedMultiplier = accessMultiplier * employmentMultiplier;
  const feasibilityBoost = Math.sqrt(normalizedValue) * 0.12 * combinedMultiplier;

  return {
    desireModifier: 1.0,
    feasibilityModifier: 1 + feasibilityBoost,
  };
};

const calculateParentalLeaveEffect = (
  value: number,
  archetype: Archetype
): EffectModifiers => {
  // Parental leave affects both desire and feasibility
  // Benefits employed individuals most
  const employmentMultiplier = {
    employed: 1.5,
    self_employed: 0.6,
    homemaker: 0.2,
    unemployed: 0.3,
  }[archetype.traits.employmentStatus];

  // Affects those with low work flexibility more
  const flexMultiplier = {
    high: 0.5,
    moderate: 0.9,
    low: 1.4,
    none: 1.6,
  }[archetype.traits.workFlexibility];

  const normalizedValue = value / 12; // 12 weeks as baseline
  const combinedMultiplier = employmentMultiplier * flexMultiplier;

  const desireBoost = Math.sqrt(normalizedValue) * 0.08 * combinedMultiplier;
  const feasibilityBoost = Math.sqrt(normalizedValue) * 0.10 * combinedMultiplier;

  return {
    desireModifier: 1 + desireBoost,
    feasibilityModifier: 1 + feasibilityBoost,
  };
};

const calculateHealthcareExpansionEffect = (
  value: number,
  archetype: Archetype
): EffectModifiers => {
  // Healthcare expansion primarily helps those with limited access
  // and older individuals who may need fertility treatment
  const accessMultiplier = {
    excellent: 0.3,
    good: 0.7,
    limited: 1.4,
    poor: 1.8,
  }[archetype.traits.healthcareAccess];

  // Older individuals benefit more (fertility treatments)
  const ageMultiplier = {
    '18-24': 0.5,
    '25-29': 0.8,
    '30-34': 1.0,
    '35-39': 1.4,
    '40-44': 1.8,
    '45+': 2.0,
  }[archetype.traits.ageGroup];

  const normalizedValue = value / 80; // 80% coverage as baseline
  const combinedMultiplier = accessMultiplier * ageMultiplier;

  // Strong effect on feasibility for those who need fertility treatment
  const feasibilityBoost = Math.sqrt(normalizedValue) * 0.15 * combinedMultiplier;

  // Some effect on desire (knowing treatment is available)
  const desireBoost = Math.sqrt(normalizedValue) * 0.05 * ageMultiplier;

  return {
    desireModifier: 1 + desireBoost,
    feasibilityModifier: 1 + feasibilityBoost,
  };
};

const calculateWorkFlexibilityEffect = (
  value: number,
  archetype: Archetype
): EffectModifiers => {
  // Work flexibility helps employed individuals with low flexibility
  const flexMultiplier = {
    high: 0.2,
    moderate: 0.6,
    low: 1.4,
    none: 1.8,
  }[archetype.traits.workFlexibility];

  const employmentMultiplier = {
    employed: 1.5,
    self_employed: 0.4, // Already flexible
    homemaker: 0.1,
    unemployed: 0.2,
  }[archetype.traits.employmentStatus];

  const normalizedValue = value / 5; // 5 as midpoint on 1-10 scale
  const combinedMultiplier = flexMultiplier * employmentMultiplier;

  const desireBoost = Math.sqrt(normalizedValue) * 0.10 * combinedMultiplier;
  const feasibilityBoost = Math.sqrt(normalizedValue) * 0.12 * combinedMultiplier;

  return {
    desireModifier: 1 + desireBoost,
    feasibilityModifier: 1 + feasibilityBoost,
  };
};

const calculateEducationSupportEffect = (
  value: number,
  archetype: Archetype
): EffectModifiers => {
  // Education support affects those with children or planning to have children
  // Stronger effect for those with existing children (proven need)
  const childrenMultiplier = {
    0: 0.6,
    1: 1.0,
    2: 1.3,
    3: 1.5,
    4: 1.6,
    5: 1.7,
  }[archetype.traits.existingChildren];

  // Income affects sensitivity to education costs
  const incomeMultiplier = {
    low: 1.5,
    medium: 1.2,
    high: 0.8,
    very_high: 0.4,
  }[archetype.traits.incomeLevel];

  const normalizedValue = value / 50;
  const combinedMultiplier = childrenMultiplier * incomeMultiplier;

  // Primarily affects desire (reduces worry about future costs)
  const desireBoost = Math.sqrt(normalizedValue) * 0.10 * combinedMultiplier;
  const feasibilityBoost = Math.sqrt(normalizedValue) * 0.08 * combinedMultiplier;

  return {
    desireModifier: 1 + desireBoost,
    feasibilityModifier: 1 + feasibilityBoost,
  };
};

const calculateTaxBenefitEffect = (
  value: number,
  archetype: Archetype
): EffectModifiers => {
  // Tax benefits are like cash transfers but structured differently
  // Affect feasibility primarily
  const incomeMultiplier = {
    low: 1.4,
    medium: 1.2,
    high: 0.9,
    very_high: 0.5,
  }[archetype.traits.incomeLevel];

  const normalizedValue = value / 10000; // 10,000 AED as baseline
  const feasibilityBoost = Math.sqrt(normalizedValue) * 0.12 * incomeMultiplier;
  const desireBoost = Math.sqrt(normalizedValue) * 0.04 * incomeMultiplier;

  return {
    desireModifier: 1 + desireBoost,
    feasibilityModifier: 1 + feasibilityBoost,
  };
};

// Main function to calculate intervention effect
export const calculateInterventionEffect = (
  intervention: Intervention,
  archetype: Archetype
): EffectModifiers => {
  const effectCalculators: Record<InterventionType, (value: number, archetype: Archetype) => EffectModifiers> = {
    cash_transfer: calculateCashTransferEffect,
    housing_subsidy: calculateHousingSubsidyEffect,
    childcare_subsidy: calculateChildcareSubsidyEffect,
    parental_leave: calculateParentalLeaveEffect,
    healthcare_expansion: calculateHealthcareExpansionEffect,
    work_flexibility: calculateWorkFlexibilityEffect,
    education_support: calculateEducationSupportEffect,
    tax_benefit: calculateTaxBenefitEffect,
  };

  const calculator = effectCalculators[intervention.type];
  if (!calculator) {
    return { desireModifier: 1, feasibilityModifier: 1 };
  }

  // Check if targeting criteria match
  if (intervention.targetCriteria) {
    const matches = Object.entries(intervention.targetCriteria).every(
      ([key, value]) => archetype.traits[key as keyof typeof archetype.traits] === value
    );
    if (!matches) {
      return { desireModifier: 1, feasibilityModifier: 1 };
    }
  }

  return calculator(intervention.value, archetype);
};

// Calculate combined effect of multiple interventions
export const calculateCombinedEffect = (
  interventions: Intervention[],
  archetype: Archetype
): EffectModifiers => {
  let desireModifier = 1;
  let feasibilityModifier = 1;

  for (const intervention of interventions) {
    const effect = calculateInterventionEffect(intervention, archetype);
    // Multiplicative combination (with diminishing returns built into individual effects)
    desireModifier *= effect.desireModifier;
    feasibilityModifier *= effect.feasibilityModifier;
  }

  // Cap at reasonable bounds (max 2x improvement)
  return {
    desireModifier: Math.min(desireModifier, 2.0),
    feasibilityModifier: Math.min(feasibilityModifier, 2.0),
  };
};
