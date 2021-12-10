import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

import { tables } from '../../lib/airtable'
import { requestWrapper } from '../../utils/api'
import { recordId } from '../../validations/airtable'

const BodyParser = z.object({
  recordId,
})

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const { recordId } = BodyParser.parse(req.body)
  const record = await tables.main.grants.find(recordId)
  res.json(record)
}

export default requestWrapper({
  POST: postHandler,
})
