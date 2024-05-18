# hex-grid-TEST  
Test of a hex grid drawing and patterns in js  
```shell
npm i
npm run dev
```

# Docs
## HexGrid
```js
const grid = new HexGrid(radius, xOffset, yOffset, true, document.body, window.innerWidth, window.innerHeight, {bgColor: '#181825', dotColor: '#fff', lineColor: '#fff', lineWidth: 5, lineCap: 'round', dotRadius: 3, goodDotColor: '#00ff00', badDotColor: '#ff0000'});
```
## Cyptex
```js
import Cryptex from './Cryptex.js';
const parentDiv = document.getElementById('Cryptex');
const goodAnswer = [1, 2, 3, 4, 5];
const cryptex = new Cryptex(parentDiv, 5, goodAnswer, () => {
    console.log('You did it!');
    cryptex.destroy();
});
```
### Constructor
```js
new Cryptex(parentDiv, nRings, goodAnswer, callback); // HTML E, int, Arr, func
```
### Methods
```js
cryptex.destroy(); // destroy

cryptex.checkAnswer() // check if the answer is correct, true if correct, false if not
```
