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
            let targetAtom = ray.engine.fireRayCast(ray);
            if(targetAtom == null)
            {
                return ray.engine.getBackgroundColor(ray);
            }
            return targetAtom.getColor(ray);
        }
    }
};