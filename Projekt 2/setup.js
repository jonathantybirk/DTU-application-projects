var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');


// Constants
var playArea = [50000,50000];
var gravitationalConstant = 1;


// Time
var frameRate = 60;

var deltaTime = 0;
var then = 0;

function liberateFramerate(now) {
    now *= 0.001 * frameRate;
    deltaTime = now - then;
    then = now;
}


// Camera
var camera = {
    zoomLevels: [1,2,3],
    zoomLevel: 1,
    p: [-canvas.width / 2, -canvas.height / 2],
    update() {
        // update position
        this.p = [Rocket.p[0] - canvas.width / 2, Rocket.p[1] - canvas.height / 2];
        // Zoom function
        if (keys.space && !keys.spacePressed) {
            for (var i = 0; i < this.zoomLevels.length; i++) {
                if (i == this.zoomLevels.length - 1) this.zoomLevel = this.zoomLevels[0];
                else if (this.zoomLevel == this.zoomLevels[i]) {
                    this.zoomLevel = this.zoomLevels[i + 1];
                    break
                }
            }
        keys.spacePressed = true;
        }
    }
}


// Map
var map = {
    size: 0.25,
    zoomLevel: 20,
    rocketSize: 0.5,
    draw() {
        // Outline
        ctx.strokeStyle = "#ffffff";
        ctx.strokeRect(canvas.width * (1 - this.size), canvas.height * (1 - this.size), canvas.width * this.size, canvas.height * this.size);
        // Space
        ctx.fillStyle = "#202025";
        ctx.fillRect(canvas.width * (1 - this.size), canvas.height * (1 - this.size), canvas.width * this.size, canvas.height * this.size);
        // Bodies
        for (body of bodies) {
            // check if bodies are within map
            if ((body.p[0] - camera.p[0] - canvas.width / 2) / this.zoomLevel + canvas.width / 2 > 0) if ((body.p[1] - camera.p[1] - canvas.height / 2) / this.zoomLevel + canvas.height / 2 > 0) {
                ctx.beginPath();
                ctx.arc(
                    canvas.width * (1 - this.size) + ((body.p[0] - camera.p[0] - canvas.width / 2) / this.zoomLevel + canvas.width / 2) * this.size,
                    canvas.height * (1 - this.size) + ((body.p[1] - camera.p[1] - canvas.height / 2) / this.zoomLevel + canvas.height / 2) * this.size, 
                    (body.r * this.size) / this.zoomLevel, 0, 2 * Math.PI
                );
                ctx.fillStyle = body.c;
                ctx.fill();
            }
        }
        // Rocket
        ctx.fillStyle = Rocket.c;
        ctx.beginPath();
        ctx.moveTo(
            canvas.width * (1 - this.size / 2) + (1/2) * (Rocket.h * this.rocketSize) * Math.cos(Rocket.rotation), 
            canvas.height * (1 - this.size / 2) - (1/2) * (Rocket.h * this.rocketSize) * Math.sin(Rocket.rotation)
        );
        ctx.lineTo(
            canvas.width * (1 - this.size / 2) + (1/2) * (Rocket.h * this.rocketSize) * Math.cos(Rocket.rotation + (2/3) * Math.PI) - (1/2) * (Rocket.h * this.rocketSize) * Math.cos(Rocket.rotation) / 2, 
            canvas.height * (1 - this.size / 2) - (1/2) * (Rocket.h * this.rocketSize) * Math.sin(Rocket.rotation + (2/3) * Math.PI) + (1/2) * (Rocket.h * this.rocketSize) * Math.sin(Rocket.rotation) / 2
        );
        ctx.lineTo(
            canvas.width * (1 - this.size / 2) + (1/2) * (Rocket.h * this.rocketSize) * Math.cos(Rocket.rotation + (4/3) * Math.PI) - (1/2) * (Rocket.h * this.rocketSize) * Math.cos(Rocket.rotation) / 2, 
            canvas.height * (1 - this.size / 2) - (1/2) * (Rocket.h * this.rocketSize) * Math.sin(Rocket.rotation + (4/3) * Math.PI) + (1/2) * (Rocket.h * this.rocketSize) * Math.sin(Rocket.rotation) / 2
        );
        ctx.fill();

        // Rectangle that indicates play area within vision
        ctx.strokeStyle = "#ffffff";
        ctx.strokeRect(
            canvas.width * (1 - this.size / 2) - canvas.width * (this.size / 2) * (camera.zoomLevel / this.zoomLevel), 
            canvas.height * (1 - this.size / 2) - canvas.height * (this.size / 2) * (camera.zoomLevel / this.zoomLevel), 
            canvas.width * this.size * (camera.zoomLevel / this.zoomLevel), canvas.height * this.size * (camera.zoomLevel / this.zoomLevel)
        );
    }
}


