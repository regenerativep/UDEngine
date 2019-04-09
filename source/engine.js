class UDEngine
{
    constructor(width, height, length)
    {
        this.maxDepth = 1000;
        this.width = width;
        this.height = height;
        this.length = length;
        this.maxLeafSize = 1;
        this.deepestDepth = 0;
        this.maximumPasses = 4;
        this.depthList = [ { x: width, y: height, z: length } ];
        this.topNode = this.createNode(0, 0, 0, this.depthList[0], 0);
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
        return {
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
            var side = inWhichSide(node, this.depthList[nextDepth], node.atom.position);
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
        if(depth > this.maxDepth)
        {
            console.log("asdasfaasdasdsa");
            debugger;
            return;
        }
        if(typeof depth !== "number")
        {
            depth = 0;
        }
        if(typeof item === "undefined")
        {
            //we are assuming that we're given the item as the first argument, instead of the node
            item = node;
            node = this.topNode;
        }
        var currentNode = node;
        var lastNode = currentNode;
        do
        {
            lastNode = currentNode;
            if(currentNode.children == null)
            {
                var depthSize = this.depthList[depth];
                if(item.equals(currentNode.atom))
                {
                    return; //we failed to add the item
                }
                if(currentNode.atom != null || depthSize.x > this.maxLeafSize || depthSize.y > this.maxLeafSize || depthSize.z > this.maxLeafSize)
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
                var side = inWhichSide(currentNode, this.depthList[depth + 1], item.position);
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
        var head = { //linked list
            item: node,
            next: null
        };
        while(head != null)
        {
            var currentNode = head.item;
            head = head.next;
            if(currentNode.children != null)
            {
                var order = rayCheckOrders[inWhichSide(currentNode, this.depthList[currentNode.depth + 1], ray.from)];
                for(var j = order.length - 1; j >= 0; j--)
                {
                    var child = currentNode.children[order[j]];
                    if((child.atom != null || child.children != null) && rayAABBIntersection(child, child.secondPos, ray)) //warning: secondPos may be useful for now, but i may need to get rid of it for memory in the future
                    {
                        head = {
                            item: child,
                            next: head
                        };
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
function inWhichSide(pos, size, loc) //todo: division can be optimized
{
    var side = 0;
    if(loc.x > pos.x + size.x)
    {
        side |= 1;
    }
    if(loc.y > pos.y + size.y)
    {
        side |= 2;
    }
    if(loc.z > pos.z + size.z)
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