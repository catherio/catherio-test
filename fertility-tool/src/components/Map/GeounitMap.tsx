import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import type { Layer, PathOptions } from 'leaflet';
import type { GeounitOutcome } from '../../types';
import { geounits, toGeoJSON } from '../../data/geounits';
import { usePolicyStore } from '../../stores/policyStore';
import 'leaflet/dist/leaflet.css';

interface GeounitMapProps {
  outcomes: GeounitOutcome[];
  showComparison?: boolean;
  comparisonOutcomes?: GeounitOutcome[];
}

// Color scale for fertility rate changes
const getColor = (deltaPercent: number): string => {
  // Green for positive, red for negative
  if (deltaPercent >= 20) return '#166534'; // Dark green
  if (deltaPercent >= 15) return '#22c55e'; // Green
  if (deltaPercent >= 10) return '#4ade80'; // Light green
  if (deltaPercent >= 5) return '#86efac'; // Very light green
  if (deltaPercent >= 0) return '#bbf7d0'; // Pale green
  if (deltaPercent >= -5) return '#fecaca'; // Pale red
  if (deltaPercent >= -10) return '#f87171'; // Light red
  return '#dc2626'; // Red
};

// Component to fit map bounds to geounits
const MapBounds = () => {
  const map = useMap();

  useEffect(() => {
    // Calculate bounds from all geounits
    let minLat = Infinity,
      maxLat = -Infinity,
      minLng = Infinity,
      maxLng = -Infinity;

    for (const geounit of geounits) {
      for (const ring of geounit.geometry.coordinates) {
        for (const [lng, lat] of ring) {
          minLat = Math.min(minLat, lat);
          maxLat = Math.max(maxLat, lat);
          minLng = Math.min(minLng, lng);
          maxLng = Math.max(maxLng, lng);
        }
      }
    }

    map.fitBounds([
      [minLat - 0.1, minLng - 0.1],
      [maxLat + 0.1, maxLng + 0.1],
    ]);
  }, [map]);

  return null;
};

export const GeounitMap: React.FC<GeounitMapProps> = ({
  outcomes,
  showComparison: _showComparison = false,
  comparisonOutcomes,
}) => {
  // showComparison reserved for future side-by-side map view
  void _showComparison;
  const { selectedGeounitId, selectGeounit } = usePolicyStore();

  const outcomeMap = useMemo(() => {
    const map = new Map<string, GeounitOutcome>();
    for (const o of outcomes) {
      map.set(o.geounitId, o);
    }
    return map;
  }, [outcomes]);

  const comparisonMap = useMemo(() => {
    if (!comparisonOutcomes) return null;
    const map = new Map<string, GeounitOutcome>();
    for (const o of comparisonOutcomes) {
      map.set(o.geounitId, o);
    }
    return map;
  }, [comparisonOutcomes]);

  const geoJsonData = useMemo(() => toGeoJSON(), []);

  const style = (feature: GeoJSON.Feature | undefined): PathOptions => {
    if (!feature?.properties?.id) return {};

    const outcome = outcomeMap.get(feature.properties.id);
    const isSelected = feature.properties.id === selectedGeounitId;

    return {
      fillColor: outcome ? getColor(outcome.deltaPercent) : '#9ca3af',
      weight: isSelected ? 3 : 1,
      opacity: 1,
      color: isSelected ? '#1e40af' : '#374151',
      fillOpacity: 0.7,
    };
  };

  const onEachFeature = (feature: GeoJSON.Feature, layer: Layer) => {
    const props = feature.properties;
    if (!props) return;

    const outcome = outcomeMap.get(props.id);
    const compOutcome = comparisonMap?.get(props.id);

    let tooltipContent = `
      <div style="min-width: 200px;">
        <strong>${props.name}</strong> (${props.nameAr})<br/>
        <hr style="margin: 4px 0;"/>
        Population: ${props.emiratiPopulation.toLocaleString()}<br/>
    `;

    if (outcome) {
      tooltipContent += `
        <br/><strong>Policy A:</strong><br/>
        Baseline Rate: ${outcome.baselineFertilityRate.toFixed(2)}<br/>
        Projected Rate: ${outcome.projectedFertilityRate.toFixed(2)}<br/>
        Change: <span style="color: ${outcome.deltaPercent >= 0 ? 'green' : 'red'}">
          ${outcome.deltaPercent >= 0 ? '+' : ''}${outcome.deltaPercent.toFixed(1)}%
        </span><br/>
        Additional Births: ${outcome.projectedAdditionalBirths}
      `;
    }

    if (compOutcome) {
      tooltipContent += `
        <br/><br/><strong>Policy B:</strong><br/>
        Projected Rate: ${compOutcome.projectedFertilityRate.toFixed(2)}<br/>
        Change: <span style="color: ${compOutcome.deltaPercent >= 0 ? 'green' : 'red'}">
          ${compOutcome.deltaPercent >= 0 ? '+' : ''}${compOutcome.deltaPercent.toFixed(1)}%
        </span><br/>
        Additional Births: ${compOutcome.projectedAdditionalBirths}
      `;
    }

    tooltipContent += '</div>';

    layer.bindTooltip(tooltipContent, { sticky: true });

    layer.on({
      click: () => {
        selectGeounit(props.id);
      },
    });
  };

  return (
    <div className="map-container" style={{ height: '100%', width: '100%' }}>
      <MapContainer
        center={[24.4, 54.5]}
        zoom={8}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON
          key={JSON.stringify(outcomes.map((o) => o.deltaPercent))}
          data={geoJsonData}
          style={style}
          onEachFeature={onEachFeature}
        />
        <MapBounds />
      </MapContainer>

      {/* Legend */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          background: 'white',
          padding: 12,
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          zIndex: 1000,
        }}
      >
        <div style={{ fontWeight: 'bold', marginBottom: 8 }}>
          Fertility Rate Change
        </div>
        {[
          { label: '+20%+', color: '#166534' },
          { label: '+15-20%', color: '#22c55e' },
          { label: '+10-15%', color: '#4ade80' },
          { label: '+5-10%', color: '#86efac' },
          { label: '0-5%', color: '#bbf7d0' },
          { label: '-5-0%', color: '#fecaca' },
          { label: '<-5%', color: '#f87171' },
        ].map(({ label, color }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
            <div
              style={{
                width: 20,
                height: 14,
                backgroundColor: color,
                marginRight: 8,
                border: '1px solid #666',
              }}
            />
            <span style={{ fontSize: 12 }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
