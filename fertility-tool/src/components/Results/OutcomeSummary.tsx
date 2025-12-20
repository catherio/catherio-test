import type { SimulationResult } from '../../types';

interface OutcomeSummaryProps {
  result: SimulationResult;
  comparisonResult?: SimulationResult | null;
  label?: string;
  color?: string;
}

const formatCurrency = (value: number): string => {
  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(1)}B AED`;
  } else if (value >= 1e6) {
    return `${(value / 1e6).toFixed(1)}M AED`;
  } else if (value >= 1e3) {
    return `${(value / 1e3).toFixed(1)}K AED`;
  }
  return `${value.toLocaleString()} AED`;
};

const MetricCard: React.FC<{
  label: string;
  value: string;
  subvalue?: string;
  color?: string;
  comparisonValue?: string;
}> = ({ label, value, subvalue, color, comparisonValue }) => (
  <div
    style={{
      padding: 12,
      backgroundColor: '#f8fafc',
      borderRadius: 8,
      textAlign: 'center',
      border: '1px solid #e2e8f0',
    }}
  >
    <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>{label}</div>
    <div style={{ fontSize: 20, fontWeight: 'bold', color: color || '#1e293b' }}>
      {value}
    </div>
    {subvalue && (
      <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{subvalue}</div>
    )}
    {comparisonValue && (
      <div style={{ fontSize: 11, color: '#8b5cf6', marginTop: 4 }}>
        vs. {comparisonValue}
      </div>
    )}
  </div>
);

export const OutcomeSummary: React.FC<OutcomeSummaryProps> = ({
  result,
  comparisonResult,
  label = 'Policy Results',
  color = '#3b82f6',
}) => {
  const deltaColor =
    result.nationalDeltaPercent >= 0 ? '#16a34a' : '#dc2626';

  return (
    <div
      style={{
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 8,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <h3 style={{ margin: '0 0 16px 0', color, fontSize: 16 }}>{label}</h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 12,
          marginBottom: 16,
        }}
      >
        <MetricCard
          label="Baseline Fertility Rate"
          value={result.baselineNationalFertilityRate.toFixed(2)}
          subvalue="births per woman"
        />
        <MetricCard
          label="Projected Fertility Rate"
          value={result.projectedNationalFertilityRate.toFixed(2)}
          subvalue="births per woman"
          color={deltaColor}
          comparisonValue={
            comparisonResult
              ? comparisonResult.projectedNationalFertilityRate.toFixed(2)
              : undefined
          }
        />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 12,
          marginBottom: 16,
        }}
      >
        <MetricCard
          label="Change"
          value={`${result.nationalDeltaPercent >= 0 ? '+' : ''}${result.nationalDeltaPercent.toFixed(1)}%`}
          color={deltaColor}
          comparisonValue={
            comparisonResult
              ? `${comparisonResult.nationalDeltaPercent >= 0 ? '+' : ''}${comparisonResult.nationalDeltaPercent.toFixed(1)}%`
              : undefined
          }
        />
        <MetricCard
          label="Additional Births/Year"
          value={result.totalAdditionalBirths.toLocaleString()}
          color={result.totalAdditionalBirths > 0 ? '#16a34a' : '#64748b'}
          comparisonValue={
            comparisonResult
              ? comparisonResult.totalAdditionalBirths.toLocaleString()
              : undefined
          }
        />
      </div>

      <div
        style={{
          padding: 12,
          backgroundColor: '#fef3c7',
          borderRadius: 8,
          marginBottom: 12,
        }}
      >
        <div style={{ fontSize: 12, color: '#92400e', marginBottom: 4 }}>
          Estimated Annual Cost
        </div>
        <div style={{ fontSize: 18, fontWeight: 'bold', color: '#92400e' }}>
          {formatCurrency(result.estimatedAnnualCost)}
        </div>
        {comparisonResult && (
          <div style={{ fontSize: 11, color: '#b45309', marginTop: 4 }}>
            Policy B: {formatCurrency(comparisonResult.estimatedAnnualCost)}
          </div>
        )}
      </div>

      {result.totalAdditionalBirths > 0 && (
        <div
          style={{
            padding: 12,
            backgroundColor: '#f0fdf4',
            borderRadius: 8,
          }}
        >
          <div style={{ fontSize: 12, color: '#166534', marginBottom: 4 }}>
            Cost per Additional Birth
          </div>
          <div style={{ fontSize: 18, fontWeight: 'bold', color: '#166534' }}>
            {formatCurrency(result.costPerAdditionalBirth)}
          </div>
          {comparisonResult && comparisonResult.totalAdditionalBirths > 0 && (
            <div style={{ fontSize: 11, color: '#15803d', marginTop: 4 }}>
              Policy B: {formatCurrency(comparisonResult.costPerAdditionalBirth)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
