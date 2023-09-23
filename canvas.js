const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth * window.devicePixelRatio;
canvas.height = window.innerHeight * window.devicePixelRatio;
canvas.style.width = `${window.innerWidth}px`;
canvas.style.height = `${window.innerHeight}px`;

ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

var mouse = {
    x: 0,
    y: 0
}

const colors = [
  {r: 255, g: 0, b: 0}, 
  {r: 0, g: 0, b: 255}, 
  {r: 255, g: 255, b: 255},
  {r: 138,g: 43,b: 226 },
  {r:210,g: 105,b: 30},
  {r:100,g: 149,b: 237},  
];

class Firework {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.counter = 0;
        this.sparks = [];
        this.trail = [];
    }
    draw() {
        this.counter++;

        // Draw the rocket
        if (this.counter < 80) {
            ctx.beginPath();
            ctx.arc(this.x, canvas.height/window.devicePixelRatio - this.counter * 2, 0, 0, 2);
            ctx.fillStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
            ctx.fill();

            this.trail.push({x: this.x, y: canvas.height/window.devicePixelRatio - this.counter * 5});

            // Draw the trail
            ctx.beginPath();
            ctx.moveTo(this.trail[0].x, this.trail[0].y);
            for (let i = 1; i < this.trail.length; i++) {
                ctx.lineTo(this.trail[i].x, this.trail[i].y);
                ctx.strokeStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
                ctx.lineWidth = 2.5;
                ctx.stroke();
            }

            // Remove older parts of the trail
            if (this.trail.length > 8) {
                this.trail.shift();
            }
        }

        // Explode the firework
        else if (this.sparks.length === 0) {
            for (let i = 0; i < 70; i++) { // increase the number of sparks
                this.sparks.push(new Spark(this.x, canvas.height/window.devicePixelRatio - this.counter * 5, this.color));
            }
        }

        // Draw the explosion
        else {
            for (let i = 0; i < this.sparks.length; i++) {
                let spark = this.sparks[i];
                spark.draw();
                spark.update();
                if (spark.opacity <= 0) {
                    this.sparks.splice(i, 1);
                    i--;
                }
            }
        }
    }
}


class Spark {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.speed = Math.random() * 5 + 1;
        this.angle = Math.random() * Math.PI * 2;
        this.color = color;
        this.opacity = 1;
        this.lightRadius = 1;
        this.lightOpacity = 1;
    }

    draw() {
        // Draw the light effect
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.lightRadius, 0.03, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity})`;
        ctx.fill();
        this.lightRadius += 0.09; 
        this.lightOpacity *= 2; 

        // Update the opacity for flickering effect
        this.opacity = this.opacity <= 0.8 ? Math.random() * 0.8 : this.opacity - 0.5;

        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity})`;
        ctx.fillRect(this.x, this.y, 0.2, 0.2); 
    }

    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.opacity -= 0.008; 
    }
}


let fireworks = [];

setInterval(function () {
    let x = Math.random() * canvas.width/window.devicePixelRatio;
    let color = colors[Math.floor(Math.random() * colors.length)];
    fireworks.push(new Firework(x, canvas.height/window.devicePixelRatio, color));
}, 1000);



/////////////////////////////////

w = canvas.width;
h = canvas.height;

ctx.font = "normal 3em Brush Script MT, cursive";
ctx.textAlign = "center";
ctx.fillText("KHÁNH LINH", canvas.width / 4, canvas.height / 3.9);
var radius = 1;

var data32 = new Uint32Array(ctx.getImageData(0, 0, canvas.width, canvas.height).data.buffer);
var txtArr = [];
// loop through each pixel. We will only store the ones with alpha = 255
for (i = 0; i < data32.length; i++) {
    if (data32[i] & 0xff000000) { // check alpha mask
        txtArr.push({ // add new ball if a solid pixel
            x: (i % w) * radius * 2 + radius, // use position and radius to
            y: ((i / w) | 0) * radius * 2 + radius, //  pre-calc final position and size
        });
    }
}

//console.log(alpha);
function Circle(x, y) {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.dx = Math.random() - 1;
    this.dy = Math.random() - 1;
    this.radius = 1;
    this.dest = {
        x: x,
        y: y
    };
    this.vx = (Math.random() - 0.5) * 20;
    this.vy = (Math.random() - 0.5) * 20;
    this.accX = 0;
    this.accY = 0;
    this.friction = Math.random() * 0.05 + 0.94;

}
Circle.prototype.render = function() {
    this.accX = (this.dest.x - this.x) / 1000;
    this.accY = (this.dest.y - this.y) / 1000;
    this.vx += this.accX;
    this.vy += this.accY;
    this.vx *= this.friction;
    this.vy *= this.friction;

    this.x += this.vx;
    this.y += this.vy;
    //var a = 10*Math.random() - 10,
        //dx = a , // do something funky
      //dy = a ;
    ctx.beginPath();
    ctx.arc(this.x , this.y , this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffe0";
    ctx.fill();
    var a = this.x - mouse.x;
    var b = this.y - mouse.y;

    var distance = Math.sqrt(a * a + b * b);
    if (distance < (radius * 70)) {
        this.accX = (this.x - mouse.x) / 100;
        this.accY = (this.y - mouse.y) / 100;
        this.vx += this.accX;
        this.vy += this.accY;
    }
    //this.update = function(){
    //if(this.x + this.radius > canvas.width || this.x - this.radius < 0){
    //this.dx = -this.dx;
    //}
    //if(this.y + this.radius > canvas.height || this.y - this.radius < 0){
    // this.dy = -this.dy;
    //}
    //}
}

function onMouseMove(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}


function initScene() {
  
ctx.font = "normal 200% Brush Script MT, cursive";
ctx.textAlign = "center";
ctx.fillText("NGUYỄN THÀNH LƯƠNG", canvas.width / 4, canvas.height / 3);
var radius = 1;

var data32 = new Uint32Array(ctx.getImageData(0, 0, canvas.width, canvas.height).data.buffer);
var txtArr = [];
// loop through each pixel. We will only store the ones with alpha = 255
for (i = 0; i < data32.length; i++) {
    if (data32[i] & 0xff000000) { // check alpha mask
        txtArr.push({ // add new ball if a solid pixel
            x: (i % w) * radius * 2 + radius, // use position and radius to
            y: ((i / w) | 0) * radius * 2 + radius, //  pre-calc final position and size
        });
    }
}

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "screen";
    circleArr = [];
    for (var i = 0; i < txtArr.length; i++) {
        circleArr.push(new Circle(txtArr[i].x, txtArr[i].y));
    }
}

var circleArr = [];
initScene();


function animate() {
    ctx.clearRect(0, 0, canvas.width/window.devicePixelRatio, canvas.height/window.devicePixelRatio);
    
    for (let i = 0; i < fireworks.length; i++) {
        fireworks[i].draw();
    }
    
    requestAnimationFrame(animate);
    
    //Add text in the middle of screen
    let fontSize = 30;
    ctx.font = `bold ${fontSize}px Open Sans`;
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("", canvas.width/2/window.devicePixelRatio, canvas.height/2/window.devicePixelRatio - 100);

    for (var i = 0; i < txtArr.length; i++) {
        circleArr[i].render();
    }
}

animate();