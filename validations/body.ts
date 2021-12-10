import { z } from 'zod'

import { recordId } from './airtable'

export const BodyWithRecordParser = z.object({
  recordId,
})
