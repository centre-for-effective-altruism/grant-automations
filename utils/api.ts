import { FieldSet, Record as AirtableRecord } from 'airtable'
import createHttpError, { HttpError } from 'http-errors'
import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next'
import { ZodError } from 'zod'

import { bases } from '../lib/airtable'
import { BodyWithRecordParser } from '../validations/body'
import { WithTableParser } from '../validations/query'
import { TableName } from '../validations/tables'

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export function requestWrapper(
  methodHandlers: Partial<{
    [x in HTTPMethod]: NextApiHandler
  }>,
) {
  return async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
      const method = req.method as HTTPMethod | 'OPTIONS'
      console.log(`Handler invoked with ${method}`)

      if (method === 'OPTIONS') {
        const allowedOptions = Object.keys(methodHandlers)
        res.setHeader('Allow', allowedOptions.join(', ')).status(204).end()
        return
      }

      const methodHandler = methodHandlers[method]
      if (!methodHandler) {
        res.status(405).send('Method not allowed')
        return
      }
      await methodHandler(req, res)
    } catch (err) {
      if (err instanceof ZodError) {
        const issues = err.issues.map((issue) => issue.message).join(', ')
        res.status(400).send(issues)
      } else if (err instanceof HttpError) {
        res.status(err.status).send(err.message)
      } else if (err instanceof Error) {
        console.error(err)
        res.status(500).send(err.message)
      } else {
        console.error(err)
        res.status(500).send('Unknown error')
      }
    }
  }
}

/** Convenience function to check that a record exists on a given table */
export function recordOnTableHandler(
  handler: (
    table: TableName,
    record: AirtableRecord<FieldSet>,
    req: NextApiRequest,
    res: NextApiResponse,
  ) => Promise<void> | void,
): NextApiHandler {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    const { recordId } = BodyWithRecordParser.parse(req.body)
    const { table } = WithTableParser.parse(req.query)
    const record = await bases[table]('Grant Applications').find(recordId)
    if (!record)
      throw createHttpError(
        404,
        `Record ${recordId} not found on table ${table}`,
      )
    await handler(table, record, req, res)
  }
}
