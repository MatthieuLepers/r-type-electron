<template>
  <div class="FormDropArea">
    <button
      :class="GenerateModifiers('FormDropAreaButton', modifiers)"
      @drop.prevent="handleDrop"
      @dragover.prevent
      @click="handleClick"
      @dragenter.prevent="modifiers.Hover = true"
      @dragleave="modifiers.Hover = false"
    >
      {{ $t('Materials.Form.DropArea.areaLabel') }}<br />
      <i class="icon-import"></i>
    </button>
    <input class="FormDropAreaInput" tabindex="-1" ref="fileInput" type="file" :value="files" @input="handleUploadFiles" />
  </div>
</template>

<script>
export default {
  name: 'FormDropArea',
  data() {
    return {
      files: [],
      modifiers: { Hover: false },
    };
  },
  methods: {
    handleDrop(e) {
      const [...droppedFiles] = e.dataTransfer.files;
      if (!droppedFiles) return;
      this.$emit('fileUpload', droppedFiles);
      this.modifiers.Hover = false;
    },
    handleDragEnter() {

    },
    handleUploadFiles(e) {
      const [...droppedFiles] = e.target.files;
      if (!droppedFiles) return;
      this.$emit('fileUpload', droppedFiles);
    },
    handleClick() {
      this.$refs.fileInput.click();
    },
  },
};
</script>

<style lang="scss" src="./DropArea.scss">
</style>
