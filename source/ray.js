class UDRay
{
    constructor(origin, unitvec, maxdist, engine)
    {
        this.from = origin;
        this.unit = unitvec;
        this.engine = engine;
        this.exclude = [];
        this.maxdist = maxdist;
    }
}