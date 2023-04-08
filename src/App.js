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

// loader.load().then( async (google) => {
//   const { Map } = await google.maps.importLibrary("maps");
//   map = new Map(
//     document.getElementById("map"), 
//     {
//       center: {lat: 36.8479673, lng: -76.16874849999999},
//       zoom: 17,
//     }
//   );

//   const marker = new google.maps.Marker({
//     position: {lat: 36.8479673, lng: -76.16874849999999},
//     label: "Home",
//     map: map, 
//     clickable: true
//   });
// })

function App() {
  const render = useRef(false)

  const getDoc = async () => {
    console.log("GETDOC")
    try {
      const response = await axios.get(
        'http://localhost:3001/grabAbc',
      );
      console.log(response.data)
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
      // getDoc();
      // getMapTest();
      getPlaceTest()
    }
  });

  return (
    <div className="App enable-view">
      <div className="enable-view" id="map"></div>
    </div>
  );
}

export default App;
