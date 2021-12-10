import Airtable from 'airtable'
import { z } from 'zod'

const EnvironmentVars = z.object({
  AIRTABLE_API_KEY: z.string(),
  AIRTABLE_MAIN_BASE_ID: z.string(),
})

const { AIRTABLE_API_KEY, AIRTABLE_MAIN_BASE_ID } = EnvironmentVars.parse(
  process.env,
)

export const client = new Airtable({ apiKey: AIRTABLE_API_KEY })

export const bases = {
  main: client.base(AIRTABLE_MAIN_BASE_ID),
}
