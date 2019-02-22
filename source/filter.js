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
            let targetAtom = ray.engine.fireRayCast(ray);
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
            
        }
    },
    BasicLighting: {
        create: function(atom) {
            return this;
        },
        pass: function(ray, color, atom) {
            let distX = (atom.position.x - ray.from.x) ** 2;
            let distY = (atom.position.y - ray.from.y) ** 2;
            let distSqr = distX + distY;
            let lightPercent = Math.min(5000 / distSqr, 1);
            let newCol = new UDColor(color.hue, color.saturation, color.lightness * lightPercent);
            return newCol;
        }
    }
};