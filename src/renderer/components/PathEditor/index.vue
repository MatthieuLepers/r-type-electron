<template>
  <div class="path-editor">
    <div class="path-editor__render-area">
      <svg
        ref="svg"
        :class="{ moving: state.enableMoving }"
        :width="state.settings.grid.width ?? 0"
        :height="state.settings.grid.height ?? 0"
        @click="actions.handleClickSvg"
        @mousemove="actions.moveSelected"
        @mouseup="state.enableMoving = false"
      >
        <g
          v-show="state.settings.grid.show"
          class="grid"
        >
          <line
            v-for="(x, i) in State.gridX"
            :key="`gv${i}`"
            :x1="x ?? 0"
            y1="0"
            :x2="x ?? 0"
            :y2="state.settings.grid.height ?? 0"
          />
          <line
            v-for="(y, i) in State.gridY"
            :key="`gh${i}`"
            x1="0"
            :y1="y ?? 0"
            :x2="state.settings.grid.width ?? 0"
            :y2="y ?? 0"
          />
        </g>
        <g
          class="points"
          v-for="(group, i) in useGroupStore.state"
          :key="`group${i}`"
        >
          <path
            :d="group.toSvgString()"
            :stroke="group.settings.stroke ? group.settings.strokeStyle : 'none'"
            :fill="group.settings.fill ? group.settings.fillStyle : 'none'"
          />
          <g
            class="pointGroup first"
            :class="{ active: group.start === state.selectedPoint }"
          >
            <circle
              :cx="group.start.x"
              :cy="group.start.y"
              :r="group.start.r"
              :opacity="group.settings.hidePoints ? 0 : 1"
              @mousedown="actions.selectPoint(group.start, i)"
            />
          </g>
          <g
            v-for="(point, j) in group.points"
            :key="`point${i}${j}`"
            class="pointGroup"
            :class="{ active: point === state.selectedPoint }"
          >
            <circle
              :cx="point.x"
              :cy="point.y"
              :r="point.r"
              :opacity="group.settings.hidePoints ? 0 : 1"
              @mousedown="actions.selectPoint(point, i)"
            />
            <g
              v-if="point.type && (point.type === 'C' || point.type === 'S') && (point === state.selectedPoint || state.selectedPoint.anchor)"
              class="anchor"
            >
              <line
                :x1="point.prevPoint.x"
                :y1="point.prevPoint.y"
                :x2="point.ctrlP1.x"
                :y2="point.ctrlP1.y"
              />
              <circle
                :cx="point.ctrlP1.x"
                :cy="point.ctrlP1.y"
                :r="state.settings.anchorRadius"
                @mousedown="actions.selectPoint(point.ctrlP1, i)"
              />

              <line
                :x1="point.x"
                :y1="point.y"
                :x2="point.ctrlP2.x"
                :y2="point.ctrlP2.y"
              />
              <circle
                :cx="point.ctrlP2.x"
                :cy="point.ctrlP2.y"
                :r="state.settings.anchorRadius"
                @mousedown="actions.selectPoint(point.ctrlP2, i)"
              />

              <line
                v-if="['S'].indexOf(group.getNextPointTypeOf(point)) >= 0"
                :x1="point.x"
                :y1="point.y"
                :x2="point.ctrlP2R.x"
                :y2="point.ctrlP2R.y"
              />
              <circle
                v-if="['S'].indexOf(group.getNextPointTypeOf(point)) >= 0"
                :cx="point.ctrlP2R.x"
                :cy="point.ctrlP2R.y"
                :r="state.settings.anchorRadius"
                @mousedown="actions.selectPoint(point.ctrlP2R, i)"
              />
            </g>
            <g
              v-if="point.type && (point.type === 'Q' || point.type === 'T') && (point === state.selectedPoint || state.selectedPoint.anchor)"
              class="anchor"
            >
              <line
                :x1="point.prevPoint.x"
                :y1="point.prevPoint.y"
                :x2="point.ctrlP1.x"
                :y2="point.ctrlP1.y"
              />
              <line
                :x1="point.x"
                :y1="point.y"
                :x2="point.ctrlP1.x"
                :y2="point.ctrlP1.y"
              />
              <circle
                :cx="point.ctrlP1.x"
                :cy="point.ctrlP1.y"
                :r="state.settings.anchorRadius"
                @mousedown="actions.selectPoint(point.ctrlP1, i)"
              />
            </g>
          </g>
        </g>
      </svg>
    </div>
    <div class="path-editor__panel">
      <MaterialTabs :tabs="State.tabs" v-model="state.currentTab">
        <template v-slot:settings>
          <ControlTitle>Settings</ControlTitle>
          <ControlContainer>
            <MaterialFormFieldLine :size="3">
              <template v-slot:field0>
                <MaterialFormInput
                  v-model="state.settings.grid.width"
                  type="number"
                  label="Width"
                />
              </template>
              <template v-slot:field1>
                <MaterialFormInput
                  v-model="state.settings.grid.height"
                  type="number"
                  label="Height"
                />
              </template>
              <template v-slot:field2>
                <MaterialFormInput
                  v-model="state.settings.grid.size"
                  type="number"
                  label="Grid size"
                />
              </template>
            </MaterialFormFieldLine>
          </ControlContainer>
          <ControlContainer>
            <ControlToggle label="Snap grid" v-model="state.settings.grid.snap" />
            <ControlToggle label="Show grid" v-model="state.settings.grid.show" />
          </ControlContainer>
          <div v-if="state.selectedPoint">
            <ControlTitle>Selected point</ControlTitle>
            <ControlContainer v-if="state.selectedPoint.type && state.selectedPoint.type !== 'M'">
              <ControlTypeChoice v-model="state.selectedPoint.type" :prevType="useGroupStore.state[state.currentGroup].getPrevPointOf(state.selectedPoint).type" />
            </ControlContainer>

            <ControlContainer>
              <ControlRange v-model="state.selectedPoint.x" :min="0" :max="state.settings.grid.width" :step="state.settings.grid.size" label="Point X position" />
            </ControlContainer>
            <ControlContainer>
              <ControlRange v-model="state.selectedPoint.y" :min="0" :max="state.settings.grid.height" :step="state.settings.grid.size" label="Point Y position" />
            </ControlContainer>

            <ControlContainer v-if="state.selectedPoint.type && (state.selectedPoint.type === 'Q' || state.selectedPoint.type === 'C')">
              <ControlRange v-model="state.selectedPoint.ctrlP1.x" :min="0" :max="state.settings.grid.width" :step="state.settings.grid.size" label="First control point X position" />
            </ControlContainer>
            <ControlContainer v-if="state.selectedPoint.type && (state.selectedPoint.type === 'Q' || state.selectedPoint.type === 'C')">
              <ControlRange v-model="state.selectedPoint.ctrlP1.y" :min="0" :max="state.settings.grid.height" :step="state.settings.grid.size" label="First control point Y position" />
            </ControlContainer>

            <ControlContainer v-if="state.selectedPoint.type && state.selectedPoint.type === 'C'">
              <ControlRange v-model="state.selectedPoint.ctrlP2.x" :min="0" :max="state.settings.grid.width" :step="state.settings.grid.size" label="Second control point X position" />
            </ControlContainer>
            <ControlContainer v-if="state.selectedPoint.type && state.selectedPoint.type === 'C'">
              <ControlRange v-model="state.selectedPoint.ctrlP2.y" :min="0" :max="state.settings.grid.height" :step="state.settings.grid.size" label="Second control point Y position" />
            </ControlContainer>

            <ControlContainer v-if="state.selectedPoint.type && state.selectedPoint.type === 'A'">
              <ControlRange v-model="state.selectedPoint.radius.x" :min="0" :max="state.settings.grid.width" :step="state.settings.grid.size" label="X radius" />
            </ControlContainer>
            <ControlContainer v-if="state.selectedPoint.type && state.selectedPoint.type === 'A'">
              <ControlRange v-model="state.selectedPoint.radius.y" :min="0" :max="state.settings.grid.width" :step="state.settings.grid.size" label="Y radius" />
            </ControlContainer>
            <ControlContainer v-if="state.selectedPoint.type && state.selectedPoint.type === 'A'">
              <ControlRange v-model="state.selectedPoint.rotation" :min="0" :max="360" label="Rotation" />
            </ControlContainer>
            <ControlContainer v-if="state.selectedPoint.type && state.selectedPoint.type === 'A'">
              <ControlToggle label="Large arc sweep flag" v-model="state.selectedPoint.largeArc" />
            </ControlContainer>
            <ControlContainer v-if="state.selectedPoint.type && state.selectedPoint.type === 'A'">
              <ControlToggle label="Sweep flag" v-model="state.selectedPoint.sweep" />
            </ControlContainer>
          </div>
        </template>
        <template v-slot:groups>
          <ControlButton
            @click="actions.addGroup"
          >
            New group
          </ControlButton>
          <div
            v-for="(group, i) in useGroupStore.state"
            :key="i"
            :class="GenerateModifiers('group', { active: state.currentGroup === i })"
            @click="state.currentGroup = i"
          >
            <label class="group__label">
              <span
                v-show="!group.edit"
                @click.stop="group.edit = true"
              >
                {{ group.name }}
              </span>
              <input
                @keydown.enter="group.edit = false"
                :type="(group.edit ? 'text' : 'hidden')"
                v-model="group.name"
              />
            </label>
            <button
              class="btn-delete"
              @click.stop="actions.removeGroup(group)"
              title="Supprimer ce groupe"
            ></button>
            <ControlContainer class="group__controls">
              <ControlToggle label="Close path" v-model="group.settings.closePath" />
              <ControlToggle label="Stroke path" v-model="group.settings.stroke" />
              <ControlToggle label="Fill path" v-model="group.settings.fill" />
              <ControlToggle label="Hide points" v-model="group.settings.hidePoints" />
            </ControlContainer>
            <div class="group__content">
              <div
                :class="GenerateModifiers('group__point', { start: true, active: state.selectedPoint === group.start })"
                @click="actions.selectPoint(group.start, i, false)"
              >
                X: {{ group.start.x }} Y: {{ group.start.y }}
              </div>
              <div
                v-for="(point, j) in group.points"
                :key="`point${i}${j}`"
                :class="GenerateModifiers('group__point', { active: state.selectedPoint === point })"
                @click="actions.selectPoint(point, i, false)"
              >
                <div class="group__point__coord">
                  X: {{ point.x }} Y: {{ point.y }}
                </div>
                <ControlTypeChoice
                  v-model="point.type"
                  :prevType="group.getPrevPointOf(point).type"
                  :small="true"
                  class="group__point__type"
                />
                <button
                  class="btn-delete"
                  @click.stop="group.removePoint(point)"
                  title="Supprimer ce point"
                ></button>
              </div>
              <div class="group__result">{{ group.toSvgString() }}</div>
            </div>
          </div>
        </template>
      </MaterialTabs>
    </div>
  </div>
