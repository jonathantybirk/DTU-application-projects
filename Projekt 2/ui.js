class UI {
    static convert() {
        this.rocketRotation = Math.round((90 - 180 * Rocket.rotation / Math.PI));     
        if (this.rocketRotation < 0) this.rocketRotation += 360;
        if (this.rocketRotation >= 360) this.rocketRotation -= 360;
        this.rocketPosition = [Math.round(Rocket.p[0]), Math.round(-Rocket.p[1])];
        this.rocketVelocity = [Math.round(Rocket.v[0] * 10) / 10,Math.round(-Rocket.v[1] * 10) / 10];
        this.rocketPower = Math.round(Rocket.power * 1000);
        this.rocketMaxPower = 100;
        this.cameraZoomLevel = Math.round(camera.zoomLevel * 10) / 10;
    }
    static update() {
        this.var1 = "Rotation: [" + this.rocketRotation + " degrees]";
        this.var2 = "Position: [" + this.rocketPosition[0] + ", " + this.rocketPosition[1] + "]";
        this.var3 = "Velocity: [" + this.rocketVelocity[0] + ", " + this.rocketVelocity[1] + "]";
        this.var4 = "Power: [" + this.rocketPower + " out of " + this.rocketMaxPower + "]";
        this.var5 = "Zoom: [x" + this.cameraZoomLevel + "]";
        if (keys.c) this.var6 = "Simulation by Jonathan Tybirk :)"; else this.var6 = "";
    }
    static draw() {
        document.getElementById("var1").innerHTML = this.var1;
        document.getElementById("var2").innerHTML = this.var2;
        document.getElementById("var3").innerHTML = this.var3;
        document.getElementById("var4").innerHTML = this.var4;
        document.getElementById("var5").innerHTML = this.var5;
        document.getElementById("var6").innerHTML = this.var6;
    }
}