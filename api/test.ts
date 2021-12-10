import { VercelRequest, VercelResponse } from '@vercel/node'

export default async function postHandler(
  req: VercelRequest,
  res: VercelResponse,
) {
  console.log(req.method)
  res.end()
}
