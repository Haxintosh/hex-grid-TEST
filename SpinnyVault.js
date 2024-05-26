export default class SpinnyVault{
    constructor(parent, x, y, src, nTimes, callback, accel = 0.4, speedLimit = 4) {
        this.x = x;
        this.y = y;
        this.src = src;
        this.parent = parent;
        this.callback = callback;

        this.rotation = 0;
        this.direction = 1;
        this.speed = 0;
        this.acceleration = accel;
        this.speedLimit = speedLimit;

        this.goodTimes = 0; // withscar
        this.nTimes = nTimes;

        this.init();
    }

    init(){
        this.mainWrapper = document.createElement('div');
        this.mainWrapper.classList.add('spinnyVaultWrapper');
        this.parent.appendChild(this.mainWrapper);

        this.img = document.createElement('img');
        this.img.src = this.src;
        this.img.style.width = '25%';
        this.img.style.height = '25%';
        this.mainWrapper.appendChild(this.img);

        const br = document.createElement('br');
        this.mainWrapper.appendChild(br);

        this.rotateButton = document.createElement('button');
        this.rotateButton.id = 'rotateButton';
        this.rotateButton.innerText = 'Crack Vault';
        this.rotateButton.addEventListener('click', this.clickHandler.bind(this));
        this.mainWrapper.appendChild(this.rotateButton);

        this.indicatorDiv = document.createElement('div');
        this.indicatorDiv.style.width = '200px';
        this.indicatorDiv.style.height = '50px';
        this.indicatorDiv.id = 'indicatorDiv';

        this.indicator = document.createElement('div');
        this.indicator.style.width = '100%';
        this.indicator.style.height = '100%';
        this.indicator.style.backgroundColor = 'green';

        this.indicatorText = document.createElement('div');
        this.indicatorText.innerText = 'Vault Vulnerable When Green';
        this.indicatorText.id = 'indicatorText';


        this.indicatorDiv.appendChild(this.indicatorText);
        this.indicatorDiv.appendChild(this.indicator);
        this.mainWrapper.appendChild(this.indicatorDiv);
        const styles = `
            .spinnyVaultWrapper{
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 10px;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
             
            }
            
            .spinnyVaultWrapper img{
            margin: 4em;
            }
            
            #rotateButton{
                // width: 100px;
                // height: 50px;
                font-size: 1.5em;
                background: #D3D3D3;
                border: none;
                color: #000;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                transition-duration: 0.4s;
                cursor: pointer;
            }
            
            #rotateButton:hover {
                background-color: #3e8e41;
                color: white;
            }
    
            
            #indicatorDiv{
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                // gap: 10px;
            }
            #indicatorText{
                // font-size: 1.5em;
                margin-right: 10px;
            }
        `
        this.styleSheet = document.createElement("style");
        this.styleSheet.innerText = styles;
        document.head.appendChild(this.styleSheet);

        this.rotate();
    }

    rotate(){
        this.speed += this.acceleration * this.direction;

        // Cap the speed
        if (Math.abs(this.speed) > this.speedLimit) {
            this.speed = this.speedLimit * Math.sign(this.speed);
        }

        this.rotation += this.speed;
        this.img.style.transform = `rotate(${this.rotation}deg)`;

        const angle = this.getAngleFromCoterminal(this.rotation);
        if (!this.correctAngle) {
            this.correctAngle = this.getAngleFromCoterminal(this.genRandomDeg() +  this.direction*angle+240);
        }
        if (angle < this.correctAngle - 60 || angle > this.correctAngle + 60){
            this.indicator.style.backgroundColor = 'red';
        } else{
            this.indicator.style.backgroundColor = 'green';
        }
        requestAnimationFrame(this.rotate.bind(this));
    }

    clickHandler(e){
        this.direction *= -1;
        if (this.indicator.style.backgroundColor === 'green'){
            this.goodTimes++;
            if (this.goodTimes === this.nTimes){
                this.callback();
            }
        } else {
            this.goodTimes = 0;
        }
        if (this.correctAngle){
            this.correctAngle=null;
            this.indicator.style.backgroundColor = 'red';
        }
    }

    destroy() {
        this.parent.innerHTML = '';
    }

    genRandomDeg(){
        return Math.floor(Math.random() * 360);
    }

    getAngleFromCoterminal(angle){
        return Math.abs(angle % 360);
    }
}