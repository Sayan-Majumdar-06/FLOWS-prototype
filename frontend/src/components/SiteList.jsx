import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { pilotLocations } from '../data/pilotLocations';
import { useAppContext } from '../state/AppContext';
import { useSimulationContext } from '../state/SimulationContext';

function probColor(p) {
  if (p >= 0.8) return 'var(--hazard-critical)';
  if (p >= 0.6) return 'var(--hazard-warning)';
  if (p >= 0.3) return 'var(--hazard-watch)';
  return 'var(--hazard-safe)';
}

export default function SiteList() {
  const { selectedLocation, setSelectedLocation } = useAppContext();
  const { lastPrediction } = useSimulationContext();
  const [locations, setLocations] = useState(pilotLocations);

  useEffect(() => {
    apiClient.getLocations().then(data => {
      if (data && data.length > 0) {
        // merge API data with local fallback
        setLocations(data.map(l => ({
          ...l,
          id: l.location_id || l.id,
          lat: l.lat || l.latitude,
          lng: l.lng || l.longitude,
        })));
      }
    });
  }, []);

  return (
    <div className="sidebar site-list">
      <div className="sidebar-header">
        <span className="sidebar-title">📡 Sector Radar</span>
        <span className="site-count">{locations.length} SITES</span>
      </div>
      <div className="list-container">
        {locations.map(loc => {
          const locId = loc.location_id || loc.id;
          const pred = lastPrediction[locId];
          const lsP = pred?.prediction?.hazards?.landslide?.probability || 0;
          const flP = pred?.prediction?.hazards?.flood?.probability || 0;
          const maxP = Math.max(lsP, flP);
          const rawAction = pred?.action?.action;
          const action = (rawAction === 'EMERGENCY' || maxP >= 0.8)
            ? 'EMERGENCY'
            : (rawAction === 'WARNING' || maxP >= 0.6)
            ? 'WARNING'
            : (rawAction === 'WATCH' || maxP >= 0.3)
            ? 'WATCH'
            : 'SAFE';
          const fosState = pred?.prediction?.physics_output?.stability_state || 'STABLE';
          return (
            <div
              key={locId}
              className={`site-card ${(selectedLocation?.location_id || selectedLocation?.id) === locId ? 'active' : ''}`}
              onClick={() => setSelectedLocation(loc)}
            >
              <div className="site-card-top">
                <div className="site-dot" style={{ background: probColor(maxP) }} />
                <span className="site-name">{loc.name}</span>
                <span className="site-action" style={{
                  color: action === 'EMERGENCY' ? 'var(--hazard-critical)' : action === 'WARNING' ? 'var(--hazard-warning)' : action === 'WATCH' ? 'var(--hazard-watch)' : 'var(--hazard-safe)',
                  background: action === 'EMERGENCY' ? 'rgba(239, 68, 68, 0.15)' : action === 'WARNING' ? 'rgba(249, 115, 22, 0.15)' : action === 'WATCH' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                  border: `1px solid ${action === 'EMERGENCY' ? 'rgba(239, 68, 68, 0.3)' : action === 'WARNING' ? 'rgba(249, 115, 22, 0.3)' : action === 'WATCH' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  letterSpacing: '0.4px',
                }}>
                  {action}
                </span>
              </div>
              <div className="site-mini-bars">
                <div className="mini-bar-row">
                  <span className="mini-bar-label">LS</span>
                  <div className="mini-bar-bg">
                    <div className="mini-bar-fill" style={{ width: (lsP * 100) + '%', background: probColor(lsP) }} />
                  </div>
                  <span className="mini-bar-pct">{(lsP * 100).toFixed(0)}%</span>
                </div>
                <div className="mini-bar-row">
                  <span className="mini-bar-label">FL</span>
                  <div className="mini-bar-bg">
                    <div className="mini-bar-fill" style={{ width: (flP * 100) + '%', background: 'var(--flood-secondary)' }} />
                  </div>
                  <span className="mini-bar-pct">{(flP * 100).toFixed(0)}%</span>
                </div>
              </div>
              {fosState !== 'STABLE' && (
                <div className="site-fos-warn">STABILITY: {fosState}</div>
              )}
            </div>
          );
        })}
      </div>
      <div className="sidebar-footer">
        <div className="legend-row"><span className="legend-dot" style={{ background: 'var(--hazard-safe)' }} /> &lt;30% Safe</div>
        <div className="legend-row"><span className="legend-dot" style={{ background: 'var(--hazard-watch)' }} /> 30-60% Watch</div>
        <div className="legend-row"><span className="legend-dot" style={{ background: 'var(--hazard-warning)' }} /> 60-80% Warn</div>
        <div className="legend-row"><span className="legend-dot" style={{ background: 'var(--hazard-critical)' }} /> &gt;80% Emerg</div>
      </div>
    </div>
  );
}

export { SiteList };