</template>

<script setup>
import {
  reactive,
  computed,
  ref,
  onMounted,
} from 'vue';

import MaterialTabs from '@renderer/components/Materials/Tabs/index.vue';
import MaterialFormFieldLine from '@renderer/components/Materials/Form/FieldLine.vue';
import MaterialFormInput from '@renderer/components/Materials/Form/Input.vue';

import ControlTitle from '@renderer/components/PathEditor/ControlTitle.vue';
import ControlContainer from '@renderer/components/PathEditor/ControlContainer.vue';
import ControlToggle from '@renderer/components/PathEditor/ControlToggle.vue';
import ControlRange from '@renderer/components/PathEditor/ControlRange.vue';
import ControlButton from '@renderer/components/PathEditor/ControlButton.vue';
import ControlTypeChoice from '@renderer/components/PathEditor/ControlTypeChoice.vue';

import { useGroupStore } from '@renderer/components/PathEditor/GroupStore';

defineOptions({ name: 'PathEditor' });

const svg = ref(null);

const state = reactive({
  currentGroup: 0,
  currentTab: 'settings',
  selectedPoint: null,
  enableMoving: false,
  settings: {
    pointRadius: 8,
    anchorRadius: 6,
    hidePoints: false,
    grid: {
      width: 600,
      height: 427,
      size: 25,
      snap: true,
      show: true,
    },
  },
});

