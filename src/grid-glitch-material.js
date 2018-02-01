var scene, camera, renderer;
// From: https://aframe.io/docs/0.5.0/components/material.html#registershader
// material-grid-glitch.js
const vertexShader = `
  // vertex.glsl
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
  `;
const fragmentShader = `
  // fragment.glsl
  varying vec2 vUv;
  uniform vec3 color;
  uniform float time;
  void main() {
    // Use sin(time), which curves between 0 and 1 over time,
    // to determine the mix of two colors:
    //    (a) Dynamic color where 'R' and 'B' channels come
    //        from a modulus of the UV coordinates.
    //    (b) Base color.
    //
    // The color itself is a vec4 containing RGBA values 0-1.
    gl_FragColor = mix(
      vec4(mod(vUv , 0.05) * 20.0, 1.0, 1.0),
      vec4(color, 1.0),
      sin(time)
    );
  }
  `;

AFRAME.registerComponent('listen-for-color', {
  init : function () {
    camera = this.el.sceneEl.camera;
    renderer = this.el.sceneEl.renderer;
    scene = this.el.sceneEl.object3D;
    // console.log("wowee", camera, renderer, scene, globalGui.lineColor);
    var gui = dat.GUIVR.create( 'Color & stuff' );
    gui.add(globalGui.lineColor, 'b');
    gui.add(globalGui, 'tubeRadius').onChange( function(val) {
      console.log(val);
    });
    gui.position.y = "1.6";
    gui.position.z = "-1";
    scene.add(gui);

    // var input = dat.GUIVR.addInputObject( controllerObject3D );
    // scene.add( input ); // this will add helpers to your scene (laser & cursor)
    dat.GUIVR.enableMouse( camera, renderer );
  }
});


var globalGui = {
  lineColor : new THREE.Color(0,0,1),
  tubeRadius : 0.0125,
  craneWidth : 0.5
}

AFRAME.registerComponent('material-grid-glitch', {
  schema: {color: {type: 'color'}},
  /**
   * Creates a new THREE.ShaderMaterial using the two shaders defined
   * in vertex.glsl and fragment.glsl.
   */
  init: function () {
    const data = this.data;

    this.material  = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0.0 },
        color: { value: globalGui.lineColor }
      },
      vertexShader,
      fragmentShader
    });
    this.applyToMesh();
    this.el.addEventListener('model-loaded', () => this.applyToMesh());
  },
  /**
   * Update the ShaderMaterial when component data changes.
   */
  update: function () {
    this.material.uniforms.color.value.set(this.data.color);
  },
  /**
   * Apply the material to the current entity.
   */
  applyToMesh: function() {
    const mesh = this.el.getObject3D('mesh')
    if (mesh) {
      var mat = this.material
      mesh.traverse(function (node) {
        if (node.isMesh) {
          node.material = mat
        }
      })
    }
  },
  /**
   * On each frame, update the 'time' uniform in the shaders.
   */
  tick: function (t) {
    this.material.uniforms.time.value = t / 1000;
  }

})
