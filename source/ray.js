class UDRay
{
    constructor(a, b, engine)
    {
        this.depth = 0;
        this.from = a;
        this.to = b;
        this.engine = engine;
        this.exclude = [];
    }
}