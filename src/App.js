import { useEffect, useRef } from 'react';
import axios from 'axios';
import { Loader } from "@googlemaps/js-api-loader"
import './App.css';

const loader = new Loader({
  apiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
  version: "weekly",
  libraries: ["maps"]
})

let map;
let googleObj;

loader.load().then( async (google) => {
  googleObj = google;
  const { Map } = await google.maps.importLibrary("maps");
  map = new Map(
    document.getElementById("map"), 
    {
      center: {lat: 38.885445, lng: -76.992772},
      zoom: 12,
    }
  );
})

function App() {
  const render = useRef(false)

  const processLocations = async () => {
    try {
      const response = await axios.get(
        'http://localhost:3001/processLocations',
      );

      console.log(response)
      // for (let i = 0; i < response.data.length; i++) {
      //   const place = response.data[i]
      //   console.log(place)
      //   const marker = new googleObj.maps.Marker({
      //     position: place.geometry.location,
      //     label: "ABC",
      //     map: map, 
      //     clickable: true
      //   });
      // }
    } catch (error) {
      console.log(error)
    }
  }

  const getMapTest = async() => {
    try {
      const response = await axios.get(
        'http://localhost:3001/testMap',
      );
      console.log(response)
    } catch (error) { 
      console.log(error)
    }
  }

  const getPlaceTest = async() => {
    console.log("placeTest")
    try {
      const response = await axios.get(
        'http://localhost:3001/testPlace',
        {
          params: {
            test: "got 'im"
          }
        }
      );
      console.log(response)
    } catch (error) { 
      console.log(error)
    }
  }

  useEffect(() => {
    if (render.current === false) {
      render.current = true
    } else {
      processLocations();
    }
    
  });

  return (
    <div className="App enable-view">
      <div className="enable-view" id="map"></div>
    </div>
  );
}

export default App;
