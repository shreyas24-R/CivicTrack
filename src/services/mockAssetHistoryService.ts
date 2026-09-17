import { Asset, AssetType, ProblemReport, IssueStatus } from '../types';

/** Mock list of civic assets across different wards and types */
export const MOCK_ASSETS: Asset[] = [
  {
    id: 'ast-8801-high',
    type: AssetType.StreetLight,
    location: { latitude: 12.9716, longitude: 77.5946 },
    installationDate: '2022-03-15T00:00:00.000Z',
    assetTag: 'SL-IND-8801 (High Severity Test)',
    ward: 'Ward 84 - Indiranagar',
  },
  {
    id: 'ast-4402-med',
    type: AssetType.WaterPoint,
    location: { latitude: 12.9352, longitude: 77.6245 },
    installationDate: '2021-08-10T00:00:00.000Z',
    assetTag: 'WP-KOR-4402 (Medium Severity Test)',
    ward: 'Ward 151 - Koramangala',
  },
  {
    id: 'ast-1103-low',
    type: AssetType.TrafficSignal,
    location: { latitude: 12.9784, longitude: 77.6408 },
    installationDate: '2023-01-20T00:00:00.000Z',
    assetTag: 'TS-CMH-1103 (Low Severity Test)',
    ward: 'Ward 88 - Domlur',
  },
  {
    id: 'ast-0000-empty',
    type: AssetType.PublicParkEquipment,
    location: { latitude: 12.9279, longitude: 77.6271 },
    installationDate: '2024-05-01T00:00:00.000Z',
    assetTag: 'PPE-KOR-0000 (Empty History Test)',
    ward: 'Ward 151 - Koramangala',
  },
  {
    id: 'ast-9999-error',
    type: AssetType.RoadAsset,
    location: { latitude: 12.9698, longitude: 77.7500 },
    installationDate: '2020-11-12T00:00:00.000Z',
    assetTag: 'RA-WHT-9999 (Simulated API Error Test)',
    ward: 'Ward 85 - Whitefield',
  },
  {
    id: 'ast-7777-paged',
    type: AssetType.RoadSign,
    location: { latitude: 12.9750, longitude: 77.6010 },
    installationDate: '2019-06-01T00:00:00.000Z',
    assetTag: 'RS-MG-7777 (Extensive History / Pagination Test)',
    ward: 'Ward 111 - MG Road',
  },
];

