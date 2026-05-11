<template>
  <div class="single-pick-setup-demo">
    <SinglePickButtonGroup />
  </div>
</template>

<script setup lang="ts">
import SinglePickButtonGroup from '@/components/common/SinglePickButtonGroup'
import { SinglePickSetupDemoProps } from './typing'
import { useSinglePickSetupDemo } from './hook'

defineOptions({
  name: 'SinglePickSetupDemo',
})

const props = defineProps<SinglePickSetupDemoProps>()

const { selectedValue } = useSinglePickSetupDemo(props)
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
