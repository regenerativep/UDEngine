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
            var targetAtom = ray.engine.fireRayCast(ray, ray.engine.nodeList[0]);
            var targetColor;
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
            
        }
    },
    BasicLighting: {
        create: function(atom) {
            return this;
        },
        pass: function(ray, color, atom) {
            var distX = (atom.position.x - ray.from.x) ** 2;
            var distY = (atom.position.y - ray.from.y) ** 2;
            var distZ = (atom.position.z - ray.from.z) ** 2;
            var distSqr = Math.pow(distX + distY + distZ, 2 / 3);
            var lightPercent = Math.min(5000 / distSqr, 1);
            var newCol = new UDColor(color.hue, color.saturation, color.lightness * lightPercent);
            return newCol;
        }
    }
};