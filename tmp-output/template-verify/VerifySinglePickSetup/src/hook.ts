import { ref } from 'vue'
import { data } from './data'
import type { VerifySinglePickSetupProps } from './typing'

export const useVerifySinglePickSetup = (props: VerifySinglePickSetupProps) => {
  const selectedValue = ref(props.modelValue ?? data[0]?.value ?? '')

  return {
    selectedValue,
  }
}
