export interface SyntheticControlRow {
  controlId: string;
  name: string;
  ownerName: string | null;
  ownerEmail: string | null;
  dueDaysAgo: number; // positive = overdue, 0 = due today, negative = future
  status: 'Pending' | 'In Progress' | 'Complete' | 'Exception';
  materiality: 'Low' | 'Medium' | 'High';
}

export interface SimulationLogEntry {
  timestamp: string;
  step: string;
  controlId?: string;
  status: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'SKIPPED';
  message: string;
  idempotencyKey?: string;
  actionTaken?: string;
}

export interface SimulationResult {
  runId: string;
  executedAt: string;
  isRerun: boolean;
  totalControlsEvaluated: number;
  notificationsSent: number;
  duplicateRunsSuppressed: number;
  escalationsTriggered: number;
  logs: SimulationLogEntry[];
}

export const INITIAL_SYNTHETIC_CONTROLS: SyntheticControlRow[] = [
  {
    controlId: 'CTRL-101',
    name: 'Operating Cash & Bank Reconciliation',
    ownerName: 'Min-jun Kim',
    ownerEmail: 'm.kim@synthetic-corp.com',
    dueDaysAgo: 1,
    status: 'Pending',
    materiality: 'High',
  },
  {
    controlId: 'CTRL-102',
    name: 'Fixed Asset Additions & Capitalization Review',
    ownerName: 'Sarah Jenkins',
    ownerEmail: 's.jenkins@synthetic-corp.com',
    dueDaysAgo: 0,
    status: 'Complete',
    materiality: 'Medium',
  },
  {
    controlId: 'CTRL-103',
    name: 'Revenue Cutoff & Unbilled AR Sampling',
    ownerName: 'Min-jun Kim',
    ownerEmail: 'm.kim@synthetic-corp.com',
    dueDaysAgo: 3,
    status: 'Pending',
    materiality: 'High',
  },
  {
    controlId: 'CTRL-104',
    name: 'Top-Side Manual Journal Entry Sign-Off',
    ownerName: null, // Edge case: Unassigned owner
    ownerEmail: null,
    dueDaysAgo: 2,
    status: 'Pending',
    materiality: 'High',
  },
  {
    controlId: 'CTRL-105',
    name: 'Intercompany Balance Matrix Settlement',
    ownerName: 'David Park',
    ownerEmail: 'd.park@synthetic-corp.com',
    dueDaysAgo: 2,
    status: 'In Progress',
    materiality: 'Medium',
  },
];

/**
 * Deterministic automation engine simulating Power Automate / workflow execution.
 * Handles triggers, conditions, missing-owner edge cases, and strict idempotency key checks.
 */
