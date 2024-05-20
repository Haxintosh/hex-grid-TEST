import './style.css'
import Inventory, {Item, DropZone} from "./Inventory.js";
const parent = document.getElementById('Cryptex')

// const electrical = new ElectricalPuzzle(parent, 500, 500, {
//     wireWidth: 10,
//     wireHeight: 20,
//     bgColor: 'black'
// });

const inv = new Inventory(parent, {}, 5);
const item1 = new Item({url: 'https://picsum.photos/50'}, 'item1', 'description', inv, 1);
const item2 = new Item({url: 'https://picsum.photos/50'}, 'item2', 'description', inv, 1);
const item3 = new Item({url: 'https://picsum.photos/50'}, 'item3', 'description', inv, 1);
const item4 = new Item({url: 'https://picsum.photos/50'}, 'item4', 'description', inv, 2);

inv.addItem(item1);
inv.addItem(item2);
inv.addItem(item3);
inv.addItem(item4);

inv.removeItem(item2);

const dropZone = new DropZone(100, 100, 500, 500, parent);
const dropZone2 = new DropZone(150, 150, 200, 300, parent);