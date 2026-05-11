export enum SinglePickNormalDemoEnum {
  DEFAULT = 'default',
}

export interface SinglePickNormalDemoProps {
  user?: Record<string, any>
  modelValue?: string
}

export interface DataType {
  label: string
  value: string
}
