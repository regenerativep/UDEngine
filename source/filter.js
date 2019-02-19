var Filter = {
    SolidColor: {
        create: function(atom, color) {
            atom.color = color;
            return this;
        },
        pass: function(ray, color, atom) {
            return atom.color;
        }
    },
    Transparent: {
        create: function(atom, opacity) {
            atom.opacity = opacity; //todo actually use this
            return this;
        },
        pass: function(ray, color, atom, opacity) {
            if(typeof opacity === "undefined")
            {
                opacity = atom.opacity;
            }
            ray.push(atom);
            let targetAtom = ray.engine.tree.fireRayCast(ray);
            let targetColor;
            if(targetAtom == null)
            {
                targetColor = ray.engine.getBackgroundColor(ray);
            }
            else
            {
                targetColor = targetAtom.getColor(ray);
            }
            //return weightedAverageOfColors([ color, targetColor ], [ opacity, 1 - opacity ]);
            return targetColor;
        }
    },
    TestRedirect: {
        create: function(atom) {
            return this;
        },
        pass: function(ray, color, atom) {
            let targetPos = {
                x: (ray.to.x - ray.from.x) + atom.position.x,
                y: (ray.to.y - ray.from.y) + atom.position.y
            };
            ray.exclude.push(atom);
            ray.from = {
                x: atom.position.x + 1,
                y: atom.position.y
            };
            ray.to = targetPos;
            let targetAtom = ray.engine.tree.fireRayCast(ray);
            if(targetAtom == null)
            {
                return ray.engine.getBackgroundColor(ray);
            }
            return targetAtom.getColor(ray);
        }
    }
    /*,
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
    }*/
};