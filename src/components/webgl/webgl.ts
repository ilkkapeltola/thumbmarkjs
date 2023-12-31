import { componentInterface, includeComponent } from '../../factory'
import { hash } from '../../utils/hash'

async function createWebGLFingerprint(): Promise<componentInterface> {
  return new Promise((resolve) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 200;
      canvas.height = 100;

      const gl = canvas.getContext('webgl');

      if (!gl) {
          throw new Error('WebGL not supported');
      }

      const vertexShaderSource = `
          attribute vec2 position;
          void main() {
              gl_Position = vec4(position, 0.0, 1.0);
          }
      `;

      const fragmentShaderSource = `
          precision mediump float;
          void main() {
              gl_FragColor = vec4(0.812, 0.195, 0.553, 0.921); // Set line color to white
          }
      `;

      const vertexShader = gl.createShader(gl.VERTEX_SHADER);
      const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

      if (!vertexShader || !fragmentShader) {
          throw new Error('Failed to create shaders');
      }

      gl.shaderSource(vertexShader, vertexShaderSource);
      gl.shaderSource(fragmentShader, fragmentShaderSource);

      gl.compileShader(vertexShader);
      gl.compileShader(fragmentShader);

      const shaderProgram = gl.createProgram();

      if (!shaderProgram) {
          throw new Error('Failed to create shader program');
      }

      gl.attachShader(shaderProgram, vertexShader);
      gl.attachShader(shaderProgram, fragmentShader);
      gl.linkProgram(shaderProgram);
      gl.useProgram(shaderProgram);

      // Set up vertices to form lines
      const numSpokes: number = 137;
      const vertices = new Float32Array(numSpokes * 4);
      const angleIncrement = (2 * Math.PI) / numSpokes;

      for (let i = 0; i < numSpokes; i++) {
          const angle = i * angleIncrement;

          // Define two points for each line (spoke)
          vertices[i * 4] = 0; // Center X
          vertices[i * 4 + 1] = 0; // Center Y
          vertices[i * 4 + 2] = Math.cos(angle) * (canvas.width / 2); // Endpoint X
          vertices[i * 4 + 3] = Math.sin(angle) * (canvas.height / 2); // Endpoint Y
      }

      const vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

      const positionAttribute = gl.getAttribLocation(shaderProgram, 'position');
      gl.enableVertexAttribArray(positionAttribute);
      gl.vertexAttribPointer(positionAttribute, 2, gl.FLOAT, false, 0, 0);

      // Render
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.LINES, 0, numSpokes * 2);

      const dataURL = canvas.toDataURL();

      // Close WebGL context
      gl.deleteProgram(shaderProgram);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      canvas.remove();
  
      resolve({
        'imageHash': hash(JSON.stringify(dataURL)).toString(),
        //'dataUrl': dataURL, // a hash is smaller
        'renderer': gl.getParameter(gl.RENDERER),
        'vendor': gl.getParameter(gl.VENDOR),
        'version': gl.getParameter(gl.VERSION),
        'shadingLanguageVersion': gl.getParameter(gl.SHADING_LANGUAGE_VERSION)
      });
    } catch (error) {
      resolve( {
        'webgl': 'unsupported'
      });
    }
    });
  }

  includeComponent('webgl', createWebGLFingerprint);