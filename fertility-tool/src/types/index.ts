// Geographic unit types
export interface Geounit {
  id: string;
  name: string;
  nameAr: string;
  geometry: GeoJSON.Polygon;
  properties: GeounitProperties;
  archetypeDistribution: ArchetypeCount[];
}

export interface GeounitProperties {
  emiratiPopulation: number;
  urbanizationLevel: 'urban' | 'suburban' | 'rural';
  avgHouseholdIncome: number; // AED per month
  healthcareFacilityCount: number;
  childcareFacilityCount: number;
  avgFamilySize: number;
}

export interface ArchetypeCount {
  archetypeId: string;
  count: number;
}

// Archetype types
export type AgeGroup = '18-24' | '25-29' | '30-34' | '35-39' | '40-44' | '45+';
export type MaritalStatus = 'single' | 'married' | 'divorced' | 'widowed';
export type ChildrenCount = 0 | 1 | 2 | 3 | 4 | 5;
export type IncomeLevel = 'low' | 'medium' | 'high' | 'very_high';
export type EmploymentStatus = 'employed' | 'self_employed' | 'homemaker' | 'unemployed';
export type HousingStatus = 'owns_home' | 'rents' | 'family_home';
export type ProximityLevel = 'nearby' | 'same_city' | 'far' | 'none';
export type CulturalOrientation = 'traditional' | 'moderate' | 'progressive';
export type AccessLevel = 'excellent' | 'good' | 'limited' | 'poor';
export type FlexibilityLevel = 'high' | 'moderate' | 'low' | 'none';

export interface ArchetypeTraits {
  ageGroup: AgeGroup;
  maritalStatus: MaritalStatus;
  existingChildren: ChildrenCount;
  incomeLevel: IncomeLevel;
  employmentStatus: EmploymentStatus;
  housingStatus: HousingStatus;
  familySupportProximity: ProximityLevel;
  culturalOrientation: CulturalOrientation;
  healthcareAccess: AccessLevel;
  childcareAccess: AccessLevel;
  workFlexibility: FlexibilityLevel;
}

export interface Archetype {
  id: string;
  name: string;
  description: string;
  color: string; // For visualization
  traits: ArchetypeTraits;
  baseFertilityDesire: number; // 0-1 scale
  baseFertilityFeasibility: number; // 0-1 scale
}

// Policy types
export type InterventionType =
  | 'cash_transfer'
  | 'housing_subsidy'
  | 'childcare_subsidy'
  | 'parental_leave'
  | 'healthcare_expansion'
  | 'work_flexibility'
  | 'education_support'
  | 'tax_benefit';

export interface InterventionConfig {
  type: InterventionType;
  label: string;
  description: string;
  unit: string;
  minValue: number;
  maxValue: number;
  defaultValue: number;
  step: number;
  costPerUnit: number; // AED per person affected per year
}

export interface Intervention {
  id: string;
  type: InterventionType;
  value: number;
  targetCriteria?: Partial<ArchetypeTraits>; // Optional targeting
}

export interface Policy {
  id: string;
  name: string;
  description: string;
  interventions: Intervention[];
}

// Simulation outcome types
export interface ArchetypeOutcome {
  archetypeId: string;
  archetypeName: string;
  populationCount: number;
  baselineDesire: number;
  baselineFeasibility: number;
  baselineIntention: number;
  projectedDesire: number;
  projectedFeasibility: number;
  projectedIntention: number;
  intentionDelta: number;
  intentionDeltaPercent: number;
}

export interface GeounitOutcome {
  geounitId: string;
  geounitName: string;
  totalPopulation: number;
  baselineFertilityRate: number;
  projectedFertilityRate: number;
  deltaFertilityRate: number;
  deltaPercent: number;
  projectedAdditionalBirths: number;
  archetypeOutcomes: ArchetypeOutcome[];
}

export interface SimulationResult {
  policyId: string;
  policyName: string;
  timestamp: Date;

  // Aggregate metrics
  totalPopulation: number;
  baselineNationalFertilityRate: number;
  projectedNationalFertilityRate: number;
  nationalDeltaPercent: number;
  totalAdditionalBirths: number;

  // Cost estimates
  estimatedAnnualCost: number; // AED
  costPerAdditionalBirth: number; // AED

  // Detailed breakdowns
  geounitOutcomes: GeounitOutcome[];
  aggregateArchetypeOutcomes: ArchetypeOutcome[];
}

// App state types
export interface ComparisonState {
  policyA: Policy | null;
  policyB: Policy | null;
  resultA: SimulationResult | null;
  resultB: SimulationResult | null;
}
