export enum VerifySinglePickSetupEnum {
  DEFAULT = 'default',
}

export interface VerifySinglePickSetupProps {
  user?: Record<string, any>
  modelValue?: string
}

export interface DataType {
  label: string
  value: string
}
