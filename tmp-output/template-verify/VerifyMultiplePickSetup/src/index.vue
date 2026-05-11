<template>
  <div class="verify-multiple-pick-setup">
    <div v-for="item in selectedValues" :key="item">{{ item }}</div>
  </div>
</template>

<script setup lang="ts">
import { VerifyMultiplePickSetupProps } from './typing'
import { useVerifyMultiplePickSetup } from './hook'

defineOptions({
  name: 'VerifyMultiplePickSetup',
})

const props = defineProps<VerifyMultiplePickSetupProps>()

const { selectedValues } = useVerifyMultiplePickSetup(props)
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
