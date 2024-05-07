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
    let closestPoints = getClosestPoints(radius*2, e.clientX, e.clientY);
    overlayCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (const element of closestPoints) {
        if (element.distance<radius/2){
            drawCircle(5, element.coord.x, element.coord.y, '#0f0', overlayCtx);
            continue;
        }
        drawCircle(5, element.coord.x, element.coord.y, '#f00', overlayCtx);
    }
});

addEventListener("mouseup", handleDrag);

function getClosestPoints(radius,x, y ){
    let closestPoints = [];
    for (const element of uniquePoints) {
        let point = {};
        let distance = distance2d(element.x - x, element.y - y);
        if (distance < radius) {
            point.coord = element;
            point.distance = distance;
            closestPoints.push(point);
        }
    }
    return closestPoints;
}

let lines = [];
let lastPoint;
function handleDrag(e){
    console.log("fired")
    if (isDrawing){
        isDrawing = false;
        lineCanvas.removeEventListener("mousemove", drawLineFromDrag, true);
        lineCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        drawLinesFromArr(lines);
        console.log(pattern);
        pattern="";
        console.log("stopped drawing");
        return;
    }
    isDrawing = true;
    let closestPoints = getClosestPoints(radius*2, e.clientX, e.clientY);
    for (const element of closestPoints) {
        if (element.distance < radius / 2) {
            lastPoint = element.coord;
            lineCanvas.addEventListener("mousemove", drawLineFromDrag, true);
            break;
        }
    }
}
let isDrawingLine = false;
let pattern = "";
function drawLineFromDrag(e){
    if (isDrawingLine){ // in case of race conditions
        return;
    }
    isDrawingLine = true;
    lineCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    drawLinesFromArr(lines);
    let closestPoints = getClosestPoints(radius * 2, e.clientX, e.clientY);
    for (let i in closestPoints) { // Math.abs(lastPoint.x - closestPoints[i].coord.x) < radius * 2 && Math.abs(lastPoint.y - closestPoints[i].coord.y)
        // how fucking ergonomic
        if (closestPoints[i].distance < radius / 2 && distance2d(Math.abs(lastPoint.x - closestPoints[i].coord.x), Math.abs(lastPoint.y - closestPoints[i].coord.y)) < radius * 2 && !lines.find(l => l.start.x === lastPoint.x && l.start.y === lastPoint.y && l.end.x === closestPoints[i].coord.x && l.end.y === closestPoints[i].coord.y)){
            if (Math.round(closestPoints[i].coord.x) === Math.round(lastPoint.x) && Math.round(closestPoints[i].coord.y)===Math.round(lastPoint.y)){
                isDrawingLine=false;
                return;
            }
            lines.push({start: lastPoint, end: closestPoints[i].coord});
            lineCtx.beginPath();
            lineCtx.moveTo(lastPoint.x, lastPoint.y);
            lineCtx.lineTo(closestPoints[i].coord.x, closestPoints[i].coord.y);
            lineCtx.stroke();
            lineCtx.closePath();
            console.log("snapped to point");
            const angle = Math.round(degFromPoint(lastPoint.x - closestPoints[i].coord.x, lastPoint.y - closestPoints[i].coord.y));
            console.log(angle);
            if (angle === 0 || angle === 180){
                pattern += "w";
            } else if (angle === 60) {
                pattern += "a";
            } else if (angle === -60){
                pattern += "d";
            } else if (angle === 120) {
                pattern += "q";
            } else if (angle === -120) {
                pattern += "e";
            }
            lastPoint = closestPoints[i].coord;
            isDrawingLine=false;
            return;
        }
    }
    lineCtx.beginPath();
    lineCtx.moveTo(lastPoint.x, lastPoint.y);
    lineCtx.lineTo(e.clientX, e.clientY);
    lineCtx.stroke();
    lineCtx.closePath();
    isDrawingLine=false;
}


function drawLinesFromArr(arr){
    for (const element of arr) {
        lineCtx.beginPath();
        lineCtx.moveTo(element.start.x, element.start.y);
        lineCtx.lineTo(element.end.x, element.end.y);
        lineCtx.stroke();
        lineCtx.closePath();
    }
}

function distance2d(x, y){
    return Math.sqrt(Math.abs(x)**2+Math.abs(y)**2);
}

function generateHexGrid(radius, xOffset, yOffset){
    let nColumns = Math.floor(canvasElement.width / (radius * 2))+1;
    let nRows = Math.floor(canvasElement.height / (radius * 2))-1;

    for (let i = 0; i < nColumns; i++) {
        for (let j = 0; j < nRows; j++) {
            let x = xOffset + i * Math.sqrt(3)*radius ;1
            let y = yOffset + j * radius * 3;
            generateHexPoint(radius, x, y, 3);
        }
    }

    drawGrid(uniquePoints);
}

function generateHexPoint(radius, xOffset, yOffset, nSide) {
    let points = [];
    for (let i = 0; i < nSide; i++) {
        let angleRad = degToRad(-90) + (2 * Math.PI / nSide) * i;
        let x = xOffset + radius * Math.cos(angleRad);
        let y = yOffset + radius * Math.sin(angleRad);
        if (uniquePoints.find(p => floorToPrecision(p.x, 100) === floorToPrecision(x, 100) && floorToPrecision(p.y, 100) === floorToPrecision(y, 100))) {
            continue;
        }
        uniquePoints.push({ x, y });
        points.push({ x, y });
    }
    return points;
}

function drawGrid(points){
    if (points) {
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (const element of points) {
            drawCircle(2, element.x, element.y, '#fff', ctx);
        }
        ctx.closePath();
        ctx.fill();
    }
}

function drawCircle(radius, centerX, centerY, color, ctx){
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function degToRad(deg){
    return deg * Math.PI / 180;
}

function floorToPrecision(n, precision){
    return Math.floor(n * Math.pow(10, precision) / Math.pow(10, precision));
}

generateHexGrid(radius, xOffset, yOffset);

function degFromPoint(x, y){
    return Math.atan2(y, x) * 180 / Math.PI;
}