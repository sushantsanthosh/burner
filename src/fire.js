var score = 0;
var gameInterval;
var timerInterval;

function getRandomPosition() {
    var screenWidth = window.innerWidth - 100;
    var screenHeight = window.innerHeight - 140;
    var randomX = Math.floor(Math.random() * screenWidth);
    var randomY = Math.floor(Math.random() * screenHeight);
    return { x: randomX, y: randomY };
}

function spawnBook() {
    var book = document.createElement('img');
    book.src = 'images/book.png';
    book.alt = 'Book';
    book.className = 'book';
    var position = getRandomPosition();
    book.style.left = position.x + 'px';
    book.style.top = position.y + 'px';
    document.getElementById('game-container').appendChild(book);

    var disappearTime = Math.floor(Math.random() * 1000) + 3000;
    setTimeout(function() {
        document.getElementById('game-container').removeChild(book);
    }, disappearTime);

    book.addEventListener('click', function() {
        document.getElementById('game-container').removeChild(book);
        score++;
        document.getElementById('scoreValue').textContent = score;
    });
}

function startGame() {
    document.getElementById('instructions').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    score = 0;
    document.getElementById('scoreValue').textContent = score;
    gameInterval = setInterval(spawnBook, 1000);
    timerInterval = setInterval(startTimer, 1000)
    document.getElementById("score").style.textContent = 'hello';
}


//////////////////

((window, document, lib, undefined) => {

    'use strict';

    this.requestAnimationFrame = (() => {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    const RAND = Math.random,
        COS = Math.cos,
        SIN = Math.sin,
        PI = Math.PI,
        TAU = PI * 2;

    class Particle extends lib.v2 {
        constructor(x, y) {
            super(x, y);
            this.noiseVelocity = new lib.v2();
            this.baseVelocity = new lib.v2(1 - RAND() * 2, RAND() * 4)
        }
        update() {
            if (this.baseVelocity.y > -5) {
                this.baseVelocity.y -= 0.2;
            }
            this.add(this.baseVelocity).add(this.noiseVelocity);
        }
    }

    class App {
        constructor() {
            this.mouseOver = false;
            this.mouse = new lib.v2();
            this.base = new lib.v2();
            this.position = new lib.v2();
            this.canvas = document.querySelector('.canvas');
            this.ctx = this.canvas.getContext('2d');
            this.tick = 0;
            this.particles = [];
            let self = this;
            window.onresize = () => {
                self.resize();
            };
            window.onmousemove = (e) => {
                this.mouseHandler(e);
            };
            window.onmouseout = (e) => {
                this.mouseHandler(e);
            };
            window.onclick = (e) => {
                this.mouseHandler(e);
            };
            this.resize();
            this.loop();
        }

        resize() {
            this.width = this.canvas.width = window.innerWidth;
            this.height = this.canvas.height = window.innerHeight;
            this.base.x = this.width / 2;
            this.base.y = this.height - 100;
        }

        mouseHandler(e) {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            if (e.type === 'mousemove') {
                this.mouseOver = true;
            }
            if (e.type === 'click') {
                for (let i = 0; i < 20; i++) {
                    let p = new Particle(e.clientX, e.clientY);
                    p.baseVelocity = new lib.v2(6 - RAND() * 12, RAND() * 8)
                    this.particles.push(p);
                }
            }
            if (e.type === 'mouseout') {
                this.mouseOver = false;
            }
        }

        render() {
            this.tick++;
            this.ctx.fillStyle = 'rgba(0,0,0,1)';
            this.ctx.fillRect(0, 0, this.width, this.height);
            this.particles.push(new Particle(this.position.x, this.position.y));
            this.ctx.save();
            for (let i = this.particles.length - 1; i > 0; i--) {
                let p = this.particles[i],
                    opacity = (p.y / window.innerHeight + 0.1).toFixed(2),
                    theta = ((lib.noise.simplex3(p.x * 0.002, p.y, this.tick) + 1) / 2) * PI,
                    velocity = new lib.v2(COS(theta) * 20, SIN(theta) * -5);
                p.noiseVelocity.lerp(velocity);
                p.update();
                this.ctx.fillStyle = 'hsla(40,50%,50%,' + opacity + ')';
                this.ctx.fillRect(p.x - i / 4, p.y - 30, i / 2, 60);
                if (p.y < 0) {
                    this.particles.splice(i, 1);
                }
            }
            this.ctx.restore();
            if (this.mouseOver) {
                this.position.lerp(this.mouse);
            } else {
                this.position.lerp(this.base);
            }
        }

        loop() {
            let self = this;
            self.render();
            window.requestAnimationFrame(self.loop.bind(self));
        }
    }

    this.onload = () => {
        let app = new App();
    };

})(this, document, {
    v2: Vector2,
    noise: noise
});

/////////

