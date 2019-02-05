class UDAtom
{
    constructor(engine, x, y, c)
    {
        this.position = {
            x: x,
            y: y
        };
        this.filters = [];
        if(typeof c !== "undefined")
        {
            this.filters.push(Filter.SolidColor.create(this, c))
        }
    }
    getColor(a, b, engine)
    {
        var color = null;
        for(var i = 0; i < this.filters.length; i++)
        {
            color = this.filters[i].pass(engine, a, b, color, this);
        }
        return color;
    }
}
