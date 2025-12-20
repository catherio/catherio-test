import type { Intervention } from '../../types';
import { interventionConfigs } from '../../data/interventions';

interface InterventionCardProps {
  intervention: Intervention;
  onUpdate: (updates: Partial<Intervention>) => void;
  onRemove: () => void;
}

export const InterventionCard: React.FC<InterventionCardProps> = ({
  intervention,
  onUpdate,
  onRemove,
}) => {
  const config = interventionConfigs[intervention.type];

  if (!config) return null;

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      onUpdate({ value: Math.min(config.maxValue, Math.max(config.minValue, value)) });
    }
  };

  return (
    <div
      style={{
        padding: 12,
        marginBottom: 8,
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: 4,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 8,
        }}
      >
        <div>
          <h4 style={{ margin: 0, fontSize: 14 }}>{config.label}</h4>
          <p style={{ margin: '4px 0 0 0', fontSize: 11, color: '#666' }}>
            {config.description}
          </p>
        </div>
        <button
          onClick={onRemove}
          style={{
            background: 'none',
            border: 'none',
            color: '#dc2626',
            cursor: 'pointer',
            fontSize: 18,
            padding: 4,
          }}
          title="Remove intervention"
        >
          ×
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <input
          type="range"
          min={config.minValue}
          max={config.maxValue}
          step={config.step}
          value={intervention.value}
          onChange={handleValueChange}
          style={{ flex: 1 }}
        />
        <div style={{ minWidth: 100, textAlign: 'right' }}>
          <input
            type="number"
            min={config.minValue}
            max={config.maxValue}
            step={config.step}
            value={intervention.value}
            onChange={handleValueChange}
            style={{
              width: 70,
              padding: 4,
              textAlign: 'right',
              border: '1px solid #ccc',
              borderRadius: 4,
            }}
          />
          <span style={{ marginLeft: 4, fontSize: 12, color: '#666' }}>
            {config.unit}
          </span>
        </div>
      </div>

      <div
        style={{
          marginTop: 8,
          padding: 6,
          backgroundColor: '#f0f9ff',
          borderRadius: 4,
          fontSize: 11,
          color: '#0369a1',
        }}
      >
        Estimated cost: {(config.costPerUnit * intervention.value).toLocaleString()} AED/person/year
      </div>
    </div>
  );
};
