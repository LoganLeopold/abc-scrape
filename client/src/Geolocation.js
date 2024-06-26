import { useState } from 'react';

const Geolocation = ({ setGeolocation, used }) => {
  const [currentCoords, setCurrentCoords] = useState('')
  const [status, setStatus] = useState('initialized')
  const [fadeCoords, setFadeCoords] = useState(true)

  const geoLocateSuccess = (data) => {
    setStatus('success')
    const { latitude, longitude } = data.coords
    setCurrentCoords({lat: latitude, lon: longitude})
    setGeolocation(JSON.stringify({lat: latitude, lon: longitude}))
    setTimeout(()=>{setFadeCoords(false)}, 1000)
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
        <div className={`geolocations ${fadeCoords ? 'fadeIn' : ''}`}>
          <label>Latitude:</label>
          <input className="form_input geo" name="lat" value={currentCoords.lat} required/>
          <label>Longitude</label>
          <input className="form_input geo" name="lon" value={currentCoords.lon} required/>
          <button onClick={onGeoLocation} className=''>{'Re-fetch Coordinates'}</button>
        </div>
      }
      {status === 'fetching' &&
        <p>Fetching the location...</p>
      }
      {status === 'error' &&
        <p>{currentCoords}</p>
      }
    </>
  )
}

export default Geolocation