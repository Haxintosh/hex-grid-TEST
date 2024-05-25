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
## Dialogue
```js
import Dialogue from './Dialogue.js';
const dialogueText = [
    {
        name: 'Flagellum Dei',
        text: 'For I am Attila the Hun, the scourge of God. If you had not committed great sins, God would not have sent a punishment like me upon you.'
    },
    {
        name: 'Flagellum Dei',
        text: 'Shame on you for your despicable sins and your great wickedness. You have brought great suffering upon yourselves.'
    },
    {
        name: 'Flagellum Dei',
        text: 'Now eat this sucker!'
    }
]

const Dialogue1 = new Dialogue(dialogueText, 40, false, 'audio/click.ogg', parent, () => {
    console.log('done');
    Dialogue1.destroy();
});

Dialogue1.startFromOrigin();
```
### Constructor
```js
new Dialogue(dialogueText, timePerLetter, autoSkip, srcToAudio, parentElement, callback); // Arr, int, bool, str, E, func

dialogueText = [
    {name: 'Name', text: 'Text'},
    {name: 'Name', text: 'Text'}, //.. etc
]
```
### Methods
```js
startFromOrigin(); // start the dialogue from the beginning

stop(); // stop the dialogue

resume(); // resume the dialogue where it stopped

reset(); // reset the dialogue to the beginning of everything

destroy(); // destroy the dialogue
```
