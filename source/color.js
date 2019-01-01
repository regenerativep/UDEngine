class UDColor
{
    constructor(h, s, l)
    {
        this.hue = h % 256;
        this.saturation = s % 256;
        this.lightness = l % 256;
        while(this.hue < 0) this.hue += 256;
        while(this.saturation < 0) this.saturation += 256;
        while(this.lightness < 0) this.lightness += 256;
    }
    getHex()
    {
        return hslToHex1(this.hue, this.saturation, this.lightness);
    }
}
function averageOfColors(colorList) //this uh, might be very slow for calculating this, but this is what we have for now
{
    var hueX = 0, hueY = 0, sat = 0, lit = 0;
    for(var i = 0; i < colorList.length; i++)
    {
        var col = colorList[i];
        var hueAngle = (col.hue * 2 * Math.PI) / 256; //radians
        hueX += Math.cos(hueAngle);
        hueY += Math.sin(hueAngle);
        sat += col.saturation;
        lit += col.lightness;
    }
    var hueAngle = Math.atan2(hueY, hueX); //radians
    var hue = (hueAngle * 256) / (2 * Math.PI);
    sat /= colorList.length;
    lit /= colorList.length;
    var col = new UDColor(hue, sat, lit);
    return col;
}
function colorEquals(a, b)
{
    if(typeof a === "undefined" || typeof b === "undefined")
    {
        return false;
    }
    return a.hue == b.hue && a.saturation == b.saturation && a.lightness == b.lightness;
}