import { VercelApiHandler, VercelRequest, VercelResponse } from '@vercel/node'

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export function requestWrapper(
  methodHandlers: Partial<{
    [x in HTTPMethod]: VercelApiHandler
  }>,
) {
  return function handler(req: VercelRequest, res: VercelResponse) {
    const method = req.method as HTTPMethod | 'OPTIONS'
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
  }
}
