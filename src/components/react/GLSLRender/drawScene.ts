// Tell WebGL how to pull out the positions from the position
// buffer into the vertexPosition attribute.
export function setPositionAttribute(
  gl: WebGLRenderingContext,
  positionBuffer: WebGLBuffer | null,
  attributeAPositionLocation: number,
) {
  const size = 2; // pull out 2 values per iteration
  const type = gl.FLOAT; // the data in the buffer is 32bit floats
  const normalize = false; // don't normalize
  const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  const offset = 0; // start at the beginning of the buffer

  if (attributeAPositionLocation === undefined || positionBuffer === null)
    return;
  // turn the attribute on
  gl.enableVertexAttribArray(attributeAPositionLocation);

  // gl.bindBuffer in initBuffers function is to prepare the buffers
  // gl.bindBuffer here is tell WebGL how to take data from the buffer we set up above
  // and supply it to the attribute in the shader
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

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

export function setResolutionAttribute(
  gl: WebGLRenderingContext,
  resolutionUniformLocation: WebGLUniformLocation | null,
) {
  if (resolutionUniformLocation === null) return;

  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
}

export function setColorUniformLocation() {}
