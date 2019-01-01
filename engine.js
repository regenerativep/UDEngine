class UDAtom
{
    constructor(x, y, c)
    {
        this.position = {
            x: x,
            y: y
        };
        this.color = c;
    }
}

class UDCamera
{
    constructor(tree)
    {
        this.position = {
            x: 0,
            y: 0
        };
        this.direction = 0; //radians
        this.fov = Math.PI / 2;
        this.tree = tree;
        this.viewDist = 512;
    }
    getPixelArray(width)
    {
        while(this.direction > Math.PI * 2) this.direction -= Math.PI * 2;
        while(this.direction < 0) this.direction += Math.PI * 2;
        var halfFov = this.fov / 2;
        var startingDir = this.direction - halfFov;
        var pixArr = [];
        for(var i = 0; i < width; i++)
        {
            var rayDir = startingDir + ((this.fov * i) / width);
            var rayVec = {
                x: this.position.x + (Math.cos(rayDir) * this.viewDist),
                y: this.position.y + (Math.sin(rayDir) * this.viewDist)
            };
            var color = this.tree.fireRayCast(this.position, rayVec);
            pixArr.push(color);
        }
        return pixArr;
    }
}
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
var defaultSize = { x: 256, y: 256 };
class UDEngine
{
    constructor(canvasContainer)
    {
        this.tree = new UDTree(0, 0, defaultSize.x, defaultSize.y);
        this.camera = new UDCamera(this.tree);

        this.resetColor = "#DDDDDD";
        this.canvas = document.createElement("canvas");
        canvasContainer.appendChild(this.canvas);
    }
    update()
    {
        var rectlist = [];
        var treeList = this.tree.getAllChildren();
        for(var i = 0; i < treeList.length; i++)
        {
            var node = treeList[i];
            rectlist.push({
                position: {
                    x: node.position.x,
                    y: node.position.y
                },
                size: {
                    x: node.size.x,
                    y: node.size.y
                },
                color: node.getColor()
            });
        }
        for(var i = 0; i < rectlist.length; i++)
        {
            var r = rectlist[i];
            rect(this.ctx, r.position.x, r.position.y, r.position.x + r.size.x, r.position.y + r.size.y, ""/*new UDColor(0, 0, 0)*/, r.color);
        }
        this.drawCamera(512, 32, { x: 0, y: 288 });
    }
    drawCamera(width, height, offset)
    {
        var pixels = this.camera.getPixelArray(width);
        for(var i = 0; i < pixels.length; i++)
        {
            var col = pixels[i];
            rect(this.ctx, offset.x + i, offset.y, offset.x + i + 1, offset.y + height, "", col);
        }
    }
    setSize(width, height)
    {
        this.width = width;
        this.height = height;
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = this.canvas.getContext("2d");
        this.ctx.fillStyle = this.resetColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function rect(ctx, x1, y1, x2, y2, outlineColor, fillColor) //todo allow filling?
{
    ctx.beginPath();
    var inCol = getHexColor(fillColor);
    ctx.fillStyle = inCol;
    ctx.rect(x1, y1, (x2 - x1), (y2 - y1));
    ctx.fill();
    /*if(outCol != "")
    {
        ctx.beginPath();
        var outCol = getHexColor(outlineColor);
        ctx.strokeStyle = outCol;
        ctx.rect(x1, y1, (x2 - x1), (y2 - y1));
        ctx.stroke();
    }*/
}
function line(ctx, x1, y1, x2, y2, color)
{
    var col = getHexColor(color);
    ctx.strokeStyle = col;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function getHexColor(color)
{
    if(color.constructor.name === "UDColor")
    {
        return color.getHex();
    }
    return color;
}
class UDTree
{
    constructor(x, y, w, h, p)
    {
        this.children = null;
        this.contents = [];
        this.size = {
            x: w,
            y: h
        };
        this.position = {
            x: x,
            y: y
        };
        this.parent = p;
        this.updateColor = false;
        this.color = new UDColor(0, 0, 0);
    }
    addItem(item)
    {
        this.updateColor = true;
        if(this.children == null)
        {
            this.contents.push(item);
        }
        else
        {
            var side = inWhichSide(this.position, this.size, item.position);
            this.children[side].addItem(item);
        }
    }
    getAllChildren()
    {
        if(this.children != null)
        {
            var children = [];
            for(var i = 0; i < this.children.length; i++)
            {
                children.push(...this.children[i].getAllChildren());
            }
            return children;
        }
        else
        {
            return [this];
        }
    }
    split()
    {
        this.children = [];
        var sx = this.size.x / 2, sy = this.size.y / 2;
        this.children.push(new UDTree(this.position.x, this.position.y, sx, sy, this));
        this.children.push(new UDTree(this.position.x + sx, this.position.y, sx, sy, this));
        this.children.push(new UDTree(this.position.x, this.position.y + sy, sx, sy, this));
        this.children.push(new UDTree(this.position.x + sx, this.position.y + sy, sx, sy, this));
        for(var i = 0; i < this.contents.length; i++)
        {
            this.addItem(this.contents[i]);
        }
        this.contents = null;
    }
    getColor()
    {
        if(this.updateColor)
        {
            if(this.children != null)
            {
                var cols = [];
                for(var i = 0; i < this.children.length; i++)
                {
                    var col = this.children[i].getColor();
                    cols.push(col);
                }
                this.color = averageOfColors(cols);
            }
            else
            {
                if(this.contents.length == 0)
                {
                    this.color = new UDColor(0, 0, 0);
                }
                else
                {
                    var cols = [];
                    for(var i = 0; i < this.contents.length; i++)
                    {
                        var col = this.contents[i].color;
                        cols.push(col);
                    }
                    this.color = averageOfColors(cols);
                }
            }
            this.updateColor = false;
        }
        return this.color;
    }
    fireRayCast(from, to)
    {
        if(this.children != null)
        {
            var side = inWhichSide(this.position, this.size, from);
            var order = getOrder(side);
            for(var i = 0; i < order.length; i++)
            {
                var child = this.children[order[i]];
                var secondPos = {
                    x: child.position.x + child.size.x,
                    y: child.position.y + child.size.y
                };
                if(lineIntersectsRectangle(from, to, child.position, secondPos))
                {
                    //we collided, stop checking
                    return child.fireRayCast(from, to);
                }
            }
            return new UDColor(0,0,0);
        }
        return this.getColor();
    }
}
function inWhichSide(pos, size, loc)
{
    var side = 0;
    if(loc.x > pos.x + (size.x / 2))
    {
        side = side | 1;
    }
    if(loc.y > pos.y + (size.y / 2))
    {
        side = side | 2;
    }
    return side;
}
var rayCheckOrders = [[0, 1, 2, 3], [1, 0, 3, 2], [2, 0, 3, 1], [3, 1, 2, 0]];
function getOrder(side)
{
    //todo do something more complicated here idk
    return rayCheckOrders[side];
}
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
        {
            a: ra,
            b: {
                x: rb.x,
                y: ra.y
            }
        },
        {
            a: {
                x: ra.x,
                y: rb.y
            },
            b: rb
        },
        {
            a: ra,
            b: {
                x: ra.x,
                y: rb.y
            }
        },
        {
            a: {
                x: ra.x,
                y: rb.y
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
