class UDCamera
{
    constructor(engine)
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
    }
    getPixelArray(width, height)
    {
        while(this.direction.yaw > Math.PI * 2) this.direction.yaw -= Math.PI * 2;
        while(this.direction.yaw < 0) this.direction.yaw += Math.PI * 2;
        while(this.direction.pitch > Math.PI) this.direction.pitch -= Math.PI * 2;
        while(this.direction.pitch <= -Math.PI) this.direction.pitch += Math.PI * 2;
        //todo compress this a bit
        var halfHorizFov = this.horizontalFov / 2;
        var halfVertFov = this.verticalFov / 2;
        var startingYaw = this.direction.yaw - halfHorizFov;
        var startingPit = this.direction.pitch - halfVertFov;
        var startPitRotationVector = getRotationVector(startingPit);
        var startYawRotationVector = getRotationVector(startingYaw);
        var leftVec = rotateVectorY(
            { x: 1, y: 0, z: 0 },
            startPitRotationVector
        );
        var yawStepDifference = this.horizontalFov / width;
        var pitStepDifference = this.verticalFov / height;
        var yawStepRotationVector = getRotationVector(yawStepDifference);
        var pitStepRotationVector = getRotationVector(pitStepDifference);
        var pixArray = []; //todo directly write to imageData
        for(var j = 0; j < height; j++)
        {
            var rowVec = rotateVectorZ(leftVec, startYawRotationVector);
            var row = [];
            for(var i = 0; i < width; i++)
            {
                var ray = new UDRay(this.position, rowVec, this.engine);
                //var ray = new UDRay(this.position, lengthdir(startingYaw + (i * yawStepDifference), startingPit + (j * pitStepDifference), 1), this.engine);
                var atom = this.engine.fireRayCast(ray);
                var color;
                if(atom == null)
                {
                    color = this.engine.backgroundColor;//.getBackgroundColor(ray);
                }
                else
                {
                    color = atom.color;
                }
                row.push(color);
                rowVec = rotateVectorZ(rowVec, yawStepRotationVector);
            }
            pixArray.push(row);
            leftVec = rotateVectorY(leftVec, pitStepRotationVector);
        }
        return pixArray;
    }
    draw(width, height, offset)
    {
        var pixels = this.getPixelArray(width, height);
        var imageData = this.engine.ctx.createImageData(width, height);
        var ind = 0;
        for(var i in pixels)
        {
            var row = pixels[i];
            for(var j in row)
            {
                var col = row[j];
                if(typeof col !== "undefined" && col != null)
                {
                    var rgb = col.getRgb(true);
                    imageData.data[ind] = rgb.r;
                    imageData.data[ind + 1] = rgb.g;
                    imageData.data[ind + 2] = rgb.b;
                    imageData.data[ind + 3] = 255;
                }
                ind += 4;
            }
        }
        this.engine.ctx.putImageData(imageData, offset.x, offset.y);
    }
}