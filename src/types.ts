/**
 * Data Models for Civic Assets and Problem History Tracking
 * Gramin-Sathi Admin / Civic Infrastructure Module
 */

export enum AssetType {
  StreetLight = 'StreetLight',
  TrafficSignal = 'TrafficSignal',
  WaterPoint = 'WaterPoint',
  PublicParkEquipment = 'PublicParkEquipment',
  RoadAsset = 'RoadAsset',
  RoadSign = 'RoadSign',
}

export enum IssueStatus {
  Open = 'Open',
  InProgress = 'InProgress',
  Resolved = 'Resolved',
  WontFix = 'WontFix',
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
}

export interface Asset {
  /** Unique Asset UUID */
  id: string;
  /** Category of civic asset */
  type: AssetType;
  /** Physical coordinates */
  location: GeoLocation;
  /** ISO Date string of installation */
  installationDate: string;
  /** Optional human-readable asset code or label */
  assetTag?: string;
  /** Municipal Ward or locality */
  ward?: string;
}

export interface ProblemReport {
  /** Unique Report UUID */
  id: string;
  /** Associated Asset UUID */
  assetId: string;
  /** Detailed issue description */
  description: string;
  /** ISO Timestamp of report submission */
  reportDate: string;
  /** Current issue status */
  status: IssueStatus;
  /** Reporter User ID */
  reportedBy: string;
  /** Optional reporter name or phone for admin context */
  reporterName?: string;
  /** Optional resolution notes when status is Resolved / WontFix */
  resolutionNotes?: string;
  /** Optional proof photo URL */
  photoUrl?: string;
}

export interface HeuristicAnalysisResult {
  /** Indicates whether the asset shows recurring problem patterns */
  isRecurring: boolean;
  /** Calculated severity grade based on report frequency */
  severity: 'Low' | 'Medium' | 'High';
  /** Human-readable rationale for government administrators */
  rationale?: string;
  /** Count of issues reported within the last 8 months */
  issuesLast8Months?: number;
  /** Count of issues reported within the last 6 months */
  issuesLast6Months?: number;
}

// Re-export all application core types for unified module access
export * from './types/index';
