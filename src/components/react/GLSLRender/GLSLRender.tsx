import { type RefObject, useEffect, useRef, useState } from "react";
import { setPositionAttribute, setResolutionAttribute } from "./drawScene.js";
import { initShaderProgram } from "./loadShaderProgram.ts";
import vertexGLSL from "./demo.vertex.glsl";
import fragmentGLSL from "./demo.fragment.glsl";
import { randomInt, setRectangle } from "./utils.ts";
import { Slider } from "./Slider.tsx";

interface Props {
  code: string;
}

export type onSlideChange = (value: string) => unknown;

export type RenderCanvasReturn = { onChange: onSlideChange } | undefined;

export function renderCanvas(
  canvasRef: RefObject<HTMLCanvasElement>,
  inputs?: { slideValue: string },
): RenderCanvasReturn {
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

    const colorUniformLocation = gl.getUniformLocation(
      shaderProgram,
      "u_color",
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

    // draw 50 random rectangles in random colors

    // Fills the buffer with the values that define a rectangle.

    // finally !
    gl.drawArrays(gl.TRIANGLES, offset, count);

    return {
      onChange: (value: string) => {
        console.log("call onchange");
        for (let ii = 0; ii < 20; ++ii) {
          // Setup a random rectangle
          // This will write to positionBuffer because
          // its the last thing we bound on the ARRAY_BUFFER
          // bind point
          setRectangle(
            gl,
            randomInt(1000),
            randomInt(500),
            randomInt(300),
            randomInt(300),
          );

          // Set a random color.
          gl.uniform4f(
            colorUniformLocation,
            Math.random(),
            Math.random(),
            Math.random(),
            1,
          );

          // Draw the rectangle.
          gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
      },
    };
  }
}

export default function (props: Props) {
  const { code } = props;
  const [slideValue, setSlideValue] = useState("0");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderCallbackRef = useRef<{ onChange: onSlideChange }>();

  useEffect(() => {
    const canvasElement = canvasRef.current;

    if (canvasElement) {
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

          if (canvasElement) {
            canvasElement.width = displayWidth;
            canvasElement.height = displayHeight;
            renderCallbackRef.current = renderCanvas(canvasRef);
          }
        }
      }

      const resizeObserver = new ResizeObserver(onResize);

      resizeObserver.observe(canvasElement, { box: "content-box" });

      return () => {
        resizeObserver.unobserve(canvasElement);
      };
    }
  }, [canvasRef, renderCallbackRef]);

  return (
    <div>
      <pre>{code}</pre>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "300px", display: "block" }}
      ></canvas>
      <Slider
        value={slideValue}
        onChange={(value) => {
          renderCallbackRef.current?.onChange(value);
          setSlideValue(value);
        }}
      />
    </div>
  );
}
