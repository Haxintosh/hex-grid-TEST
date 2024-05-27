import {DropZone} from "./Inventory.js";
export default class FuseBox {
    constructor(parentDiv, x, y, width, height, item, callback) {
        this.parentDiv = parentDiv;
        this.item = item;
        this.callback = callback;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.init();
    }

    init(){
        this.dropZone = new DropZone(this.width, this.height, this.x, this.y, this.parentDiv, this.checkForItem.bind(this));
    }

    checkForItem(){
        if (this.dropZone.items.length > 0){
            if (this.dropZone.items[0].name === this.item.name){
                this.callback();
                return true;
            }
        }
        return false;
    }

    destroy(){
        this.dropZone.destroy();
        this.parentDiv.innerHTML = '';
    }
}