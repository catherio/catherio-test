import type { GeounitOutcome } from '../../types';
import { geounits } from '../../data/geounits';
import { archetypes } from '../../data/archetypes';
import { usePolicyStore } from '../../stores/policyStore';

interface GeounitDetailProps {
  outcome: GeounitOutcome | undefined;
  comparisonOutcome?: GeounitOutcome | undefined;
}

export const GeounitDetail: React.FC<GeounitDetailProps> = ({
  outcome,
  comparisonOutcome,
}) => {
  const { selectedGeounitId, selectGeounit } = usePolicyStore();

  if (!selectedGeounitId || !outcome) {
    return (
      <div
        style={{
          padding: 16,
          backgroundColor: 'white',
          borderRadius: 8,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          textAlign: 'center',
          color: '#64748b',
        }}
      >
        <p>Click on a region on the map to see detailed breakdown</p>
      </div>
    );
  }

  const geounit = geounits.find((g) => g.id === selectedGeounitId);
  if (!geounit) return null;

  return (
    <div
      style={{
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 8,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 16,
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontSize: 16, color: '#1e293b' }}>{geounit.name}</h3>
          <p style={{ margin: '4px 0 0 0', fontSize: 14, color: '#64748b' }}>
            {geounit.nameAr}
          </p>
        </div>
        <button
          onClick={() => selectGeounit(null)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 20,
            color: '#64748b',
            cursor: 'pointer',
          }}
        >
          ×
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 8,
          marginBottom: 16,
        }}
      >
        <div style={{ padding: 8, backgroundColor: '#f8fafc', borderRadius: 4 }}>
          <div style={{ fontSize: 11, color: '#64748b' }}>Population</div>
          <div style={{ fontSize: 16, fontWeight: 'bold' }}>
            {geounit.properties.emiratiPopulation.toLocaleString()}
          </div>
        </div>
        <div style={{ padding: 8, backgroundColor: '#f8fafc', borderRadius: 4 }}>
          <div style={{ fontSize: 11, color: '#64748b' }}>Urbanization</div>
          <div style={{ fontSize: 16, fontWeight: 'bold', textTransform: 'capitalize' }}>
            {geounit.properties.urbanizationLevel}
          </div>
        </div>
        <div style={{ padding: 8, backgroundColor: '#f8fafc', borderRadius: 4 }}>
          <div style={{ fontSize: 11, color: '#64748b' }}>Avg Income</div>
          <div style={{ fontSize: 16, fontWeight: 'bold' }}>
            {geounit.properties.avgHouseholdIncome.toLocaleString()} AED
          </div>
        </div>
        <div style={{ padding: 8, backgroundColor: '#f8fafc', borderRadius: 4 }}>
          <div style={{ fontSize: 11, color: '#64748b' }}>Avg Family Size</div>
          <div style={{ fontSize: 16, fontWeight: 'bold' }}>
            {geounit.properties.avgFamilySize.toFixed(1)}
          </div>
        </div>
      </div>

      <div
        style={{
          padding: 12,
          backgroundColor: outcome.deltaPercent >= 0 ? '#f0fdf4' : '#fef2f2',
          borderRadius: 8,
          marginBottom: 16,
        }}
      >
        <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>
          Policy A Impact
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <span style={{ fontSize: 14 }}>
              {outcome.baselineFertilityRate.toFixed(2)} →{' '}
              {outcome.projectedFertilityRate.toFixed(2)}
            </span>
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: outcome.deltaPercent >= 0 ? '#16a34a' : '#dc2626',
            }}
          >
            {outcome.deltaPercent >= 0 ? '+' : ''}
            {outcome.deltaPercent.toFixed(1)}%
          </div>
        </div>
        <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
          +{outcome.projectedAdditionalBirths} additional births/year
        </div>
      </div>

      {comparisonOutcome && (
        <div
          style={{
            padding: 12,
            backgroundColor:
              comparisonOutcome.deltaPercent >= 0 ? '#faf5ff' : '#fef2f2',
            borderRadius: 8,
            marginBottom: 16,
          }}
        >
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>
            Policy B Impact
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <span style={{ fontSize: 14 }}>
                {comparisonOutcome.baselineFertilityRate.toFixed(2)} →{' '}
                {comparisonOutcome.projectedFertilityRate.toFixed(2)}
              </span>
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: comparisonOutcome.deltaPercent >= 0 ? '#8b5cf6' : '#dc2626',
              }}
            >
              {comparisonOutcome.deltaPercent >= 0 ? '+' : ''}
              {comparisonOutcome.deltaPercent.toFixed(1)}%
            </div>
          </div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
            +{comparisonOutcome.projectedAdditionalBirths} additional births/year
          </div>
        </div>
      )}

      <h4 style={{ margin: '16px 0 8px 0', fontSize: 14, color: '#1e293b' }}>
        Archetype Distribution
      </h4>
      <div style={{ maxHeight: 200, overflowY: 'auto' }}>
        {outcome.archetypeOutcomes.map((ao) => {
          const archetype = archetypes.find((a) => a.id === ao.archetypeId);
          return (
            <div
              key={ao.archetypeId}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '6px 0',
                borderBottom: '1px solid #f1f5f9',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: archetype?.color || '#888',
                  }}
                />
                <span style={{ fontSize: 12 }}>{archetype?.name}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: 12, color: '#64748b' }}>
                  {ao.populationCount.toLocaleString()}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    marginLeft: 8,
                    color: ao.intentionDeltaPercent >= 0 ? '#16a34a' : '#dc2626',
                  }}
                >
                  {ao.intentionDeltaPercent >= 0 ? '+' : ''}
                  {ao.intentionDeltaPercent.toFixed(1)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
