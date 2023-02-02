import * as dat from "three/examples/jsm/libs/lil-gui.module.min";
import { fGeometry, fGeometryNormals } from "./geometry.js";

const globals = {
  gl: {},
  program: {},
  vao: {},
};

const data = {
  fieldOfView: 40,
  xTranslation: 0,
  yTranslation: 0,
  zTranslation: 0,
  xRotation: 4,
  yRotation: 4,
  zRotation: 1.5,
  xScale: 1,
  yScale: 1,
  xTranslationCamera: 100,
  yTranslationCamera: 200,
  zTranslationCamera: -200,
};

const transformation = {
  setPosition: (x, y, z) => {
    // prettier-ignore
    transformation.translation = [
      1, 0, 0, 0,  
      0, 1, 0, 0, 
      0, 0, 1, 0,
      x, y, z, 1
    ]
  },

  setRotationX: (r) => {
    const sin = Math.sin(r);
    const cos = Math.cos(r);
    // prettier-ignore
    transformation.rotationX = [
      1,  0,    0,    0,  
      0,  cos,  sin, 0, 
      0,  -sin, cos,  0,
      0,  0,    0,    1
    ]
  },

  setRotationY: (r) => {
    const sin = Math.sin(r);
    const cos = Math.cos(r);
    // prettier-ignore
    transformation.rotationY = [
      cos,  0,  -sin,  0,  
      0,    1,  0,    0, 
      sin, 0,   cos,  0,
      0,    0,  0,    1
    ]
  },

  setRotationZ: (r) => {
    const sin = Math.sin(r);
    const cos = Math.cos(r);
    // prettier-ignore
    transformation.rotationZ = [
      cos,  sin,  0, 0,  
      -sin, cos,  0, 0, 
      0,    0,    1, 0,
      0,    0,    0, 1
    ]
  },

  setScale: (x, y, z) => {
    // prettier-ignore
    transformation.scale = [
      x, 0, 0, 0,  
      0, y, 0, 0, 
      0, 0, z, 0,
      0, 0, 0, 1
    ]
  },
};

transformation.setPosition(0, 0, 0);
transformation.setRotationX(0);
transformation.setRotationY(0);
transformation.setRotationZ(0);
transformation.setScale(1, 1, 1);

main();

async function main() {
  getWebGLContext();
  await createProgramAndShaders();
  createFShape();
  setupSizing();
  clearCanvasAndZBuffer();
  setupControls();
  updateScene();
}

function setupControls() {
  const gui = new dat.GUI();

  gui
    .add(data, "fieldOfView")
    .min(0)
    .max(100)
    .onChange(() => {
      updateScene();
    });

  gui
    .add(data, "xTranslation")
    .min(-500)
    .max(500)
    .onChange(() => {
      updateScene();
    });

  gui
    .add(data, "yTranslation")
    .min(-500)
    .max(500)
    .onChange(() => {
      updateScene();
    });

  gui
    .add(data, "zTranslation")
    .min(-500)
    .max(500)
    .onChange(() => {
      updateScene();
    });

  gui
    .add(data, "xRotation")
    .min(0)
    .max(2 * Math.PI)
    .onChange(() => {
      updateScene();
    });

  gui
    .add(data, "yRotation")
    .min(0)
    .max(2 * Math.PI)
    .onChange(() => {
      updateScene();
    });

  gui
    .add(data, "zRotation")
    .min(0)
    .max(2 * Math.PI)
    .onChange(() => {
      updateScene();
    });

  gui
    .add(data, "xScale")
    .min(0)
    .max(3)
    .onChange(() => {
      updateScene();
    });

  gui
    .add(data, "yScale")
    .min(0)
    .max(3)
    .onChange(() => {
      updateScene();
    });
  gui
    .add(data, "xTranslationCamera")
    .min(-500)
    .max(500)
    .onChange(() => {
      updateScene();
    });
  gui
    .add(data, "yTranslationCamera")
    .min(-500)
    .max(500)
    .onChange(() => {
      updateScene();
    });
  gui
    .add(data, "zTranslationCamera")
    .min(-500)
    .max(500)
    .onChange(() => {
      updateScene();
    });
}

function updateScene() {
  transformation.setRotationX(data.xRotation);
  transformation.setRotationY(data.yRotation);
  transformation.setRotationZ(data.zRotation);
  transformation.setScale(data.xScale, data.yScale, 1);
  transformation.setPosition(
    data.xTranslation,
    data.yTranslation,
    data.zTranslation
  );
  draw();
}

function getWebGLContext() {
  const canvas = document.getElementById("c");
  const gl = canvas.getContext("webgl2");
  if (!gl) throw new Error("You do not support webgl2!");
  globals.gl = gl;
}

