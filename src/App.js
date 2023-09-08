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
  const [locationMethod, setLocationMethod] = useState('init')

  const geoLocateSuccess = (data) => {
    console.log(data.coords)
    const { latitude, longitude } = data.coords
    setSubmitDisabled(false)
    if (currentLocation) { setCurrentLocation('') }
  }

  const geoLocateError = (error) => {
    console.log(error)
    setSubmitDisabled(false)
  }

  const onCurrentLocationChange = (e) => {
    setCurrentLocation(e.target.value)
    if (currentCoords) { setCurrentCoords({lat: 0, lng: 0}) }
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
      setLocationMethod('init')
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
      <div className='input_group'>
        <input className="form_input" type="text" name="drop_url" placeholder='Drop Url Goes Here' onChange={onUrlInputChange}/>
      </div>

      {locationMethod === "init" &&
        <>
          <h2>Determine your search area:</h2>
          <div className='location_method'>
            <button onClick={() => setLocationMethod('written')}>Typed City, State</button>
            <button onClick={() => setLocationMethod('geolocation')}>Use Current Location</button>
          </div>
        </>
      }

      <div className="input_group">
        {locationMethod === 'written' && (
          <>
            <input className="form_input" type="text" name="current_location" placeholder='City, State' onChange={onCurrentLocationChange}/>
            <button onClick={() => setLocationMethod('init')} className='back'>{'< Pick a different method'}</button>
          </>
        )}
      </div>
      { locationMethod === 'geolocation' && 
        <>
          <input type="submit" value="Fetch Location >" onClick={onGeoLocation}/> 
          <button onClick={() => setLocationMethod('init')} className='back'>{'< Pick a different method'}</button>
        </>
      }

      <div className="submission">
        <input type="submit" value="Get My link" onClick={processLocations} disabled={submitDisabled}/>
        { 
          listUrl &&
            <a href={listUrl} target='_blank' rel="noreferrer">Click for Directions</a>
        }
      </div>
    </div>
  );
}

export default App;
