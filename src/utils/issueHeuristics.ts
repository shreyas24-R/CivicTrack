import { ProblemReport, HeuristicAnalysisResult } from '../types';

/**
 * Analyzes the frequency of problem reports for a given civic asset
 * to detect recurring issues and determine severity for government intervention.
 *
 * Logic:
 * - 3+ issues in the last 8 months => High Severity (Requires Permanent Solution / Capital Overhaul)
 * - 2 issues in the last 6 months => Medium Severity (Escalated Preventive Repair)
 * - Otherwise => Low Severity (Standard Routine Maintenance)
 *
 * @param history Array of problem reports associated with the asset
 * @param referenceDate Optional reference date (defaults to current Date) for deterministic evaluation/testing
 * @returns HeuristicAnalysisResult containing recurrence flag, severity level, and administrative rationale
 */
export function analyzeIssueFrequency(
  history: ProblemReport[],
  referenceDate: Date = new Date()
): HeuristicAnalysisResult {
  if (!history || history.length === 0) {
    return {
      isRecurring: false,
      severity: 'Low',
      rationale: 'No problem reports recorded for this asset.',
      issuesLast8Months: 0,
      issuesLast6Months: 0,
    };
  }

  const refTime = referenceDate.getTime();

  // Threshold dates
  const eightMonthsAgo = new Date(referenceDate);
  eightMonthsAgo.setMonth(eightMonthsAgo.getMonth() - 8);

  const sixMonthsAgo = new Date(referenceDate);
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  let issuesLast8Months = 0;
  let issuesLast6Months = 0;

  for (const report of history) {
    const reportTime = new Date(report.reportDate).getTime();

    // Skip invalid dates
    if (isNaN(reportTime)) continue;

    // Check if report fell within 8 months
    if (reportTime >= eightMonthsAgo.getTime() && reportTime <= refTime) {
      issuesLast8Months++;
    }

    // Check if report fell within 6 months
    if (reportTime >= sixMonthsAgo.getTime() && reportTime <= refTime) {
      issuesLast6Months++;
    }
  }

  // 1. High Severity Rule: 3+ issues in last 8 months
  if (issuesLast8Months >= 3) {
    return {
      isRecurring: true,
      severity: 'High',
      rationale: `High Severity: ${issuesLast8Months} issues reported in the last 8 months. High recurrence detected! Infrastructure requires permanent replacement or structural redesign rather than temporary patch fixes.`,
      issuesLast8Months,
      issuesLast6Months,
    };
  }

  // 2. Medium Severity Rule: 2 issues in last 6 months
  if (issuesLast6Months >= 2) {
    return {
      isRecurring: true,
      severity: 'Medium',
      rationale: `Medium Severity: ${issuesLast6Months} issues reported in the last 6 months. Frequent failure pattern detected. Requires priority technical inspection and preventive maintenance.`,
      issuesLast8Months,
      issuesLast6Months,
    };
  }

  // 3. Low Severity: Normal / Isolated issues
  return {
    isRecurring: false,
    severity: 'Low',
    rationale: `Low Severity: ${history.length} total report(s), ${issuesLast8Months} in the last 8 months. Operating within standard failure tolerance.`,
    issuesLast8Months,
    issuesLast6Months,
  };
}
