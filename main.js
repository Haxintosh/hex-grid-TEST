import './style.css'
let canvasElement = document.getElementById('canvas');

let overlayCanvas = document.getElementById('overlayCanvas');

let lineCanvas = document.getElementById('lineCanvas');

canvasElement.width = window.innerWidth;
canvasElement.height = window.innerHeight;

overlayCanvas.width = window.innerWidth;
overlayCanvas.height = window.innerHeight;

lineCanvas.width = window.innerWidth;
lineCanvas.height = window.innerHeight;

let ctx = canvasElement.getContext('2d');

let overlayCtx = overlayCanvas.getContext('2d');

let lineCtx = lineCanvas.getContext('2d');

ctx.fillStyle = '#181825';

ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

lineCtx.strokeStyle = '#fff';

let uniquePoints = [];

let radius = 50;
let xOffset = 100;
let yOffset = 100;

let isDrawing = false;

generateHexGrid(radius, xOffset, yOffset);

addEventListener("mousemove", (e) =>{
    let closestPoints = this.getClosestPoints(radius*2, e.clientX, e.clientY);
    overlayCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (const element of closestPoints) {
        if (element.distance<radius/2){
            this.drawCircle(5, element.coord.x, element.coord.y, '#0f0', overlayCtx);
            continue;
        }
        this.drawCircle(5, element.coord.x, element.coord.y, '#f00', overlayCtx);
    }
});

addEventListener("mousedown", handleDrag);

generateHexGrid(radius, xOffset, yOffset);

class HexGrid{
    constructor(radius, xOffset, yOffset, isEditable, parentDiv, width, height, style){
        this.radius = radius;
        this.xOffset = xOffset;
        this.yOffset = yOffset;
        this.isEditable = isEditable;
        this.height = height;
        this.width = width;
        this.uniquePoints = [];
        this.patterns= [];
        this.parentDiv = parentDiv;
        this.style = style;
        this.currentDrawingPattern="";
        this.lastPoint= null;
        this.init();
    }

    init(){
        const canvasElement = this.parentDiv.createElement('canvas');
        canvasElement.width = this.width;
        canvasElement.height = this.height;
        this.bgCanvas = canvasElement;

        const overlayCanvas = this.parentDiv.createElement('canvas');
        overlayCanvas.width = this.width;
        overlayCanvas.height = this.height;
        this.highlightCanvas = overlayCanvas;

        const lineCanvas = this.parentDiv.createElement('canvas');
        lineCanvas.width = this.width;
        lineCanvas.height = this.height;
        this.lineCanvas = lineCanvas;

        this.parentDiv.appendChild(canvasElement);
        this.parentDiv.appendChild(overlayCanvas);
        this.parentDiv.appendChild(lineCanvas);

        this.ctx = canvasElement.getContext('2d');
        this.overlayCtx = overlayCanvas.getContext('2d');
        this.lineCtx = lineCanvas.getContext('2d');

        this.ctx.fillStyle = this.style.bgColor;
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.lineCtx.strokeStyle = this.style.lineColor;
        this.lineCtx.lineWidth = this.style.lineWidth;
        this.lineCtx.lineCap = this.style.lineCap;

        this.lines = [];

        addEventListener("mousedown", this.handleDrag);
    }

    // the hex grid
    generateHexGrid(radius = this.radius, xOffset = this.xOffset, yOffset = this.yOffset){
        this.nColumns = Math.floor(this.bgCanvas.width / (radius * 2))+1;
        this.nRows = Math.floor(this.bgCanvas.height / (radius * 2))-1;

        for (let i = 0; i < this.nColumns; i++) {
            for (let j = 0; j < this.nRows; j++) {
                let x = xOffset + i * Math.sqrt(3)*radius ;
                let y = yOffset + j * radius * 3;
                this.generateHexPoint(radius, x, y, 3);
            }
        }

        this.drawGrid();
    }

    drawGrid(points = this.uniquePoints){
        if (points) {
            this.ctx.fillStyle = '#fff';
            this.ctx.beginPath();
            this.ctx.moveTo(points[0].x, points[0].y);
            for (const element of points) {
                this.drawCircle(this.radius, element.x, element.y, this.style.dotColor, this.ctx);
            }
            this.ctx.closePath();
            this.ctx.fill();
        }
    }

    generateHexPoint(radius = this.radius, xOffset = this.xOffset, yOffset = this.yOffset, nSide = 3) {
        let points = [];
        for (let i = 0; i < nSide; i++) {
            let angleRad = this.degToRad(-90) + (2 * Math.PI / nSide) * i;
            let x = xOffset + radius * Math.cos(angleRad);
            let y = yOffset + radius * Math.sin(angleRad);
            if (this.uniquePoints.find(p => this.floorToPrecision(p.x, 100) === this.floorToPrecision(x, 100) && this.floorToPrecision(p.y, 100) === this.floorToPrecision(y, 100))) {
                continue;
            }
            this.uniquePoints.push({ x, y });
            points.push({ x, y });
        }
        return points;
    }

