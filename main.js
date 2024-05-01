import './style.css'

let canvasElement = document.getElementById('canvas');

let overlayCanvas = document.getElementById('overlayCanvas');

canvasElement.width = window.innerWidth;
canvasElement.height = window.innerHeight;

overlayCanvas.width = window.innerWidth;
overlayCanvas.height = window.innerHeight;

let ctx = canvasElement.getContext('2d');

let overlayCtx = overlayCanvas.getContext('2d');

ctx.fillStyle = '#181825';

ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

let uniquePoints = [];

let radius = 50;
let xOffset = 100;
let yOffset = 100;

generateHexGrid(radius, xOffset, yOffset);
console.log(uniquePoints);

addEventListener("mousemove", (e) =>{
    let closestPoints = getClosestPoints(radius*2, e.clientX, e.clientY);
    console.log(e.clientX, e.clientY);
    console.log(closestPoints);
    overlayCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (const element of closestPoints) {
        if (element.distance<radius/2){
            drawCircle(5, element.coord.x, element.coord.y, '#0f0', overlayCtx);
            continue;
        }
        drawCircle(5, element.coord.x, element.coord.y, '#f00', overlayCtx);
    }
})

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












function distance2d(x, y){
    return Math.sqrt(Math.abs(x)**2+Math.abs(y)**2);
}

function generateHexGrid(radius, xOffset, yOffset){
    let nColumns = Math.floor(canvasElement.width / (radius * 2))+1;
    let nRows = Math.floor(canvasElement.height / (radius * 2))-1;

    for (let i = 0; i < nColumns; i++) {
        for (let j = 0; j < nRows; j++) {
            let x = xOffset + i * Math.sqrt(3)*radius ;
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
            console.log(element.x, element.y);
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