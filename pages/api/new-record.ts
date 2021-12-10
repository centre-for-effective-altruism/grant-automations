import createError from 'http-errors'
import { NextApiRequest, NextApiResponse } from 'next'

import { requestWrapper } from '../../utils/api'

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const { recordId } = req.body
  if (!recordId) throw createError(400, 'Invalid record id')
  console.log(`Got record ID ${recordId}`)
  res.send(`Thanks for sending record ID ${recordId}`)
}

export default requestWrapper({
  POST: postHandler,
})
