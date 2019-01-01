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