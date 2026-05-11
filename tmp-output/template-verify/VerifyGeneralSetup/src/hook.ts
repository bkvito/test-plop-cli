import { ref } from 'vue'
import type { VerifyGeneralSetupProps } from './typing'
import { ButtonGroupItem } from '@/components/common/SinglePickButtonGroup';

export const useVerifyGeneralSetup = (props: VerifyGeneralSetupProps) => {

  const model = ref<string>('')
  const buttons: ButtonGroupItem[] = [
    {
      key: 'button-1',
      label: "button-1",
      name: '1',
    }
  ]

  return {
    model,
    buttons,
  }
}
