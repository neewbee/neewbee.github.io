import { type RefObject, useRef } from "react";
import { setPositionAttribute, setResolutionAttribute } from "./drawScene.js";
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

    console.log(
      "3. prepare the buffer data for the GLSL program we just created",
    );
    const positionBuffer = gl.createBuffer();

    // quote from https://webglfundamentals.org/webgl/lessons/webgl-fundamentals.html
    //
    // * WebGL lets us manipulate many WebGL resources on global bind points.
    // * You can think of bind points as internal global variables inside WebGL.
    // * First you bind a resource to a bind point.
    // * Then, all other functions refer to the resource through the bind point.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // prettier-ignore
    const positions = [
      10, 20,
      80, 20,
      10, 30,
      10, 30,
      80, 20,
      80, 30,
    ];
    // quote from https://webglfundamentals.org/webgl/lessons/webgl-fundamentals.html
    //
    // * Now we can put data in that buffer by referencing it through the bind point
    // * There's a lot going on here. The first thing is we have positions which is a JavaScript array.
    // * WebGL on the other hand needs strongly typed data
    // * so the part new Float32Array(positions) creates a new array of 32bit floating point numbers
    // * and copies the values from positions. gl.bufferData then copies that data to the positionBuffer
    // * on the GPU. It's using the position buffer because we bound it to the ARRAY_BUFFER bind point above.
    // *
    // * The last argument, gl.STATIC_DRAW is a hint to WebGL about how we'll use the data.
    // * WebGL can try to use that hint to optimize certain things.
    // * gl.STATIC_DRAW tells WebGL we are not likely to change this data much.
    // *
    // * The code up to this point is initialization code. Code that gets run once when we load the page.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // 4. finally draw the scene
    // - reset the canvas prepare for drawing
    // - use the program we just created
    // - enable the attribute is Step 3
    //    - enable the attribute using the attribute location we get from programInfo
    //    - bind the buffer data we created from initBuffers(gl) to gl.ARRAY_BUFFER;
    //    - bind the ARRAY_BUFFER data to the attribute (aVertexPosition / aVertexColor);
    // - useProgram (the shaderProgram created in step 1)
    // - uniformMatrix4fv
    // - Draw the scene
    console.log("4. finally draw the scene");

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque

    // Clear the canvas before we start drawing on it.
    gl.clear(gl.COLOR_BUFFER_BIT);

    setPositionAttribute(gl, positionBuffer, attributeAPositionLocation);

    // useProgram must come before gl.uniform in setResolutionAttribute function
    // @see https://www.khronos.org/opengl/wiki/GLSL_:_common_mistakes
    // glUseProgram section
    gl.useProgram(shaderProgram);

    setResolutionAttribute(gl, resolutionUniformLocation);

    const offset = 0;
    const count = 6;

    // finally !
    gl.drawArrays(gl.TRIANGLES, offset, count);
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
