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
        this.defaultColor = new UDColor(0, 0, 0);
    }
    getPixelArray(width)
    {
        while(this.direction > Math.PI * 2) this.direction -= Math.PI * 2;
        while(this.direction < 0) this.direction += Math.PI * 2;
        var halfFov = this.fov / 2;
        var startingDir = this.direction - halfFov;
        var pixArr = [];
        for(var i = 0; i < width; i++)
        {
            var rayDir = startingDir + ((this.fov * i) / width);
            var rayVec = {
                x: this.position.x + (Math.cos(rayDir) * this.viewDist),
                y: this.position.y + (Math.sin(rayDir) * this.viewDist)
            };
            var atom = this.tree.fireRayCast(this.position, rayVec);
            var color;
            if(atom == null)
            {
                color = this.defaultColor;
            }
            else
            {
                color = atom.getColor();
            }
            pixArr.push(color);
        }
        return pixArr;
    }
}