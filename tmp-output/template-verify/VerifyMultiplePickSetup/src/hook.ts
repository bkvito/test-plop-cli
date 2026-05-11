import { ref } from 'vue'
import { data } from './data'
import type { VerifyMultiplePickSetupProps } from './typing'

export const useVerifyMultiplePickSetup = (props: VerifyMultiplePickSetupProps) => {
  const selectedValues = ref(props.modelValue ?? data.slice(0, 2).map((item) => item.value))

  return {
    selectedValues,
  }
}
