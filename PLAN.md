# Abu Dhabi Fertility Policy Exploration Tool - Prototype Plan

## Executive Summary

A web-based tool enabling Abu Dhabi policymakers to explore how fertility policy proposals affect Emirati citizen fertility outcomes across geographic units. Users input policy proposals (single or A/B comparison) and visualize projected fertility outcomes on a map.

---

## 1. Conceptual Model

### Fertility Pathway Framework

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   FERTILITY     │ ──► │   FERTILITY     │ ──► │   FERTILITY     │ ──► │   FERTILITY     │
│    DESIRES      │     │  FEASIBILITY    │     │   INTENTIONS    │     │    OUTCOMES     │
│                 │     │                 │     │                 │     │                 │
│ "What I want"   │     │ "What's possible│     │ "What I plan    │     │ "What happens"  │
│                 │     │  given my       │     │  to do"         │     │                 │
│                 │     │  constraints"   │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Trait Categories

**Desire Traits** (affect what people want):
- Cultural/religious orientation
- Family size norms
- Career aspirations
- Partner fertility preferences

**Feasibility Traits** (affect what's possible):
- Age and biological factors
- Economic stability (income, employment, housing)
- Healthcare access
- Childcare availability
- Family support network proximity
- Work-life balance capacity

**Mediating Factors**:
- Education level
- Marital status
- Existing number of children
- Years since last birth

---

## 2. Data Architecture

### 2.1 Geounit Structure

```typescript
interface Geounit {
  id: string;
  name: string;
  geometry: GeoJSON.Polygon;
  properties: {
    emiratiPopulation: number;
    urbanizationLevel: 'urban' | 'suburban' | 'rural';
    avgHouseholdIncome: number;
    healthcareFacilityCount: number;
    childcareFacilityCount: number;
  };
  archetypeDistribution: ArchetypeCount[];
}
```

### 2.2 Archetype Structure

```typescript
interface Archetype {
  id: string;
  name: string;  // e.g., "Young Professional Couple"
  traits: {
    // Demographics
    ageGroup: '18-24' | '25-29' | '30-34' | '35-39' | '40-44' | '45+';
    maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
    existingChildren: 0 | 1 | 2 | 3 | 4 | '5+';

    // Economic
    incomeLevel: 'low' | 'medium' | 'high' | 'very_high';
    employmentStatus: 'employed' | 'self_employed' | 'homemaker' | 'unemployed';
    housingStatus: 'owns_home' | 'rents' | 'family_home';

    // Social/Cultural
    familySupportProximity: 'nearby' | 'same_city' | 'far' | 'none';
    culturalOrientation: 'traditional' | 'moderate' | 'progressive';

    // Access
    healthcareAccess: 'excellent' | 'good' | 'limited' | 'poor';
    childcareAccess: 'excellent' | 'good' | 'limited' | 'poor';
    workFlexibility: 'high' | 'moderate' | 'low' | 'none';
  };

  // Baseline fertility metrics (before policy)
  baseFertilityDesire: number;      // 0-1 scale
  baseFertilityFeasibility: number; // 0-1 scale
}

interface ArchetypeCount {
  archetypeId: string;
  count: number;  // Estimated individuals matching this archetype
}
```

### 2.3 Policy Structure

```typescript
interface Policy {
  id: string;
  name: string;
  description: string;
  interventions: Intervention[];
}

interface Intervention {
  type: InterventionType;
  parameters: Record<string, number | string>;
  targetTraits?: Partial<Archetype['traits']>;  // Who it affects
}

type InterventionType =
  | 'cash_transfer'           // Direct financial support
  | 'housing_subsidy'         // Housing assistance
  | 'childcare_subsidy'       // Childcare cost reduction
  | 'parental_leave'          // Extended leave policies
  | 'healthcare_expansion'    // Fertility treatment coverage
  | 'work_flexibility'        // Flexible work mandates
  | 'education_support'       // Education cost coverage for children
  | 'tax_benefit';            // Tax incentives for families
```

---

## 3. Simulation Model

### 3.1 Effect Calculation (Simplified for Prototype)

```typescript
interface PolicyEffect {
  desireModifier: number;      // Multiplicative effect on desire
  feasibilityModifier: number; // Multiplicative effect on feasibility
  conditions: TraitCondition[]; // When this effect applies
}

// Calculate projected fertility intention
function calculateFertilityIntention(
  archetype: Archetype,
  policy: Policy
): number {
  let desire = archetype.baseFertilityDesire;
  let feasibility = archetype.baseFertilityFeasibility;

  for (const intervention of policy.interventions) {
    const effect = getInterventionEffect(intervention, archetype);
    desire *= effect.desireModifier;
    feasibility *= effect.feasibilityModifier;
  }

  // Intention is function of both desire and feasibility
  // Using minimum as bottleneck model (can't intend what's not feasible)
  const intention = Math.min(desire, feasibility) *
                    Math.sqrt(desire * feasibility);

  return Math.min(1, intention);
}
```

### 3.2 Outcome Projection

```typescript
interface GeounitOutcome {
  geounitId: string;
  baselineFertilityRate: number;
  projectedFertilityRate: number;
  deltaFertilityRate: number;
  projectedAdditionalBirths: number;
  affectedPopulation: number;

  // Breakdown by archetype
  archetypeOutcomes: {
    archetypeId: string;
    baselineIntention: number;
    projectedIntention: number;
    populationCount: number;
  }[];
}
```

---

## 4. Technical Architecture

### 4.1 Recommended Stack (Prototype)

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │    React     │  │   Leaflet/   │  │    Recharts/         │  │
│  │  + TypeScript│  │   Mapbox GL  │  │    D3 (charts)       │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Zustand (State Management)                   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SIMULATION ENGINE                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Policy Effect Calculator (TypeScript, runs in browser)   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  Geounit     │  │  Archetype   │  │  Policy Effect       │  │
│  │  GeoJSON     │  │  Definitions │  │  Parameters          │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│                    (Static JSON files for prototype)            │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 File Structure

```
abu-dhabi-fertility-tool/
├── public/
│   └── data/
│       ├── geounits.geojson          # Abu Dhabi geographic units
│       ├── archetypes.json           # Archetype definitions
│       └── policy-effects.json       # Effect parameter mappings
├── src/
│   ├── components/
│   │   ├── Map/
│   │   │   ├── GeounitMap.tsx        # Main map visualization
│   │   │   ├── GeounitLayer.tsx      # Choropleth layer
│   │   │   └── Legend.tsx            # Map legend
│   │   ├── Policy/
│   │   │   ├── PolicyEditor.tsx      # Policy input form
│   │   │   ├── InterventionCard.tsx  # Individual intervention UI
│   │   │   └── PolicyComparison.tsx  # A/B comparison view
│   │   ├── Results/
│   │   │   ├── OutcomeSummary.tsx    # Aggregate statistics
│   │   │   ├── ArchetypeBreakdown.tsx# Impact by archetype
│   │   │   └── GeounitDetail.tsx     # Single geounit deep-dive
│   │   └── Layout/
│   │       ├── Header.tsx
│   │       └── Sidebar.tsx
│   ├── simulation/
│   │   ├── engine.ts                 # Core simulation logic
│   │   ├── effects.ts                # Policy effect calculations
│   │   └── aggregation.ts            # Geounit-level aggregation
│   ├── types/
│   │   ├── archetype.ts
│   │   ├── geounit.ts
│   │   ├── policy.ts
│   │   └── outcome.ts
│   ├── stores/
│   │   ├── policyStore.ts            # Policy state management
│   │   └── simulationStore.ts        # Results state
│   ├── hooks/
│   │   ├── useSimulation.ts
│   │   └── useGeoData.ts
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 5. User Interface Design

### 5.1 Main Layout

```
┌────────────────────────────────────────────────────────────────────────────┐
│  Abu Dhabi Fertility Policy Explorer                          [Settings]   │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌─────────────────────┐  ┌──────────────────────────────────────────────┐│
│  │ POLICY A            │  │                                              ││
│  │ ─────────────────── │  │                                              ││
│  │ [+ Add Intervention]│  │                                              ││
│  │                     │  │              MAP VISUALIZATION               ││
│  │ ┌─────────────────┐ │  │                                              ││
│  │ │ Cash Transfer   │ │  │         (Choropleth showing fertility        ││
│  │ │ 5000 AED/month  │ │  │          rate changes by geounit)            ││
│  │ │ [Edit] [Remove] │ │  │                                              ││
│  │ └─────────────────┘ │  │                                              ││
│  │                     │  │                                              ││
│  │ ┌─────────────────┐ │  │                                              ││
│  │ │ Childcare Sub.  │ │  │                                              ││
│  │ │ 50% coverage    │ │  │                                              ││
│  │ │ [Edit] [Remove] │ │  │                                              ││
│  │ └─────────────────┘ │  │                                              ││
│  │                     │  ├──────────────────────────────────────────────┤│
│  ├─────────────────────┤  │  OUTCOMES SUMMARY                            ││
│  │ POLICY B (optional) │  │  ───────────────────                         ││
│  │ ─────────────────── │  │  Baseline: 1.42 births/woman                 ││
│  │ [+ Add Intervention]│  │  Projected: 1.67 births/woman (+17.6%)       ││
│  │                     │  │  Additional births: ~2,340/year              ││
│  │ [Compare A vs B]    │  │                                              ││
│  │                     │  │  [View by Archetype] [View by Region]        ││
│  └─────────────────────┘  └──────────────────────────────────────────────┘│
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 A/B Comparison View

```
┌────────────────────────────────────────────────────────────────────────────┐
│  Comparing: Policy A vs Policy B                              [Back]       │
├────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────┐ ┌─────────────────────────────────┐  │
│  │         POLICY A MAP            │ │         POLICY B MAP            │  │
│  │                                 │ │                                 │  │
│  │                                 │ │                                 │  │
│  │                                 │ │                                 │  │
│  └─────────────────────────────────┘ └─────────────────────────────────┘  │
│  ┌─────────────────────────────────┐ ┌─────────────────────────────────┐  │
│  │ Projected Rate: 1.67           │ │ Projected Rate: 1.58            │  │
│  │ Change: +17.6%                  │ │ Change: +11.3%                  │  │
│  │ Est. Cost: 450M AED/year        │ │ Est. Cost: 280M AED/year        │  │
│  └─────────────────────────────────┘ └─────────────────────────────────┘  │
│                                                                            │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │  DIFFERENTIAL IMPACT BY ARCHETYPE                                   │   │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                                     │   │
│  │  Young Prof. Couples:  A: +22%  B: +15%  (A wins by 7%)            │   │
│  │  Est. Families:        A: +8%   B: +12%  (B wins by 4%)            │   │
│  │  Single Parents:       A: +31%  B: +18%  (A wins by 13%)           │   │
│  └────────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Implementation Phases

### Phase 1: Foundation (Week 1-2 equivalent effort)
- [ ] Set up React + TypeScript + Vite project
- [ ] Define TypeScript types for all data structures
- [ ] Create mock GeoJSON for Abu Dhabi (simplified polygons)
- [ ] Define 8-12 representative archetypes
- [ ] Implement basic map rendering with Leaflet

### Phase 2: Simulation Engine (Week 2-3)
- [ ] Implement policy effect calculations
- [ ] Build fertility intention computation
- [ ] Create geounit-level aggregation
- [ ] Add outcome projection logic

### Phase 3: Policy Interface (Week 3-4)
- [ ] Build policy editor UI
- [ ] Implement intervention configuration forms
- [ ] Add policy save/load functionality
- [ ] Create preset policy templates

### Phase 4: Visualization & Comparison (Week 4-5)
- [ ] Implement choropleth visualization
- [ ] Add archetype breakdown charts
- [ ] Build A/B comparison view
- [ ] Add geounit detail panel

### Phase 5: Refinement (Week 5-6)
- [ ] User testing with stakeholders
- [ ] Calibrate effect parameters
- [ ] Add help/documentation
- [ ] Performance optimization

---

## 7. Key Decisions Needed

Before implementation, we should discuss:

### 7.1 Data Questions
1. **Real geographic data**: Do we have access to actual Abu Dhabi administrative boundaries, or should we create simplified mock data?
2. **Population data**: What granularity of Emirati population data is available by area?
3. **Existing research**: Are there UAE-specific fertility studies that can inform archetype definitions and effect magnitudes?

### 7.2 Model Complexity
1. **Simulation sophistication**: Start with simple linear effects, or implement more complex non-linear dynamics?
2. **Temporal modeling**: Should we model single-year outcomes or multi-year trajectories?
3. **Uncertainty**: Should the prototype include confidence intervals?

### 7.3 Scope Questions
1. **Cost modeling**: Should policies include estimated cost calculations?
2. **Constraints**: Should the tool enforce budget constraints or policy feasibility limits?
3. **Export**: What output formats do policymakers need (PDF reports, data exports)?

---

## 8. Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Inaccurate effect parameters | Use literature-based ranges; allow parameter sensitivity analysis |
| Oversimplified archetypes | Start with fewer, well-defined archetypes; expand based on feedback |
| Geographic data unavailability | Create credible synthetic data with realistic characteristics |
| Model misuse (over-confidence) | Include prominent uncertainty messaging; avoid false precision |
| Scope creep | Strict phase gating; prototype-first mentality |

---

## 9. Next Steps

1. **Review and approve this plan**
2. **Gather available data** (geography, demographics, research)
3. **Finalize archetype definitions** with domain experts
4. **Begin Phase 1 implementation**

---

*This document will be updated as decisions are made and implementation progresses.*
