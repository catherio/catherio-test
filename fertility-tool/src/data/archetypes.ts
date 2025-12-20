import type { Archetype } from '../types';

export const archetypes: Archetype[] = [
  {
    id: 'young-professional-couple',
    name: 'Young Professional Couple',
    description: 'Married couples aged 25-34, dual income, no children yet, focused on careers',
    color: '#3B82F6', // Blue
    traits: {
      ageGroup: '25-29',
      maritalStatus: 'married',
      existingChildren: 0,
      incomeLevel: 'high',
      employmentStatus: 'employed',
      housingStatus: 'rents',
      familySupportProximity: 'same_city',
      culturalOrientation: 'moderate',
      healthcareAccess: 'excellent',
      childcareAccess: 'limited',
      workFlexibility: 'low',
    },
    baseFertilityDesire: 0.75,
    baseFertilityFeasibility: 0.45,
  },
  {
    id: 'established-family',
    name: 'Established Family',
    description: 'Married couples aged 30-39 with 1-2 children, stable income and housing',
    color: '#10B981', // Green
    traits: {
      ageGroup: '30-34',
      maritalStatus: 'married',
      existingChildren: 2,
      incomeLevel: 'high',
      employmentStatus: 'employed',
      housingStatus: 'owns_home',
      familySupportProximity: 'nearby',
      culturalOrientation: 'moderate',
      healthcareAccess: 'good',
      childcareAccess: 'good',
      workFlexibility: 'moderate',
    },
    baseFertilityDesire: 0.55,
    baseFertilityFeasibility: 0.65,
  },
  {
    id: 'traditional-large-family',
    name: 'Traditional Large Family',
    description: 'Traditional families with 3+ children, strong extended family ties',
    color: '#8B5CF6', // Purple
    traits: {
      ageGroup: '35-39',
      maritalStatus: 'married',
      existingChildren: 4,
      incomeLevel: 'medium',
      employmentStatus: 'employed',
      housingStatus: 'owns_home',
      familySupportProximity: 'nearby',
      culturalOrientation: 'traditional',
      healthcareAccess: 'good',
      childcareAccess: 'excellent',
      workFlexibility: 'moderate',
    },
    baseFertilityDesire: 0.70,
    baseFertilityFeasibility: 0.40,
  },
  {
    id: 'young-newlywed',
    name: 'Young Newlywed',
    description: 'Recently married young adults, starting their family journey',
    color: '#F59E0B', // Amber
    traits: {
      ageGroup: '18-24',
      maritalStatus: 'married',
      existingChildren: 0,
      incomeLevel: 'medium',
      employmentStatus: 'employed',
      housingStatus: 'family_home',
      familySupportProximity: 'nearby',
      culturalOrientation: 'traditional',
      healthcareAccess: 'good',
      childcareAccess: 'excellent',
      workFlexibility: 'low',
    },
    baseFertilityDesire: 0.85,
    baseFertilityFeasibility: 0.55,
  },
  {
    id: 'single-mother',
    name: 'Single Mother',
    description: 'Divorced or widowed women with children, managing alone',
    color: '#EF4444', // Red
    traits: {
      ageGroup: '30-34',
      maritalStatus: 'divorced',
      existingChildren: 1,
      incomeLevel: 'medium',
      employmentStatus: 'employed',
      housingStatus: 'rents',
      familySupportProximity: 'same_city',
      culturalOrientation: 'moderate',
      healthcareAccess: 'good',
      childcareAccess: 'limited',
      workFlexibility: 'low',
    },
    baseFertilityDesire: 0.30,
    baseFertilityFeasibility: 0.25,
  },
  {
    id: 'homemaker-family',
    name: 'Homemaker Family',
    description: 'Single-income families with stay-at-home mother',
    color: '#EC4899', // Pink
    traits: {
      ageGroup: '30-34',
      maritalStatus: 'married',
      existingChildren: 2,
      incomeLevel: 'high',
      employmentStatus: 'homemaker',
      housingStatus: 'owns_home',
      familySupportProximity: 'nearby',
      culturalOrientation: 'traditional',
      healthcareAccess: 'excellent',
      childcareAccess: 'excellent',
      workFlexibility: 'high',
    },
    baseFertilityDesire: 0.80,
    baseFertilityFeasibility: 0.70,
  },
  {
    id: 'career-focused-couple',
    name: 'Career-Focused Couple',
    description: 'High-income professionals prioritizing career advancement',
    color: '#6366F1', // Indigo
    traits: {
      ageGroup: '35-39',
      maritalStatus: 'married',
      existingChildren: 1,
      incomeLevel: 'very_high',
      employmentStatus: 'employed',
      housingStatus: 'owns_home',
      familySupportProximity: 'far',
      culturalOrientation: 'progressive',
      healthcareAccess: 'excellent',
      childcareAccess: 'good',
      workFlexibility: 'low',
    },
    baseFertilityDesire: 0.45,
    baseFertilityFeasibility: 0.55,
  },
  {
    id: 'late-starter',
    name: 'Late Starter',
    description: 'Couples starting families later in life, often facing fertility challenges',
    color: '#14B8A6', // Teal
    traits: {
      ageGroup: '40-44',
      maritalStatus: 'married',
      existingChildren: 0,
      incomeLevel: 'very_high',
      employmentStatus: 'employed',
      housingStatus: 'owns_home',
      familySupportProximity: 'same_city',
      culturalOrientation: 'progressive',
      healthcareAccess: 'excellent',
      childcareAccess: 'good',
      workFlexibility: 'moderate',
    },
    baseFertilityDesire: 0.80,
    baseFertilityFeasibility: 0.30,
  },
];

export const getArchetypeById = (id: string): Archetype | undefined => {
  return archetypes.find(a => a.id === id);
};

export const getArchetypesByTrait = <K extends keyof Archetype['traits']>(
  trait: K,
  value: Archetype['traits'][K]
): Archetype[] => {
  return archetypes.filter(a => a.traits[trait] === value);
};
