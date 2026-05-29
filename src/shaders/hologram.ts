export const hologramVertexShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec3 transformed = position + normal * sin((position.y + uTime) * 5.0) * 0.035;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
  }
`;

export const hologramFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    float scan = sin((vUv.y * 52.0) + (uTime * 3.6));
    float rim = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
    float alpha = 0.14 + rim * 0.5 + smoothstep(0.82, 1.0, scan) * 0.18;
    vec3 color = uColor + vec3(0.08, 0.02, 0.0) * scan;
    gl_FragColor = vec4(color, alpha);
  }
`;
