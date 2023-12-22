import type { Buffers } from "./initBuffer.ts";

interface Props {
  gl: WebGLRenderingContext;
  shaderProgram: WebGLProgram;
  attributeAPositionLocation: number;
  buffers: Buffers;
}
function drawScene(props: Props) {
  const { gl, shaderProgram, attributeAPositionLocation, buffers } = props;
  gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque

  // Clear the canvas before we start drawing on it.
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(shaderProgram);

  // buffer into the a_position attribute.
  setPositionAttribute(gl, buffers, attributeAPositionLocation);

  const offset = 0;
  const vertexCount = 3;

  // finally !
  gl.drawArrays(gl.TRIANGLES, offset, vertexCount);
}

// Tell WebGL how to pull out the positions from the position
// buffer into the vertexPosition attribute.
function setPositionAttribute(
  gl: WebGLRenderingContext,
  buffers: Buffers,
  attributeAPositionLocation: number,
) {
  const size = 2; // pull out 2 values per iteration
  const type = gl.FLOAT; // the data in the buffer is 32bit floats
  const normalize = false; // don't normalize
  const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  const offset = 0; // start at the beginning of the buffer

  if (attributeAPositionLocation === undefined) return;
  // turn the attribute on
  gl.enableVertexAttribArray(attributeAPositionLocation);

  // gl.bindBuffer in initBuffers function is to prepare the buffers
  // gl.bindBuffer here is tell WebGL how to take data from the buffer we set up above
  // and supply it to the attribute in the shader
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionBuffer);

  //   quote from https://webglfundamentals.org/webgl/lessons/webgl-fundamentals.html
  //*  A hidden part of gl.vertexAttribPointer is that it binds the current ARRAY_BUFFER to the attribute.
  //*  In other words now this attribute is bound to positionBuffer. That means we're free to bind something
  //*  else to the ARRAY_BUFFER bind point. The attribute will continue to use positionBuffer.
  gl.vertexAttribPointer(
    attributeAPositionLocation,
    size,
    type,
    normalize,
    stride,
    offset,
  );
}

export { drawScene };
