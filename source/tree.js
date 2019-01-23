var maxTreeContents = 1;
class UDTree
{
    constructor(x, y, w, h, p, top)
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
        this.updateFilters = false;
        this.filters = [];
        this.shouldSplit = false;
        if(typeof top === "undefined")
        {
            this.topNode = this;
        }
        else
        {
            this.topNode = top;
        }
    }
    addItem(item)
    {
        this.updateFilters = true;
        if(this.children == null)
        {
            this.contents.push(item);
            if(this.contents.length > maxTreeContents)
            {
                this.shouldSplit = true;
            }
        }
        else
        {
            var side = inWhichSide(this.position, this.size, item.position);
            this.children[side].addItem(item);
        }
        this.constructor._super.emit("atomAdd", item);
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
        this.children.push(new UDTree(this.position.x, this.position.y, sx, sy, this, this.topNode));
        this.children.push(new UDTree(this.position.x + sx, this.position.y, sx, sy, this, this.topNode));
        this.children.push(new UDTree(this.position.x, this.position.y + sy, sx, sy, this, this.topNode));
        this.children.push(new UDTree(this.position.x + sx, this.position.y + sy, sx, sy, this, this.topNode));
        for(var i = 0; i < this.contents.length; i++)
        {
            this.addItem(this.contents[i]);
        }
        this.contents = null;
        
        for(var i = 0; i < this.children.length; i++)
        {
            var child = this.children[i];
            for(var j = 0; j < this.filters.length; j++)
            {
                var filter = this.filters[j];
                child.addFilter(filter);
            }
        }
        this.shouldSplit = false;
    }
    fireRayCast(from, to, exclude)
    {
        if(typeof exclude === "undefined")
        {
            exclude = [];
        }
        if(this.children != null)
        {
            var side = inWhichSide(this.position, this.size, from);
            var order = getOrder(side);
            for(var i = 0; i < order.length; i++)
            {
                var child = this.children[order[i]];
                for(let node in exclude)
                {
                    if(child == node)
                    {
                        break; //we dont worry about this one
                    }
                }
                var secondPos = {
                    x: child.position.x + child.size.x,
                    y: child.position.y + child.size.y
                };
                if(lineIntersectsRectangle(from, to, child.position, secondPos))
                {
                    var color = child.fireRayCast(from, to, exclude);
                    return color;
                }
                
            }
            return new UDColor(0, 0, 0); //todo maybe get a skybox?
        }
        var color = new UDColor(0, 0, 0);
        for(var i = 0; i < this.filters.length; i++)
        {
            color = this.filters[i].pass(from, to, color, this);
        }
        return color;
    }
    isLeaf()
    {
        if(this.shouldSplit)
        {
            this.split();
            return false;
        }
        return this.children == null;
    }
    addFilter(filter)
    {
        var args = Array.prototype.slice.call(arguments, 1);
        this.filters.push(filter);
        filter.create(this, ...args);
    }
}
heir.inherit(UDTree, EventEmitter);
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