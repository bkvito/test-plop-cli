export enum VerifyMultiplePickSetupEnum {
  DEFAULT = 'default',
}

export interface VerifyMultiplePickSetupProps {
  user?: Record<string, any>
  modelValue?: string[]
}

export interface DataType {
  label: string
  value: string
}
