<template>
  <div class="single-pick-normal-demo">
    <SinglePickButtonGroup />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import SinglePickButtonGroup from '@/components/common/SinglePickButtonGroup'
import { SinglePickNormalDemoProps } from './typing'
import { useSinglePickNormalDemo } from './hook'

export default defineComponent({
  name: 'SinglePickNormalDemo',
  components: {
    SinglePickButtonGroup,
  },
  props: {
    user: {
      type: Object as PropType<SinglePickNormalDemoProps['user']>,
      required: false,
    },
  },
  setup(props) {
    const { selectedValue } = useSinglePickNormalDemo(props as SinglePickNormalDemoProps)

    return {
      selectedValue,
    }
  },
})
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
