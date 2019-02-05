var maxTreeContents = 1;
var maxLeafSize = 1;
class UDTree
{
    constructor(x, y, w, h, p, top, engine)
    {
        this.children = null;
        this.contents = [];
        this.engine = engine;
        this.size = {
            x: w,
            y: h
        };
        this.position = {
            x: x,
            y: y
        };
        this.parent = p;
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
        if(this.children == null)
        {
            this.contents.push(item);
            if(this.contents.length > maxTreeContents || this.size.x > maxLeafSize || this.size.y > maxLeafSize)
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
        this.children.push(new UDTree(this.position.x, this.position.y, sx, sy, this, this.topNode, this.engine));
        this.children.push(new UDTree(this.position.x + sx, this.position.y, sx, sy, this, this.topNode, this.engine));
        this.children.push(new UDTree(this.position.x, this.position.y + sy, sx, sy, this, this.topNode, this.engine));
        this.children.push(new UDTree(this.position.x + sx, this.position.y + sy, sx, sy, this, this.topNode, this.engine));
        for(var i = 0; i < this.contents.length; i++)
        {
            this.addItem(this.contents[i]);
        }
        this.contents = null;
        this.shouldSplit = false;
    }
    fireRayCast(from, to, exclude)
    {
        if(typeof exclude === "undefined")
        {
            exclude = [];
        }
        if(!this.isLeaf())
        {
            var side = inWhichSide(this.position, this.size, from);
            var order = getOrder(side);
            for(var i = 0; i < order.length; i++)
            {
                var child = this.children[order[i]];
                for(let ind in exclude)
                {
                    if(child == exclude[ind] || (child.hasContents() && child.contents[0] == exclude[ind]))
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
                    let atom = child.fireRayCast(from, to, exclude);
                    if(atom != null)
                    {
                        return atom;
                    }
                }
                
            }
        }
        if(!this.hasContents())
        {
            return null;
        }
        return this.contents[0];
    }
    hasContents()
    {
        return this.contents != null && this.contents.length > 0;
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