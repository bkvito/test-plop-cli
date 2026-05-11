import { ref } from 'vue'
import { data } from './data'
import type { VerifySinglePickNormalProps } from './typing'

export const useVerifySinglePickNormal = (props: VerifySinglePickNormalProps) => {
  const selectedValue = ref(props.modelValue ?? data[0]?.value ?? '')

  return {
    selectedValue,
  }
}
