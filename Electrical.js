export default class ElectricalPuzzle {
    constructor(parentDiv, width, height, styles, solution) {
        this.parentDiv = parentDiv;
        this.width = width;
        this.height = height;
        this.styles = styles;
        this.solution = solution; // [['red, blue'], ['blue', 'green'], ['green', 'yellow'], ['yellow', 'purple'], ['purple', 'red']]
        this.points = {top: [], bottom: []};
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.init();
    }

    init(){
        this.bgCanvas = document.createElement('canvas');
        this.bgCanvas.width = this.width;
        this.bgCanvas.height = this.height;
        this.ctx = this.bgCanvas.getContext('2d');
        this.parentDiv.appendChild(this.bgCanvas);

        this.interactionCanvas = document.createElement('canvas');
        this.interactionCanvas.width = this.width;
        this.interactionCanvas.height = this.height;
        this.interactionCtx = this.interactionCanvas.getContext('2d');
        this.parentDiv.appendChild(this.interactionCanvas);
        this.interactionCanvas.addEventListener('click', this.handleClick.bind(this));
        this.ctx.fillStyle = this.styles.bgColor;
        this.ctx.fillRect(0, 0, this.width, this.height);

        let initX = 10;
        let endY = 380;

        let arrColor = ['red', 'blue', 'green', 'yellow', 'purple']
        this.shuffleArray(arrColor);
        let bottomArr = [...arrColor];
        this.shuffleArray(arrColor);
        let topArr = [...arrColor];

        for (let i = 0; i < 5; i++){
            this.ctx.fillStyle = topArr[i];
            this.ctx.fillRect(initX, 0, this.styles.wireWidth, this.styles.wireHeight);
            this.ctx.fillStyle = "white";
            this.points.top.push({x: initX + this.styles.wireWidth/2, y: this.styles.wireHeight, color: topArr[i]});
            this.drawCircle(10, initX + this.styles.wireWidth/2, this.styles.wireHeight, 'white', this.ctx)

            this.ctx.fillStyle = bottomArr[i];
            this.ctx.fillRect(initX, endY, this.styles.wireWidth, this.styles.wireHeight);
            this.ctx.fillStyle = "white";
            this.points.bottom.push({x: initX + this.styles.wireWidth/2, y: endY, color: bottomArr[i]});
            this.drawCircle(10, initX + this.styles.wireWidth/2, endY, 'white', this.ctx)

            initX += 100;
        }
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * i);
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    handleClick(e) {
        const x = e.offsetX;
        const y = e.offsetY;
        const pts = this.getClosestPoints(x, y);

        if (pts.length === 0) return;

        console.log(x, y, pts);
        if (!this.currentPts) {
            this.currentPts = pts;
            this.interactionCanvas.addEventListener('mousemove', this.handleMouseMove, true);
        } else {
            if (this.currentPts.y === pts.y) return;
            this.ctx.beginPath();
            this.ctx.moveTo(pts[0].x, pts[0].y);
            this.ctx.strokeStyle = 'white';
            this.ctx.lineWidth = 5;
            this.ctx.lineTo(this.currentPts[0].x, this.currentPts[0].y);
            this.ctx.stroke();
            this.ctx.closePath();
            this.currentPts = null;
            this.interactionCanvas.removeEventListener('mousemove', this.handleMouseMove, true);
        }
    }

    handleMouseMove(e) {
        const pts = this.currentPts;
        this.interactionCtx.clearRect(0, 0, this.width, this.height);
        this.interactionCtx.beginPath();
        this.interactionCtx.moveTo(pts[0].x, pts[0].y);
        this.interactionCtx.strokeStyle = 'white';
        this.interactionCtx.lineWidth = 5;
        this.interactionCtx.lineTo(e.offsetX, e.offsetY);
        this.interactionCtx.stroke();
        this.interactionCtx.closePath();
    }

    getClosestPoints(x, y) {
        const closestPoints = [];
        for (const point of this.points.top){
            let distance = Math.sqrt((point.x - x) ** 2 + (point.y - y) ** 2);
            if (distance < 10){
                closestPoints.push(point);
            }
        }
        for (const point of this.points.bottom){
            let distance = Math.sqrt((point.x - x) ** 2 + (point.y - y) ** 2);
            if (distance < 10){
                closestPoints.push(point);
            }
        }
        return closestPoints;
    }

    drawCircle(radius, centerX, centerY, color, ctx){
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
    }
}