<template>
  <div class="multiple-pick-normal-demo">
    <div v-for="item in selectedValues" :key="item">{{ item }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { MultiplePickNormalDemoProps } from './typing'
import { useMultiplePickNormalDemo } from './hook'

export default defineComponent({
  name: 'MultiplePickNormalDemo',
  props: {
    user: {
      type: Object as PropType<MultiplePickNormalDemoProps['user']>,
      required: false,
    },
    modelValue: {
      type: Array as PropType<MultiplePickNormalDemoProps['modelValue']>,
      required: false,
      default: () => [],
    },
  },
  setup(props) {
    const { selectedValues } = useMultiplePickNormalDemo(props as MultiplePickNormalDemoProps)

    return {
      selectedValues,
    }
  },
})
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
