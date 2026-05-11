<template>
  <div class="multiple-pick-setup-demo">
    <div v-for="item in selectedValues" :key="item">{{ item }}</div>
  </div>
</template>

<script setup lang="ts">
import { MultiplePickSetupDemoProps } from './typing'
import { useMultiplePickSetupDemo } from './hook'

defineOptions({
  name: 'MultiplePickSetupDemo',
})

const props = defineProps<MultiplePickSetupDemoProps>()

const { selectedValues } = useMultiplePickSetupDemo(props)
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
