import React from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';

class GoogleMap extends React.Component {
  render() {
    const mapStyles = {
      width: '100%',
      height: '400px',
    };
    return (
      <Map
        google={this.props.google}
        zoom={14} // Adjust the initial zoom level
        style={mapStyles}
        initialCenter= {lat: -3.745,
    lng: -38.523,}
      >

        {/* Add map content here */}

      </Map>

    );

  }

}

export default GoogleApiWrapper({

  apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,

})(GoogleMap);