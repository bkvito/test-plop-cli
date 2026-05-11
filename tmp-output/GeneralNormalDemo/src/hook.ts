import { ref } from 'vue'
import type { GeneralNormalDemoProps } from './typing'

export const useGeneralNormalDemo = (props: GeneralNormalDemoProps) => {
  const visible = ref(true)

  return {
    props,
    visible,
  }
}
