## step(a, b)

- If a>b, it returns 0
- If b<a, it returns 1.

## smoothstep(a, b, c)

- If c < a, returns 0.
- If c > b, returns 1.
- If c is contained between a and b, returns a [smooth interpolation](https://en.wikipedia.org/wiki/Smoothstep) between 0 and 1.

## clamp(a, b, c)

- If a < b, returns b.
- If a > c, returns c.
- If a is contained between b and c, returns a.

## mix(a, b, c)

- Returns a linear interpolation of a and b, using c as the percentage.