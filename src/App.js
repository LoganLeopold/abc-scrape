import { useState } from 'react';
import axios from 'axios';
import './App.css';
import './fonts/youre gone.otf'
import './fonts/youre gone it.otf'

function App() {
  const [dropUrl, setDropUrl] = useState('')
  const [listUrl, setListUrl] = useState('')
  const [currentLocation, setCurrentLocation] = useState('')
  const [currentCoords, setCurrentCoords] = useState({lat: 0, lng: 0})
  const [submitDisabled, setSubmitDisabled] = useState(false)
  const [locationMethod, setLocationMethod] = useState('')

  const geoLocateSuccess = (data) => {
    console.log(data.coords)
    const { latitude, longitude } = data.coords
    setSubmitDisabled(false)
  }

  const geoLocateError = (error) => {
    console.log(error)
    setSubmitDisabled(false)
  }

  const onCurrentLocationChange = (e) => {
    setCurrentLocation(e.target.value)
  }

  const onGeoLocation = (e) => {
    console.log('geoLocation')
    setSubmitDisabled(true)
    navigator.geolocation.getCurrentPosition(geoLocateSuccess, geoLocateError)
  }

  const onUrlInputChange = (e) => {
    setDropUrl(e.target.value)
  }

  const processLocations = async () => {
    let payload = { dropUrl }

    if (currentCoords.lat !== 0) {
      payload['currentCoords'] = currentCoords
    } else if (currentLocation.length > 0) {
      payload['currentLocation'] = currentLocation
    } else {
      return 
    }

    try {
      const response = await axios.post(
        'http://localhost:3001/processLocations', 
        payload,
      );
      setListUrl(response.data)
      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="App enable-view">
      <h1>
        <span className="title_animate">A</span>
        <span className="title_animate">B</span>
        <span className="title_animate">C </span>
        <span className="title_animate">A</span>
        <span className="title_animate">S</span>
        <span className="title_animate">S</span>
        <span className="title_animate">I</span>
        <span className="title_animate">S</span>
        <span className="title_animate">T</span>
      </h1>
      <label className="form_label">ABC's Drop URL</label>
      <input type="text" name="drop_url" placeholder='Drop Url:' onChange={onUrlInputChange}/>
      <h2>Options:</h2>
      { locationMethod.length < 1 && (
        <>
          <button onClick={() => setLocationMethod('written')}>Written City, State</button>
          <button onClick={() => setLocationMethod('geolocation')}>Use Your Current Location</button>
        </>
      )}
      { locationMethod === 'written' && (
        <>
          <label className="form_label">Written Location (City, State)</label>
          <input type="text" name="current_location" placeholder="E.g.: Richmond, VA" onChange={onCurrentLocationChange}/>
        </>
      )}
      { locationMethod === 'geolocation' && 
          <input type="submit" value="Use your location" onClick={onGeoLocation}/> 
      }
      { locationMethod.length > 0 &&
          <button onClick={() => setLocationMethod('')}>{'<-- Pick a different method'}</button>
      }
      <input type="submit" value="Submit" onClick={processLocations} disabled={submitDisabled}/>
      { 
        listUrl &&
          <a href={listUrl} target='_blank' rel="noreferrer">Click for Directions</a>
      }
    </div>
  );
}

export default App;
