class UDColor
{
    /*
        h - hue (0 - 359)
        s - saturation (0 - 255)
        l - lightness (0 - 255)
    */
    constructor(h, s, l)
    {
        this.hue = h % 360;
        this.saturation = s % 256;
        this.lightness = l % 256;
        while(this.hue < 0) this.hue += 360;
        while(this.saturation < 0) this.saturation += 256;
        while(this.lightness < 0) this.lightness += 256;
    }
    getHex()
    {
        return hslToHex1(this.hue, this.saturation, this.lightness);
    }
    getRgb(getObj)
    {
        let rgbCol = gg_hsl2rgb([this.hue, this.saturation, this.lightness]);
        if(typeof getObj === "boolean" && getObj)
        {
            return {
                r: Math.floor(rgbCol[0] * 255),
                g: Math.floor(rgbCol[1] * 255),
                b: Math.floor(rgbCol[2] * 255)
            };
        }
        return "rgb(" + rgbCol[0] * 255 + "," + rgbCol[1] * 255 + "," + rgbCol[2] * 255 + ")";
    }
    getHsl()
    {
        return "hsl(" + this.hue + "," + (this.saturation / 2.56) + "%," + (this.lightness / 2.56) + "%)";
    }
}
function averageOfColors(colorList) //this uh, might be very slow for calculating this, but this is what we have for now
{
    var hueX = 0, hueY = 0, sat = 0, lit = 0;
    for(var i = 0; i < colorList.length; i++)
    {
        var col = colorList[i];
        var hueAngle = (col.hue * 2 * Math.PI) / 360; //radians
        hueX += Math.cos(hueAngle);
        hueY += Math.sin(hueAngle);
        sat += col.saturation;
        lit += col.lightness;
    }
    var hueAngle = Math.atan2(hueY, hueX); //radians
    var hue = (hueAngle * 360) / (2 * Math.PI);
    sat /= colorList.length;
    lit /= colorList.length;
    return new UDColor(hue, sat, lit);
}
function weightedAverageOfColors(colorList, weights)
{
    var hueX = 0, hueY = 0, sat = 0, lit = 0;
    for(var i = 0; i < colorList.length; i++)
    {
        var col = colorList[i];
        var hueAngle = (col.hue * 2 * Math.PI) / 360; //radians
        var weight = weights[i];
        hueX += Math.cos(hueAngle) * weight;
        hueY += Math.sin(hueAngle) * weight;
        sat += col.saturation * weight;
        lit += col.lightness * weight;
    }
    var hueAngle = Math.atan2(hueY, hueX); //radians
    var hue = (hueAngle * 360) / (2 * Math.PI);
    var weightSum = 0;
    for(var i in weights)
    {
        weightSum += weights[i];
    }
    sat /= weightSum;
    lit /= weightSum;
    return new UDColor(hue, sat, lit);
}
function colorEquals(a, b)
{
    if(typeof a === "undefined" || typeof b === "undefined")
    {
        return false;
    }
    return a.hue == b.hue && a.saturation == b.saturation && a.lightness == b.lightness;
}