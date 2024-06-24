import { useState } from 'react';
import axios from 'axios';

const Geolocation = ({changeMethod, reportCoords}) => {
  const [currentCoords, setCurrentCoords] = useState('')
  const [status, setStatus] = useState('initialized')

  const geoLocateSuccess = (data) => {
    setStatus('success')
    const { latitude, longitude } = data.coords
    setCurrentCoords({lat: latitude, lng: longitude})
    reportCoords({lat: latitude, lng: longitude})
  }

  const geoLocateError = (error) => {
    setStatus('error')  
    // currentCoords takes string, so should work
    setCurrentCoords(error.message.length > 0 ? error.message : 'The gelocation encountered an error. Try using a city-state combo for now.')
  }

  const onGeoLocation = (e) => {
    e.preventDefault()
    setStatus('fetching')
    navigator.geolocation.getCurrentPosition(geoLocateSuccess, geoLocateError, {timeout: 20000})
  }

  return (
    <>
      {status === 'initialized' && 
        <button type="submit" value="Fetch Location >" onClick={onGeoLocation} htmlFor="location_fetch">Fetch Location</button>
      }
      {status === 'success' && 
        <div className="geolocations">
          <label>Latitude:</label>
          <input className="form_input geo" name="lat" value={currentCoords.lat} required/>
          <label>Longitude</label>
          <input className="form_input geo" name="lng" value={currentCoords.lng} required/>
          <button onClick={onGeoLocation} className=''>{'Re-fetch Coordinates'}</button>
        </div>
      }
      {status === 'fetching' &&
        <p>Fetching the location...</p>
      }
      {status === 'error' &&
        <p>{currentCoords}</p>
      }
      <button className='back' onClick={()=>{changeMethod()}}>{'< Use City, State Instead'}</button>
    </>
  )
}

export default Geolocation