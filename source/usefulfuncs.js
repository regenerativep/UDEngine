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

 //https://jsperf.com/hsl-to-rgb
function gg_hsl2rgb(hsl) {
    var h = hsl[0] / 256, //edited to have / 256
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
   

//http://jsfiddle.net/justin_c_rounds/Gd2S2/light/
//find out if two lines intersect, and if they do, where
function checkLineIntersection(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
    // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
    var denominator, a, b, numerator1, numerator2, result = {
        x: null,
        y: null,
        onLine1: false,
        onLine2: false
    };
    denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
    if (denominator == 0) {
        return result;
    }
    a = line1StartY - line2StartY;
    b = line1StartX - line2StartX;
    numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
    numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
    a = numerator1 / denominator;
    b = numerator2 / denominator;

    // if we cast these lines infinitely in both directions, they intersect here:
    result.x = line1StartX + (a * (line1EndX - line1StartX));
    result.y = line1StartY + (a * (line1EndY - line1StartY));
/*
        // it is worth noting that this should be the same as:
        x = line2StartX + (b * (line2EndX - line2StartX));
        y = line2StartX + (b * (line2EndY - line2StartY));
        */
    // if line1 is a segment and line2 is infinite, they intersect if:
    if (a > 0 && a < 1) {
        result.onLine1 = true;
    }
    // if line2 is a segment and line1 is infinite, they intersect if:
    if (b > 0 && b < 1) {
        result.onLine2 = true;
    }
    // if line1 and line2 are segments, they intersect if both of the above are true
    return result;
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

function lineIntersectsRectangle(la, lb, ra, rb)
{
    var lines = [
        { //top
            a: ra,
            b: {
                x: rb.x,
                y: ra.y
            }
        },
        { //bottom
            a: {
                x: ra.x,
                y: rb.y
            },
            b: rb
        },
        { //left
            a: ra,
            b: {
                x: ra.x,
                y: rb.y
            }
        },
        { //right
            a: {
                x: rb.x,
                y: ra.y
            },
            b: {
                x: rb.x,
                y: rb.y
            }
        }
    ];
    for(var i = 0; i < lines.length; i++)
    {
        var line = lines[i];
        var result = checkLineIntersection(line.a.x, line.a.y, line.b.x, line.b.y, la.x, la.y, lb.x, lb.y);
        if(result.onLine1 && result.onLine2)
        {
            //we have collision
            return true;
        }
    }
    return false;
}
function p(x, y) //makes things a little bit quicker to type in console and such
{
    return {
        x: x,
        y: y
    };
}