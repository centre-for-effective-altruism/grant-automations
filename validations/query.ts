import { z } from 'zod'

import { tableName } from './tables'

export const WithTableParser = z.object({
  table: tableName,
})
