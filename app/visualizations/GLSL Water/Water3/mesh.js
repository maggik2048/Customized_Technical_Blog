export function createPlaneMesh(grid=128){
    const positions=[], uvs=[], indices=[];
    for(let y=0;y<=grid;y++){
        for(let x=0;x<=grid;x++){
            let u = x/grid, v = y/grid;
            positions.push(u*2-1,0,v*2-1);
            uvs.push(u,v);
        }
    }
    for(let y=0;y<grid;y++){
        for(let x=0;x<grid;x++){
            let i = y*(grid+1)+x;
            indices.push(i,i+1,i+grid+1);
            indices.push(i+1,i+grid+2,i+grid+1);
        }
    }
    return {positions, uvs, indices};
}

export function createBuffer(gl,data,type){
    const buf = gl.createBuffer();
    gl.bindBuffer(type,buf);
    gl.bufferData(type,new Float32Array(data),gl.STATIC_DRAW);
    return buf;
}