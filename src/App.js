import React, { Component } from 'react';
import { AFrameRenderer, Marker } from 'react-web-ar';

/**
 * webcam is the default source type for analysing the marker
 */
class ReactArApp extends Component {
  render() {
    return (
      <AFrameRenderer inherent={true}>
        <Marker parameters={{ preset: "hiro" }}>
          <a-obj-model id="model_base"
                       src="src/assets/v.obj"
                       mtl="src/assets/v.mtl">
            <a-animation
              attribute="rotation"
              to="360 0 0"
              dur="2000"
              easing="linear"
              repeat="indefinite"
            />
          </a-obj-model>
        </Marker>
      </AFrameRenderer>
    );
  }
}

export default ReactArApp;
