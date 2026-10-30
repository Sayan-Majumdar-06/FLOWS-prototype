import React from 'react';
import { useAppContext } from '../state/AppContext';

const TopBar = () => {
  const { activeTab, setActiveTab, operatingMode } = useAppContext();
  // Note: 'Training' and 'Scorecard' can be re-added here anytime
  const tabs = ['Dashboard', 'Simulation', 'Sources', 'Alerts'];

  return (
    <div className="topbar">
      <div className="logo-section">
        <h1>FLOWS</h1>
        <span className="tagline">Flash Flood & Landslide Observation System</span>
      </div>
      <div className="tabs">
        {tabs.map(tab => (
          <button 
            key={tab} 
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="status-section">
        <span className={`status-badge ${operatingMode.toLowerCase()}`}>
          {operatingMode}
        </span>
      </div>
    </div>
  );
};

export default TopBar;
