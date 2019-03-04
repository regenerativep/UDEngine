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
        let halfHorizFov = this.horizontalFov / 2;
        let halfVertFov = this.verticalFov / 2;
        let startingYaw = this.direction.yaw - halfHorizFov;
        let startingPit = this.direction.pitch - halfVertFov;
        let startPitRotationVector = getRotationVector(startingPit);
        let startYawRotationVector = getRotationVector(startingYaw);
        let leftVec = rotateVectorY(
            { x: 1, y: 0, z: 0 },
            startPitRotationVector
        );
        let yawStepDifference = this.horizontalFov / width;
        let pitStepDifference = this.verticalFov / height;
        let yawStepRotationVector = getRotationVector(yawStepDifference);
        let pitStepRotationVector = getRotationVector(pitStepDifference);
        let pixArray = []; //todo directly write to imageData
        for(let j = 0; j < height; j++)
        {
            let rowVec = rotateVectorZ(leftVec, startYawRotationVector);
            let row = [];
            for(let i = 0; i < width; i++)
            {
                let ray = new UDRay(this.position, rowVec, this.engine);
                //let ray = new UDRay(this.position, lengthdir(startingYaw + (i * yawStepDifference), startingPit + (j * pitStepDifference), 1), this.engine);
                let atom = this.engine.fireRayCast(ray);
                let color;
                if(atom == null)
                {
                    color = this.engine.getBackgroundColor(ray);
                }
                else
                {
                    //color = atom.getColor(ray);
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
        let imageData = this.engine.ctx.createImageData(width, height);
        let ind = 0;
        for(let i in pixels)
        {
            let row = pixels[i];
            for(let j in row)
            {
                var col = row[j];
                if(typeof col !== "undefined" && col != null)
                {
                    let rgb = col.getRgb(true);
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