async function createProgramAndShaders() {
  const { gl } = globals;
  const program = gl.createProgram();
  globals.program = program;

  gl.enable(gl.DEPTH_TEST);

  await createShaders(program);
  gl.linkProgram(program);

  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    gl.useProgram(program);
    return program;
  }

  // If there's an error, log it
  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

function createFShape() {
  const { gl, program } = globals;
  // prettier-ignore
  const positions = fGeometry;

  const positionsArray = new Float32Array(positions);

  // Initialize position buffer and bind it
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, positionsArray, gl.STATIC_DRAW);

  // Enable attribute
  setupPositionBufferAttribute();

  setupNormalBufferAttribute();

  setupLight();
}

function setupLight() {
  const { gl, program } = globals;

  const colorLocation = gl.getUniformLocation(program, "u_color");
  const lightLocation = gl.getUniformLocation(program, "u_lightWorldPosition");

  // Set the color to use
  gl.uniform4fv(colorLocation, [0.2, 1, 0.2, 1]); // green

  // set the light direction.
  gl.uniform3fv(lightLocation, normalize([0, 0, 0]));
}

function setupNormalBufferAttribute() {
  const { gl, program } = globals;

  const normalAttributeLocation = gl.getAttribLocation(program, "a_normal");

  // create the normal buffer, make it the current ARRAY_BUFFER
  // and copy in the normal values
  const normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  const normalData = new Float32Array(fGeometryNormals);
  gl.bufferData(gl.ARRAY_BUFFER, normalData, gl.STATIC_DRAW);

  // Turn on the attribute
  gl.enableVertexAttribArray(normalAttributeLocation);

  const size = 3;
  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;
  gl.vertexAttribPointer(
    normalAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );
}

function setupSizing() {
  const { gl } = globals;

  const width = gl.canvas.clientWidth;
  const height = gl.canvas.clientHeight;
  gl.canvas.width = width;
  gl.canvas.height = height;

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
}

function clearCanvasAndZBuffer() {
  const { gl } = globals;
  gl.clearColor(0, 0, 0, 0);

  // Clear the canvas AND the depth buffer.
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function setupPositionBufferAttribute() {
  const { gl, program } = globals;
  // Createa collection of attribute state called Vertex Array Object
  const vao = gl.createVertexArray();
  globals.vao = vao;

  // Make it the current vertex array
  gl.bindVertexArray(vao);

  // Look up where the vertex data is and turn on the attribute
  const posAttrLocation = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(posAttrLocation);

  // Tell the attribute how to get data out of positionBuffer
  gl.vertexAttribPointer(
    posAttrLocation,
    3, // 3 components per iteration
    gl.FLOAT, // the data is 32bit floats
    false, // normalize = false: don't normalize the data
    0, // stride = 0: move forward size * sizeof(type) each iteration
    0 // offset = 0: start at the beginning of the buffer
  );
}

function draw() {
  const { gl, vao } = globals;

  // Update the transformation of the geometry
  updateTransformation();

  // Bind the attribute/buffer set we want.
  gl.bindVertexArray(vao);

  const count = 16 * 6;
  const offset = 0;
  const primitiveType = gl.TRIANGLES;
  gl.drawArrays(primitiveType, offset, count);
}

function updateTransformation() {
  const { gl, program } = globals;

  // Geometry transformation

  const { translation, rotationX, rotationY, rotationZ, scale } =
    transformation;

  // View matrix

  const cameraTranslation = lookAt(
    [data.xTranslationCamera, data.yTranslationCamera, data.zTranslationCamera],
    [0, 0, 0]
  );

  const viewMatrix = invertMatrix4(cameraTranslation);

  // Set origin of transformations in -60, -60

  // prettier-ignore
  const halfPositionTransform = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    -60, -60, 0, 1
  ];

  const inverseHalfTranslationTransform = invertMatrix4([
    ...halfPositionTransform,
  ]);

  // Projection matrix

  const fovInRadians = (data.fieldOfView * Math.PI) / 180;
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 1;
  const zFar = 2000;
  const clipSpaceConversion = getClipSpaceMatrix4Perspective(
    fovInRadians,
    aspect,
    zNear,
    zFar
  );

  const worldMatrix = multiplyManyMatrix4(
    translation,
    inverseHalfTranslationTransform,
    rotationX,
    rotationY,
    rotationZ,
    scale,
    halfPositionTransform
  );

  const worldInverseMatrix = invertMatrix4([...worldMatrix]);
  const worldInverseTransposeMatrix = transposeMatrix4(worldInverseMatrix);

  const worldViewProjectionMatrix = multiplyManyMatrix4(
    clipSpaceConversion,
    viewMatrix,
    worldMatrix
  );

  // Update uniforms

  const worldLocation = gl.getUniformLocation(program, "u_world");
  gl.uniformMatrix4fv(worldLocation, false, worldMatrix);

  const witLocation = gl.getUniformLocation(program, "u_worldInverseTranspose");
  gl.uniformMatrix4fv(witLocation, false, worldInverseTransposeMatrix);

  const wvpLocation = gl.getUniformLocation(program, "u_worldViewProjection");
  gl.uniformMatrix4fv(wvpLocation, false, worldViewProjectionMatrix);
}

