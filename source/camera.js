class UDCamera
{
    constructor(engine, canvasContainer)
    {
        this.position = {
            x: 0,
            y: 0,
            z: 0
        };
        this.engine = engine;
        this.direction = {
            yaw: 0,
            pitch: 0
        }; //radians
        this.horizontalFov = Math.PI / 2;
        this.verticalFov = Math.PI / 3;
        this.lastWidth = 0;
        this.lastHeight = 0;
        this.canvas = document.createElement("canvas");
        canvasContainer.appendChild(this.canvas);
    }
    fixDirections()
    {
        while(this.direction.yaw > Math.PI * 2) this.direction.yaw -= Math.PI * 2;
        while(this.direction.yaw < 0) this.direction.yaw += Math.PI * 2;
        while(this.direction.pitch > Math.PI) this.direction.pitch -= Math.PI * 2;
        while(this.direction.pitch <= -Math.PI) this.direction.pitch += Math.PI * 2;
    }
    setSize(width, height)
    {
        this.lastWidth = width;
        this.lastHeight = height;
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = this.canvas.getContext("2d");
        this.ctx.fillStyle = this.resetColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.imageData = this.ctx.createImageData(width, height);
    }
    getPixels(width, height)
    {
        if(this.lastHeight != height || this.lastWidth != width)
        {
            this.setSize(width, height);
        }
        this.fixDirections();
        var startYawRotationVector = getRotationVector(this.direction.yaw - this.horizontalFov / 2);
        var leftVec = { x: 1, y: 0, z: 0 }
        rotateVectorY(leftVec, getRotationVector(this.direction.pitch - this.verticalFov / 2));
        var yawStepRotationVector = getRotationVector(this.horizontalFov / width);
        var pitStepRotationVector = getRotationVector(this.verticalFov / height);
        var ind = 0;
        for(var j = 0; j < height; j++)
        {
            var rowVec = copyVector(leftVec);
            rotateVectorZ(rowVec, startYawRotationVector);
            for(var i = 0; i < width; i++)
            {
                var ray = new UDRay(this.position, rowVec, this.engine);
                //var ray = new UDRay(this.position, lengthdir(startingYaw + (i * yawStepDifference), startingPit + (j * pitStepDifference), 1), this.engine);
                var atom = this.engine.fireRayCast(ray, this.engine.nodeList[0]);
                var color;
                if(atom == null)
                {
                    color = this.engine.backgroundColor;
                }
                else
                {
                    color = atom.color;
                }
                var rgb = color.getRgb(true);
                this.imageData.data[ind++] = rgb.r;
                this.imageData.data[ind++] = rgb.g;
                this.imageData.data[ind++] = rgb.b;
                this.imageData.data[ind++] = 255;
                rotateVectorZ(rowVec, yawStepRotationVector);
            }
            rotateVectorY(leftVec, pitStepRotationVector);
        }
        return this.imageData;
    }
}