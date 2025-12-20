import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { ArchetypeOutcome } from '../../types';
import { archetypes } from '../../data/archetypes';

interface ArchetypeBreakdownProps {
  outcomes: ArchetypeOutcome[];
  comparisonOutcomes?: ArchetypeOutcome[] | null;
  showComparison?: boolean;
}

export const ArchetypeBreakdown: React.FC<ArchetypeBreakdownProps> = ({
  outcomes,
  comparisonOutcomes,
  showComparison = false,
}) => {
  // Prepare data for chart
  const chartData = outcomes.map((outcome) => {
    const archetype = archetypes.find((a) => a.id === outcome.archetypeId);
    const compOutcome = comparisonOutcomes?.find(
      (c) => c.archetypeId === outcome.archetypeId
    );

    return {
      name: archetype?.name.split(' ').slice(0, 2).join(' ') || outcome.archetypeId,
      fullName: archetype?.name || outcome.archetypeId,
      population: outcome.populationCount,
      policyAChange: outcome.intentionDeltaPercent,
      policyBChange: compOutcome?.intentionDeltaPercent || 0,
      color: archetype?.color || '#888',
    };
  });

  // Sort by population
  chartData.sort((a, b) => b.population - a.population);

  return (
    <div
      style={{
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 8,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <h3 style={{ margin: '0 0 16px 0', fontSize: 16, color: '#1e293b' }}>
        Impact by Archetype
      </h3>

      <div style={{ height: 300, marginBottom: 16 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              domain={['dataMin - 5', 'dataMax + 5']}
              tickFormatter={(v) => `${v >= 0 ? '+' : ''}${v.toFixed(0)}%`}
            />
            <YAxis type="category" dataKey="name" width={75} tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(value, name) => {
                const numValue = Number(value);
                return [
                  `${numValue >= 0 ? '+' : ''}${numValue.toFixed(1)}%`,
                  name === 'policyAChange' ? 'Policy A' : 'Policy B',
                ];
              }}
              labelFormatter={(label) =>
                chartData.find((d) => d.name === label)?.fullName || label
              }
            />
            <Legend />
            <Bar
              dataKey="policyAChange"
              name="Policy A"
              fill="#3b82f6"
              radius={[0, 4, 4, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
            {showComparison && comparisonOutcomes && (
              <Bar
                dataKey="policyBChange"
                name="Policy B"
                fill="#8b5cf6"
                radius={[0, 4, 4, 0]}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed breakdown table */}
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: 12,
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <th style={{ padding: 8, textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>
                Archetype
              </th>
              <th style={{ padding: 8, textAlign: 'right', borderBottom: '2px solid #e2e8f0' }}>
                Population
              </th>
              <th style={{ padding: 8, textAlign: 'right', borderBottom: '2px solid #e2e8f0' }}>
                Base Intent
              </th>
              <th style={{ padding: 8, textAlign: 'right', borderBottom: '2px solid #e2e8f0' }}>
                Policy A Intent
              </th>
              <th style={{ padding: 8, textAlign: 'right', borderBottom: '2px solid #e2e8f0' }}>
                Change
              </th>
              {showComparison && comparisonOutcomes && (
                <th style={{ padding: 8, textAlign: 'right', borderBottom: '2px solid #e2e8f0' }}>
                  Policy B Change
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {outcomes.map((outcome) => {
              const archetype = archetypes.find((a) => a.id === outcome.archetypeId);
              const compOutcome = comparisonOutcomes?.find(
                (c) => c.archetypeId === outcome.archetypeId
              );

              return (
                <tr key={outcome.archetypeId}>
                  <td style={{ padding: 8, borderBottom: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: archetype?.color || '#888',
                        }}
                      />
                      {archetype?.name || outcome.archetypeId}
                    </div>
                  </td>
                  <td
                    style={{
                      padding: 8,
                      textAlign: 'right',
                      borderBottom: '1px solid #e2e8f0',
                    }}
                  >
                    {outcome.populationCount.toLocaleString()}
                  </td>
                  <td
                    style={{
                      padding: 8,
                      textAlign: 'right',
                      borderBottom: '1px solid #e2e8f0',
                    }}
                  >
                    {(outcome.baselineIntention * 100).toFixed(1)}%
                  </td>
                  <td
                    style={{
                      padding: 8,
                      textAlign: 'right',
                      borderBottom: '1px solid #e2e8f0',
                    }}
                  >
                    {(outcome.projectedIntention * 100).toFixed(1)}%
                  </td>
                  <td
                    style={{
                      padding: 8,
                      textAlign: 'right',
                      borderBottom: '1px solid #e2e8f0',
                      color: outcome.intentionDeltaPercent >= 0 ? '#16a34a' : '#dc2626',
                      fontWeight: 'bold',
                    }}
                  >
                    {outcome.intentionDeltaPercent >= 0 ? '+' : ''}
                    {outcome.intentionDeltaPercent.toFixed(1)}%
                  </td>
                  {showComparison && comparisonOutcomes && (
                    <td
                      style={{
                        padding: 8,
                        textAlign: 'right',
                        borderBottom: '1px solid #e2e8f0',
                        color:
                          (compOutcome?.intentionDeltaPercent || 0) >= 0
                            ? '#16a34a'
                            : '#dc2626',
                        fontWeight: 'bold',
                      }}
                    >
                      {(compOutcome?.intentionDeltaPercent || 0) >= 0 ? '+' : ''}
                      {(compOutcome?.intentionDeltaPercent || 0).toFixed(1)}%
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
