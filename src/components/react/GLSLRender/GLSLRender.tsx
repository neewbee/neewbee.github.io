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
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
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
    gl.deleteProgram(shaderProgram);
    return null;
  }

  return shaderProgram;
}

function useCanvasWebGL(canvasRef: RefObject<HTMLCanvasElement>) {
  console.log("render webgl");
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

    // 1. create shader / attach shader / link program / get a GLSL program on the GPU
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    if (!shaderProgram) return;

    // 2. supply data to the GLSL program

    const programInfo = {
      program: shaderProgram,
      attribLocations: {
        // look up the location of the attribute for the program just created
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

    // create buffer / bind buffer location / buffer data
    const buffers = initBuffers(gl);

    console.log("gl.canvas.width", gl.canvas.width);
    console.log("gl.canvas.height", gl.canvas.height);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    //
    // 3. render
    // Draw the scene
    drawScene(gl, programInfo, buffers);
  }
}

export default function (props: Props) {
  const { code } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    console.log("canvasRef", canvasRef);
    const canvasElement = canvasRef.current;

    if (canvasElement) {
      const canvasToDisplaySizeMap = new Map<HTMLCanvasElement, number[]>([
        [canvasElement, [400, 400]],
      ]);

      const updateCanvasSize = () => {
        const [displayWidth, displayHeight] =
          canvasToDisplaySizeMap.get(canvasElement) || [];
        canvasElement.width = displayWidth;
        canvasElement.height = displayHeight;
        console.log("updateCavasSize");
        useCanvasWebGL(canvasRef);
      };
      function onResize(entries: ResizeObserverEntry[]) {
        for (const entry of entries) {
          let width: number;
          let height: number;
          let dpr = window.devicePixelRatio;
          if (entry.devicePixelContentBoxSize) {
            // NOTE: Only this path gives the correct answer
            // The other paths are an imperfect fallback
            // for browsers that don't provide anyway to do this
            width = entry.devicePixelContentBoxSize[0].inlineSize;
            height = entry.devicePixelContentBoxSize[0].blockSize;
            dpr = 1; // it's already in width and height
          } else if (entry.contentBoxSize) {
            if (entry.contentBoxSize[0]) {
              width = entry.contentBoxSize[0].inlineSize;
              height = entry.contentBoxSize[0].blockSize;
            } else {
              // legacy
              // @ts-ignore
              width = entry.contentBoxSize.inlineSize;
              // @ts-ignore
              height = entry.contentBoxSize.blockSize;
            }
          } else {
            // legacy
            width = entry.contentRect.width;
            height = entry.contentRect.height;
          }
          const displayWidth = Math.round(width * dpr);
          const displayHeight = Math.round(height * dpr);
          canvasToDisplaySizeMap.set(entry.target as HTMLCanvasElement, [
            displayWidth,
            displayHeight,
          ]);
          updateCanvasSize();
        }
      }

      // updateCanvasSize();
      const resizeObserver = new ResizeObserver(onResize);
      resizeObserver.observe(canvasElement, { box: "content-box" });

      return () => resizeObserver.unobserve(canvasElement);
    }
  }, [canvasRef]);

  useEffect(() => {}, []);

  return (
    <code>
      <pre>{code}</pre>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "300px", display: "block" }}
      ></canvas>
    </code>
  );
}
