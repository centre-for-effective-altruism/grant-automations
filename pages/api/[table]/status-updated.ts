import { FieldSet, Record as AirtableRecord } from 'airtable'
import { NextApiRequest, NextApiResponse } from 'next'

import { processTransition } from '../../../actions/status-updated'
import { recordOnTableHandler, requestWrapper } from '../../../utils/api'
import { TableName } from '../../../validations/tables'

async function statusUpdated(
  table: TableName,
  record: AirtableRecord<FieldSet>,
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const transitionStatus = await processTransition(table, record)

  res.json({ transitionStatus })
}

export default requestWrapper({
  POST: recordOnTableHandler(statusUpdated),
})
