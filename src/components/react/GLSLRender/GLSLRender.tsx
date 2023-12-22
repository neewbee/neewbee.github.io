import { type RefObject, useRef } from "react";
import { initBuffers } from "./initBuffer.js";
import { drawScene } from "./drawScene.js";
import { initShaderProgram } from "./loadShaderProgram.ts";
import { resizeCanvasToDisplaySize } from "./resizeCanvasToDisplaySize.ts";
import vertexGLSL from "./demo.vertex.glsl";
import fragmentGLSL from "./demo.fragment.glsl";

interface Props {
  code: string;
}

function renderCanvas(canvasRef: RefObject<HTMLCanvasElement>) {
  const canvas = canvasRef.current;
  if (canvas) {
    const gl = canvas.getContext("webgl");

    // 确认 WebGL 支持性
    if (!gl) {
      alert("无法初始化 WebGL，你的浏览器、操作系统或硬件等可能不支持 WebGL。");
      return;
    }
    // 1. create the program
    // - gl.createShader -> gl.shaderSource -> gl.compileShader
    // - gl.createProgram -> gl.attachShader -> gl.linkProgram
    console.log("1. create the program");
    const shaderProgram = initShaderProgram(gl, vertexGLSL, fragmentGLSL);
    if (shaderProgram === null) return;

    // 2. get the attribute locations
    // * look up the location of the attribute for the program we just created
    console.log("2. get the attribute locations");
    const attributeAPositionLocation = gl.getAttribLocation(
      shaderProgram,
      "a_position",
    );

    const resolutionUniformLocation = gl.getUniformLocation(
      shaderProgram,
      "u_resolution",
    );

    // 3. prepare the buffer data for the GLSL program we just created
    // gl.createBuffer -> gl.bindBuffer -> gl.bufferData
    const buffers = initBuffers(gl);
    console.log(
      "3. prepare the buffer data for the GLSL program we just created",
    );

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    //
    // 4. finally draw the scene
    // - reset the canvas prepare for drawing
    // - enable the attribute is Step 3
    //    - enable the attribute using the attribute location we get from programInfo
    //    - bind the buffer data we created from initBuffers(gl) to gl.ARRAY_BUFFER;
    //    - bind the ARRAY_BUFFER data to the attribute (aVertexPosition / aVertexColor);
    // - useProgram (the shaderProgram created in step 1)
    // - uniformMatrix4fv
    // - Draw the scene
    console.log("4. finally draw the scene");
    drawScene({
      gl,
      buffers,
      shaderProgram,
      attributeAPositionLocation,
      resolutionUniformLocation,
    });
  }
}

export default function (props: Props) {
  const { code } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  resizeCanvasToDisplaySize({ canvasRef, renderCanvas });

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
