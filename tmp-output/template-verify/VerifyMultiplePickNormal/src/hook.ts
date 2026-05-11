import { ref } from 'vue'
import { data } from './data'
import type { VerifyMultiplePickNormalProps } from './typing'

export const useVerifyMultiplePickNormal = (props: VerifyMultiplePickNormalProps) => {
  const selectedValues = ref(props.modelValue ?? data.slice(0, 2).map((item) => item.value))

  return {
    selectedValues,
  }
}