export function runMonthEndAutomationSimulation(
  controls: SyntheticControlRow[],
  existingRunKeys: Set<string>,
  runDate: string = '2026-10-09'
): { result: SimulationResult; updatedRunKeys: Set<string> } {
  const logs: SimulationLogEntry[] = [];
  const runId = `RUN-${Date.now().toString(36).toUpperCase()}`;
  const updatedRunKeys = new Set(existingRunKeys);

  let notificationsSent = 0;
  let duplicateRunsSuppressed = 0;
  let escalationsTriggered = 0;

  logs.push({
    timestamp: new Date().toISOString(),
    step: 'Trigger',
    status: 'INFO',
    message: `Scheduled recurrence trigger fired at 08:00:00 KST for batch date [${runDate}].`,
  });

  logs.push({
    timestamp: new Date().toISOString(),
    step: 'Get Items',
    status: 'INFO',
    message: `Retrieved ${controls.length} controls from synthetic SharePoint list 'MonthEndCloseChecklist'.`,
  });

  for (const ctrl of controls) {
    // Condition: Is control already Complete?
    if (ctrl.status === 'Complete') {
      logs.push({
        timestamp: new Date().toISOString(),
        step: 'Evaluate Condition',
        controlId: ctrl.controlId,
        status: 'INFO',
        message: `Control [${ctrl.controlId}] is already 'Complete'. No reminder needed.`,
      });
      continue;
    }

    // Condition: Is it overdue?
    if (ctrl.dueDaysAgo <= 0) {
      logs.push({
        timestamp: new Date().toISOString(),
        step: 'Evaluate Condition',
        controlId: ctrl.controlId,
        status: 'INFO',
        message: `Control [${ctrl.controlId}] is due today or in the future (${ctrl.dueDaysAgo} days). Reminder not yet triggered.`,
      });
      continue;
    }

    // Edge Case: Missing or Unassigned Owner
    if (!ctrl.ownerEmail || !ctrl.ownerName) {
      escalationsTriggered += 1;
      const idempotencyKey = `${runDate}-${ctrl.controlId}-ESCALATE-NO-OWNER`;
      
      if (updatedRunKeys.has(idempotencyKey)) {
        duplicateRunsSuppressed += 1;
        logs.push({
          timestamp: new Date().toISOString(),
          step: 'Idempotency Filter',
          controlId: ctrl.controlId,
          status: 'SKIPPED',
          idempotencyKey,
          message: `Suppressed duplicate unassigned owner escalation for [${ctrl.controlId}] (Key: ${idempotencyKey}).`,
        });
      } else {
        updatedRunKeys.add(idempotencyKey);
        notificationsSent += 1;
        logs.push({
          timestamp: new Date().toISOString(),
          step: 'Edge Case Handler',
          controlId: ctrl.controlId,
          status: 'WARNING',
          idempotencyKey,
          message: `Missing owner detected for [${ctrl.controlId}]! Dispatched routing exception to Controller inbox: controller@synthetic-corp.com`,
          actionTaken: 'Escalated to Controller (Unassigned owner branch)',
        });
      }
      continue;
    }

    // Standard Overdue Notification with Idempotency Key
    // Key formula: {runDate}-{controlId}-{dueDaysAgo}
    const idempotencyKey = `${runDate}-${ctrl.controlId}-DAY-${ctrl.dueDaysAgo}`;

    if (updatedRunKeys.has(idempotencyKey)) {
      duplicateRunsSuppressed += 1;
      logs.push({
        timestamp: new Date().toISOString(),
        step: 'Idempotency Filter',
        controlId: ctrl.controlId,
        status: 'SKIPPED',
        idempotencyKey,
        message: `Suppressed duplicate email for [${ctrl.controlId}] to ${ctrl.ownerEmail}. Key [${idempotencyKey}] already processed today!`,
        actionTaken: 'Suppressed duplicate dispatch (Idempotency check passed)',
      });
      continue;
    }

    // Record the run key
    updatedRunKeys.add(idempotencyKey);
    notificationsSent += 1;

    // Check if severe overdue (>= 2 days) needing CC escalation
    if (ctrl.dueDaysAgo >= 2) {
      escalationsTriggered += 1;
      logs.push({
        timestamp: new Date().toISOString(),
        step: 'Send Escalation Alert',
        controlId: ctrl.controlId,
        status: 'WARNING',
        idempotencyKey,
        message: `URGENT (${ctrl.dueDaysAgo} days overdue): Dispatched reminder to ${ctrl.ownerEmail} with CC to finance-director@synthetic-corp.com`,
        actionTaken: `Email sent to ${ctrl.ownerEmail} + Manager CC`,
      });
    } else {
      logs.push({
        timestamp: new Date().toISOString(),
        step: 'Send Standard Reminder',
        controlId: ctrl.controlId,
        status: 'SUCCESS',
        idempotencyKey,
        message: `Standard reminder (${ctrl.dueDaysAgo} day overdue) dispatched to ${ctrl.ownerEmail}.`,
        actionTaken: `Email sent to ${ctrl.ownerEmail}`,
      });
    }
  }

  logs.push({
    timestamp: new Date().toISOString(),
    step: 'Flow Complete',
    status: 'INFO',
    message: `Batch run [${runId}] finished. Sent: ${notificationsSent}, Suppressed Duplicates: ${duplicateRunsSuppressed}, Escalated: ${escalationsTriggered}.`,
  });

  return {
    result: {
      runId,
      executedAt: new Date().toISOString(),
      isRerun: duplicateRunsSuppressed > 0,
      totalControlsEvaluated: controls.length,
      notificationsSent,
      duplicateRunsSuppressed,
      escalationsTriggered,
      logs,
    },
    updatedRunKeys,
  };
}