// Stars
var stars = {
    amountPerScreen: 100,
    screens: [],
    generate() {
        // empty list
        this.rectangles = [];
        // divide play area into rectangles
        for (var i = -0.5 * camera.zoomLevels.slice().sort()[camera.zoomLevels.length - 1]; i < playArea[0] / canvas.width + 0.5 * camera.zoomLevels.slice().sort()[camera.zoomLevels.length - 1]; i++) {
            for (var j = -0.5 * camera.zoomLevels.slice().sort()[camera.zoomLevels.length - 1]; j < playArea[0] / canvas.height + 0.5 * camera.zoomLevels.slice().sort()[camera.zoomLevels.length - 1]; j++) {
                this.rectangles.push([i * canvas.width - playArea[0] / 2, j * canvas.height - playArea[1] / 2,[]]);
            }
        }
        // generate stars in rectangles
        for (var k = 0; k < this.rectangles.length; k++) {
            for (var l = 0; l < this.amountPerScreen; l++) {
                this.rectangles[k][2].push([Math.random() * canvas.width, Math.random() * canvas.height])
            }
        }
    },
    draw() {
        for (rectangle of this.rectangles) {
            // check if rectangle is visible to player
            if (rectangle[0] + canvas.width > Rocket.p[0] - camera.zoomLevel * canvas.width / 2 && rectangle[0] < Rocket.p[0] + camera.zoomLevel * canvas.width / 2) {
                if (rectangle[1] + canvas.height > Rocket.p[1] - camera.zoomLevel * canvas.height / 2 && rectangle[1] < Rocket.p[1] + camera.zoomLevel * canvas.height / 2) {
                    // draw stars in visible rectangles
                    for (star of rectangle[2]) {
                        ctx.beginPath();
                        ctx.arc(
                            (rectangle[0] + star[0] - camera.p[0] - canvas.width / 2) / camera.zoomLevel + canvas.width / 2, 
                            (rectangle[1] + star[1] - camera.p[1] - canvas.height / 2) / camera.zoomLevel + canvas.height / 2, 
                            1 / camera.zoomLevel, 0, 2 * Math.PI
                        );
                        ctx.fillStyle = "#ffffff";
                        ctx.fill();
                    }
                } 
            }
        }
    },
    generationTime: 0,
}
var timeStamp = performance.now();
stars.generate();
stars.generationTime = Math.round(performance.now() - timeStamp)


// Log
function log() {
    timeStamp = performance.now();
    console.log(stars.rectangles.length * stars.amountPerScreen + " stars generated in " + stars.generationTime + " milliseconds.")
    console.log("Solar system size is [" + playArea[0] + "x" + playArea[1] + "].");
    console.log(bodies.length + " bodies are in the system.");
}


// Controls
document.addEventListener("keydown",keyPressed);
document.addEventListener("keyup",keyReleased);

var keys = {
    left: false,
    right: false,
    up: false,
    space: false,
    spacePressed: false,
    c: false,
}
function keyPressed(event) {
    if(event.keyCode == 37) {
        keys.left = true;
    }
    if(event.keyCode == 39) {
        keys.right = true;
    }
    if(event.keyCode == 38) {
        keys.up = true;
    }
    if(event.keyCode == 32) {
        keys.space = true;
    }
    if(event.keyCode == 67) {
        keys.c = true;
    }
}
function keyReleased(event) {
    if(event.keyCode == 37) {
        keys.left = false;
    }
    if(event.keyCode == 39) {
        keys.right = false;
    }
    if(event.keyCode == 38) {
        keys.up = false;
    }
    if(event.keyCode == 32) {
        keys.space = false;
        keys.spacePressed = false;
    }
    if(event.keyCode == 67) {
        keys.c = false;
    }
}