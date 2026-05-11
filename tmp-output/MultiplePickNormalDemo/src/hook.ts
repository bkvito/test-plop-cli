import { ref } from 'vue'
import { data } from './data'
import type { MultiplePickNormalDemoProps } from './typing'

export const useMultiplePickNormalDemo = (props: MultiplePickNormalDemoProps) => {
  const selectedValues = ref(props.modelValue ?? data.slice(0, 2).map((item) => item.value))

  return {
    selectedValues,
  }
}
