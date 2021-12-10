import { VercelRequest, VercelResponse } from '@vercel/node'
// import createError from 'http-errors'
import isNumber from 'is-number'

import { requestWrapper } from '../lib/helpers'

async function postHandler(req: VercelRequest, res: VercelResponse) {
  const { recordId } = req.body
  console.log(`is 10 a number? ${isNumber(10)}`)
  if (!recordId) throw new Error('no record Id') // createError(400, 'Invalid record id')
  console.log(`Got record ID ${recordId}`)
  res.send(`Thanks for sending record ID ${recordId}`)
}

export default requestWrapper({
  POST: postHandler,
})
