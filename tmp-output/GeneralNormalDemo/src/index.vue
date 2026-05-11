<template>
  <div class="general-normal-demo"></div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { GeneralNormalDemoProps } from './typing'
import { useGeneralNormalDemo } from './hook'

export default defineComponent({
  name: 'GeneralNormalDemo',
  props: {
    user: {
      type: Object as PropType<GeneralNormalDemoProps['user']>,
      required: false,
    },
  },
  setup(props) {
    const {} = useGeneralNormalDemo(props as GeneralNormalDemoProps)

    return {}
  },
})
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
