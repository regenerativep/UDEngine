var CameraPatternFisheye = (function() {
    function CameraPatternFisheye(width, height, horizFov, vertiFov)
    {
        this.c = 0; //y //ok so i messed this up, the columns measures y, and the rows measure x. todo this
        this.r = 0; //x
        this.horizontalFov = horizFov;
        this.verticalFov = vertiFov;
        this.width = width;
        this.height = height;
        this.updateX = false;
        this.active = false;
    }
    CameraPatternFisheye.prototype.getNext = function() {
        if(this.updateX)
        {
            this.r++; //intentionally put this before the if statement
            if(this.r < this.width - 1)
            {
                rotateVectorZ(this.rowVec, this.yawStepRotationVector);
            }
            else
            {
                this.updateX = false;
                this.r = 0;
                this.c++;
                if(this.c >= this.height)
                {
                    this.active = false;
                }
                rotateVectorY(this.leftVec, this.pitStepRotationVector);
            }
        }
        else
        {
            this.updateX = true;
            this.rowVec = copyVector(this.leftVec);
            rotateVectorZ(this.rowVec, this.startYawRotationVector);
        }
        return this.rowVec;
    };
    CameraPatternFisheye.prototype.reset = function(yaw, pit) {
        this.r = 0;
        this.c = 0;
        this.startYawRotationVector = getRotationVector(yaw - (this.horizontalFov / 2));
        this.leftVec = { x: 1, y: 0, z: 0 };
        rotateVectorY(this.leftVec, getRotationVector(pit - (this.verticalFov / 2)))
        this.yawStepRotationVector = getRotationVector(this.horizontalFov / this.width);
        this.pitStepRotationVector = getRotationVector(this.verticalFov / this.height);
        this.updateX = false;
        this.active = true;
    };
    return CameraPatternFisheye;
}());