/** Internal mock problem reports database indexed by assetId */
const MOCK_REPORTS_DATABASE: Record<string, ProblemReport[]> = {
  // 1. High Severity: 4 reports in the last 8 months
  'ast-8801-high': [
    {
      id: 'rep-101',
      assetId: 'ast-8801-high',
      description: 'Frequent voltage surge burned out LED fixture capacitor for the 3rd time.',
      reportDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // ~15 days ago
      status: IssueStatus.Open,
      reportedBy: 'usr-cit-109',
      reporterName: 'Rajesh Kumar',
      photoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'rep-102',
      assetId: 'ast-8801-high',
      description: 'Streetlight flickering rapidly during evening hours. Wiring insulation degraded.',
      reportDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // ~2 months ago
      status: IssueStatus.InProgress,
      reportedBy: 'usr-cit-204',
      reporterName: 'Priya Sharma',
      resolutionNotes: 'Temporary patch connector installed by line worker Suresh.',
    },
    {
      id: 'rep-103',
      assetId: 'ast-8801-high',
      description: 'Total blackout on 12th Main Road. Junction box short circuit.',
      reportDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(), // ~4 months ago
      status: IssueStatus.Resolved,
      reportedBy: 'usr-cit-305',
      reporterName: 'Anil Mehta',
      resolutionNotes: 'Fuse replaced with 16A module.',
    },
    {
      id: 'rep-104',
      assetId: 'ast-8801-high',
      description: 'Pole cover plate missing, exposed wires spark during rain.',
      reportDate: new Date(Date.now() - 190 * 24 * 60 * 60 * 1000).toISOString(), // ~6.3 months ago
      status: IssueStatus.Resolved,
      reportedBy: 'usr-cit-412',
      reporterName: 'Deepak V',
      resolutionNotes: 'Cover taped up temporarily.',
    },
    {
      id: 'rep-105',
      assetId: 'ast-8801-high',
      description: 'Initial installation complaint: light beam angled incorrectly.',
      reportDate: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString(), // ~13 months ago
      status: IssueStatus.Resolved,
      reportedBy: 'usr-cit-501',
      reporterName: 'Kavita Reddy',
    },
  ],

  // 2. Medium Severity: 2 reports in the last 6 months
  'ast-4402-med': [
    {
      id: 'rep-201',
      assetId: 'ast-4402-med',
      description: 'Public water tap leaking continuously. Valve seal worn out.',
      reportDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 1 month ago
      status: IssueStatus.InProgress,
      reportedBy: 'usr-cit-882',
      reporterName: 'Sunil Gowda',
    },
    {
      id: 'rep-202',
      assetId: 'ast-4402-med',
      description: 'Low water pressure and rust discoloration in outflow pipe.',
      reportDate: new Date(Date.now() - 110 * 24 * 60 * 60 * 1000).toISOString(), // 3.6 months ago
      status: IssueStatus.Resolved,
      reportedBy: 'usr-cit-991',
      reporterName: 'Meena Iyer',
      resolutionNotes: 'Flushed pipe sediment.',
    },
    {
      id: 'rep-203',
      assetId: 'ast-4402-med',
      description: 'Handle lever broken off by vandals.',
      reportDate: new Date(Date.now() - 320 * 24 * 60 * 60 * 1000).toISOString(), // 10.6 months ago
      status: IssueStatus.Resolved,
      reportedBy: 'usr-cit-102',
      reporterName: 'Ramesh Babu',
    },
  ],

  // 3. Low Severity: 1 report 10 months ago
  'ast-1103-low': [
    {
      id: 'rep-301',
      assetId: 'ast-1103-low',
      description: 'Red light LED matrix module dim during direct sunlight.',
      reportDate: new Date(Date.now() - 300 * 24 * 60 * 60 * 1000).toISOString(), // ~10 months ago
      status: IssueStatus.Resolved,
      reportedBy: 'usr-cit-330',
      reporterName: 'Vikram Singh',
      resolutionNotes: 'Cleaned protective glass visor.',
    },
  ],

  // 4. Empty History
  'ast-0000-empty': [],

  // 5. Extensive History (12 items for pagination testing)
  'ast-7777-paged': Array.from({ length: 12 }).map((_, i) => ({
    id: `rep-paged-${i + 1}`,
    assetId: 'ast-7777-paged',
    description: `Road Sign damage report #${i + 1}: ${
      i % 2 === 0
        ? 'Reflective coating peeled off by high heat'
        : 'Signboard bracket loose and vibrating in wind'
    }`,
    reportDate: new Date(Date.now() - (i * 25 + 10) * 24 * 60 * 60 * 1000).toISOString(),
    status: i === 0 ? IssueStatus.Open : i === 1 ? IssueStatus.InProgress : IssueStatus.Resolved,
    reportedBy: `usr-cit-${700 + i}`,
    reporterName: `Citizen Inspector ${i + 1}`,
  })),
};

/**
 * Mock Data Generator function simulating an API endpoint.
 * Fetches problem report history for a given asset with simulated latency, error, and pagination.
 */
export async function fetchAssetProblemHistory(
  assetId: string,
  page: number = 1,
  pageSize: number = 4
): Promise<{
  asset: Asset;
  reports: ProblemReport[];
  totalCount: number;
  hasMore: boolean;
}> {
  // Artificial network latency delay (600ms)
  await new Promise((resolve) => setTimeout(resolve, 600));

  // Find asset
  const asset = MOCK_ASSETS.find((a) => a.id === assetId) || {
    id: assetId,
    type: AssetType.StreetLight,
    location: { latitude: 12.9716, longitude: 77.5946 },
    installationDate: '2023-01-01T00:00:00.000Z',
    assetTag: `Asset-${assetId}`,
    ward: 'Unknown Ward',
  };

  // Simulate server error for testing error UI state
  if (assetId === 'ast-9999-error') {
    throw new Error('HTTP 500: Internal Server Error - Failed to query municipal asset registry service.');
  }

  const fullHistory = MOCK_REPORTS_DATABASE[assetId] || [];
  
  // Sort descending by report date (newest first)
  const sortedHistory = [...fullHistory].sort(
    (a, b) => new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime()
  );

  const startIndex = 0;
  const endIndex = page * pageSize;
  const paginatedReports = sortedHistory.slice(startIndex, endIndex);
  const hasMore = endIndex < sortedHistory.length;

  return {
    asset,
    reports: paginatedReports,
    totalCount: sortedHistory.length,
    hasMore,
  };
}

/** Utility to generate dynamic mock problem report for quick testing */
export function createMockReport(overrides?: Partial<ProblemReport>): ProblemReport {
  return {
    id: `rep-gen-${Math.random().toString(36).substr(2, 9)}`,
    assetId: overrides?.assetId || 'ast-8801-high',
    description: 'Generated test description for problem history timeline unit testing.',
    reportDate: new Date().toISOString(),
    status: IssueStatus.Open,
    reportedBy: 'usr-cit-test',
    reporterName: 'Test Citizen',
    ...overrides,
  };
}
