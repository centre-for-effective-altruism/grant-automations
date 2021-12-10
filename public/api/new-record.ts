import { VercelRequest, VercelResponse } from '@vercel/node'
import createError from 'http-errors'

import { requestWrapper } from '../../lib/helpers'

async function postHandler(req: VercelRequest, res: VercelResponse) {
  const { recordId } = req.body
  if (!recordId) throw createError(400, 'Invalid record id')
  console.log(`Got record ID ${recordId}`)
  res.send(`Thanks for sending record ID ${recordId}`)
}

export default requestWrapper({
  POST: postHandler,
})
