import { ref } from 'vue'
import type { GeneralSetupDemoProps } from './typing'

export const useGeneralSetupDemo = (props: GeneralSetupDemoProps) => {
  const visible = ref(true)

  return {
    props,
    visible,
  }
}
