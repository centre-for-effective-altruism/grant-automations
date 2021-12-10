import createError from 'http-errors'
import { NextApiRequest, NextApiResponse } from 'next'

import { bases } from '../../lib/airtable'
import { requestWrapper } from '../../utils/api'

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const { recordId } = req.body

  if (!recordId) throw createError(400, 'Invalid record id')
  const grantsTable = bases.main('Grant Applications')
  const record = await grantsTable.find(recordId)
  res.json(record)
}

export default requestWrapper({
  POST: postHandler,
})
