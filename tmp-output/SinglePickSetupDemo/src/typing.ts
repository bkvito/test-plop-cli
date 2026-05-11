export enum SinglePickSetupDemoEnum {
  DEFAULT = 'default',
}

export interface SinglePickSetupDemoProps {
  user?: Record<string, any>
  modelValue?: string
}

export interface DataType {
  label: string
  value: string
}
