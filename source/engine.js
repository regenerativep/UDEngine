var defaultSize = { x: 256, y: 256 };
class UDEngine
{
    constructor(canvasContainer)
    {
        this.tree = new UDTree(0, 0, defaultSize.x, defaultSize.y);
        //this.tree.filters.push(Filter.AverageColor);
        this.camera = new UDCamera(this.tree);

        this.resetColor = "#DDDDDD";
        this.canvas = document.createElement("canvas");
        canvasContainer.appendChild(this.canvas);
    }
    update()
    {
        rect(this.ctx, 0, 0, this.width, this.height, "", "#FFFFFF");
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
                color: node.hasContents() ? node.contents[0].getColor() : null
            });
        }
        for(var i = 0; i < rectlist.length; i++)
        {
            var r = rectlist[i];
            if(r.color != null)
            {
                rect(this.ctx, r.position.x, r.position.y, r.position.x + r.size.x, r.position.y + r.size.y, "", r.color);
            }
        }
        var visualCamRadius = 4, visualCamDirLength = 16;
        rect(this.ctx, this.camera.position.x - visualCamRadius, this.camera.position.y - visualCamRadius, this.camera.position.x + visualCamRadius, this.camera.position.y + visualCamRadius, "", "#000000");
        line(this.ctx, this.camera.position.x, this.camera.position.y, this.camera.position.x + (Math.cos(this.camera.direction) * visualCamDirLength), this.camera.position.y + (Math.sin(this.camera.direction) * visualCamDirLength), "#0000FF");
        line(this.ctx, this.camera.position.x, this.camera.position.y, this.camera.position.x + (Math.cos(this.camera.direction + (this.camera.fov / 2)) * this.camera.viewDist), this.camera.position.y + (Math.sin(this.camera.direction + (this.camera.fov / 2)) * this.camera.viewDist), "#0000FF");
        line(this.ctx, this.camera.position.x, this.camera.position.y, this.camera.position.x + (Math.cos(this.camera.direction - (this.camera.fov / 2)) * this.camera.viewDist), this.camera.position.y + (Math.sin(this.camera.direction - (this.camera.fov / 2)) * this.camera.viewDist), "#0000FF");
        this.drawCamera(512, 32, { x: 0, y: 480 });
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
    x1 = Math.floor(x1);
    y1 = Math.floor(y1);
    x2 = Math.floor(x2);
    y2 = Math.floor(y2);
    ctx.beginPath();
    ctx.fillStyle = getUsableColor(fillColor);
    ctx.rect(x1, y1, (x2 - x1), (y2 - y1));
    ctx.fill();
}
function line(ctx, x1, y1, x2, y2, color)
{
    var lastStroke = ctx.strokeStyle;
    x1 = Math.floor(x1);
    y1 = Math.floor(y1);
    x2 = Math.floor(x2);
    y2 = Math.floor(y2);
    var col = getUsableColor(color);
    ctx.strokeStyle = col;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.strokeStyle = lastStroke;
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
    if(color.constructor.name === "UDColor")
    {
        return color.getHsl();
    }
    return color;
}