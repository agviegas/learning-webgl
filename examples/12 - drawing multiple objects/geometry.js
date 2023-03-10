import { normalData, positionData } from "./buffers.js";

export class FGeometry {
  vao;
  gl;
  size = positionData.length / 3;
  attributes;
  initialized = false;

  center = [-20, -80, 0];

  constructor(gl) {
    this.gl = gl;
    this.attributes = {
      a_position: {
        size: 3,
        type: gl.FLOAT,
        normalize: false,
        stride: 0,
        offset: 0,
        buffer: new Float32Array(positionData),
      },
      a_normal: {
        size: 3,
        type: gl.FLOAT,
        normalize: false,
        stride: 0,
        offset: 0,
        buffer: new Float32Array(normalData),
      },
    };
  }

  getCenter() {
    const [x, y, z] = this.center;
    // prettier-ignore
    return [
      1, 0, 0, 0,  
      0, 1, 0, 0, 
      0, 0, 1, 0,
      x, y, z, 1
    ];
  }

  prepareToRender() {
    this.gl.bindVertexArray(this.vao);
  }

  setupAttributes(material) {
    if (this.initialized) return;
    const { gl, program } = material;
    this.createAndSelectVAO();
    this.setupAttribute(gl, program, "a_position");
    this.setupAttribute(gl, program, "a_normal");
    this.deselectVAO();
    this.initialized = true;
  }

  createAndSelectVAO() {
    if (!this.vao) {
      this.vao = this.gl.createVertexArray();
    }
    this.gl.bindVertexArray(this.vao);
  }

  deselectVAO() {
    this.gl.bindVertexArray(null);
  }

  setupAttribute(gl, program, name) {
    const data = this.attributes[name];
    const location = gl.getAttribLocation(program, name);
    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, data.buffer, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(location);
    this.setupAttributePointer(location, data);
  }

  setupAttributePointer(location, data) {
    const { size, type, normalize, stride, offset } = data;
    this.gl.vertexAttribPointer(
      location,
      size,
      type,
      normalize,
      stride,
      offset
    );
  }
}
