import { createWebHashHistory, createRouter } from 'vue-router';

import MenuScreen from '@renderer/views/Menu/index.vue';
import PlayScreen from '@renderer/views/Play/index.vue';
import MenuSettingsScreen from '@renderer/views/Menu/Settings/index.vue';
import MenuSettingsGameplayScreen from '@renderer/views/Menu/Settings/Gameplay.vue';
import MenuSettingsKeyboardScreen from '@renderer/views/Menu/Settings/Keyboard.vue';
import MenuSettingsAudioScreen from '@renderer/views/Menu/Settings/Audio.vue';
import MenuModsScreen from '@renderer/views/Menu/Mods.vue';
import MenuToolsScreen from '@renderer/views/Menu/Tools/index.vue';
import MenuPathEditorToolScreen from '@renderer/views/Menu/Tools/PathEditor.vue';
import DevToolsScreen from '@renderer/views/DevTools/index.vue';

const routes = [
  { path: '/', name: 'Menu', component: MenuScreen },
  { path: '/play', name: 'Play', component: PlayScreen },
  {
    path: '/settings',
    name: 'MenuSettings',
    component: MenuSettingsScreen,
    children: [
      { path: '/gameplay', name: 'MenuSettingsGameplay', component: MenuSettingsGameplayScreen },
      { path: '/keyboard', name: 'MenuSettingsKeyboard', component: MenuSettingsKeyboardScreen },
      { path: '/audio', name: 'MenuSettingsAudio', component: MenuSettingsAudioScreen },
    ],
  },
  { path: '/mods', name: 'MenuMods', component: MenuModsScreen },
  { path: '/tools', name: 'MenuTools', component: MenuToolsScreen },
  { path: '/tools/path-editor', name: 'MenuPathEditorTool', component: MenuPathEditorToolScreen },
  { path: '/devTools', name: 'DevTools', component: DevToolsScreen },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
