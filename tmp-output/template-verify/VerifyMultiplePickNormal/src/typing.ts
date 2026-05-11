export enum VerifyMultiplePickNormalEnum {
  DEFAULT = 'default',
}

export interface VerifyMultiplePickNormalProps {
  user?: Record<string, any>
  modelValue?: string[]
}

export interface DataType {
  label: string
  value: string
}
