import React from 'react';
import { AppProvider, useAppContext } from './state/AppContext';
import { SimulationProvider } from './state/SimulationContext';
import TopBar from './components/TopBar';
import SiteList from './components/SiteList';
import MapView from './components/MapView';
import SitePanel from './components/SitePanel';
import AlertPanel from './components/AlertPanel';
import SimulationWorkspace from './components/SimulationWorkspace';
import SourceHealthGrid from './components/SourceHealthGrid';
import TrainingPanel from './components/TrainingPanel';
import ScorecardPanel from './components/ScorecardPanel';
import ErrorBoundary from './components/ErrorBoundary';

const AppContent = () => {
  const { activeTab } = useAppContext();

  return (
    <div className="app-container">
      <ErrorBoundary fallbackMessage="Failed to load navigation bar.">
        <TopBar />
      </ErrorBoundary>
      <div className="main-content">
        {activeTab === 'Dashboard' && (
          <div className="dashboard-layout">
            <ErrorBoundary fallbackMessage="Failed to load monitoring sites list.">
              <SiteList />
            </ErrorBoundary>
            <div className="map-container">
              <ErrorBoundary fallbackMessage="Map view rendering encountered an issue.">
                <MapView />
              </ErrorBoundary>
            </div>
            <ErrorBoundary fallbackMessage="Site details panel encountered an issue.">
              <SitePanel />
            </ErrorBoundary>
          </div>
        )}
        {activeTab === 'Simulation' && (
          <ErrorBoundary fallbackMessage="Simulation workspace encountered an issue.">
            <SimulationWorkspace />
          </ErrorBoundary>
        )}
        {activeTab === 'Sources' && (
          <ErrorBoundary fallbackMessage="Data source health monitor encountered an issue.">
            <SourceHealthGrid />
          </ErrorBoundary>
        )}
        {activeTab === 'Alerts' && (
          <ErrorBoundary fallbackMessage="Alert dispatch console encountered an issue.">
            <AlertPanel />
          </ErrorBoundary>
        )}

        {/* DEDICATED CHANGE: 'Training' and 'Scorecard' sections unmounted from the primary user interface.
            Preserved here for instantaneous re-activation whenever required.
        */}
        {/*
        {activeTab === 'Training' && (
          <ErrorBoundary fallbackMessage="Model training console encountered an issue.">
            <TrainingPanel />
          </ErrorBoundary>
        )}
        {activeTab === 'Scorecard' && (
          <ErrorBoundary fallbackMessage="Scorecard verification panel encountered an issue.">
            <ScorecardPanel />
          </ErrorBoundary>
        )}
        */}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary fallbackMessage="The application encountered an initialization issue.">
      <AppProvider>
        <SimulationProvider>
          <AppContent />
        </SimulationProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}
