class UDCamera
{
    constructor(engine)
    {
        this.position = {
            x: 0,
            y: 0
        };
        this.engine = engine;
        this.direction = 0; //radians
        this.fov = Math.PI / 2;
        this.viewDist = 512;
    }
    getPixelArray(width)
    {
        while(this.direction > Math.PI * 2) this.direction -= Math.PI * 2;
        while(this.direction < 0) this.direction += Math.PI * 2;
        var halfFov = this.fov / 2;
        var startingDir = this.direction - halfFov;
        var pixArr = [];
        var sw = new Stopwatch();
        let fps_sw = new Stopwatch();
        var elapsedTimes = [];
        fps_sw.start();
        for(var i = 0; i < width; i++)
        {
            var rayDir = startingDir + ((this.fov * i) / width);
            var rayVec = {
                x: this.position.x + (Math.cos(rayDir) * this.viewDist),
                y: this.position.y + (Math.sin(rayDir) * this.viewDist)
            };
            let ray = new UDRay(this.position, rayVec, this.engine);
            sw.start();
            var atom = this.engine.fireRayCast(ray);
            var elapsed = sw.stop();
            elapsedTimes.push(elapsed);
            var color;
            if(atom == null)
            {
                color = this.engine.getBackgroundColor(ray);
            }
            else
            {
                color = atom.getColor(ray);
            }
            pixArr.push(color);
        }
        var max = 0, avg = 0;
        for(var i in elapsedTimes)
        {
            let time = elapsedTimes[i];
            avg += time;
            if(max < time)
            {
                max = time;
            }
        }
        avg /= elapsedTimes.length;
        console.log("pixel max: " + max + "\npixel avg: " + avg + "\nframe: " + fps_sw.stop());
        return pixArr;
    }
}