const State = computed(() => {
  const { width, height, size } = state.settings.grid;
  const gridX = [...Array(Math.max(0, Math.ceil((width - size) / size))).keys()]
    .map((e) => (e + 1) * size)
  ;
  const gridY = [...Array(Math.max(0, Math.ceil((height - size) / size))).keys()]
    .map((e) => (e + 1) * size)
  ;
  return {
    gridX,
    gridY,
    tabs: {
      settings: { label: 'Settings' },
      groups: { label: 'Groups' },
    },
  };
});

const actions = {
  handleClickSvg(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.ctrlKey && !e.shiftKey && e.button === 0) {
      const { x, y } = actions.getGridCoordFor(e.pageX, e.pageY);
      state.selectedPoint = useGroupStore.state[state.currentGroup].addPoint(x, y, 'L');
    }
    if (e.ctrlKey && e.shiftKey && e.button === 0) {
      state.currentGroup = useGroupStore.state.length;
      const { x, y } = actions.getGridCoordFor(e.pageX, e.pageY);
      const newGroup = useGroupStore.actions.addGroup(x, y, state.settings);
      state.selectedPoint = newGroup.start;
    }
  },
  selectPoint(point, groupId, enableMoving = true) {
    state.selectedPoint = point;
    state.currentGroup = groupId;
    state.enableMoving = enableMoving;
  },
  moveSelected(e) {
    if (state.selectedPoint && state.enableMoving) {
      const { x, y } = actions.getGridCoordFor(e.pageX, e.pageY);
      state.selectedPoint.x = x;
      state.selectedPoint.y = y;
    }
  },
  getGridCoordFor(coordX, coordY) {
    const svgBbox = svg.value.getBoundingClientRect();
    if (state.settings.grid.snap) {
      const x = Math.ceil(((coordX - svgBbox.left) - (state.settings.grid.size / 2)) / state.settings.grid.size) * state.settings.grid.size;
      const y = Math.ceil(((coordY - svgBbox.top) - (state.settings.grid.size / 2)) / state.settings.grid.size) * state.settings.grid.size;
      return { x, y };
    }
    return {
      x: coordX - svgBbox.left,
      y: coordY - svgBbox.top,
    };
  },
  addGroup() {
    useGroupStore.actions.addGroup(state.settings.grid.size, state.settings.grid.size, state.settings);
  },
  removeGroup(group) {
    useGroupStore.actions.removeGroup(group);
    if (state.currentGroup >= 1) {
      state.currentGroup -= 1;
    }
  },
};

onMounted(() => {
  useGroupStore.actions.addGroup(state.settings.grid.width / 2, state.settings.grid.height / 2, state.settings);
});
</script>

<style lang="scss" src="./index.scss">
</style>
