var Filter = {
    SolidColor: {
        create: function(atom, color) {
            atom.color = color;
            return this;
        },
        pass: function(engine, a, b, color, atom) {
            return atom.color;
        }
    },
    Transparent: {
        create: function(atom, opacity) {
            atom.opacity = opacity; //todo actually use this
            return this;
        },
        pass: function(engine, a, b, color, atom, opacity) {
            if(typeof opacity === "undefined")
            {
                opacity = atom.opacity;
            }
            let targetAtom = engine.tree.fireRayCast(a, b, [atom]), targetColor;
            if(targetAtom == null)
            {
                targetColor = engine.getBackgroundColor(a, b);
            }
            else
            {
                targetColor = targetAtom.getColor(a, b, engine);
            }
            //return weightedAverageOfColors([ color, targetColor ], [ opacity, 1 - opacity ]);
            return targetColor;
        }
    },
    TestRedirect: {
        create: function(atom) {
            return this;
        },
        pass: function(engine, a, b, color, atom) {
            let targetPos = {
                x: (b.x - a.x) + atom.position.x,
                y: (b.y - a.y) + atom.position.y
            };
            return engine.tree.fireRayCast(atom.position, targetPos, [atom]);
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