    // draws
    drawCircle(radius = this.radius, centerX, centerY, color = this.style.dotColor){
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.closePath();
    }

    drawLinesFromArr(arr){
        for (const element of arr) {
            this.lineCtx.beginPath();
            this.lineCtx.moveTo(element.start.x, element.start.y);
            this.lineCtx.lineTo(element.end.x, element.end.y);
            this.lineCtx.stroke();
            this.lineCtx.closePath();
        }
    }

    drawLineFromDrag(e){
        this.lineCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        this.drawLinesFromArr(lines);
        let closestPoints = this.getClosestPoints(this.radius * 2, e.clientX, e.clientY);
        for (let i in closestPoints) { // Math.abs(lastPoint.x - closestPoints[i].coord.x) < radius * 2 && Math.abs(lastPoint.y - closestPoints[i].coord.y)
            // how fucking ergonomic
            if (closestPoints[i].distance < this.radius / 2 && this.distance2d(Math.abs(this.lastPoint.x - closestPoints[i].coord.x), Math.abs(this.lastPoint.y - closestPoints[i].coord.y)) < this.radius * 2 && !this.lines.find(l => l.start.x === this.lastPoint.x && l.start.y === this.lastPoint.y && l.end.x === closestPoints[i].coord.x && l.end.y === closestPoints[i].coord.y)){
                if (Math.round(closestPoints[i].coord.x) === Math.round(this.lastPoint.x) && Math.round(closestPoints[i].coord.y)===Math.round(this.lastPoint.y)){
                    return;
                }
                this.lines.push({start: this.lastPoint, end: closestPoints[i].coord});
                this.lineCtx.beginPath();
                this.lineCtx.moveTo(this.lastPoint.x, this.lastPoint.y);
                this.lineCtx.stroke();
                this.lineCtx.closePath();
                this.lineCtx.lineTo(closestPoints[i].coord.x, closestPoints[i].coord.y);
                console.log("snapped to point");
                const angle = Math.round(this.degFromPoint(this.lastPoint.x - closestPoints[i].coord.x, this.lastPoint.y - closestPoints[i].coord.y));
                console.log(angle);
                if (angle === 0 || angle === 180){
                    this.pattern += "w";
                } else if (angle === 60) {
                    this.pattern += "a";
                } else if (angle === -60){
                    this.pattern += "d";
                } else if (angle === 120) {
                    this.pattern += "q";
                } else if (angle === -120) {
                    this.pattern += "e";
                }
                this.lastPoint = closestPoints[i].coord;
                return;
            }
        }
        this.lineCtx.beginPath();
        this.lineCtx.moveTo(lastPoint.x, lastPoint.y);
        this.lineCtx.lineTo(e.clientX, e.clientY);
        this.lineCtx.stroke();
        this.lineCtx.closePath();
    }


    // helpers
    degFromPoint(x, y){
        return Math.atan2(y, x) * 180 / Math.PI;
    }

    degToRad(deg){
        return deg * Math.PI / 180;
    }

    distance2d(x, y){
        return Math.sqrt(Math.abs(x)**2+Math.abs(y)**2);
    }

    floorToPrecision(n, precision){
        return Math.floor(n * Math.pow(10, precision) / Math.pow(10, precision));
    }

    getClosestPoints(radius,x, y){
        let closestPoints = [];
        for (const element of this.uniquePoints) {
            let point = {};
            let distance = this.distance2d(element.x - x, element.y - y);
            if (distance < radius) {
                point.coord = element;
                point.distance = distance;
                closestPoints.push(point);
            }
        }
        return closestPoints;
    }

    // Handlers
    handleDrag(e){
        if (this.isDrawing){
            this.isDrawing = false;
            this.lineCanvas.removeEventListener("mousemove", this.drawLineFromDrag, true);
            this.lineCtx.clearRect(0, 0, this.lineCanvas.width, this.lineCanvas.height);
            this.drawLinesFromArr(lines);
            console.log(this.pattern);
            this.pattern="";
            return;
        }
        this.isDrawing = true;
        let closestPoints = this.getClosestPoints(this.radius*2, e.clientX, e.clientY);
        for (const element of closestPoints) {
            if (element.distance < this.radius / 2) {
                this.lastPoint = element.coord;
                this.lineCanvas.addEventListener("mousemove", this.drawLineFromDrag, true);
                break;
            }
        }
    }
}