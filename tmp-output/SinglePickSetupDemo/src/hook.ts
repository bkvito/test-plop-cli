import { ref } from 'vue'
import { data } from './data'
import type { SinglePickSetupDemoProps } from './typing'

export const useSinglePickSetupDemo = (props: SinglePickSetupDemoProps) => {
  const selectedValue = ref(props.modelValue ?? data[0]?.value ?? '')

  return {
    selectedValue,
  }
}
