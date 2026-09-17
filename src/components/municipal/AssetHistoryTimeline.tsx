import React, { useState, useEffect, useMemo } from 'react';
import {
  Asset,
  AssetType,
  ProblemReport,
  IssueStatus,
} from '../../types';
import { analyzeIssueFrequency } from '../../utils/issueHeuristics';
import { fetchAssetProblemHistory } from '../../services/mockAssetHistoryService';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Wrench,
  XCircle,
  MapPin,
  Calendar,
  RefreshCw,
  ChevronDown,
  ShieldAlert,
  Zap,
  Radio,
  Droplets,
  Trees,
  Construction,
  Signpost,
  User,
  FileText,
  Sparkles,
  Info,
  Filter,
} from 'lucide-react';

interface AssetHistoryTimelineProps {
  /** Target asset ID to inspect */
  assetId: string;
  /** Optional pre-loaded asset data */
  initialAsset?: Asset;
  /** Custom title header */
  title?: string;
  /** Callback when issue details are clicked */
  onSelectReport?: (report: ProblemReport) => void;
  /** Page size for timeline pagination */
  pageSize?: number;
}

export const AssetHistoryTimeline: React.FC<AssetHistoryTimelineProps> = ({
  assetId,
  initialAsset,
  title = 'Asset Problem History & Infrastructure Diagnostics',
  onSelectReport,
  pageSize = 4,
}) => {
  // State management
  const [asset, setAsset] = useState<Asset | null>(initialAsset || null);
  const [reports, setReports] = useState<ProblemReport[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Filter status state
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Fetch asset and history on assetId or page changes
  const loadData = async (targetPage: number = 1, isInitial: boolean = true) => {
    if (isInitial) {
      setIsLoading(true);
      setError(null);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const result = await fetchAssetProblemHistory(assetId, targetPage, pageSize);
      setAsset(result.asset);
      setReports(result.reports);
      setTotalCount(result.totalCount);
      setHasMore(result.hasMore);
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to load asset problem history.');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    loadData(1, true);
  }, [assetId]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadData(nextPage, false);
  };

  const handleRetry = () => {
    loadData(page, true);
  };

  // Compute Heuristic Analysis on complete fetched history
  const heuristic = useMemo(() => {
    return analyzeIssueFrequency(reports);
  }, [reports]);

  // Filtered reports for display
  const filteredReports = useMemo(() => {
    if (statusFilter === 'ALL') return reports;
    return reports.filter((r) => r.status === statusFilter);
  }, [reports, statusFilter]);

  // Helper for Asset Type Icon & Badge
  const renderAssetTypeBadge = (type?: AssetType) => {
    switch (type) {
      case AssetType.StreetLight:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Zap className="w-3.5 h-3.5 text-amber-500" /> Street Light
          </span>
        );
      case AssetType.TrafficSignal:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <Radio className="w-3.5 h-3.5 text-rose-500" /> Traffic Signal
          </span>
        );
      case AssetType.WaterPoint:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            <Droplets className="w-3.5 h-3.5 text-sky-500" /> Water Point
          </span>
        );
      case AssetType.PublicParkEquipment:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Trees className="w-3.5 h-3.5 text-emerald-500" /> Park Equipment
          </span>
        );
      case AssetType.RoadAsset:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Construction className="w-3.5 h-3.5 text-indigo-500" /> Road Asset
          </span>
        );
      case AssetType.RoadSign:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-200">
            <Signpost className="w-3.5 h-3.5 text-violet-500" /> Road Sign
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-50 text-gray-700 border border-gray-200">
            Civic Asset
          </span>
        );
    }
  };

  // Helper for Status Badge
  const renderStatusBadge = (status: IssueStatus) => {
    switch (status) {
      case IssueStatus.Open:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
            <Clock className="w-3 h-3 text-red-600" /> Open
          </span>
        );
      case IssueStatus.InProgress:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <Wrench className="w-3 h-3 text-amber-600 animate-spin-slow" /> In Progress
          </span>
        );
      case IssueStatus.Resolved:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Resolved
          </span>
        );
      case IssueStatus.WontFix:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
            <XCircle className="w-3 h-3 text-slate-500" /> Won't Fix
          </span>
        );
    }
  };

  // Format date helper
  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(d);
    } catch {
      return isoString;
    }
  };

  // Relative time helper
  const getRelativeTime = (isoString: string) => {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 30) return `${diffDays} days ago`;
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) return `${diffMonths} mo ago`;
    return `${Math.floor(diffMonths / 12)} yr ago`;
  };

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden font-sans">
      {/* 1. Header Bar */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-slate-900 text-white p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-blue-500/20 text-blue-300 text-[11px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded border border-blue-400/30">
                Government Dashboard
              </span>
              <span className="text-xs text-gray-400">• Asset Telemetry</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-1 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400 shrink-0" />
              <span>{title}</span>
            </h2>
          </div>

          <button
            onClick={() => loadData(1, true)}
            disabled={isLoading}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/10 hover:bg-white/20 text-white transition-all disabled:opacity-50"
            title="Refresh Timeline"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Asset Details Bar (If loaded) */}
        {asset && !isLoading && !error && (
          <div className="mt-4 pt-4 border-t border-gray-700/60 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2 text-gray-300">
              <span className="text-gray-400 font-medium">Type:</span>
              {renderAssetTypeBadge(asset.type)}
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="truncate">
                {asset.location.latitude.toFixed(4)}, {asset.location.longitude.toFixed(4)}
                {asset.ward ? ` (${asset.ward})` : ''}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>Installed: {new Date(asset.installationDate).toLocaleDateString()}</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* 2. LOADING SKELETON STATE */}
        {isLoading && (
          <div className="space-y-4 animate-pulse">
            {/* Warning Skeleton */}
            <div className="h-24 bg-gray-100 rounded-xl border border-gray-200" />
            
            {/* Timeline Skeleton Nodes */}
            <div className="space-y-6 pt-2">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex gap-4">
                  <div className="w-8 h-8 bg-gray-200 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-12 bg-gray-100 rounded-lg w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. ERROR STATE WITH RETRY BUTTON */}
        {!isLoading && error && (
          <div className="p-6 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 space-y-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-base text-rose-900">Failed to Retrieve History</h3>
                <p className="text-sm text-rose-700 mt-1">{error}</p>
              </div>
            </div>
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={handleRetry}
                className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Request</span>
              </button>
              <span className="text-xs text-rose-600">
                Check connection or asset registry status.
              </span>
            </div>
          </div>
        )}

        {/* 4. SUCCESS CONTENT */}
        {!isLoading && !error && (
          <>
            {/* Advanced Recurring Problem Detection Warning Badge / Banner */}
            {reports.length > 0 && (
              <div>
                {heuristic.severity === 'High' && (
                  <div className="p-4 sm:p-5 bg-gradient-to-r from-red-500/10 via-rose-500/5 to-red-500/10 border-2 border-red-500/40 rounded-xl shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-red-600 text-white rounded-lg shadow-sm shrink-0">
                        <ShieldAlert className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-bold text-red-900 uppercase tracking-wide">
                            High Severity: Recurring Infrastructure Failure
                          </h3>
                          <span className="px-2.5 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wider animate-pulse">
                            Permanent Solution Required
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-red-800 leading-relaxed">
                          {heuristic.rationale}
                        </p>
                        <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-red-700">
                          <span>📊 Reports in last 8 months: <strong>{heuristic.issuesLast8Months}</strong></span>
                          <span>⚠️ Action: Dispatch Capital Replacement Tender</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {heuristic.severity === 'Medium' && (
                  <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-amber-500/10 border-2 border-amber-500/40 rounded-xl shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-amber-600 text-white rounded-lg shadow-sm shrink-0">
                        <AlertTriangle className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wide">
                            Medium Severity: Frequent Issue Pattern
                          </h3>
                          <span className="px-2.5 py-0.5 bg-amber-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                            Preventive Maintenance Escalation
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
                          {heuristic.rationale}
                        </p>
                        <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-amber-700">
                          <span>📊 Reports in last 6 months: <strong>{heuristic.issuesLast6Months}</strong></span>
                          <span>🔧 Action: Technical Senior Inspection</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {heuristic.severity === 'Low' && (
                  <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-emerald-600 text-white rounded-lg shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                          Normal Operating Health
                        </h4>
                        <p className="text-xs text-emerald-700 mt-0.5">
                          {heuristic.rationale} Asset is performing within normal failure parameters.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Filter & Counter Bar */}
            {reports.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 pb-2 border-b border-gray-100">
                <div className="flex items-center space-x-2 text-xs text-gray-500 font-medium">
                  <Filter className="w-3.5 h-3.5 text-gray-400" />
                  <span>Filter Status:</span>
                  {(['ALL', IssueStatus.Open, IssueStatus.InProgress, IssueStatus.Resolved, IssueStatus.WontFix] as const).map(
                    (st) => (
                      <button
                        key={st}
                        onClick={() => setStatusFilter(st)}
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                          statusFilter === st
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {st}
                      </button>
                    )
                  )}
                </div>

                <div className="text-xs text-gray-500 font-medium">
                  Showing <strong>{filteredReports.length}</strong> of <strong>{totalCount}</strong> reports
                </div>
              </div>
            )}

            {/* 5. EMPTY STATE */}
            {reports.length === 0 && (
              <div className="py-12 px-4 text-center space-y-3 bg-gray-50/60 rounded-xl border border-dashed border-gray-200">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-gray-800">No Problem History Found</h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  This asset has no recorded citizen complaints or defect reports. It maintains a clean maintenance log.
                </p>
              </div>
            )}

            {/* 6. VERTICAL TIMELINE LAYOUT */}
            {filteredReports.length > 0 && (
              <div className="relative pl-4 sm:pl-6 space-y-6 pt-2">
                {/* Timeline vertical bar */}
                <div className="absolute left-[19px] sm:left-[27px] top-3 bottom-3 w-0.5 bg-gray-200" />

                {filteredReports.map((report, index) => {
                  return (
                    <div
                      key={report.id}
                      onClick={() => onSelectReport?.(report)}
                      className={`relative flex items-start gap-4 sm:gap-6 group transition-all ${
                        onSelectReport ? 'cursor-pointer' : ''
                      }`}
                    >
                      {/* Timeline Node Icon */}
                      <div className="relative z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border-2 border-gray-300 group-hover:border-blue-500 group-hover:scale-105 flex items-center justify-center shadow-sm transition-all shrink-0">
                        {report.status === IssueStatus.Open && (
                          <Clock className="w-4 h-4 text-red-600" />
                        )}
                        {report.status === IssueStatus.InProgress && (
                          <Wrench className="w-4 h-4 text-amber-600" />
                        )}
                        {report.status === IssueStatus.Resolved && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        )}
                        {report.status === IssueStatus.WontFix && (
                          <XCircle className="w-4 h-4 text-slate-500" />
                        )}
                      </div>

                      {/* Timeline Card */}
                      <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4 shadow-sm group-hover:shadow-md group-hover:border-blue-200 transition-all space-y-2">
                        {/* Top Line: Date & Status */}
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center space-x-2">
                            {renderStatusBadge(report.status)}
                            <span className="text-xs font-bold text-gray-900">
                              Report #{report.id}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            <span>{formatDate(report.reportDate)}</span>
                            <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] font-semibold text-gray-600">
                              {getRelativeTime(report.reportDate)}
                            </span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal">
                          {report.description}
                        </p>

                        {/* Optional Resolution Notes */}
                        {report.resolutionNotes && (
                          <div className="p-2.5 bg-emerald-50/60 border border-emerald-100 rounded-lg text-xs text-emerald-900 flex items-start gap-2 mt-2">
                            <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-semibold text-emerald-800">Resolution Remark: </span>
                              <span>{report.resolutionNotes}</span>
                            </div>
                          </div>
                        )}

                        {/* Optional Image Preview */}
                        {report.photoUrl && (
                          <div className="pt-2">
                            <img
                              src={report.photoUrl}
                              alt="Report Evidence"
                              className="h-28 w-44 object-cover rounded-lg border border-gray-200 shadow-xs"
                            />
                          </div>
                        )}

                        {/* Bottom Reporter Info */}
                        <div className="pt-2 flex items-center justify-between text-[11px] text-gray-400 border-t border-gray-100">
                          <div className="flex items-center space-x-1.5 text-gray-500">
                            <User className="w-3 h-3 text-gray-400" />
                            <span>Reported by: </span>
                            <strong className="text-gray-700 font-medium">
                              {report.reporterName || report.reportedBy}
                            </strong>
                          </div>

                          <span className="text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                            View details &rarr;
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 7. PAGINATION / INFINITE SCROLL PLACEHOLDER LOGIC */}
            {hasMore && (
              <div className="pt-4 text-center border-t border-gray-100">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
                >
                  {isLoadingMore ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Fetching next page...</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      <span>Load More Problem Reports ({totalCount - reports.length} remaining)</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
