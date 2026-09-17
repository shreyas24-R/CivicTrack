import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CivicIssue } from '../../types';
import { AnalyticsOverview } from './AnalyticsOverview';
import { ComplaintMap } from './ComplaintMap';
import { ComplaintTable } from './ComplaintTable';
import { AssignWorkerModal } from './AssignWorkerModal';
import { IssueTrackerModal } from '../citizen/IssueTrackerModal';
import { AssetHistoryTimeline } from './AssetHistoryTimeline';
import { MOCK_ASSETS } from '../../services/mockAssetHistoryService';
import { createRipple } from '../common/MaterialRipple';
import {
  LayoutDashboard,
  Map as MapIcon,
  Table as TableIcon,
  History,
  ShieldAlert,
  ChevronRight,
} from 'lucide-react';

export const MunicipalDashboard: React.FC = () => {
  const { t } = useApp();
  const [viewMode, setViewMode] = useState<'split' | 'map' | 'table' | 'history'>('split');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  const [selectedIssue, setSelectedIssue] = useState<CivicIssue | null>(null);
  const [assigningIssue, setAssigningIssue] = useState<CivicIssue | null>(null);

  // Asset History Inspector State
  const [selectedAssetId, setSelectedAssetId] = useState<string>('ast-8801-high');

  return (
    <div className="w-full bg-[#F8F9FA] text-[#202124] pb-12 font-sans">
      {/* Command Center Subheader */}
      <div className="bg-white border-b border-[#DADCE0] sticky top-14 sm:top-16 z-20 shadow-elevation-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded bg-[#4285F4] text-white flex items-center justify-center font-bold shadow-elevation-1">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-lg font-medium text-[#202124] tracking-wide">
                  {t.municipalCommand}
                </h1>
                <span className="bg-[#E6F4EA] text-[#137333] text-[10px] font-medium px-2 py-0.5 rounded border border-[#CEEAD6] flex items-center gap-1 uppercase tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34A853] animate-pulse" /> Live Telemetry
                </span>
              </div>
              <p className="text-xs text-[#5F6368]">
                Bengaluru Municipal Corporation • Indiranagar & Koramangala Zones
              </p>
            </div>
          </div>

          {/* View Switcher Bar */}
          <div className="flex items-center space-x-2">
            <div className="bg-gray-100 p-0.5 rounded border border-[#DADCE0] flex items-center">
              <button
                onClick={(e) => {
                  createRipple(e);
                  setViewMode('split');
                }}
                className={`px-3 py-1.5 rounded text-xs font-medium uppercase tracking-wider transition-all ripple-surface ${
                  viewMode === 'split'
                    ? 'bg-white text-[#1A73E8] shadow-elevation-1'
                    : 'text-[#5F6368] hover:text-[#202124]'
                }`}
              >
                Split View
              </button>
              <button
                onClick={(e) => {
                  createRipple(e);
                  setViewMode('map');
                }}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded text-xs font-medium uppercase tracking-wider transition-all ripple-surface ${
                  viewMode === 'map'
                    ? 'bg-white text-[#1A73E8] shadow-elevation-1'
                    : 'text-[#5F6368] hover:text-[#202124]'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>Map Only</span>
              </button>
              <button
                onClick={(e) => {
                  createRipple(e);
                  setViewMode('table');
                }}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded text-xs font-medium uppercase tracking-wider transition-all ripple-surface ${
                  viewMode === 'table'
                    ? 'bg-white text-[#1A73E8] shadow-elevation-1'
                    : 'text-[#5F6368] hover:text-[#202124]'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Table Only</span>
              </button>

              <button
                onClick={(e) => {
                  createRipple(e);
                  setViewMode('history');
                }}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-all ripple-surface ${
                  viewMode === 'history'
                    ? 'bg-[#1A73E8] text-white shadow-elevation-1'
                    : 'text-[#1A73E8] hover:bg-blue-50'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Problem History</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* KPI Analytics Overview */}
        <AnalyticsOverview />

        {/* View Mode: Problem History Module */}
        {viewMode === 'history' && (
          <div className="space-y-6">
            {/* Quick Test Preset Selector for Admin Reviewers */}
            <div className="p-4 bg-white border border-[#DADCE0] rounded-xl shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <ShieldAlert className="w-5 h-5 text-[#1A73E8]" />
                  <h3 className="text-sm font-bold text-[#202124]">
                    Select Asset Test Scenario:
                  </h3>
                </div>
                <span className="text-xs text-[#5F6368]">
                  Test Heuristics & Recurring Defect Detection Rules
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {MOCK_ASSETS.map((ast) => (
                  <button
                    key={ast.id}
                    onClick={() => setSelectedAssetId(ast.id)}
                    className={`p-3 rounded-lg border text-left transition-all flex items-center justify-between ${
                      selectedAssetId === ast.id
                        ? 'border-[#1A73E8] bg-blue-50/70 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="space-y-0.5 truncate">
                      <div className="text-xs font-bold text-[#202124] truncate">
                        {ast.assetTag}
                      </div>
                      <div className="text-[11px] text-[#5F6368]">{ast.ward}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>

            {/* Main Reusable Asset History Timeline Component */}
            <AssetHistoryTimeline assetId={selectedAssetId} key={selectedAssetId} />
          </div>
        )}

        {/* Dynamic Views: Split / Map / Table */}
        {viewMode === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full max-w-full min-w-0">
            {/* Left: Interactive Map (5 Cols) */}
            <div className="lg:col-span-5 min-w-0 max-w-full space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#202124] flex items-center space-x-1.5">
                  <MapIcon className="w-4 h-4 text-[#4285F4]" />
                  <span>{t.densityHeatmap}</span>
                </h3>
              </div>
              <ComplaintMap
                onSelectIssue={(issue) => setSelectedIssue(issue)}
                onAssignWorker={(issue) => setAssigningIssue(issue)}
                selectedCategory={categoryFilter}
                selectedSeverity={severityFilter}
                heightClassName="h-[380px] sm:h-[420px] lg:h-[460px]"
              />
            </div>

            {/* Right: Filterable Complaints Table (7 Cols) */}
            <div className="lg:col-span-7 min-w-0 max-w-full space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#202124] flex items-center space-x-1.5">
                  <TableIcon className="w-4 h-4 text-[#4285F4]" />
                  <span>Complaints Queue & Dispatch</span>
                </h3>
              </div>
              <ComplaintTable
                onSelectIssue={(issue) => setSelectedIssue(issue)}
                onAssignWorker={(issue) => setAssigningIssue(issue)}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                severityFilter={severityFilter}
                setSeverityFilter={setSeverityFilter}
              />
            </div>
          </div>
        )}

        {viewMode === 'map' && (
          <div className="w-full max-w-full min-w-0 space-y-3">
            <h3 className="text-sm font-bold text-[#202124] flex items-center space-x-1.5">
              <MapIcon className="w-4 h-4 text-[#4285F4]" />
              <span>Full Screen Geographic Complaint Heatmap</span>
            </h3>
            <ComplaintMap
              onSelectIssue={(issue) => setSelectedIssue(issue)}
              onAssignWorker={(issue) => setAssigningIssue(issue)}
              selectedCategory={categoryFilter}
              selectedSeverity={severityFilter}
              heightClassName="h-[520px] sm:h-[600px]"
            />
          </div>
        )}

        {viewMode === 'table' && (
          <div className="w-full max-w-full min-w-0 space-y-3">
            <h3 className="text-sm font-bold text-[#202124] flex items-center space-x-1.5">
              <TableIcon className="w-4 h-4 text-[#4285F4]" />
              <span>Comprehensive Municipal Complaint Database</span>
            </h3>
            <ComplaintTable
              onSelectIssue={(issue) => setSelectedIssue(issue)}
              onAssignWorker={(issue) => setAssigningIssue(issue)}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              severityFilter={severityFilter}
              setSeverityFilter={setSeverityFilter}
            />
          </div>
        )}
      </div>

      {/* Assign Worker Modal */}
      {assigningIssue && (
        <AssignWorkerModal
          issue={assigningIssue}
          onClose={() => setAssigningIssue(null)}
        />
      )}

      {/* Issue Tracker Detail Modal */}
      {selectedIssue && (
        <IssueTrackerModal
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
        />
      )}
    </div>
  );
};

