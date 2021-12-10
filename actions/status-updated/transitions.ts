import { FieldSet, Record as AirtableRecord } from 'airtable'
import { z } from 'zod'

import { tables } from '../../lib/airtable'
import {
  grantApplicationStatus,
  GrantApplicationStatus,
} from '../../validations/statuses'
import { TableName } from '../../validations/tables'

const canAlwaysTransitionTo: GrantApplicationStatus[] = [
  'Application Submitted',
  'Under Evaluation',
  'Voting',
  'Final Review',
  'Funded Elsewhere',
  'Rejected',
  'Desk Rejected',
]

const allowedTransitions: Record<
  GrantApplicationStatus,
  GrantApplicationStatus[]
> = {
  'Application Submitted': [
    'Desk Rejected' /*  'Referred to Secondary Fund' */,
  ],
  'Under Evaluation': [
    'Voting',
    'Final Review',
    'Rejected',
    // 'Referred to Secondary Fund',
  ],
  Voting: ['Final Review', 'Rejected'],
  'Final Review': ['Approved', 'Rejected', 'Referred to Private Funder'],
  Approved: ['Paid Out'],
  'Paid Out': [],
  'Funded Elsewhere': [],
  'Desk Rejected': [],
  Rejected: [],
  // 'Referred to Secondary Fund': ['Rejected'],
  'Referred to Private Funder': [],
}

type TransitionStatus = 'INIT' | 'VALID' | 'INVALID' | 'NO_CHANGE'

export function validateTransition(
  status: GrantApplicationStatus,
  prevStatus: GrantApplicationStatus | null | undefined,
): TransitionStatus {
  if (status && prevStatus) {
    if (status === prevStatus) return 'NO_CHANGE'
    const statusAllowedTransitions = [
      ...allowedTransitions[prevStatus],
      ...canAlwaysTransitionTo,
    ]
    return !statusAllowedTransitions.includes(status) ? 'INVALID' : 'VALID'
  }
  return 'INIT'
}

type TransitionProcessedStatus = {
  transitionStatus: TransitionStatus
  currentStatus: GrantApplicationStatus
}

const RecordParser = z.object({
  Status: grantApplicationStatus,
  'Previous Status': grantApplicationStatus.nullish(),
})

export async function processTransition(
  table: TableName,
  record: AirtableRecord<FieldSet>,
): Promise<TransitionProcessedStatus> {
  const { Status, 'Previous Status': PreviousStatus } = RecordParser.parse(
    record.fields,
  )
  const transitionStatus = validateTransition(Status, PreviousStatus)
  const grantsTable = tables[table].grants

  let currentStatus: GrantApplicationStatus = Status
  switch (transitionStatus) {
    case 'NO_CHANGE':
      break
    case 'INIT':
    case 'VALID':
      await grantsTable.update(record.id, {
        'Previous Status': Status,
      })
      break
    case 'INVALID': {
      const _prev = grantApplicationStatus.parse(PreviousStatus)
      await grantsTable.update(record.id, {
        Status: _prev,
      })
      currentStatus = _prev
      break
    }
    default:
      throw new Error(`Unknown transition status ${transitionStatus}`)
  }

  return { transitionStatus, currentStatus }
}
