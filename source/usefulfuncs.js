//https://jsperf.com/hsl-to-hex
function hslToHex1(h, s, l) {
    h /= 256;
    s /= 256;
    l /= 256;
    var r, g, b;
    var v, min, sv, sextant, fract, vsf;
    
    if (l <= 0.5) {
        v = l * (1 + s);
    } else {
        v = l + s - l * s;
    }
    
    if (v === 0) {
        return '#000';
    } else {
        min = 2 * l - v;
        sv = (v - min) / v;
        h = 6 * h;
        sextant = Math.floor(h);
        fract = h - sextant;
        vsf = v * sv * fract;
        if (sextant === 0 || sextant === 6) {
            r = v;
            g = min + vsf;
            b = min;
        } else if (sextant === 1) {
            r = v - vsf;
            g = v;
            b = min;
        } else if (sextant === 2) {
            r = min;
            g = v;
            b = min + vsf;
        } else if (sextant === 3) {
            r = min;
            g = v - vsf;
            b = v;
        } else if (sextant === 4) {
            r = min + vsf;
            g = min;
            b = v;
        } else {
            r = v;
            g = min;
            b = v - vsf;
        }
        return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }
}
    
function componentToHex(c) {
    c = Math.round(c * 256).toString(16);
    return c.length === 1 ? "0" + c : c;
}
    
function hslToHex2(h, s, l) {
    h /= 256;
    s /= 256;
    l /= 256;
    var r, g, b;
    
    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
    
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    
    return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function hue2rgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
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
 //https://jsperf.com/hsl-to-rgb
function gg_hsl2rgb(hsl) {
    var h = hsl[0] / 360,
        s = hsl[1] / 256,
        l = hsl[2] / 256;
    var v, min, sv, sextant, fract, vsf;
   
    if (l <= 0.5) v = l * (1 + s);
    else v = l + s - l * s;
   
    if (v === 0) return [0, 0, 0];
    else {
     min = 2 * l - v;
     sv = (v - min) / v;
     h = 6 * h;
     sextant = Math.floor(h);
     fract = h - sextant;
     vsf = v * sv * fract;
     if (sextant === 0 || sextant === 6) return [v, min + vsf, min];
     else if (sextant === 1) return [v - vsf, v, min];
     else if (sextant === 2) return [min, v, min + vsf];
     else if (sextant === 3) return [min, v - vsf, v];
     else if (sextant === 4) return [min + vsf, min, v];
     else return [v, min, v - vsf];
    }
   }
//https://stackoverflow.com/questions/491738/how-do-you-calculate-the-average-of-a-set-of-circular-data
function averageOfAngles(angleList)
{
    var sum = 0;
    for(var i = 0; i < angleList.length; i++)
    {
        var angle = angleList[i];
        if(angle >= 180)
        {
            angle -= 360;
        }
        sum += angle;
    }
    var mean = sum / angleList.length;
    return (mean < 0) ? mean + 360 : mean;
}
function pointInRectangle(p, ra, rb)
{
    return p.x > ra.x && p.x < rb.x && p.y > ra.y && p.y < rb.y;
}
//https://gamedev.stackexchange.com/a/18459
function rayAABBIntersection(lb, rt, ray)
{
    var dfx = 1 / ray.unit.x;
    var dfy = 1 / ray.unit.y;
    var dfz = 1 / ray.unit.z;
    var t1 = (lb.x - ray.from.x) * dfx;
    var t2 = (rt.x - ray.from.x) * dfx;
    var t3 = (lb.y - ray.from.y) * dfy;
    var t4 = (rt.y - ray.from.y) * dfy;
    var t5 = (lb.z - ray.from.z) * dfz;
    var t6 = (rt.z - ray.from.z) * dfz;
    var temp;
    if(t1 > t2)
    {
        temp = t1;
        t1 = t2;
        t2 = temp;
    }
    if(t3 > t4)
    {
        temp = t3;
        t3 = t4;
        t4 = temp;
    }
    if(t5 > t6)
    {
        temp = t5;
        t5 = t6;
        t6 = temp;
    }
    var tmin, tmax;
    if(t1 > t3)
    {
        if(t1 > t5)
        {
            tmin = t1;
        }
        else
        {
            tmin = t5;
        }
    }
    else
    {
        if(t3 > t5)
        {
            tmin = t3;
        }
        else
        {
            tmin = t5;
        }
    }
    if(t2 > t4)
    {
        if(t4 > t6)
        {
            tmax = t6;
        }
        else
        {
            tmax = t4;
        }
    }
    else
    {
        if(t2 > t6)
        {
            tmax = t6;
        }
        else
        {
            tmax = t2;
        }
    }
    if(tmax < 0 || tmin > tmax)
    {
        //dist to intersection is tmax
        return false;
    }
    //dist to intersection is tmin
    return true;
}
function getRotationVector(theta)
{
    return {
        c: Math.cos(theta),
        s: Math.sin(theta)
    };
}
function copyVector(vector)
{
    return {
        x: vector.x,
        y: vector.y,
        z: vector.z
    };
}
function rotateVectorX(vector, rotationVector)
{
    var ny = (vector.y * rotationVector.c) - (vector.z * rotationVector.s);
    var nz = (vector.y * rotationVector.s) + (vector.z * rotationVector.c);
    vector.y = ny;
    vector.z = nz;
}
function rotateVectorY(vector, rotationVector)
{
    var nx = (vector.x * rotationVector.c) + (vector.z * rotationVector.s);
    var nz = (vector.z * rotationVector.c) - (vector.x * rotationVector.s);
    vector.x = nx;
    vector.z = nz;
}
function rotateVectorZ(vector, rotationVector)
{
    var nx = (vector.x * rotationVector.c) - (vector.y * rotationVector.s);
    var ny = (vector.x * rotationVector.s) + (vector.y * rotationVector.c);
    vector.x = nx;
    vector.y = ny;
}