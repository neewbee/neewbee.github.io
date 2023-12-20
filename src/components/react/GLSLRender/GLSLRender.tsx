import { RefObject, useEffect, useRef } from "react";
import { initBuffers } from "./initBuffer.js";
import { drawScene } from "./drawScene.js";
interface Props {
  code: string;
}

//
// 创建指定类型的着色器，上传 source 源码并编译
//
function loadShader(gl: WebGLRenderingContext, type: GLenum, source: string) {
  const shader = gl.createShader(type);

  if (!shader) throw new Error("no shader created");
  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(
      "An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader),
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

//  初始化着色器程序，让 WebGL 知道如何绘制我们的数据
function initShaderProgram(
  gl: WebGLRenderingContext,
  vsSource: string,
  fsSource: string,
) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  if (!vertexShader) throw new Error("no vertexShader created");

  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
  if (!fragmentShader) throw new Error("no fragmentShader created");

  // 创建着色器程序

  const shaderProgram = gl.createProgram();
  if (!shaderProgram) throw new Error("no shader Program created");
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // 如果创建失败，alert
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert(
      "Unable to initialize the shader program: " +
        gl.getProgramInfoLog(shaderProgram),
    );
    return null;
  }

  return shaderProgram;
}

function useCanvasWebGL(canvasRef: RefObject<HTMLCanvasElement>) {
  const canvas = canvasRef.current;
  if (canvas) {
    const gl = canvas.getContext("webgl");

    // 确认 WebGL 支持性
    if (!gl) {
      alert("无法初始化 WebGL，你的浏览器、操作系统或硬件等可能不支持 WebGL。");
      return;
    }

    // 使用完全不透明的黑色清除所有图像
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // 用上面指定的颜色清除缓冲区
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Vertex shader program
    // Vertex shader program

    const vsSource = `attribute vec4 aVertexPosition;
attribute vec4 aVertexColor;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying lowp vec4 vColor;

void main(void) {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  vColor = aVertexColor;
}
  `;
    const fsSource = `varying lowp vec4 vColor;
void main(void) {
  gl_FragColor = vColor;
}
  `;

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    if (!shaderProgram) return;

    const programInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
        vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor"),
      },
      uniformLocations: {
        projectionMatrix: gl.getUniformLocation(
          shaderProgram,
          "uProjectionMatrix",
        ),
        modelViewMatrix: gl.getUniformLocation(
          shaderProgram,
          "uModelViewMatrix",
        ),
      },
    };

    // Here's where we call the routine that builds all the
    // objects we'll be drawing.
    const buffers = initBuffers(gl);

    // Draw the scene
    drawScene(gl, programInfo, buffers);
  }
}

export default function (props: Props) {
  const { code } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    useCanvasWebGL(canvasRef);
  }, [canvasRef]);

  return (
    <code>
      <pre>{code}</pre>
      <canvas ref={canvasRef} height="1080" width="1920"></canvas>
    </code>
  );
}
