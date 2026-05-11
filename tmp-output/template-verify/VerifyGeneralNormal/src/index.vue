<template>
  <div class="verify-general-normal"></div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { VerifyGeneralNormalProps } from './typing'
import { useVerifyGeneralNormal } from './hook'

export default defineComponent({
  name: 'VerifyGeneralNormal',
  props: {
    user: {
      type: Object as PropType<VerifyGeneralNormalProps['user']>,
      required: false,
    },
  },
  setup(props) {
    const {} = useVerifyGeneralNormal(props as VerifyGeneralNormalProps)

    return {}
  },
})
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
