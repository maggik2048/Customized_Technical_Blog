export const vertexShaderSource = `
attribute vec3 a_position;
attribute vec2 a_uv;
varying vec2 v_uv;
varying vec3 v_normal;
varying vec3 v_worldPos;

uniform float u_time;
uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_proj;

// FBM noise
float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
float noise(vec2 p){ vec2 i=floor(p); vec2 f=fract(p); vec2 u=f*f*(3.0-2.0*f);
    return mix(mix(hash(i+vec2(0.0,0.0)), hash(i+vec2(1.0,0.0)), u.x),
               mix(hash(i+vec2(0.0,1.0)), hash(i+vec2(1.0,1.0)), u.x), u.y); }
float fbm(vec2 p){ float v=0.0; float a=0.5; float f=1.0; for(int i=0;i<5;i++){ v+=a*noise(p*f); f*=2.0; a*=0.5; } return v; }

void main(){
    v_uv = a_uv;
    float t = u_time*0.2;
    float height = fbm(a_uv*3.0 + vec2(t,t)) * 0.3;
    vec3 pos = a_position + vec3(0.0, height, 0.0);
    v_worldPos = pos;

    float eps = 0.001;
    float hL = fbm((a_uv + vec2(-eps,0.0))*3.0 + vec2(t,t)) * 0.3;
    float hR = fbm((a_uv + vec2( eps,0.0))*3.0 + vec2(t,t)) * 0.3;
    float hD = fbm((a_uv + vec2(0.0,-eps))*3.0 + vec2(t,t)) * 0.3;
    float hU = fbm((a_uv + vec2(0.0, eps))*3.0 + vec2(t,t)) * 0.3;
    v_normal = normalize(vec3(hL - hR, 2.0, hD - hU));

    gl_Position = u_proj * u_view * u_model * vec4(pos,1.0);
}
`;

export const fragmentShaderSource = `
precision highp float;
varying vec3 v_normal;
varying vec3 v_worldPos;
uniform vec3 u_cameraPos;
uniform vec3 u_lightDir;
uniform bool u_showNormal;

void main(){
    if(u_showNormal){
        vec3 N = normalize(v_normal);
        gl_FragColor = vec4(N*0.5 + 0.5,1.0); // 노멀 시각화
        return;
    }

    vec3 N = normalize(v_normal);
    vec3 V = normalize(u_cameraPos - v_worldPos);
    vec3 L = normalize(u_lightDir);

    float fresnel = pow(1.0 - max(dot(V,N),0.0), 3.0) * 0.7 + 0.3;
    float diff = max(dot(N,L),0.0);
    vec3 H = normalize(L + V);
    float spec = pow(max(dot(N,H),0.0),32.0);

    vec3 waterColor = vec3(0.0,0.4,0.7);
    vec3 reflectionColor = vec3(0.8,0.9,1.0);

    vec3 color = mix(waterColor, reflectionColor, fresnel);
    color = color * diff + spec;
    color = clamp(color,0.0,1.0);

    gl_FragColor = vec4(color,1.0);
}

`;

export function createShader(gl,type,source){
    const s = gl.createShader(type);
    gl.shaderSource(s,source);
    gl.compileShader(s);
    if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){
        console.error(gl.getShaderInfoLog(s));
        return null;
    }
    return s;
}

export function createProgram(gl,vsSrc,fsSrc){
    const program = gl.createProgram();
    const vs = createShader(gl,gl.VERTEX_SHADER,vsSrc);
    const fs = createShader(gl,gl.FRAGMENT_SHADER,fsSrc);
    gl.attachShader(program,vs);
    gl.attachShader(program,fs);
    gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS)){
        console.error(gl.getProgramInfoLog(program));
        return null;
    }
    return program;
}