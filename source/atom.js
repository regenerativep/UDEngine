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
        if(typeof c !== "undefined")
        {
            this.color = c;
        }
    }
    equals(other)
    {
        if(typeof other === "undefined" || other == null) return false;
        return other.position.x == this.position.x && other.position.y == this.position.y && other.position.z == this.position.z;
    }
}
