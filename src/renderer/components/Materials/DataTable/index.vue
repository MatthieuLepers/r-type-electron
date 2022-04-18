<template>
  <div class="DataTable">
    <div class="DataTableHead">
      <DataTableRow>
        <DataTableColumn v-if="enableActionRow" :modifiers="{ Action: true }" />
        <DataTableColumn :modifiers="{ Inner: true, NoActionRow: !enableActionRow }">
          <DataTableColumn :class="columnData.className" v-for="([column, columnData], i) in Object.entries(columns)" :key="i" :data-label="columnData.label">
            <DataTableButton :variant="`Sort${getSortingDirection(column)}`" v-if="!isSortDisabled(column)" @click="sortBy(column)">
              {{ columnData.label }}
            </DataTableButton>
            <span v-else>{{ columnData.label }}</span>
          </DataTableColumn>
        </DataTableColumn>
      </DataTableRow>
    </div>
    <component :is="isGrabbable() ? 'Draggable' : 'div'" class="DataTableBody" :list="result" @change="handleDraggableChange">
      <DataTableRow
        v-for="(obj, i) in result"
        :key="`row${i}`"
        :modifiers="{ Selectable: enableSelectionRow, Selected: obj.selected }"
        @click="handleRowClick(obj)"
        @contextmenu="$event => $emit('contextmenu', $event, obj)"
      >
        <DataTableRow v-if="enableActionRow" :modifiers="{ Action: true, Opened: isOpened(obj) }">
          <DataTableColumn :modifiers="{ Action: true }">
            <DataTableButton :modifiers="{ Less: true, Shadowed: true }" @click.stop="close(obj)" />
          </DataTableColumn>
          <DataTableColumn :modifiers="{ Inner: true }">
            <slot name="ActionColumnInner" :obj="obj" :close="() => close(obj)" />
          </DataTableColumn>
        </DataTableRow>
        <DataTableColumn v-if="enableActionRow" :modifiers="{ Action: true }">
          <DataTableButton :modifiers="{ More: true, Shadowed: true }" @click.stop="open(obj)" />
          <slot name="ActionColumn" :obj="obj" />
        </DataTableColumn>
        <DataTableColumn :modifiers="{ Inner: true, NoActionRow: !enableActionRow }">
          <DataTableColumn :class="columnData.className" v-for="([column, columnData], j) in Object.entries(columns)" :key="`column${j}`" :data-label="columnData.label">
            <slot :name="column" :obj="obj" :value="obj[column]" :column="column">
              {{ obj[column] }}
            </slot>
          </DataTableColumn>
        </DataTableColumn>
        <slot name="SecretArea" />
      </DataTableRow>
      <slot name="LastRow" />
    </component>
    <div class="DataTableFooter" v-if="paginate && paginated.length > 1">
      <!-- <DataTablePagination :data="paginated" :perPage="perPage" v-model="page" /> -->
    </div>
  </div>
</template>

<script>
import Draggable from 'vuedraggable';
import DataTableRow from './Row';
import DataTableColumn from './Column';
import DataTableButton from './Button';
// import DataTablePagination from './Pagination';

export default {
  name: 'DataTable',
  components: { Draggable, DataTableRow, DataTableColumn, DataTableButton },
  props: {
    columns: { type: Object, default: () => ({}) },
    data: { type: Array, default: () => [] },
    perPage: { type: Number, default: 20 },
    filters: { type: Object, default: () => ({}) },
    paginate: { type: Boolean, default: true },
    enableActionRow: { type: Boolean, default: true },
    enableSelectionRow: { type: Boolean, default: false },
  },
  data() {
    return {
      opened: [],
      perChunk: this.perPage,
      page: 1,
      sorting: {
        name: null,
        direction: '',
      },
    };
  },
  methods: {
    open(obj) {
      this.opened.push(obj);
    },
    close(obj) {
      this.opened.splice(this.opened.indexOf(obj), 1);
    },
    isOpened(obj) {
      return this.opened.includes(obj);
    },
    isSortDisabled(key) {
      return !this.columns[key].filter;
    },
    getSortingDirection(key) {
      if (this.sorting.name && this.sorting.name === key) {
        return this.sorting.direction || '';
      }
      return '';
    },
    sortBy(key) {
      const sortDirection = this.getSortingDirection(key);
      this.sorting = {
        name: key,
        direction: !sortDirection || sortDirection === 'Desc' ? 'Asc' : 'Desc',
      };
    },
    handleRowClick(obj) {
      if (this.enableSelectionRow) {
        this.$emit('selectLine', obj);
      }
    },
    isGrabbable() {
      return this.result.every((obj) => obj.order !== undefined);
    },
    handleDraggableChange() {
      const changed = [];
      this.result.forEach((obj, index) => {
        if (obj.order !== null && obj.order !== index + 1) {
          obj.order = index + 1;
          changed.push(obj);
        }
      });
      if (changed.length) {
        this.$emit('orderChange', changed);
      }
    },
  },
  computed: {
    filtered() {
      return Object.values(this.filters).reduce((objList, fn) => objList.filter(fn), this.data);
    },
    sorted() {
      const { name, direction } = this.sorting;
      if (!name || !direction) {
        return this.filtered;
      }
      return this.filtered.slice().sort((a, b) => this.columns[name].filter(a, b, direction === 'Desc'));
    },
    paginated() {
      return this.sorted.reduce((acc, val, i) => {
        const ch = Math.floor(i / this.perChunk);
        acc[ch] = [].concat((acc[ch] || []), val);
        return acc;
      }, []);
    },
    result() {
      return this.paginate ? this.paginated[this.page - 1] || [] : this.sorted;
    },
  },
};
</script>

<style lang="scss" src="./index.scss">
</style>
