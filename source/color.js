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
    getRgb()
    {
        var rgbCol = gg_hsl2rgb(this.hue / 360, this.saturation / 256, this.lightness / 256);
        return {
            r: Math.floor(rgbCol[0] * 255),
            g: Math.floor(rgbCol[1] * 255),
            b: Math.floor(rgbCol[2] * 255)
        };
    }
    getRgbCss()
    {
        var rgbCol = gg_hsl2rgb(this.hue, this.saturation / 256, this.lightness / 256);
        return "rgb(" + rgbCol[0] * 255 + "," + rgbCol[1] * 255 + "," + rgbCol[2] * 255 + ")";
    }
    getHsl()
    {
        return "hsl(" + this.hue + "," + (this.saturation / 2.56) + "%," + (this.lightness / 2.56) + "%)";
    }
}
function getHexColor(color)
{
    if(color.constructor.name === "UDColor")
    {
        return color.getHex();
    }
    return color;
}
function getUsableColor(color)
{
    if(typeof color !== "undefined" && color != null)
    {
        if(color.constructor.name === "UDColor")
        {
            return color.getHsl();
        }
    }
    return color;
}