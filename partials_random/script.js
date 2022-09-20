
(
    function () {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        let width = canvas.width = innerWidth;
        let height = canvas.height = innerHeight;
        const particles = [];
        const properties = {
            bgColor: 'rgba(17,17,19,1)',
            particleColor: 'rgba(255,40,40,1)',
            particleRadius: 3,
            particleCount: 60,
            particleMaxVelocity: 0.5,
            lineLength: 150, // Длина соединения
            particleLife: 6, //6 сек максим жизнь частицы
        };

        document.querySelector('body').appendChild(canvas);

        window.addEventListener('resize', () => {
            width = canvas.width = innerWidth;
            height = canvas.height = innerHeight;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                //получим скорость от -0.5 до 0.5
                this.velocityX = Math.random() * (properties.particleMaxVelocity * 2) - properties.particleMaxVelocity;
                this.velocityY = Math.random() * (properties.particleMaxVelocity * 2) - properties.particleMaxVelocity;

                this.life = Math.random() * properties.particleLife * 60;
                //60 - количество кадров в сек из requestAnimationFrame
            }

            getPosition() {
                //добавляем к текущем координатам скорость
                if (
                    (this.x + this.velocityX > width && this.velocityX > 0 )
                    || (this.x + this.velocityX < 0 && this.velocityX < 0)
                ) {
                    //проверка чтобы по X точки не уходили за экран - изменим направление движения
                    this.velocityX *= -1;
                } else {
                    this.x += this.velocityX;
                }

                if (
                    (this.y + this.velocityY > height && this.velocityY > 0 )
                    || (this.y + this.velocityY < 0 && this.velocityY < 0)
                ) {
                    //проверка чтобы по X точки не уходили за экран - изменим направление движения
                    this.velocityY *= -1;
                } else {
                    this.y += this.velocityY;
                }
            }

            reDraw() {
                context.beginPath();
                context.arc(this.x, this.y, properties.particleRadius, 0, Math.PI * 2);
                context.closePath();
                context.fillStyle = properties.particleColor;
                context.fill();
            }

            reCalculateLife() {
                if (this.life < 1) {
                    this.x = Math.random() * width;
                    this.y = Math.random() * height;
                    //получим скорость от -0.5 до 0.5
                    this.velocityX = Math.random() * (properties.particleMaxVelocity * 2) - properties.particleMaxVelocity;
                    this.velocityY = Math.random() * (properties.particleMaxVelocity * 2) - properties.particleMaxVelocity;

                    this.life = Math.random() * properties.particleLife * 60;
                }
                this.life --;
            }
        }

        const reDrawBackground = () => {
            context.fillStyle = properties.bgColor;
            context.fillRect(0,0, width, height);
        }

        const reDrawParticles = () => {
            for (const particle of particles) {
                particle.reCalculateLife();
                particle.getPosition();
                particle.reDraw();
            }
        }

        const drawLines = () => {
            //будем проверять расстояние от одной точки до другой
            let x1;
            let y1;
            let x2;
            let y2;
            let length;
            let opacity;

            for (const i of particles) {
                for (const j of particles) {
                    x1 = i.x;
                    y1 = i.y;
                    x2 = j.x;
                    y2 = j.y;
                    length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

                    if (length < properties.lineLength) {

                        opacity = 1 - length / properties.lineLength; //чем короче length - тем больше opacity

                        context.lineWidth = 0.5;
                        context.strokeStyle = `rgba(255,40,40,${opacity})`;
                        context.beginPath();
                        context.moveTo(x1 ,y1);
                        context.lineTo(x2, y2);
                        context.closePath();
                        context.stroke();
                    }
                }
            }
        }

        const loop = () => {
            reDrawBackground();
            reDrawParticles();
            drawLines();
            requestAnimationFrame(loop); //анимация
        }

        const init = () => {
            let i = 0;
            while (i < properties.particleCount) {
                particles.push(new Particle());
                i++;
            }

            loop();
        }

        init();
    }()
)