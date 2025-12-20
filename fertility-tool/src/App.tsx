import { useState } from 'react';
import { GeounitMap } from './components/Map/GeounitMap';
import { PolicyEditor } from './components/Policy/PolicyEditor';
import { OutcomeSummary } from './components/Results/OutcomeSummary';
import { ArchetypeBreakdown } from './components/Results/ArchetypeBreakdown';
import { GeounitDetail } from './components/Results/GeounitDetail';
import { usePolicyStore } from './stores/policyStore';
import './App.css';

type Tab = 'summary' | 'archetypes' | 'geounit';

function App() {
  const {
    policyA,
    resultA,
    policyB,
    resultB,
    isComparing,
    selectedGeounitId,
    updatePolicyA,
    addInterventionA,
    updateInterventionA,
    removeInterventionA,
    enableComparison,
    disableComparison,
    updatePolicyB,
    addInterventionB,
    updateInterventionB,
    removeInterventionB,
    resetAll,
  } = usePolicyStore();

  const [activeTab, setActiveTab] = useState<Tab>('summary');

  const selectedOutcomeA = resultA.geounitOutcomes.find(
    (o) => o.geounitId === selectedGeounitId
  );
  const selectedOutcomeB = resultB?.geounitOutcomes.find(
    (o) => o.geounitId === selectedGeounitId
  );

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <h1>Abu Dhabi Fertility Policy Explorer</h1>
        <div className="header-actions">
          <button onClick={resetAll} className="btn btn-secondary">
            Reset All
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="main-content">
        {/* Left sidebar - Policy editors */}
        <aside className="sidebar-left">
          <PolicyEditor
            policy={policyA}
            onAddIntervention={addInterventionA}
            onUpdateIntervention={updateInterventionA}
            onRemoveIntervention={removeInterventionA}
            onUpdatePolicy={updatePolicyA}
            label="Policy A"
            color="#3b82f6"
          />

          {isComparing && policyB ? (
            <>
              <PolicyEditor
                policy={policyB}
                onAddIntervention={addInterventionB}
                onUpdateIntervention={updateInterventionB}
                onRemoveIntervention={removeInterventionB}
                onUpdatePolicy={updatePolicyB}
                label="Policy B"
                color="#8b5cf6"
              />
              <button
                onClick={disableComparison}
                className="btn btn-secondary"
                style={{ width: '100%' }}
              >
                Remove Comparison
              </button>
            </>
          ) : (
            <button
              onClick={enableComparison}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              + Add Policy B for Comparison
            </button>
          )}
        </aside>

        {/* Center - Map */}
        <main className="map-area">
          <GeounitMap
            outcomes={resultA.geounitOutcomes}
            showComparison={isComparing}
            comparisonOutcomes={resultB?.geounitOutcomes}
          />
        </main>

        {/* Right sidebar - Results */}
        <aside className="sidebar-right">
          {/* Tab navigation */}
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'summary' ? 'active' : ''}`}
              onClick={() => setActiveTab('summary')}
            >
              Summary
            </button>
            <button
              className={`tab ${activeTab === 'archetypes' ? 'active' : ''}`}
              onClick={() => setActiveTab('archetypes')}
            >
              Archetypes
            </button>
            <button
              className={`tab ${activeTab === 'geounit' ? 'active' : ''}`}
              onClick={() => setActiveTab('geounit')}
            >
              Region Detail
            </button>
          </div>

          {/* Tab content */}
          <div className="tab-content">
            {activeTab === 'summary' && (
              <OutcomeSummary
                result={resultA}
                comparisonResult={resultB}
                label={isComparing ? 'Policy A Results' : 'Policy Results'}
                color="#3b82f6"
              />
            )}

            {activeTab === 'archetypes' && (
              <ArchetypeBreakdown
                outcomes={resultA.aggregateArchetypeOutcomes}
                comparisonOutcomes={resultB?.aggregateArchetypeOutcomes}
                showComparison={isComparing}
              />
            )}

            {activeTab === 'geounit' && (
              <GeounitDetail
                outcome={selectedOutcomeA}
                comparisonOutcome={selectedOutcomeB}
              />
            )}
          </div>
        </aside>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>
          Prototype tool for exploring fertility policy impacts. Data is synthetic and
          for demonstration purposes only.
        </p>
      </footer>
    </div>
  );
}

export default App;
