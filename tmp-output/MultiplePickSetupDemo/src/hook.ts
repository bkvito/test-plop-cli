import { ref } from 'vue'
import { data } from './data'
import type { MultiplePickSetupDemoProps } from './typing'

export const useMultiplePickSetupDemo = (props: MultiplePickSetupDemoProps) => {
  const selectedValues = ref(props.modelValue ?? data.slice(0, 2).map((item) => item.value))

  return {
    selectedValues,
  }
}
