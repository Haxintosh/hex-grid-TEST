export default class Cryptex {
    constructor(parentDiv, goodAnswer, callback) {
        this.parentDiv = parentDiv;
        this.answer = [];
        this.goodAnswer = goodAnswer;
        this.callback = callback;
        this.canvas = document.createElement('canvas');
        this.canvas.classList.add('cryptexCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.parentDiv.appendChild(this.canvas);
        this.pts = []; // [{x:0, y:0}]
        // this.createCryptex();
        this.init();
    }

    init(){
        this.pts = [
            {x:120, y:95},
            {x:120, y:365},
            {x:250, y:95},
            {x:250, y:365},
            {x:370, y:95},
            {x:370, y:365},
            {x:495, y:95},
            {x:495, y:365},
        ];
        this.canvas.width = 614;
        this.canvas.height = 461;
        this.bgImage = new Image();
        this.bgImage.src = 'images/cryptx-pzl.png';
        this.bgImage.onload = () => {
            this.ctx.drawImage(this.bgImage, 0, 0, this.canvas.width, this.canvas.height);
            this.ctx.font = '30px Arial';
            this.ctx.fillStyle = 'black';
            this.ctx.fillText('0', 119, 240);
            this.answer[0] = 0;
            this.ctx.fillText('0', 239, 240);
            this.answer[1] = 0;
            this.ctx.fillText('0', 360, 240);
            this.answer[2] = 0;
            this.ctx.fillText('0', 483, 240);
            this.answer[3] = 0;
        }
        const styles = `
                .cryptexCanvas {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }
        }`
        this.styleSheet = document.createElement('style');
        this.styleSheet.innerHTML = styles;
        document.head.appendChild(this.styleSheet);

        this.canvas.addEventListener('click', this.handleClick.bind(this));

    }

    handleClick(e) {
        const {offsetX, offsetY} = e;
        const closestPt = this.getClosestPoint(offsetX, offsetY);
        if (closestPt === null) return;
        if (closestPt === this.pts[0]){
            this.answer[0] = this.answer[0] + 1;
        } else if (closestPt === this.pts[1]){
            this.answer[0] = this.answer[0] - 1;
        } else if (closestPt === this.pts[2]){
            this.answer[1] = this.answer[1] + 1;
        } else if (closestPt === this.pts[3]){
            this.answer[1] = this.answer[1] - 1;
        } else if (closestPt === this.pts[4]){
            this.answer[2] = this.answer[2] + 1;
        } else if (closestPt === this.pts[5]){
            this.answer[2] = this.answer[2] - 1;
        } else if (closestPt === this.pts[6]){
            this.answer[3] = this.answer[3] + 1;
        } else if (closestPt === this.pts[7]){
            this.answer[3] = this.answer[3] - 1;
        }

        this.redraw();
        this.checkAnswer();
    }

    getClosestPoint(x, y) {
        let closestPt = null;
        const maxDist = 30;
        for (const pt of this.pts){
            const dist = Math.hypot(pt.x - x, pt.y - y);
            if (dist < maxDist){
                closestPt = pt;
                break;
            }
        }
        return closestPt;
    }

    redraw(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.bgImage, 0, 0, this.canvas.width, this.canvas.height);
        this.ctx.font = '30px Arial';
        this.ctx.fillStyle = 'black';
        this.ctx.fillText(this.answer[0], 119, 240);
        this.ctx.fillText(this.answer[1], 239, 240);
        this.ctx.fillText(this.answer[2], 360, 240);
        this.ctx.fillText(this.answer[3], 483, 240);
    }

    checkAnswer(){
        console.log(this.answer, this.goodAnswer);
        if(this.answer[0] === this.goodAnswer[0] && this.answer[1] === this.goodAnswer[1] && this.answer[2] === this.goodAnswer[2] && this.answer[3] === this.goodAnswer[3]){
            this.callback();
        }
    }

    destroy(){
        this.canvas.removeEventListener('click', this.handleClick.bind(this));
        this.parentDiv.removeChild(this.canvas);
        this.styleSheet.remove();
    }
}