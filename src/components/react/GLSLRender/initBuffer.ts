export type Buffers = {
  positionBuffer: WebGLBuffer | null;
  colorBuffer: WebGLBuffer | null;
};

function initBuffers(gl: WebGLRenderingContext): Buffers {
  const colorBuffer = initColorBuffer(gl);
  const positionBuffer = initPositionBuffer(gl);

  return {
    positionBuffer: positionBuffer,
    colorBuffer: colorBuffer,
  };
}

// gl.createBuffer -> gl.bindBuffer -> gl.bufferData
function initPositionBuffer(gl: WebGLRenderingContext) {
  // Create a buffer for the square's positions.
  const positionBuffer = gl.createBuffer();

  // quote from https://webglfundamentals.org/webgl/lessons/webgl-fundamentals.html
  //
  // * WebGL lets us manipulate many WebGL resources on global bind points.
  // * You can think of bind points as internal global variables inside WebGL.
  // * First you bind a resource to a bind point.
  // * Then, all other functions refer to the resource through the bind point.
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Now create an array of positions for the square.
  const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];

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

  return positionBuffer;
}

export function initColorBuffer(gl: WebGLRenderingContext) {
  const colors = [
    1.0,
    1.0,
    1.0,
    1.0, // 白
    1.0,
    0.0,
    0.0,
    1.0, // 红
    0.0,
    1.0,
    0.0,
    1.0, // 绿
    0.0,
    0.0,
    1.0,
    1.0, // 蓝
  ];

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  return colorBuffer;
}

export { initBuffers };
