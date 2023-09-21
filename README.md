# R-Type

## Installation

Make sure you have nodejs V14 installed /!\\

Make sur to use the develop branch

Clone the project and run `npm i`

Then run `npm run dev`

## Controls
- Z : Move up
- Q : Move left
- S : Move down
- D : Move right
- Space : Call/Release module
- L : Shoot, hold for constant shooting
- M : Hold for charge a powerful shot, release to shoot the charged shot
- Ecape : Pause/Unpause

## Debug controls
- NUMPAD1 : Show entities hitboxes
- NUMPAD2 : Show Quadtree collision detection areas
- NUMPAD3 : Show entities paths
- NUMPAD4 : Show entities health bar

## Main class & entity testing/spawning

Go to the class `src/renderer/js/Game.js` and uncomment the entity import and creation in `start` method then run the project

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change. **Use develop branch for pull requests.**

## License
[ISC](https://www.isc.org/licenses/)

---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[45a3e22](https://github.com/SimulatedGREG/electron-vue/tree/45a3e224e7bb8fc71909021ccfdcfec0f461f634) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).
