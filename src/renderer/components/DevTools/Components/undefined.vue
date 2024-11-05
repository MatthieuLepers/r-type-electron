<template>
  <div class="entity-panel__container">
    <h2 class="entity-panel__container-title">
      (Component) {{ props.component }}
    </h2>
    <div class="entity-panel__container-content">
      Unable to find vue for this component
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  component: { type: String },
});
</script>
