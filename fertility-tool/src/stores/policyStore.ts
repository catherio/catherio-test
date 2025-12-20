import { create } from 'zustand';
import type { Intervention, Policy, SimulationResult } from '../types';
import { runSimulation, createBaselineResult } from '../simulation/engine';

interface PolicyState {
  // Policy A (always active)
  policyA: Policy;
  resultA: SimulationResult;

  // Policy B (optional comparison)
  policyB: Policy | null;
  resultB: SimulationResult | null;

  // Comparison mode
  isComparing: boolean;

  // Selected geounit for detail view
  selectedGeounitId: string | null;

  // Actions
  updatePolicyA: (policy: Partial<Policy>) => void;
  addInterventionA: (intervention: Intervention) => void;
  updateInterventionA: (id: string, updates: Partial<Intervention>) => void;
  removeInterventionA: (id: string) => void;

  enableComparison: () => void;
  disableComparison: () => void;
  updatePolicyB: (policy: Partial<Policy>) => void;
  addInterventionB: (intervention: Intervention) => void;
  updateInterventionB: (id: string, updates: Partial<Intervention>) => void;
  removeInterventionB: (id: string) => void;

  selectGeounit: (id: string | null) => void;

  resetAll: () => void;
}

const createDefaultPolicy = (name: string): Policy => ({
  id: `policy-${Date.now()}`,
  name,
  description: '',
  interventions: [],
});

const initialPolicyA = createDefaultPolicy('Policy A');
const initialResultA = createBaselineResult();

export const usePolicyStore = create<PolicyState>((set) => ({
  policyA: initialPolicyA,
  resultA: initialResultA,
  policyB: null,
  resultB: null,
  isComparing: false,
  selectedGeounitId: null,

  updatePolicyA: (updates) => {
    set((state) => {
      const newPolicy = { ...state.policyA, ...updates };
      return {
        policyA: newPolicy,
        resultA: runSimulation(newPolicy),
      };
    });
  },

  addInterventionA: (intervention) => {
    set((state) => {
      const newPolicy = {
        ...state.policyA,
        interventions: [...state.policyA.interventions, intervention],
      };
      return {
        policyA: newPolicy,
        resultA: runSimulation(newPolicy),
      };
    });
  },

  updateInterventionA: (id, updates) => {
    set((state) => {
      const newPolicy = {
        ...state.policyA,
        interventions: state.policyA.interventions.map((i) =>
          i.id === id ? { ...i, ...updates } : i
        ),
      };
      return {
        policyA: newPolicy,
        resultA: runSimulation(newPolicy),
      };
    });
  },

  removeInterventionA: (id) => {
    set((state) => {
      const newPolicy = {
        ...state.policyA,
        interventions: state.policyA.interventions.filter((i) => i.id !== id),
      };
      return {
        policyA: newPolicy,
        resultA: runSimulation(newPolicy),
      };
    });
  },

  enableComparison: () => {
    const policyB = createDefaultPolicy('Policy B');
    set({
      isComparing: true,
      policyB,
      resultB: runSimulation(policyB),
    });
  },

  disableComparison: () => {
    set({
      isComparing: false,
      policyB: null,
      resultB: null,
    });
  },

  updatePolicyB: (updates) => {
    set((state) => {
      if (!state.policyB) return state;
      const newPolicy = { ...state.policyB, ...updates };
      return {
        policyB: newPolicy,
        resultB: runSimulation(newPolicy),
      };
    });
  },

  addInterventionB: (intervention) => {
    set((state) => {
      if (!state.policyB) return state;
      const newPolicy = {
        ...state.policyB,
        interventions: [...state.policyB.interventions, intervention],
      };
      return {
        policyB: newPolicy,
        resultB: runSimulation(newPolicy),
      };
    });
  },

  updateInterventionB: (id, updates) => {
    set((state) => {
      if (!state.policyB) return state;
      const newPolicy = {
        ...state.policyB,
        interventions: state.policyB.interventions.map((i) =>
          i.id === id ? { ...i, ...updates } : i
        ),
      };
      return {
        policyB: newPolicy,
        resultB: runSimulation(newPolicy),
      };
    });
  },

  removeInterventionB: (id) => {
    set((state) => {
      if (!state.policyB) return state;
      const newPolicy = {
        ...state.policyB,
        interventions: state.policyB.interventions.filter((i) => i.id !== id),
      };
      return {
        policyB: newPolicy,
        resultB: runSimulation(newPolicy),
      };
    });
  },

  selectGeounit: (id) => {
    set({ selectedGeounitId: id });
  },

  resetAll: () => {
    const newPolicyA = createDefaultPolicy('Policy A');
    set({
      policyA: newPolicyA,
      resultA: runSimulation(newPolicyA),
      policyB: null,
      resultB: null,
      isComparing: false,
      selectedGeounitId: null,
    });
  },
}));
