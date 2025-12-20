import type { InterventionConfig, InterventionType } from '../types';

export const interventionConfigs: Record<InterventionType, InterventionConfig> = {
  cash_transfer: {
    type: 'cash_transfer',
    label: 'Monthly Cash Transfer',
    description: 'Direct monthly payment to families with children or expecting',
    unit: 'AED/month',
    minValue: 0,
    maxValue: 10000,
    defaultValue: 2000,
    step: 500,
    costPerUnit: 12, // Annual cost = monthly * 12
  },
  housing_subsidy: {
    type: 'housing_subsidy',
    label: 'Housing Subsidy',
    description: 'Subsidy towards housing costs for families',
    unit: '% of rent/mortgage',
    minValue: 0,
    maxValue: 100,
    defaultValue: 30,
    step: 5,
    costPerUnit: 600, // Rough estimate per percentage point per person per year
  },
  childcare_subsidy: {
    type: 'childcare_subsidy',
    label: 'Childcare Subsidy',
    description: 'Coverage of childcare costs for working parents',
    unit: '% coverage',
    minValue: 0,
    maxValue: 100,
    defaultValue: 50,
    step: 10,
    costPerUnit: 400, // Per percentage point per child per year
  },
  parental_leave: {
    type: 'parental_leave',
    label: 'Paid Parental Leave',
    description: 'Extended paid leave for new parents',
    unit: 'weeks',
    minValue: 0,
    maxValue: 52,
    defaultValue: 12,
    step: 2,
    costPerUnit: 2000, // Cost per week per person
  },
  healthcare_expansion: {
    type: 'healthcare_expansion',
    label: 'Fertility Healthcare',
    description: 'Coverage for fertility treatments and prenatal care',
    unit: '% coverage',
    minValue: 0,
    maxValue: 100,
    defaultValue: 80,
    step: 10,
    costPerUnit: 500, // Per percentage point per person per year
  },
  work_flexibility: {
    type: 'work_flexibility',
    label: 'Work Flexibility Policy',
    description: 'Mandated flexible work arrangements for parents',
    unit: 'flexibility score (1-10)',
    minValue: 0,
    maxValue: 10,
    defaultValue: 5,
    step: 1,
    costPerUnit: 1000, // Administrative/compliance cost per point
  },
  education_support: {
    type: 'education_support',
    label: 'Child Education Support',
    description: 'Subsidies for children\'s education costs',
    unit: '% coverage',
    minValue: 0,
    maxValue: 100,
    defaultValue: 50,
    step: 10,
    costPerUnit: 300, // Per percentage point per child per year
  },
  tax_benefit: {
    type: 'tax_benefit',
    label: 'Family Tax Benefit',
    description: 'Tax credits and deductions for families with children',
    unit: 'AED/year per child',
    minValue: 0,
    maxValue: 50000,
    defaultValue: 10000,
    step: 2500,
    costPerUnit: 1, // Direct cost equals the benefit
  },
};

export const getInterventionConfig = (type: InterventionType): InterventionConfig => {
  return interventionConfigs[type];
};

export const allInterventionTypes: InterventionType[] = Object.keys(interventionConfigs) as InterventionType[];
