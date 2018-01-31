import React, { Component } from 'react';
import { AFrameRenderer, Marker } from 'react-web-ar';

/**
 * webcam is the default source type for analysing the marker
 */
class ReactArApp extends Component {
  render() {
    return (
      <AFrameRenderer
        inherent={true}
      >
        <Marker parameters={{ preset: "hiro" }}>
          <a-entity
            obj-model="obj: url(https://raw.githubusercontent.com/vitalishapovalov/react-ar/master/src/assets/v.obj); mtl: url(https://raw.githubusercontent.com/vitalishapovalov/react-ar/master/src/assets/v.mtl)"
          >
            <a-animation
              attribute="rotation"
              to="360 0 0"
              dur="2000"
              easing="linear"
              repeat="indefinite"
            />
          </a-entity>
          <a-box color="blue" position="0 0.1 0" scale="0.4 0.8 0.8">
            <a-animation
              attribute="rotation"
              to="360 0 0"
              dur="2000"
              easing="linear"
              repeat="indefinite"
            />
          </a-box>
        </Marker>
      </AFrameRenderer>
    );
  }
}

export default ReactArApp;
