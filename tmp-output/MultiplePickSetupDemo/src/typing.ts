export enum MultiplePickSetupDemoEnum {
  DEFAULT = 'default',
}

export interface MultiplePickSetupDemoProps {
  user?: Record<string, any>
  modelValue?: string[]
}

export interface DataType {
  label: string
  value: string
}
