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
        let rayVec = {
            x: Math.cos(startingDir),
            y: Math.sin(startingDir)
        };
        let directionStepDifference = this.fov / width;
        let rotationVec = {
            s: Math.sin(directionStepDifference),
            c: Math.cos(directionStepDifference)
        };
        var pixArr = [];
        var sw = new Stopwatch();
        let fps_sw = new Stopwatch();
        var elapsedTimes = [];
        fps_sw.start();
        for(var i = 0; i < width; i++)
        {
            //https://en.wikipedia.org/wiki/Rotation_matrix#In_two_dimensions so we don't have to recalculate cos and sin functions for every pixel
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
            rayVec = {
                x: (rayVec.x * rotationVec.c) - (rayVec.y * rotationVec.s),
                y: (rayVec.x * rotationVec.s) + (rayVec.y * rotationVec.c)
            };
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
    draw(width, height, offset)
    {
        var pixels = this.getPixelArray(width);
        for(var i = 0; i < pixels.length; i++)
        {
            var col = pixels[i];
            if(typeof col !== "undefined" && col != null)
            {
                line(this.engine.ctx, offset.x + i, offset.y, offset.x + i, offset.y + height, col);
            }
        }
    }
}