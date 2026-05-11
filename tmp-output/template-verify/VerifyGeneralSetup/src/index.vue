<template>
  <SinglePickButtonGroup
    v-model:model-value="model"
    :list="buttons"
    :radioName="viewType"
  >
  </SinglePickButtonGroup>
</template>

<script setup lang="ts">
import { VerifyGeneralSetupProps } from './typing'
import { useVerifyGeneralSetup } from './hook'
import SinglePickButtonGroup from '@/components/common/SinglePickButtonGroup';

defineOptions({
  name: 'VerifyGeneralSetup',
})

const props = defineProps<VerifyGeneralSetupProps>()

const { model, buttons } = useVerifyGeneralSetup(props)
</script>

<style lang="scss" scoped>
@import './index.scss';
// 不要在index.scss中使用v-bind()，它不生效。如果必须要用v-bind(),请在该文件内使用。
</style>


