class UDRay
{
    constructor(origin, unitvec, engine)
    {
        this.depth = 0;
        this.from = origin;
        this.unit = unitvec;
        this.engine = engine;
        this.exclude = [];
    }
}