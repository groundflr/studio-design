import { AttemptStatus, GradingStatus } from '~/types/TestAttempt'

export const attemptStatusMap = {
  [AttemptStatus.Complete]: 'Complete',
  [AttemptStatus.InProgress]: 'In Progress',
  [AttemptStatus.Incomplete]: 'Incomplete',
  [AttemptStatus.NotStarted]: 'Not Started',
  [AttemptStatus.Processing]: 'Processing',
  [AttemptStatus.Error]: 'Error',
}

export const gradingStatusMap = {
  [GradingStatus.Complete]: 'Complete',
  [GradingStatus.Error]: 'Error',
  [GradingStatus.InProgress]: 'In Progress',
  [GradingStatus.NotStarted]: 'Not Started',
  [GradingStatus.Queued]: 'Queued',
  [GradingStatus.Timeout]: 'Timeout',
  [GradingStatus.Processing]: 'Processing',
  [GradingStatus.OutOfDate]: 'Out of Date',
  [GradingStatus.GradeOverrideRequiresRegrade]: 'Regrade Required',
} satisfies Record<GradingStatus, string>
