import { ref } from 'vue'
import type { VerifyGeneralNormalProps } from './typing'
import { ButtonGroupItem } from '@/components/common/SinglePickButtonGroup';

export const useVerifyGeneralNormal = (props: VerifyGeneralNormalProps) => {

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
