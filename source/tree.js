var maxLeafSize = 1;
var deepestDepth = 0;
class UDTree
{
    constructor(x, y, w, h, p, top, engine)
    {
        this.children = null;
        this.contents = null;
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
        if(typeof top === "undefined" || top == null)
        {
            this.topNode = this;
            this.depth = 0;
        }
        else
        {
            this.topNode = top;
            this.depth = p.depth + 1;
            if(this.depth > deepestDepth)
            {
                deepestDepth = this.depth;
            }
        }
    }
    addItem(item)
    {
        if(this.children == null)
        {
            if(this.contents == null)
            {
                this.contents = item;
                if(this.size.x > maxLeafSize || this.size.y > maxLeafSize)
                {
                    this.split();
                }
            }
            else
            {
                this.split(item);
            }
        }
        else
        {
            let side = inWhichSide(this.position, this.size, item.position)
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
    split(item)
    {
        this.children = [];
        var sx = this.size.x / 2, sy = this.size.y / 2;
        this.children.push(new UDTree(this.position.x, this.position.y, sx, sy, this, this.topNode, this.engine));
        this.children.push(new UDTree(this.position.x + sx, this.position.y, sx, sy, this, this.topNode, this.engine));
        this.children.push(new UDTree(this.position.x, this.position.y + sy, sx, sy, this, this.topNode, this.engine));
        this.children.push(new UDTree(this.position.x + sx, this.position.y + sy, sx, sy, this, this.topNode, this.engine));
        if(typeof item !== "undefined")
        {
            this.addItem(item);
        }
        if(this.contents != null)
        {
            this.addItem(this.contents);
        }
        this.contents = null;
    }
    fireRayCast(ray)
    {
        if(!this.isLeaf())
        {
            var side = inWhichSide(this.position, this.size, ray.from);
            var order = getOrder(side);
            for(var i = 0; i < order.length; i++)
            {
                var child = this.children[order[i]];
                for(let ind in ray.exclude)
                {
                    if(child == ray.exclude[ind] || (child.hasContents() && child.contents == ray.exclude[ind]))
                    {
                        break; //we dont worry about this one
                    }
                }
                var secondPos = {
                    x: child.position.x + child.size.x,
                    y: child.position.y + child.size.y
                };
                if(lineIntersectsRectangle(ray.from, ray.to, child.position, secondPos))
                {
                    let atom = child.fireRayCast(ray);
                    if(atom != null)
                    {
                        ray.depth++;
                        return atom;
                    }
                }
                
            }
        }
        ray.depth++;
        if(!this.hasContents())
        {
            return null;
        }
        ray.depth++;
        return this.contents;
    }
    hasContents()
    {
        return this.contents != null;
    }
    isLeaf()
    {
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