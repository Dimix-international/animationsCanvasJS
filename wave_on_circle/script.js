//<canvas></canvas> add in index.html

(() => {
    const cnv = document.querySelector('canvas');
    const ctx = cnv.getContext('2d');
    const numberOfRings = 3;
    const maxWaveAmplitude = 17;
    const numberOfWaves = 7;
    const ringRadius = 200;
    let startAngle = 0; //для движения волн
    const ringRadiusOffset = 7;
    const colors = ['#771122', '#bb1122', '#ff1122'];
    const waveOffset = 15;// смещение для каждой волны

    const centerX = innerWidth / 2;
    const centerY = innerHeight / 2;

    const init = () => {
        cnv.width = innerWidth;
        cnv.height = innerHeight;
    }

    const loop = () => {
        cnv.width |= 0; //запись аналогична методу clearRect(0,0,cnv.width, cnv.height)
        updateRings();
        requestAnimationFrame(loop);
    }

    const updateRings = () => {
        for (let i = 0; i < numberOfRings; i++) {
            let radius = i * ringRadiusOffset + ringRadius;
            let offsetAngle = i * waveOffset * Math.PI / 180;
            drawRing(radius, colors[i], offsetAngle);
        }
        startAngle >= 360 ? startAngle = 0 : startAngle++;
    }

    function drawRing (radius, color, offsetAngle)  {
        //кольцо состоит из маленьких отрезков
        ctx.strokeStyle = color;
        ctx.lineWidth = 9;
        ctx.beginPath();

        //создаем окружность
        for (let j = -180; j < 180; j++) {
            let currentAngle =( j + startAngle) * Math.PI / 180;//переводим градусы в радианы

            let now = Math.abs(j);
            //эффекте перехода волны в окружность и наоборот
            let displacement = 0;

            if (now > 70) {
                displacement = (now - 70) / 70; //(j - 70) / 70 - для плавного перехода
            }

            //предотвратим большие волны
            if (displacement >= 1) {
                displacement = 1;
            }


            let waveAmplitude = radius + displacement * Math.sin(
                (currentAngle + offsetAngle) * numberOfWaves)
                * maxWaveAmplitude;//*maxWaveAmplitude - т.к. sin вернет от -1 до 1, увеличиваем волну
            let x = centerX + Math.cos(currentAngle) * waveAmplitude; //ringRadius - для увеличения размера круга
            let y = centerY + Math.sin(currentAngle) * waveAmplitude;

            if (j > -180) {
                ctx.lineTo(x,y);
            } else {
                ctx.moveTo(x,y);
            }
        }
        ctx.closePath();
        ctx.stroke();
    }

    window.addEventListener('resize', init);

    init();
    loop();
})();