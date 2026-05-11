<template>
  <div class="verify-single-pick-normal">
    <SinglePickButtonGroup />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import SinglePickButtonGroup from '@/components/common/SinglePickButtonGroup'
import { VerifySinglePickNormalProps } from './typing'
import { useVerifySinglePickNormal } from './hook'

export default defineComponent({
  name: 'VerifySinglePickNormal',
  components: {
    SinglePickButtonGroup,
  },
  props: {
    user: {
      type: Object as PropType<VerifySinglePickNormalProps['user']>,
      required: false,
    },
  },
  setup(props) {
    const { selectedValue } = useVerifySinglePickNormal(props as VerifySinglePickNormalProps)

    return {
      selectedValue,
    }
  },
})
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
