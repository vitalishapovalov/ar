AFRAME.registerComponent('refraction-material', {
  schema: {
    refractionIndex: { type : 'number', default: 0.9 },
    distance: { type : 'number', default: 1 },
    tintColor : { default : [255, 255, 255] },
    opacity: { default : 1 }
  },

  /**
   * Create shaders, generate material and apply mesh
   */
  init: function () {
    const vertexShader = verbatim(function () {/*
        varying vec3 vRefract;
        uniform float refractionIndex;

        void main() {
            vec4 mPosition = modelMatrix * vec4( position, 1.0 );
            vec3 nWorld = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );
            vRefract = normalize( refract( normalize( mPosition.xyz - cameraPosition ), nWorld, refractionIndex ) );

            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
    */});

    const fragShader = verbatim(function () {/*
        uniform sampler2D texture;
        varying vec3 vRefract;
        uniform float distance;
        uniform float opacity;
        uniform vec3 tintColor;

        void main(void) {
            vec2 p = vec2(vRefract.x*distance + 0.5, vRefract.y*distance + 0.5);
            vec3 color = texture2D( texture, p ).rgb;

            // float mixThresh = 0.05;
            // color.r = mix(color.r, normalize(tintColor.r), mixThresh);
            // color.g = mix(color.g, normalize(tintColor.g), mixThresh);
            // color.b = mix(color.b, normalize(tintColor.b), mixThresh);

            // color.r = normalize(color.r * tintColor.r);
            // color.g = normalize(color.g * tintColor.g);
            // color.b = normalize(color.b * tintColor.b);
            gl_FragColor = vec4(color, opacity );
            // gl_FragColor = vec4(normalize(tintColor), opacity );
        }
    */});

    const texture = new THREE.VideoTexture(this.el.sceneEl.systems.arjs.arToolkitSource.domElement);

    texture.minFilter = THREE.NearestFilter;

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0.0 },
        texture: { type: 't', value: texture },
        refractionIndex: { type: 'f', value: this.data.refractionIndex },
        distance: { type: 'f', value: this.data.distance },
        tintColor: { type: 'vec3', value: new THREE.Color(this.data.tintColor.r, this.data.tintColor.g, this.data.tintColor.b)},
        opacity: { type: 'f', value: this.data.opacity }
      },
      vertexShader : vertexShader,
      fragmentShader : fragShader
    });
    this.material.uniforms.texture.value.wrapS = this.material.uniforms.texture.value.wrapT = THREE.ClampToEdgeWrapping;
    this.applyToMesh();
    this.el.addEventListener('model-loaded', this.applyToMesh.bind(this));
  },

  /**
   * Apply the material to the current entity.
   */
  applyToMesh: function() {
    const mesh = this.el.getObject3D('mesh');
    if (mesh) {
      var mat = this.material;
      mesh.traverse(function (node) {
        if (node.isMesh) {
          node.material = mat
        }
      });
    }
  },

  /**
   * Set defaults
   *
   * @param {Number} t
   */
  tick: function (t) {
    this.material.uniforms.time.value = t / 1000;
    this.material.uniforms.refractionIndex.value = this.data.refractionIndex;
    this.material.uniforms.distance.value = this.data.distance;
    this.material.uniforms.tintColor.value = this.data.tintColor;
    this.material.uniforms.opacity.value = this.data.opacity;
  }
});

/**
 * Process shader code
 *
 * @param {Function} fn
 * @return {String}
 */
function verbatim(fn){return fn.toString().match(/[^]*\/\*\s*([^]*)\s*\*\/\}$/)[1]}
