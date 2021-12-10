import { VercelApiHandler, VercelRequest, VercelResponse } from '@vercel/node'
import { HttpError } from 'http-errors'

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export function requestWrapper(
  methodHandlers: Partial<{
    [x in HTTPMethod]: VercelApiHandler
  }>,
) {
  return function handler(req: VercelRequest, res: VercelResponse) {
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
      return methodHandler(req, res)
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
