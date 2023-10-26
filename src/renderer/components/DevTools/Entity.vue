<template>
  {{ props.entity.getId() }}
</template>

<script setup>
defineOptions({ name: 'DevToolsEntity' });

const props = defineProps({
  entity: { type: Object, required: true },
});
</script>
