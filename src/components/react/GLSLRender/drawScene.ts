import { mat4 } from "../glMatrix/src";
import type { ProgramInfo } from "./GLSLRender.tsx";
import type { Buffers } from "./initBuffer.ts";

function drawScene(
  gl: WebGLRenderingContext,
  programInfo: ProgramInfo,
  buffers: Buffers,
) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
  gl.clearDepth(1.0); // Clear everything
  gl.enable(gl.DEPTH_TEST); // Enable depth testing
  gl.depthFunc(gl.LEQUAL); // Near things obscure far things

  // Clear the canvas before we start drawing on it.
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  const fieldOfView = (45 * Math.PI) / 180; // in radians
  const aspect = gl.canvas.width / gl.canvas.height;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  const modelViewMatrix = mat4.create();

  // Now move the drawing position a bit to where we want to
  // start drawing the square.

  mat4.translate(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to translate
    [-0.0, 0.0, -6.0],
  ); // amount to translate

  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute.
  setPositionAttribute(gl, buffers, programInfo);

  setColorAttribute(gl, buffers, programInfo);

  // Tell WebGL to use our program when drawing

  gl.useProgram(programInfo.shaderProgram);

  // Set the shader uniforms

  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix,
  );
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix,
  );

  const offset = 0;
  const vertexCount = 4;

  // finally !
  gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
}

// Tell WebGL how to pull out the positions from the position
// buffer into the vertexPosition attribute.
function setPositionAttribute(
  gl: WebGLRenderingContext,
  buffers: Buffers,
  programInfo: ProgramInfo,
) {
  const numComponents = 2; // pull out 2 values per iteration
  const type = gl.FLOAT; // the data in the buffer is 32bit floats
  const normalize = false; // don't normalize
  const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  const offset = 0; // start at the beginning of the buffer

  if (!programInfo.attribLocations) return;
  // turn the attribute on
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

  // gl.bindBuffer in initBuffers function is to prepare the buffers
  // gl.bindBuffer here is tell WebGL how to take data from the buffer we setup above
  // and supply it to the attribute in the shader
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionBuffer);

  //   quote from https://webglfundamentals.org/webgl/lessons/webgl-fundamentals.html
  //*  A hidden part of gl.vertexAttribPointer is that it binds the current ARRAY_BUFFER to the attribute.
  //*  In other words now this attribute is bound to positionBuffer. That means we're free to bind something
  //*  else to the ARRAY_BUFFER bind point. The attribute will continue to use positionBuffer.
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexPosition,
    numComponents,
    type,
    normalize,
    stride,
    offset,
  );
}

// Tell WebGL how to pull out the colors from the color buffer
// into the vertexColor attribute.
function setColorAttribute(
  gl: WebGLRenderingContext,
  buffers: Buffers,
  programInfo: ProgramInfo,
) {
  const numComponents = 4;
  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;

  if (!programInfo.attribLocations) return;
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.colorBuffer);
  if (!programInfo.attribLocations) return;
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexColor,
    numComponents,
    type,
    normalize,
    stride,
    offset,
  );
}

export { drawScene };
