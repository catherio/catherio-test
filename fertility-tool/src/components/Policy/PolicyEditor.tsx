import { useState } from 'react';
import type { Intervention, InterventionType, Policy } from '../../types';
import { interventionConfigs, allInterventionTypes } from '../../data/interventions';
import { InterventionCard } from './InterventionCard';

interface PolicyEditorProps {
  policy: Policy;
  onAddIntervention: (intervention: Intervention) => void;
  onUpdateIntervention: (id: string, updates: Partial<Intervention>) => void;
  onRemoveIntervention: (id: string) => void;
  onUpdatePolicy: (updates: Partial<Policy>) => void;
  label: string;
  color: string;
}

export const PolicyEditor: React.FC<PolicyEditorProps> = ({
  policy,
  onAddIntervention,
  onUpdateIntervention,
  onRemoveIntervention,
  onUpdatePolicy,
  label,
  color,
}) => {
  const [isAddingIntervention, setIsAddingIntervention] = useState(false);
  const [selectedType, setSelectedType] = useState<InterventionType>('cash_transfer');

  const handleAddIntervention = () => {
    const config = interventionConfigs[selectedType];
    const newIntervention: Intervention = {
      id: `intervention-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: selectedType,
      value: config.defaultValue,
    };
    onAddIntervention(newIntervention);
    setIsAddingIntervention(false);
  };

  // Filter out intervention types that are already added
  const usedTypes = new Set(policy.interventions.map((i) => i.type));
  const availableTypes = allInterventionTypes.filter((t) => !usedTypes.has(t));

  return (
    <div
      style={{
        border: `2px solid ${color}`,
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        backgroundColor: '#fafafa',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <h3 style={{ margin: 0, color }}>{label}</h3>
      </div>

      <input
        type="text"
        value={policy.name}
        onChange={(e) => onUpdatePolicy({ name: e.target.value })}
        placeholder="Policy name"
        style={{
          width: '100%',
          padding: 8,
          marginBottom: 12,
          border: '1px solid #ccc',
          borderRadius: 4,
          fontSize: 14,
        }}
      />

      <div style={{ marginBottom: 12 }}>
        {policy.interventions.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic', margin: 8 }}>
            No interventions added. Add interventions to see projected effects.
          </p>
        ) : (
          policy.interventions.map((intervention) => (
            <InterventionCard
              key={intervention.id}
              intervention={intervention}
              onUpdate={(updates) => onUpdateIntervention(intervention.id, updates)}
              onRemove={() => onRemoveIntervention(intervention.id)}
            />
          ))
        )}
      </div>

      {isAddingIntervention ? (
        <div
          style={{
            padding: 12,
            backgroundColor: '#f0f0f0',
            borderRadius: 4,
            marginBottom: 8,
          }}
        >
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
            Select Intervention Type:
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as InterventionType)}
            style={{
              width: '100%',
              padding: 8,
              marginBottom: 12,
              borderRadius: 4,
              border: '1px solid #ccc',
            }}
          >
            {availableTypes.map((type) => (
              <option key={type} value={type}>
                {interventionConfigs[type].label}
              </option>
            ))}
          </select>
          <p style={{ fontSize: 12, color: '#666', marginBottom: 12 }}>
            {interventionConfigs[selectedType].description}
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleAddIntervention}
              disabled={availableTypes.length === 0}
              style={{
                flex: 1,
                padding: '8px 16px',
                backgroundColor: color,
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: availableTypes.length === 0 ? 'not-allowed' : 'pointer',
                opacity: availableTypes.length === 0 ? 0.5 : 1,
              }}
            >
              Add
            </button>
            <button
              onClick={() => setIsAddingIntervention(false)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#666',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => {
            if (availableTypes.length > 0) {
              setSelectedType(availableTypes[0]);
              setIsAddingIntervention(true);
            }
          }}
          disabled={availableTypes.length === 0}
          style={{
            width: '100%',
            padding: '10px 16px',
            backgroundColor: availableTypes.length === 0 ? '#ccc' : color,
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: availableTypes.length === 0 ? 'not-allowed' : 'pointer',
            fontSize: 14,
          }}
        >
          {availableTypes.length === 0
            ? 'All Intervention Types Added'
            : '+ Add Intervention'}
        </button>
      )}
    </div>
  );
};
