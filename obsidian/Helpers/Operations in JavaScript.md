
# Vector subtraction

```js
function subtractVectors(a, b) {
	return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}
```

# Vector cross product

>The **cross product** of two vectors results in a vector that is perpendicular vector whose length ranges from 1 (if the two are perpendicular) and 0 (if they are parallel). 

```js
function cross(a, b) {
	return [a[1] * b[2] - a[2] * b[1],
	a[2] * b[0] - a[0] * b[2],
	a[0] * b[1] - a[1] * b[0]];
}
```

# Vector dot product

>The **dot product** of two vectors results in a number between -1 (if the they have the same direction) and 1 (if they have opposite directions). If they are perpendicular, the result is 0. In other words, is the **cosine** of the angle that they form.



# Vector normalization

>Normalizing means making the vector length = 1.

```js
function normalize(v) {
	var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
	// make sure we don't divide by 0.
	if (length > 0.00001) {
		return [v[0] / length, v[1] / length, v[2] / length];
	} else {
		return [0, 0, 0];
	}
}
```

# Matrix product 3x3

>**Order mattters**: transformations are applied from right to left.

```js
function multiplyManyMatrix3(...matrices) {
  let result = [
    1, 0, 0,
    0, 1, 0,
    0, 0, 1
  ];

  for (let i = matrices.length - 1; i >= 0; i--) {
    result = multiplyMatrix3(matrices[i], result);
  }
  
  return result;
}

function multiplyMatrix3(a, b) {
  const a00 = a[0 * 3 + 0];
  const a01 = a[0 * 3 + 1];
  const a02 = a[0 * 3 + 2];
  const a10 = a[1 * 3 + 0];
  const a11 = a[1 * 3 + 1];
  const a12 = a[1 * 3 + 2];
  const a20 = a[2 * 3 + 0];
  const a21 = a[2 * 3 + 1];
  const a22 = a[2 * 3 + 2];
  const b00 = b[0 * 3 + 0];
  const b01 = b[0 * 3 + 1];
  const b02 = b[0 * 3 + 2];
  const b10 = b[1 * 3 + 0];
  const b11 = b[1 * 3 + 1];
  const b12 = b[1 * 3 + 2];
  const b20 = b[2 * 3 + 0];
  const b21 = b[2 * 3 + 1];
  const b22 = b[2 * 3 + 2];

  return [
    b00 * a00 + b01 * a10 + b02 * a20,
    b00 * a01 + b01 * a11 + b02 * a21,
    b00 * a02 + b01 * a12 + b02 * a22,
    b10 * a00 + b11 * a10 + b12 * a20,
    b10 * a01 + b11 * a11 + b12 * a21,
    b10 * a02 + b11 * a12 + b12 * a22,
    b20 * a00 + b21 * a10 + b22 * a20,
    b20 * a01 + b21 * a11 + b22 * a21,
    b20 * a02 + b21 * a12 + b22 * a22,
  ];
}
```

# Matrix inverse 3x3

```js
function invertMatrix3(matrix) {
  const n11 = matrix[0];
  const n21 = matrix[1];
  const n31 = matrix[2];
  const n12 = matrix[3];
  const n22 = matrix[4];
  const n32 = matrix[5];
  const n13 = matrix[6];
  const n23 = matrix[7];
  const n33 = matrix[8];
  const t11 = n33 * n22 - n32 * n23;
  const t12 = n32 * n13 - n33 * n12;
  const t13 = n23 * n12 - n22 * n13;
  const det = n11 * t11 + n21 * t12 + n31 * t13;

  if (det === 0) return [0, 0, 0, 0, 0, 0, 0, 0, 0];

  const detInv = 1 / det;

  matrix[0] = t11 * detInv;
  matrix[1] = (n31 * n23 - n33 * n21) * detInv;
  matrix[2] = (n32 * n21 - n31 * n22) * detInv;

  matrix[3] = t12 * detInv;
  matrix[4] = (n33 * n11 - n31 * n13) * detInv;
  matrix[5] = (n31 * n12 - n32 * n11) * detInv;

  matrix[6] = t13 * detInv;
  matrix[7] = (n21 * n13 - n23 * n11) * detInv;
  matrix[8] = (n22 * n11 - n21 * n12) * detInv;

  return matrix;
}

```

# Matrix transpose 4x4

```js
function transposeMatrix4(m) {
	return [
		m[0], m[4], m[8], m[12],
		m[1], m[5], m[9], m[13],
		m[2], m[6], m[10], m[14],
		m[3], m[7], m[11], m[15],
	];
}
```

# Matrix product 4x4

```js
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
```

# Matrix inverse 4x4

```js
function multiplyManyMatrix4(...matrices) {
  let result = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ];
  
  for (let i = matrices.length - 1; i >= 0; i--) {
    result = multiplyMatrix4(matrices[i], result);
  }
  
  return result;
}

export function invertMatrix4(matrix) {
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
```