import './style.css'
import HexGrid from './HexGrid.js'

const parentDiv = document.getElementById('HexGrid');

const grid = new HexGrid(50, 100, 100, true, parentDiv, window.innerWidth, window.innerHeight, {bgColor: '#181825', dotColor: '#fff', lineColor: '#fff', lineWidth: 5, lineCap: 'round', dotRadius: 3, goodDotColor: '#00ff00', badDotColor: '#ff0000'}, love, "deqawad");

function love(){
    console.log('I love you');
}