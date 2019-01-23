var Filter = {
    SolidColor: {
        create: function(node, color) {
            if(typeof color === "undefined")
            {
                node.color = node.parent.color;
            }
            else
            {
                node.color = color;
            }
        },
        pass: function(a, b, color, node) {
            return node.color;
        }
    },
    Transparent: {
        create: function(node, opacity) {
            if(typeof opacity === "undefined")
            {
                node.opacity = node.parent.opacity;
            }
            else
            {
                node.opacity = opacity; //todo use opacity somewhere
            }
        },
        pass: function(a, b, color, node, opacity) {
            var secondPos = {
                x: node.position.x + node.size.x,
                y: node.position.y + node.size.y
            };
            if(typeof opacity === "undefined")
            {
                opacity = node.opacity;
            }
            var result = lineIntersectsRectangle(a, b, node.position, secondPos, true);
            if(result.intersects)
            {
                if(result.farthest.dist != null)
                {
                    return node.topNode.fireRayCast(result.farthest, b, [node]); //todo make result.farthest go out a little bit so that it doesnt intersect with the original node
                }
            }
            return color;
        }
    },
    AverageColor: {
        create: function(node) {
            node.color = this.getColor(node);
            var gc = this.getColor;
            node.constructor._super.on("atomAdd", function(atom) {
                node.color = gc(node);
            }); //todo add ability to remove filters. must remove these event listeners too
        },
        getColor: function(node) {
            var color = new UDColor(0,0,0);
            if(node.isLeaf())
            {
                if(node.contents.length == 0)
                {
                    color = new UDColor(0, 0, 0);
                }
                else
                {
                    var cols = [];
                    for(var i = 0; i < node.contents.length; i++)
                    {
                        var col = node.contents[i].color;
                        cols.push(col);
                    }
                    color = averageOfColors(cols);
                }
            }
            return color;
        },
        pass: function(a, b, color, node) {
            if(node.isLeaf())
            {
                if(node.contents.length == 0)
                {
                    //return Filter.Transparent.pass(a, b, color, node, 0);
                }
                return node.color;
            }
            else
            {
                return Filter.Transparent.pass(a, b, color, node, 0);
            }
        }
    }
};