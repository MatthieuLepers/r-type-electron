import MenuScreen from '@/views/Menu/index';
import PlayScreen from '@/views/Play/index';
import MenuSettingsScreen from '@/views/Menu/Settings/index';
import MenuSettingsGameplayScreen from '@/views/Menu/Settings/Gameplay';
import MenuSettingsKeyboardScreen from '@/views/Menu/Settings/Keyboard';
import MenuSettingsAudioScreen from '@/views/Menu/Settings/Audio';
import MenuModsScreen from '@/views/Menu/Mods';
import MenuToolsScreen from '@/views/Menu/Tools';

export default {
  routes: [
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
  ],
};
