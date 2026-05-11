<template>
  <div class="verify-single-pick-setup" data-template-type="single-pick">
    <SinglePickButtonGroup />
  </div>
</template>

<script setup lang="ts">
import SinglePickButtonGroup from '@/components/common/SinglePickButtonGroup'
import { VerifySinglePickSetupProps } from './typing'
import { useVerifySinglePickSetup } from './hook'

defineOptions({
  name: 'VerifySinglePickSetup',
})

const props = defineProps<VerifySinglePickSetupProps>()

const { selectedValue } = useVerifySinglePickSetup(props)
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
