var maxRayDepth = 4;
class UDAtom
{
    constructor(engine, x, y, z, c)
    {
        this.position = {
            x: x,
            y: y,
            z: z
        };
        this.filters = [];
        if(typeof c !== "undefined")
        {
            this.filters.push(Filter.SolidColor.create(this, c))
        }
    }
    getColor(ray)
    {
        /*
        if(ray.depth > maxRayDepth)
        {
            if(this.filters.length > 0 && this.filters[0] == Filter.SolidColor)
            {
                return this.filters[0].pass(ray, null, this);
            }
        }*/
        var color = null;
        for(var i = 0; i < this.filters.length; i++)
        {
            color = this.filters[i].pass(ray, color, this);
        }
        return color;
    }
    equals(other)
    {
        if(typeof other === "undefined" || other == null) return false;
        return other.position.x == this.position.x && other.position.y == this.position.y && other.position.z == this.position.z;
    }
}
