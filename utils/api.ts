import { HttpError } from 'http-errors'
import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next'

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
      console.error(err)
      if (err instanceof HttpError) {
        res.status(err.status).send(err.message)
      } else if (err instanceof Error) {
        res.status(500).send(err.message)
      } else {
        res.status(500).send('Unknown error')
      }
    }
  }
}
