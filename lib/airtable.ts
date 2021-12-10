import Airtable, { FieldSet, Table } from 'airtable'
import { AirtableBase } from 'airtable/lib/airtable_base'
import { z } from 'zod'

import { baseId, apiKey } from '../validations/airtable'
import { TableName } from '../validations/tables'

const EnvironmentVars = z.object({
  AIRTABLE_API_KEY: apiKey,
  AIRTABLE_MAIN_BASE_ID: baseId,
  AIRTABLE_AWF_BASE_ID: baseId,
  AIRTABLE_LTFF_BASE_ID: baseId,
  AIRTABLE_EAIF_BASE_ID: baseId,
})

const {
  AIRTABLE_API_KEY,
  AIRTABLE_MAIN_BASE_ID,
  AIRTABLE_AWF_BASE_ID,
  AIRTABLE_LTFF_BASE_ID,
  AIRTABLE_EAIF_BASE_ID,
} = EnvironmentVars.parse(process.env)

export const client = new Airtable({ apiKey: AIRTABLE_API_KEY })

export const bases: Record<TableName, AirtableBase> = {
  main: client.base(AIRTABLE_MAIN_BASE_ID),
  awf: client.base(AIRTABLE_AWF_BASE_ID),
  ltff: client.base(AIRTABLE_LTFF_BASE_ID),
  eaif: client.base(AIRTABLE_EAIF_BASE_ID),
}

export const tables: Record<TableName, Record<string, Table<FieldSet>>> = {
  main: {
    grants: bases.main('Grant Applications'),
  },
  awf: {
    grants: bases.awf('Grant Applications'),
  },
  ltff: {
    grants: bases.ltff('Grant Applications'),
  },
  eaif: {
    grants: bases.eaif('Grant Applications'),
  },
}
