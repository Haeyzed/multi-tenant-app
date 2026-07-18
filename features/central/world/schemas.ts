import { z } from "zod"

export const countrySchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  iso2: z
    .string()
    .length(2, { message: "ISO2 must be exactly 2 characters." }),
  iso3: z
    .union([
      z.string().length(3, { message: "ISO3 must be exactly 3 characters." }),
      z.literal(""),
    ])
    .optional(),
  status: z.enum(["0", "1"]),
  phone_code: z.string().max(5).optional(),
  native: z.string().optional(),
  region: z.string().optional(),
  subregion: z.string().optional(),
  emoji: z.string().optional(),
})

export const stateSchema = z.object({
  country_id: z.string().min(1, { message: "Country is required." }),
  name: z.string().min(1, { message: "Name is required." }),
  state_code: z.string().max(5).optional(),
  country_code: z.string().max(3).optional(),
  type: z.string().optional(),
})

export const citySchema = z.object({
  country_id: z.string().min(1, { message: "Country is required." }),
  state_id: z.string().min(1, { message: "State is required." }),
  name: z.string().min(1, { message: "Name is required." }),
  country_code: z
    .string()
    .min(1, { message: "Country code is required." })
    .max(3),
  state_code: z
    .string()
    .min(1, { message: "State code is required." })
    .max(5),
})

export const currencySchema = z.object({
  country_id: z.string().min(1, { message: "Country is required." }),
  name: z.string().min(1, { message: "Name is required." }),
  code: z.string().min(1, { message: "Code is required." }),
  symbol: z.string().min(1, { message: "Symbol is required." }),
  symbol_native: z.string().optional(),
  precision: z.string().optional(),
})

export const timezoneSchema = z.object({
  country_id: z.string().min(1, { message: "Country is required." }),
  name: z.string().min(1, { message: "Name is required." }),
})

export const languageSchema = z.object({
  code: z
    .string()
    .length(2, { message: "Code must be exactly 2 characters." }),
  name: z.string().min(1, { message: "Name is required." }),
  name_native: z.string().min(1, { message: "Native name is required." }),
  dir: z.enum(["ltr", "rtl"]),
})

export type CountryFormValues = z.infer<typeof countrySchema>
export type StateFormValues = z.infer<typeof stateSchema>
export type CityFormValues = z.infer<typeof citySchema>
export type CurrencyFormValues = z.infer<typeof currencySchema>
export type TimezoneFormValues = z.infer<typeof timezoneSchema>
export type LanguageFormValues = z.infer<typeof languageSchema>
