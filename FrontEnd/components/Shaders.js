import { Shaders, GLSL } from 'gl-react';

export const shaders = Shaders.create({
  sepia: {
    frag: GLSL`
      precision highp float;
      varying vec2 uv;
      uniform sampler2D t;

      void main() {
        vec4 color = texture2D(t, uv);
        float r = color.r * 0.393 + color.g * 0.769 + color.b * 0.189;
        float g = color.r * 0.349 + color.g * 0.686 + color.b * 0.168;
        float b = color.r * 0.272 + color.g * 0.534 + color.b * 0.131;
        gl_FragColor = vec4(r, g, b, 1.0);
      }
    `,
  },
});
