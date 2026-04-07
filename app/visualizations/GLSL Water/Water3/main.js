import { createPlaneMesh, createBuffer } from './mesh.js';
import { createProgram, vertexShaderSource, fragmentShaderSource } from './shader.js';
import { Camera } from './camera.js';

const canvas = document.getElementById('glcanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const gl = canvas.getContext('webgl');
if(!gl){ console.error("WebGL not supported"); }

gl.enable(gl.DEPTH_TEST);

// Shader program
const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
gl.useProgram(program);

// Plane mesh
const mesh = createPlaneMesh(128);
const posBuffer = createBuffer(gl, mesh.positions, gl.ARRAY_BUFFER);
const uvBuffer = createBuffer(gl, mesh.uvs, gl.ARRAY_BUFFER);
const indexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.indices), gl.STATIC_DRAW);

// Camera
const camera = new Camera(3);
camera.attach(canvas);

// Attributes
const a_pos = gl.getAttribLocation(program, 'a_position');
if(a_pos>=0){
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.enableVertexAttribArray(a_pos);
    gl.vertexAttribPointer(a_pos, 3, gl.FLOAT, false, 0, 0);
}
const a_uv = gl.getAttribLocation(program, 'a_uv');
if(a_uv>=0){
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.enableVertexAttribArray(a_uv);
    gl.vertexAttribPointer(a_uv, 2, gl.FLOAT, false, 0, 0);
}

// Uniforms
const u_time = gl.getUniformLocation(program, 'u_time');
const u_model = gl.getUniformLocation(program, 'u_model');
const u_view = gl.getUniformLocation(program, 'u_view');
const u_proj = gl.getUniformLocation(program, 'u_proj');
const u_cameraPos = gl.getUniformLocation(program, 'u_cameraPos');

const u_lightDir = gl.getUniformLocation(program,'u_lightDir');

// render loop에서
gl.uniform3fv(u_lightDir, new Float32Array([0.5,1.0,0.3]));

function render(time){
    time *= 0.001;
    gl.viewport(0,0,canvas.width,canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniform1f(u_time, time);

    const model = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
    gl.uniformMatrix4fv(u_model,false,new Float32Array(model));

    const eye = camera.getPosition();
    const view = camera.getViewMatrix();
    gl.uniformMatrix4fv(u_view,false,new Float32Array(view));
    gl.uniform3fv(u_cameraPos,new Float32Array(eye));

    const proj = perspective(Math.PI/4, canvas.width / canvas.height, 0.1, 100);
    gl.uniformMatrix4fv(u_proj,false,new Float32Array(proj));

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);
    gl.drawElements(gl.TRIANGLES, mesh.indices.length, gl.UNSIGNED_SHORT,0);

    requestAnimationFrame(render);
}
requestAnimationFrame(render);

function perspective(fov, aspect, near, far){
    const f = 1.0 / Math.tan(fov/2);
    return [
        f/aspect,0,0,0,
        0,f,0,0,
        0,0,(far+near)/(near-far),-1,
        0,0,(2*far*near)/(near-far),0
    ];
}