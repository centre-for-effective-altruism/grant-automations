import emailValidator from 'email-validator'
import isUrl from 'is-url'
import { z } from 'zod'

/** Valid email */
export const email = z
  .string()
  .refine((val) => emailValidator.validate(val), { message: 'Invalid email' })

/** Valid URL */
export const url = z
  .string()
  .refine((val) => isUrl(val), { message: 'Invalid URL' })
