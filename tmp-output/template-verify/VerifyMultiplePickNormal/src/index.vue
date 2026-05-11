<template>
  <div class="verify-multiple-pick-normal">
    <div v-for="item in selectedValues" :key="item">{{ item }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { VerifyMultiplePickNormalProps } from './typing'
import { useVerifyMultiplePickNormal } from './hook'

export default defineComponent({
  name: 'VerifyMultiplePickNormal',
  props: {
    user: {
      type: Object as PropType<VerifyMultiplePickNormalProps['user']>,
      required: false,
    },
    modelValue: {
      type: Array as PropType<VerifyMultiplePickNormalProps['modelValue']>,
      required: false,
      default: () => [],
    },
  },
  setup(props) {
    const { selectedValues } = useVerifyMultiplePickNormal(props as VerifyMultiplePickNormalProps)

    return {
      selectedValues,
    }
  },
})
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
