class Vec3
{
    constructor(x,y,z)
    {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    sum()
    {
        return this.x + this.y + this.z;
    }

    min()
    {
        var tmp =  this.x < this.y ? this.x : this.y;
        return tmp < this.z ? tmp : this.z;
    }

    mid()
    {
        return this.sum() - this.min() - this.max()
    }

    max()
    {
        var tmp =  this.x < this.y ? this.y : this.x;
        return tmp < this.z ? this.z : tmp;
    }

    abs()
    {
        return (this.x * this.x + this.y * this.y + this.z * this.z)**0.5;
    }


}

function cross_product(v1,v2)
{
    return new Vec3(v1.y * v2.z - v1.z * v2.y,
                    v1.z * v2.x - v1.x * v2.z,
                    v1.x * v2.y - v1.y * v2.x);
}


function AreaOfTriangle(v0,v1,v2)
{
    vector_v1 = new Vec3(v1.x-v0.x,v1.y-v0.y,v1.z-v0.z);
    vector_v2 = new Vec3(v2.x-v0.x,v2.y-v0.y,v2.z-v0.z);

    vector_cross_product = cross_product(vector_v1,vector_v2);
    vector_cross_product_abs = vector_cross_product.abs();

    return vector_cross_product_abs/2;
}