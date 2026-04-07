export class Camera {
    constructor(radius=3){
        this.radius = radius;
        this.angleX = 0;
        this.angleY = 0;
        this.isDragging = false;
        this.lastX = 0;
        this.lastY = 0;
    }

    attach(canvas){
        canvas.addEventListener('mousedown', e=>{
            this.isDragging=true;
            this.lastX=e.clientX; this.lastY=e.clientY;
        });
        canvas.addEventListener('mouseup', ()=>{this.isDragging=false;});
        canvas.addEventListener('mousemove', e=>{
            if(!this.isDragging) return;
            const dx = e.clientX - this.lastX;
            const dy = e.clientY - this.lastY;
            this.angleY += dx*0.01;
            this.angleX += dy*0.01;
            this.lastX = e.clientX; this.lastY = e.clientY;
        });
    }

    getPosition(){
        return [
            Math.sin(this.angleY)*this.radius,
            Math.sin(this.angleX)*this.radius,
            Math.cos(this.angleY)*this.radius
        ];
    }

    getViewMatrix(){
        const eye = this.getPosition();
        const target = [0,0,0];
        const up=[0,1,0];
        return lookAt(eye,target,up);
    }
}

// helpers
function lookAt(eye,target,up){
    const z = normalize(sub(eye,target));
    const x = normalize(cross(up,z));
    const y = cross(z,x);
    return [
        x[0],y[0],z[0],0,
        x[1],y[1],z[1],0,
        x[2],y[2],z[2],0,
        -dot(x,eye),-dot(y,eye),-dot(z,eye),1
    ];
}
function sub(a,b){return[a[0]-b[0],a[1]-b[1],a[2]-b[2]];}
function cross(a,b){return[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];}
function dot(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2];}
function normalize(v){ const len=Math.hypot(v[0],v[1],v[2]); return[len? v[0]/len:0,len? v[1]/len:0,len? v[2]/len:0]; }