async function createShaders() {
  const { gl } = globals;

  const fragmentPath = "./shaders/vertex.glsl";
  const vertexPath = "./shaders/fragment.glsl";

  // Get the strings for our GLSL shaders
  const vertexShaderSource = await getShaderSource(fragmentPath);
  const fragmentShaderSource = await getShaderSource(vertexPath);

  // Load GLSL shaders, compile them and attach to program
  createShader(gl.VERTEX_SHADER, vertexShaderSource);
  createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
}

function createShader(type, source) {
  const { gl, program } = globals;

  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) gl.attachShader(program, shader);

  // If there's an error, log it
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

async function getShaderSource(path) {
  const response = await fetch(path);
  return await response.text();
}

function lookAt(cameraPosition, target) {
  const up = [0, 1, 0];
  const zAxis = normalize(subtractVectors(cameraPosition, target));
  const xAxis = normalize(cross(up, zAxis));
  const yAxis = normalize(cross(zAxis, xAxis));
  // prettier-ignore
  return [
		xAxis[0], xAxis[1], xAxis[2], 0,
		yAxis[0], yAxis[1], yAxis[2], 0,
		zAxis[0], zAxis[1], zAxis[2], 0,
		cameraPosition[0],
		cameraPosition[1],
		cameraPosition[2],
		1,
	];
}

function normalize(v) {
  var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  // make sure we don't divide by 0.
  if (length > 0.00001) {
    return [v[0] / length, v[1] / length, v[2] / length];
  } else {
    return [0, 0, 0];
  }
}

