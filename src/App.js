import React, { Component } from 'react';
import { AFrameRenderer, Marker } from 'react-web-ar';

/**
 * webcam is the default source type for analysing the marker
 */
class ReactArApp extends Component {
  render() {
    return (
      <AFrameRenderer
        arToolKit={{ trackingMethod: "tango" }}
        inherent={true}
      >
        <Marker parameters={{ preset: "hiro" }}>
          <a-entity
            obj-model="obj: url(https://raw.githubusercontent.com/vitalishapovalov/react-ar/master/src/assets/v.obj); mtl: url(https://raw.githubusercontent.com/vitalishapovalov/react-ar/master/src/assets/v.mtl)"
            position="-0.1 0.15 0"
            scale="0.1 0.3 0.3"
          />
        </Marker>
      </AFrameRenderer>
    );
  }
}

export default ReactArApp;
