class UDRay
{
    constructor(origin, unitvec, engine)
    {
        this.from = origin;
        this.unit = unitvec;
        this.engine = engine;
        this.exclude = [];
    }
}