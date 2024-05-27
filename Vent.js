export default class Vent {
    constructor(parent, x, y) {
        this.x = x;
        this.y = y;
        this.parent = parent;
    }

    init(){
        this.ventElement = document.createElement('div');
        
    }

}