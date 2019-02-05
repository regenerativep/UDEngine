class UDCamera
{
    constructor(tree)
    {
        this.position = {
            x: 0,
            y: 0
        };
        this.direction = 0; //radians
        this.fov = Math.PI / 2;
        this.tree = tree;
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
        var elapsedTimes = [];
        for(var i = 0; i < width; i++)
        {
            var rayDir = startingDir + ((this.fov * i) / width);
            var rayVec = {
                x: this.position.x + (Math.cos(rayDir) * this.viewDist),
                y: this.position.y + (Math.sin(rayDir) * this.viewDist)
            };
            sw.start();
            var atom = this.tree.fireRayCast(this.position, rayVec);
            var elapsed = sw.stop();
            elapsedTimes.push(elapsed);
            var color;
            if(atom == null)
            {
                color = this.tree.engine.getBackgroundColor(this.position, rayVec);
                //todo make a ray object
            }
            else
            {
                color = atom.getColor(this.position, rayVec, this.tree.engine);
            }
            pixArr.push(color);
        }
        /*
        var avg = 0;
        for(var i = 0; i < elapsedTimes.length; i++)
        {
            avg += elapsedTimes[i];
        }
        avg /= elapsedTimes.length;
        console.log(avg);*/
        var max = 0;
        for(var i in elapsedTimes)
        {
            if(max < elapsedTimes[i])
            {
                max = elapsedTimes[i];
            }
        }
        console.log(max);
        return pixArr;
    }
}