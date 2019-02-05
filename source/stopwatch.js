class Stopwatch
{
    constructor()
    {
        this.microseconds = 0;
    }
    start()
    {
        this.microseconds = window.performance.now();
    }
    stop()
    {
        return window.performance.now() - this.microseconds;
    }
}