import { z } from 'zod'

export const tableNames = ['main', 'awf', 'ltff', 'eaif'] as const
export const tableName = z.enum(tableNames)
export type TableName = z.infer<typeof tableName>
