// create the shader program
// create the program / put the shader in / link the program
// so gl.createProgram -> gl.attachShader -> gl.linkProgram -> gl.useProgram (later)
import { loadShader } from "./loadShader.ts";

export function initShaderProgram(
  gl: WebGLRenderingContext,
  vsSource: string,
  fsSource: string,
) {
  // cook the vertexShader
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  if (!vertexShader) throw new Error("no vertexShader created");

  // cook the fragmentShader
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
  if (!fragmentShader) throw new Error("no fragmentShader created");

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
