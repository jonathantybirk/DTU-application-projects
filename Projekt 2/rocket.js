class Rocket {
    static {
        this.c = "#ffffff";
        this.h = 10;    //height
        this.m = 0.01;
        this.rotationSpeed = 5;
        this.maxPower = 0.1;
        this.powerIncrease = 0.005;

        this.rotation = (3/2) * Math.PI;
        this.p = [0,-6300];
        this.v = [7,0];

        this.power = 0;

        this.abVector = [];
        this.abVectorLength;
        this.abVectorNormalized = [];
        this.gravitationalForce;
    }
    static doGravity() {
        for (var b = 0; b < bodies.length; b++) {
            // calculate force
            this.abVector = [bodies[b].p[0] - this.p[0], bodies[b].p[1] - this.p[1]];
            this.abVectorLength = (this.abVector[0] ** 2 + this.abVector[1] ** 2) ** (1/2);
            this.abVectorNormalized = [this.abVector[0] / this.abVectorLength, this.abVector[1] / this.abVectorLength];
            this.gravitationalForce = gravitationalConstant * this.m * bodies[b].m / (this.abVector[0] ** 2 + this.abVector[1] ** 2);
    
            // update velocity
            this.v[0] += (this.abVectorNormalized[0] * this.gravitationalForce / this.m) * deltaTime;
            this.v[1] += (this.abVectorNormalized[1] * this.gravitationalForce / this.m) * deltaTime;
        }
    }
    static enforceBorder() {
          // left
        if (this.p[0] < -playArea[0] / 2) {
            this.p[0] = -playArea[0] / 2;
            this.v[0] = 0;
        } // right
        if (this.p[0] > playArea[0] / 2) {
            this.p[0] = playArea[0] / 2;
            this.v[0] = 0;
        } // top
        if (this.p[1] < -playArea[1] / 2) {
            this.p[1] = -playArea[1] / 2;
            this.v[1] = 0;
        } // bottom
        if (this.p[1] > playArea[1] / 2) {
            this.p[1] = playArea[1] / 2;
            this.v[1] = 0;
        }
    }
    static land() {
        for (var b = 0; b < bodies.length; b++) {
            // detect collision
            this.abVector = [bodies[b].p[0] - this.p[0], this.abVector[1] = bodies[b].p[1] - this.p[1]];
            this.abVectorLength = (this.abVector[0] ** 2 + this.abVector[1] ** 2) ** (1/2);
            this.abVectorNormalized = [this.abVector[0] / this.abVectorLength, this.abVector[1] / this.abVectorLength];
            if (this.abVectorLength <= bodies[b].r + this.h / 2) {
                // match position, velocity, rotation to planet
                this.p = [
                    bodies[b].p[0] - this.abVectorNormalized[0] * (bodies[b].r + this.h / 2), 
                    bodies[b].p[1] - this.abVectorNormalized[1] * (bodies[b].r + this.h / 2)
                ];
                this.v[0] = bodies[b].v[0];
                this.v[1] = bodies[b].v[1];
                this.rotation = (Math.atan2(this.abVectorNormalized[1], -this.abVectorNormalized[0]));
            }
        }
    }
    static control() {
        // Rotation
        if (keys.left && keys.right) ;
        else if (keys.left) {
            this.rotation += (this.rotationSpeed * deltaTime * (Math.PI/180));
            if (this.rotation >= 2 * Math.PI) this.rotation -= 2 * Math.PI;
        }
        else if (keys.right) {
            this.rotation -= this.rotationSpeed * deltaTime * (Math.PI/180);
            if (this.rotation < 0) this.rotation += 2 * Math.PI;
        }
        // snap to 5 degrees
        else this.rotation = Math.round(this.rotation / (Math.PI / (180 / this.rotationSpeed))) * (Math.PI / (180 / this.rotationSpeed));
        // Acceleration
        if (keys.up) {
            if (this.power < this.maxPower) this.power += this.powerIncrease * deltaTime;
            else this.power = this.maxPower;
        }
        else this.power = 0;

        // update velocity
        this.v[0] += 2 * this.power * Math.cos(this.rotation) * deltaTime;
        this.v[1] -= 2 * this.power * Math.sin(this.rotation) * deltaTime;
    }
    static move() {
        this.p[0] += this.v[0] * deltaTime;
        this.p[1] += this.v[1] * deltaTime;
    }
    static draw() {
        // Rocket
        ctx.fillStyle = this.c;
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2 + (1/2) * (this.h / camera.zoomLevel) * Math.cos(this.rotation), canvas.height / 2 - (1/2) * (this.h / camera.zoomLevel) * Math.sin(this.rotation));
        ctx.lineTo(canvas.width / 2 + (1/2) * (this.h / camera.zoomLevel) * Math.cos(this.rotation + (2/3) * Math.PI) - (1/2) * (this.h / camera.zoomLevel) * Math.cos(this.rotation) / 2, canvas.height / 2 - (1/2) * (this.h / camera.zoomLevel) * Math.sin(this.rotation + (2/3) * Math.PI) + (1/2) * (this.h / camera.zoomLevel) * Math.sin(this.rotation) / 2);
        ctx.lineTo(canvas.width / 2 + (1/2) * (this.h / camera.zoomLevel) * Math.cos(this.rotation + (4/3) * Math.PI) - (1/2) * (this.h / camera.zoomLevel) * Math.cos(this.rotation) / 2, canvas.height / 2 - (1/2) * (this.h / camera.zoomLevel) * Math.sin(this.rotation + (4/3) * Math.PI) + (1/2) * (this.h / camera.zoomLevel) * Math.sin(this.rotation) / 2);
        ctx.fill();

        // Rocket flame
        if (this.power > 0) {
            ctx.fillStyle = "rgba(255," + (Math.random() * 100) + ",0," + (0.75 + 0.25 * this.power / this.maxPower) + ")";
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2 + (1/2) * ((-1.5 - 10*this.power) * (this.h / camera.zoomLevel)) * Math.cos(this.rotation), canvas.height / 2 + (1/2) * ((1.5 + 10 * this.power) * (this.h / camera.zoomLevel)) * Math.sin(this.rotation));
            ctx.lineTo(canvas.width / 2 + (1/2) * (this.h / camera.zoomLevel) * Math.cos(this.rotation + (2/3) * Math.PI) - (1/2) * (this.h / camera.zoomLevel) * Math.cos(this.rotation) / 2, canvas.height / 2 - (1/2) * (this.h / camera.zoomLevel) * Math.sin(this.rotation + (2/3) * Math.PI) + (1/2) * (this.h / camera.zoomLevel) * Math.sin(this.rotation) / 2);
            ctx.lineTo(canvas.width / 2 + (1/2) * (this.h / camera.zoomLevel) * Math.cos(this.rotation + (4/3) * Math.PI) - (1/2) * (this.h / camera.zoomLevel) * Math.cos(this.rotation) / 2, canvas.height / 2 - (1/2) * (this.h / camera.zoomLevel) * Math.sin(this.rotation + (4/3) * Math.PI) + (1/2) * (this.h / camera.zoomLevel) * Math.sin(this.rotation) / 2);
            ctx.fill();
        }
    }
}