function subtractVectors(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function cross(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

function getClipSpaceMatrix4Perspective(
  fieldOfViewInRadians,
  aspect,
  near,
  far
) {
  const f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
  const rangeInv = 1.0 / (near - far);

  // prettier-ignore
  return [
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (near + far) * rangeInv, -1,
    0, 0, near * far * rangeInv * 2, 0
  ];
}

function transposeMatrix4(m) {
  return [
    m[0],
    m[4],
    m[8],
    m[12],
    m[1],
    m[5],
    m[9],
    m[13],
    m[2],
    m[6],
    m[10],
    m[14],
    m[3],
    m[7],
    m[11],
    m[15],
  ];
}

function multiplyManyMatrix4(...matrices) {
  // prettier-ignore
  let result = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]

  for (let i = matrices.length - 1; i >= 0; i--) {
    result = multiplyMatrix4(matrices[i], result);
  }

  return result;
}

function multiplyMatrix4(a, b) {
  const b00 = b[0 * 4 + 0];
  const b01 = b[0 * 4 + 1];
  const b02 = b[0 * 4 + 2];
  const b03 = b[0 * 4 + 3];
  const b10 = b[1 * 4 + 0];
  const b11 = b[1 * 4 + 1];
  const b12 = b[1 * 4 + 2];
  const b13 = b[1 * 4 + 3];
  const b20 = b[2 * 4 + 0];
  const b21 = b[2 * 4 + 1];
  const b22 = b[2 * 4 + 2];
  const b23 = b[2 * 4 + 3];
  const b30 = b[3 * 4 + 0];
  const b31 = b[3 * 4 + 1];
  const b32 = b[3 * 4 + 2];
  const b33 = b[3 * 4 + 3];
  const a00 = a[0 * 4 + 0];
  const a01 = a[0 * 4 + 1];
  const a02 = a[0 * 4 + 2];
  const a03 = a[0 * 4 + 3];
  const a10 = a[1 * 4 + 0];
  const a11 = a[1 * 4 + 1];
  const a12 = a[1 * 4 + 2];
  const a13 = a[1 * 4 + 3];
  const a20 = a[2 * 4 + 0];
  const a21 = a[2 * 4 + 1];
  const a22 = a[2 * 4 + 2];
  const a23 = a[2 * 4 + 3];
  const a30 = a[3 * 4 + 0];
  const a31 = a[3 * 4 + 1];
  const a32 = a[3 * 4 + 2];
  const a33 = a[3 * 4 + 3];

  return [
    b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
    b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
    b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
    b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
    b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
    b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
    b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
    b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
    b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
    b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
    b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
    b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
    b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
    b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
    b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
    b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
  ];
}

export function invertMatrix4(matrix) {
  // based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
  const n11 = matrix[0];
  const n21 = matrix[1];
  const n31 = matrix[2];
  const n41 = matrix[3];
  const n12 = matrix[4];
  const n22 = matrix[5];
  const n32 = matrix[6];
  const n42 = matrix[7];
  const n13 = matrix[8];
  const n23 = matrix[9];
  const n33 = matrix[10];
  const n43 = matrix[11];
  const n14 = matrix[12];
  const n24 = matrix[13];
  const n34 = matrix[14];
  const n44 = matrix[15];

  const t11 =
    n23 * n34 * n42 -
    n24 * n33 * n42 +
    n24 * n32 * n43 -
    n22 * n34 * n43 -
    n23 * n32 * n44 +
    n22 * n33 * n44;

  const t12 =
    n14 * n33 * n42 -
    n13 * n34 * n42 -
    n14 * n32 * n43 +
    n12 * n34 * n43 +
    n13 * n32 * n44 -
    n12 * n33 * n44;

  const t13 =
    n13 * n24 * n42 -
    n14 * n23 * n42 +
    n14 * n22 * n43 -
    n12 * n24 * n43 -
    n13 * n22 * n44 +
    n12 * n23 * n44;

  const t14 =
    n14 * n23 * n32 -
    n13 * n24 * n32 -
    n14 * n22 * n33 +
    n12 * n24 * n33 +
    n13 * n22 * n34 -
    n12 * n23 * n34;

  const det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;

  if (det === 0) return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  const detInv = 1 / det;

  matrix[0] = t11 * detInv;
  matrix[1] =
    (n24 * n33 * n41 -
      n23 * n34 * n41 -
      n24 * n31 * n43 +
      n21 * n34 * n43 +
      n23 * n31 * n44 -
      n21 * n33 * n44) *
    detInv;

  matrix[2] =
    (n22 * n34 * n41 -
      n24 * n32 * n41 +
      n24 * n31 * n42 -
      n21 * n34 * n42 -
      n22 * n31 * n44 +
      n21 * n32 * n44) *
    detInv;

  matrix[3] =
    (n23 * n32 * n41 -
      n22 * n33 * n41 -
      n23 * n31 * n42 +
      n21 * n33 * n42 +
      n22 * n31 * n43 -
      n21 * n32 * n43) *
    detInv;

  matrix[4] = t12 * detInv;

  matrix[5] =
    (n13 * n34 * n41 -
      n14 * n33 * n41 +
      n14 * n31 * n43 -
      n11 * n34 * n43 -
      n13 * n31 * n44 +
      n11 * n33 * n44) *
    detInv;

  matrix[6] =
    (n14 * n32 * n41 -
      n12 * n34 * n41 -
      n14 * n31 * n42 +
      n11 * n34 * n42 +
      n12 * n31 * n44 -
      n11 * n32 * n44) *
    detInv;

  matrix[7] =
    (n12 * n33 * n41 -
      n13 * n32 * n41 +
      n13 * n31 * n42 -
      n11 * n33 * n42 -
      n12 * n31 * n43 +
      n11 * n32 * n43) *
    detInv;

  matrix[8] = t13 * detInv;

  matrix[9] =
    (n14 * n23 * n41 -
      n13 * n24 * n41 -
      n14 * n21 * n43 +
      n11 * n24 * n43 +
      n13 * n21 * n44 -
      n11 * n23 * n44) *
    detInv;
  matrix[10] =
    (n12 * n24 * n41 -
      n14 * n22 * n41 +
      n14 * n21 * n42 -
      n11 * n24 * n42 -
      n12 * n21 * n44 +
      n11 * n22 * n44) *
    detInv;

  matrix[11] =
    (n13 * n22 * n41 -
      n12 * n23 * n41 -
      n13 * n21 * n42 +
      n11 * n23 * n42 +
      n12 * n21 * n43 -
      n11 * n22 * n43) *
    detInv;

  matrix[12] = t14 * detInv;

  matrix[13] =
    (n13 * n24 * n31 -
      n14 * n23 * n31 +
      n14 * n21 * n33 -
      n11 * n24 * n33 -
      n13 * n21 * n34 +
      n11 * n23 * n34) *
    detInv;

  matrix[14] =
    (n14 * n22 * n31 -
      n12 * n24 * n31 -
      n14 * n21 * n32 +
      n11 * n24 * n32 +
      n12 * n21 * n34 -
      n11 * n22 * n34) *
    detInv;

  matrix[15] =
    (n12 * n23 * n31 -
      n13 * n22 * n31 +
      n13 * n21 * n32 -
      n11 * n23 * n32 -
      n12 * n21 * n33 +
      n11 * n22 * n33) *
    detInv;

  return matrix;
}
