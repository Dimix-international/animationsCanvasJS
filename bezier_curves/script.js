
const config = {
    waveSpeed: 1,
    wavesToBlend: 4,
    curvesNum: 40,
    framesToMove: 600, // каждые 600 кадров (10сек) будем менять тип и расположение
}

class WaveNoise {
    constructor() {
        this.waveSet = [];
    }

    addWaves(requiredWaves ) {
        let i = 0;
        while (i < requiredWaves) {
            let randomAngle = Math.random() * 360;
            this.waveSet.push(randomAngle);
            i++;
        }
    }

    getWave() {
        let blendedWave = 0;
        for (const e of this.waveSet) {
            blendedWave += Math.sin(e / 180 * Math.PI);
        }

        return (blendedWave / this.waveSet.length + 1) / 2; //чтобы был результат от 0 до 1
    }

    update () {
        this.waveSet.forEach((e, i) => {
            let r = Math.random() * (i + 1) * config.waveSpeed; //разные скорости волн
            this.waveSet[i] = (e + r) % 360; // % 360 - чтобы не было больше 360
        })
    }
}


class Animation {
    constructor() {
        this.cnv = null;
        this.ctx = null;
        this.size = {
            w: 0,
            h: 0,
            cx: 0,
            cy: 0,
        };
        this.controls = [];
        this.controlsNum = 3; //общие координаты для всех x1,y1,x2
        this.framesCounter = 0; //счетчик кадров
        this.type4Start = 0; //начало кривых
        this.type4SEnd = 0; //начало кривых
    }

    init() {
        this.createCanvas();
        this.createControls();
        this.updateAnimation();
    }

    createCanvas() {
        this.cnv = document.createElement('canvas');
        this.ctx = this.cnv.getContext('2d');
        this.setCanvasSize();
        document.body.appendChild(this.cnv);

        window.addEventListener('resize', () => this.setCanvasSize());
    }

    setCanvasSize() {
        this.size.w = this.cnv.width = window.innerWidth;
        this.size.h = this.cnv.height = window.innerHeight;
        this.size.cx = this.size.w / 2;
        this.size.cy = this.size.h / 2;
    }

    createControls() {
        let i = 0;
        while (i < this.controlsNum + config.curvesNum) {
            //будет 3 общих точек контроля и 3 индивидуальных
            let control = new WaveNoise();
            control.addWaves(config.wavesToBlend);
            this.controls.push(control);
            i++;
        }
    }


    updateCurves () {
        let c = this.controls;
        let _controlX1 = c[0].getWave() * this.size.w; //getWave() вернет от 0 до 1 и для больше движения умножаем
        let _controlY1 = c[1].getWave() * this.size.h;
        let _controlX2 = c[2].getWave() * this.size.w;

        let i = 0;
        while (i < config.curvesNum) {
            let _controlY2 = c[3 + i].getWave();
            let curveParam = {
                startX: 0,
                startY: this.getYPlacementType(this.type4Start, i),
                controlX1: _controlX1,
                controlY1: _controlY1,
                controlX2: _controlX2,
                controlY2: _controlY2 * this.size.h,
                endX: this.size.w,
                endY: this.getYPlacementType(this.type4SEnd, i),
                alpha: _controlY2,
                hue: 360 / config.curvesNum * i
            };

            this.drawCurve(curveParam);
            i++;
        }
    }

    drawCurve ({startX, startY, controlX1, controlY1, controlX2, controlY2, endX, endY, alpha, hue}) {
        this.ctx.strokeStyle = `hsla(${hue}, 100%, 50%, ${alpha})`;
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.bezierCurveTo(
            controlX1,
            controlY1,
            controlX2,
            controlY2,
            endX,
            endY
        );
        this.ctx.stroke();
    }

    updateCanvas() {
        this.ctx.fillStyle = `rgb(22,22,25)`;
        this.ctx.fillRect(0,0,this.size.w, this.size.h);
    }

    updateControls () {
        this.controls.forEach(e => e.update());
    }

    getYPlacementType (type, i) {
        if (type > 0.6) {
            return this.size.h / config.curvesNum * i; //расредоточим кривые вдоль всей высоты
        } else if (type > 0.4) {
            return this.size.h //сверху
        } else if (type > 0.2) {
            return this.size.cy //середина
        } else{
            return 0; //снизу
        }
    }

    updateFrameCounter() {
        this.framesCounter = (this.framesCounter + 1) % config.framesToMove;

        if (this.framesCounter === 0) {
            this.type4Start = Math.random();
            this.type4SEnd = Math.random();
        }
    }

    updateAnimation() {
        this.updateFrameCounter();
        this.updateCanvas();
        this.updateCurves();
        this.updateControls();
        requestAnimationFrame(() => this.updateAnimation());
    }
}

window.addEventListener('load', () => {
    new Animation().init();
})