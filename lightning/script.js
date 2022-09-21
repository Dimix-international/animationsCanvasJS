(
    () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const w = canvas.width = innerWidth;
        const h = canvas.height = innerHeight;
        const canvasColor = `#232332`;
        const TWO_PI = 2 * Math.PI;
        const maxLength = 800; //максимальная длинна разряда
        const stepLength = 2;
        const maxOffset = 6; //максимальный разброс молнии

        let mx = 0;// координаты мыши
        let my = 0;// координаты мыши
        let toggle = 0;// переключатель, для перемещения окружностей

        const circles = [];
        const circlesCount = 2;

        class Circle {
            constructor(x, y) {
                this.x = x || Math.random() * w;
                this. y = y || Math.random() * h;
            }

            draw (x,y,) {
                this.x = x || this.x;
                this.y = y || this.y;

                ctx.lineWidth = 1.5;
                ctx.fillStyle = `white`;
                ctx.strokeStyle = `red`;

                //точка
                ctx.beginPath();
                ctx.arc(this.x, this.y, 6, 0, TWO_PI);
                ctx.closePath();
                ctx.fill();

                //контур
                ctx.beginPath();
                ctx.arc(this.x, this.y, 32, 0, TWO_PI);
                ctx.closePath();
                ctx.stroke();
            }
        }

        const init = () => {
            canvas.style.background = canvasColor;
            document.querySelector('body').appendChild(canvas);

            let i = 0;
            while (i < circlesCount) {
                circles.push(new Circle());
                i++;
            }
        }

        const mouseMove = (e) => {
            mx = e.x - canvas.getBoundingClientRect().x;
            my = e.y - canvas.getBoundingClientRect().y;
        }

        const toggleMoveCircle = () => {
            toggle = toggle === circles.length - 1 ? 0 : toggle + 1; //пробежимся по всем окружностям нажимая любую клавишу

        }

        const createLightning = () => {
            for (let a = 0; a < circles.length; a++) {
                // b = a + 1 - чтобы не проводить линию от b к a, если от a к b уже проведена,
                // и не будем сравнивать круги сами с собой
                for (let b = a + 1; b < circles.length; b++) {

                    let dist = getDistance(circles[a], circles[b]);
                    let chance = dist / maxLength; //шанс разряда

                    if (chance > Math.random()) continue; //разряда не будет

                    let otherColor = chance * 255;
                    //разобьем линию на части и сделаем смещение
                    let stepsCount = dist / stepLength;
                    let sx = circles[a].x;
                    let sy = circles[a].y;

                    //рисуем линию
                    ctx.lineWidth  = 2.5;
                    ctx.strokeStyle = `rgb(255, ${otherColor}, ${otherColor})`;

                    ctx.beginPath();
                    ctx.moveTo(circles[a].x, circles[a].y);

                    //ctx.lineTo(circles[b].x, circles[b].y);  //была просто линия

                    for (let j = stepsCount; j > 1; j--) {

                        let pathLength = getDistance(circles[a], {x: sx, y: sy});//пройденный путь
                        //pathLength / dist * Math.PI - число от 0 то PI
                        let offset = Math.sin(pathLength / dist * Math.PI) * maxOffset;

                        //линия будет пока шагов больше 1
                        sx += (circles[b].x - sx) / j + Math.random() * offset * 2 - offset; //увеличиваем чтобы линии не были в одном месте
                        sy += (circles[b].y - sy) / j + Math.random() * offset * 2 - offset;
                        ctx.lineTo(sx, sy);
                    }
                    ctx.stroke();
                }
            }
        }

        const getDistance = (a,b) => {
            //вычисляем расстояние между объектами
            return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
        }

        canvas.addEventListener('mousemove', mouseMove);
        window.addEventListener('keydown', toggleMoveCircle);

        const loop = () => {
            ctx.clearRect(0,0, w, h) //очищаем canvas

            createLightning();

            circles.map(c => {
                if (c === circles[toggle]) {
                    c.draw(mx, my)
                } else {
                    c.draw()
                }
            });

            requestAnimationFrame(loop);
        }

        init();
        loop();
    }
)();