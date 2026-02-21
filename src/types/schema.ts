export type FieldType =
  | 'string'
  | 'number'
  | 'integer'
  | 'boolean'
  | 'array'
  | 'object'
  | 'null'

export const FIELD_TYPES: FieldType[] = [
  'string', 'number', 'integer', 'boolean', 'array', 'object', 'null',
]

export const STRING_FORMATS = [
  'date-time', 'date', 'time', 'email', 'hostname', 'ipv4', 'ipv6', 'uri', 'uuid',
]

export interface SchemaField {
  id: string
  name: string
  type: FieldType
  required: boolean
  description?: string

  // String constraints
  minLength?: number
  maxLength?: number
  pattern?: string
  format?: string
  enum?: string[]

  // Number / integer constraints
  minimum?: number
  maximum?: number
  multipleOf?: number
  exclusiveMin?: number
  exclusiveMax?: number

  // Array constraints
  itemType?: FieldType
  minItems?: number
  maxItems?: number
  uniqueItems?: boolean

  // Object properties (recursive)
  properties?: SchemaField[]
}

export interface SchemaState {
  title: string
  description: string
  fields: SchemaField[]
}
