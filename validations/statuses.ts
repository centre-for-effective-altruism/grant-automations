import { z } from 'zod'

export const grantApplicationStatus = z.enum([
  'Application Submitted',
  'Under Evaluation',
  'Voting',
  'Final Review',
  'Desk Rejected',
  'Rejected',
  'Funded Elsewhere',
  'Approved',
  'Referred to Private Funder',
  'Paid Out',
])

export type GrantApplicationStatus = z.infer<typeof grantApplicationStatus>
