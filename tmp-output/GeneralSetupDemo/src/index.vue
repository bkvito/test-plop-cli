<template>
  <div class="general-setup-demo"></div>
</template>

<script setup lang="ts">
import { GeneralSetupDemoProps } from './typing'
import { useGeneralSetupDemo } from './hook'

defineOptions({
  name: 'GeneralSetupDemo',
})

const props = defineProps<GeneralSetupDemoProps>()

const {} = useGeneralSetupDemo(props)
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
