import { z } from 'zod'

/** Airtable API key */
export const apiKey = z
  .string()
  .refine((val) => /^key\w+$/.test(val), { message: 'Invalid api key' })

/** Airtable Base ID */
export const baseId = z
  .string()
  .refine((val) => /^app\w+$/.test(val), { message: 'Invalid base ID' })

/** Airtable record ID */
export const recordId = z
  .string()
  .refine((val) => /^rec\w+$/.test(val), { message: 'Invalid record ID' })
