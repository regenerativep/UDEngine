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