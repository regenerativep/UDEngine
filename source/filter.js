var Filter = {
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
            var targetAtom = ray.engine.fireRayCast(ray, ray.engine.topNode);
            var targetColor;
            if(targetAtom == null)
            {
                targetColor = ray.engine.getBackgroundColor(ray);
            }
            else
            {
                targetColor = targetAtom.color;
            }
            //return weightedAverageOfColors([ color, targetColor ], [ opacity, 1 - opacity ]);
            return targetColor;
        }
    },
    BasicLighting: {
        pass: function(ray, color, atom) {
            var distX = (atom.position.x - ray.from.x) ** 2;
            var distY = (atom.position.y - ray.from.y) ** 2;
            var distZ = (atom.position.z - ray.from.z) ** 2;
            var distSqr = Math.pow(distX + distY + distZ, 2 / 3);
            var lightPercent = Math.min(128 / distSqr, 1);
            var newCol = new UDColor(color.hue, color.saturation, color.lightness * lightPercent);
            return newCol;
        }
    }
};