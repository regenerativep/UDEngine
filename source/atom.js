class UDAtom
{
    constructor(x, y, c)
    {
        this.position = {
            x: x,
            y: y
        };
        this.color = c;
    }
    getColor()
    {
        return this.color;
        //todo filters
    }
}
