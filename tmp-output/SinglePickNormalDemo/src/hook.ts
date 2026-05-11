import { ref } from 'vue'
import { data } from './data'
import type { SinglePickNormalDemoProps } from './typing'

export const useSinglePickNormalDemo = (props: SinglePickNormalDemoProps) => {
  const selectedValue = ref(props.modelValue ?? data[0]?.value ?? '')

  return {
    selectedValue,
  }
}
