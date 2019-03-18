var defaultSize = { x: 256, y: 256 };
class UDEngine
{
    constructor(width, height, length)
    {
        if(typeof width !== "number" || typeof height !== "number")
        {
            width = defaultSize.x;
            height = defaultSize.y;
        }
        this.width = width;
        this.height = height;
        this.length = length;
        this.maxLeafSize = 4;
        this.deepestDepth = 0;
        this.maximumPasses = 4;
        this.nodeList = [];
        this.depthList = [ { x: width, y: height, z: length } ];
        this.createNode(0, 0, 0, this.depthList[0], 0);
        this.resetColor = "#DDDDDD";
        this.backgroundColor = new UDColor(0, 0, 0);
    }
    getAllChildren(node, depth) //don't run this a lot. really slow
    {
        if(typeof depth !== "number")
        {
            depth = 0;
        }
        if(node.children == null)
        {
            return [ { depth: depth, node: node } ];
        }
        var childList = [];
        for(var i in node.children)
        {
            childList.push(...this.getAllChildren(node.children[i], depth + 1));
        }
        return childList;
    }
    createNode(x, y, z, size, depth)
    {
        var node = {
            x: x,
            y: y,
            z: z,
            atom: null,
            children: null,
            secondPos: {
                x: x + size.x,
                y: y + size.y,
                z: z + size.z
            },
            depth: depth
        };
        this.nodeList.push(node);
        return node;
    }
    split(node, depth) //depth should be the depth of the given node
    {
        var nextDepth = depth + 1;
        this.updateDepthList(nextDepth);
        var sze = this.depthList[nextDepth];
        node.children = [];
        node.children.push(this.createNode(node.x, node.y, node.z, sze, nextDepth));
        node.children.push(this.createNode(node.x + sze.x, node.y, node.z, sze, nextDepth));
        node.children.push(this.createNode(node.x, node.y + sze.y, node.z, sze, nextDepth));
        node.children.push(this.createNode(node.x + sze.x, node.y + sze.y, node.z, sze, nextDepth));
        node.children.push(this.createNode(node.x, node.y, node.z + sze.z, sze, nextDepth));
        node.children.push(this.createNode(node.x + sze.x, node.y, node.z + sze.z, sze, nextDepth));
        node.children.push(this.createNode(node.x, node.y + sze.y, node.z + sze.z, sze, nextDepth));
        node.children.push(this.createNode(node.x + sze.x, node.y + sze.y, node.z + sze.z, sze, nextDepth));
        if(node.atom != null)
        {
            var side = inWhichSide(node, depth, node.atom.position);
            node.children[side].atom = node.atom;
            node.atom = null;
        }
        if(this.deepestDepth < nextDepth)
        {
            this.deepestDepth = nextDepth;
        }
    }
    addItem(node, item, depth) //warning: infinite loop if item's position == any other item's position
    {
        if(typeof depth !== "number")
        {
            depth = 0;
        }
        if(typeof item === "undefined")
        {
            //we are assuming that we're given the item as the first argument, instead of the node
            item = node;
            node = this.nodeList[0];
        }
        var currentNode = node;
        var lastNode = currentNode;
        do
        {
            lastNode = currentNode;
            if(currentNode.children == null)
            {
                var depthSize = this.depthList[depth];
                if((currentNode.atom != null && currentNode.atom != item) || depthSize.x > this.maxLeafSize || depthSize.y > this.maxLeafSize || depthSize.z > this.maxLeafSize)
                {
                    this.split(currentNode, depth);
                }
                else if(currentNode.atom == null)
                {
                    currentNode.atom = item;
                }
            }
            if(currentNode.children != null)
            {
                var side = inWhichSide(currentNode, this.depthList[depth], item.position);
                currentNode = currentNode.children[side];
                depth++;
            }
        }
        while(lastNode.children != null);
    }
    updateDepthList(depth)
    {
        if(this.depthList.length >= depth + 1)
        {
            return;
        }
        for(var i = this.depthList.length; i < depth + 1; i++) //todo hmmm
        {
            var lastDepthSize = this.depthList[i - 1];
            this.depthList.push({
                x: lastDepthSize.x / 2,
                y: lastDepthSize.y / 2,
                z: lastDepthSize.z / 2
            });
        }
    }
    fireRayCast(ray, node)
    {
        ray.depth++;
        var remainingNodes = [ node ];
        while(remainingNodes.length > 0)
        {
            var currentNode = remainingNodes.pop();
            if(currentNode.children != null)
            {
                var order = rayCheckOrders[inWhichSide(currentNode, this.depthList[currentNode.depth], ray.from)];
                var pos = remainingNodes.length;
                for(var j in order)
                {
                    var child = currentNode.children[order[j]];
                    if(rayAABBIntersection(child, child.secondPos, ray)) //warning: secondPos may be useful for now, but i may need to get rid of it for memory in the future
                    {
                        remainingNodes.splice(pos, 0, child);
                    }
                }
            }
            else
            {
                if(currentNode.atom != null)
                {
                    return currentNode.atom;
                }
            }
        }
        return null;
    }
    getBackgroundColor(ray)
    {
        return new UDColor(0, 0, 0); //todo skybox?
    }
}

function rect(ctx, x1, y1, x2, y2, outlineColor, fillColor)
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
    ctx.beginPath();
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
    if(typeof color !== "undefined" && color != null)
    {
        if(color.constructor.name === "UDColor")
        {
            return color.getHsl();
        }
    }
    return color;
}
function inWhichSide(pos, size, loc) //todo: division can be optimized
{
    var side = 0;
    if(loc.x > pos.x + (size.x / 2))
    {
        side |= 1;
    }
    if(loc.y > pos.y + (size.y / 2))
    {
        side |= 2;
    }
    if(loc.z > pos.z + (size.z / 2))
    {
        side |= 4;
    }
    return side;
}
var rayCheckOrders = [
    [0, 1, 2, 4, 3, 5, 6, 7],
    [1, 0, 3, 5, 2, 4, 7, 6],
    [2, 0, 3, 6, 1, 4, 7, 5],
    [3, 1, 2, 7, 0, 5, 6, 4],
    [4, 0, 5, 6, 1, 2, 7, 3],
    [5, 1, 4, 7, 0, 3, 6, 2],
    [6, 2, 4, 7, 0, 3, 5, 1],
    [7, 3, 5, 6, 1, 2, 4, 0]
];