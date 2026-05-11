export enum MultiplePickNormalDemoEnum {
  DEFAULT = 'default',
}

export interface MultiplePickNormalDemoProps {
  user?: Record<string, any>
  modelValue?: string[]
}

export interface DataType {
  label: string
  value: string
}
