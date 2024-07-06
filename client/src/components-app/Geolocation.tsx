import { MouseEventHandler, useState } from 'react';
import * as types from '../types'

const Geolocation = ({ setGeolocation, resetResults }) => {
  const [currentCoords, setCurrentCoords] = useState<types.Coordinates>({})
  const [status, setStatus] = useState<types.ProcessState>('initialized')
  const [fadeCoords, setFadeCoords] = useState(true)

  const geoLocateSuccess = (data) => {
    setStatus('success')
    const { latitude, longitude } = data.coords
    setCurrentCoords({lat: latitude, lon: longitude})
    setGeolocation(JSON.stringify({lat: latitude, lon: longitude}))
    setTimeout(()=>{setFadeCoords(false)}, 1000)
  }

  const geoLocateError = (error: GeolocationPositionError) => {
    resetResults()
    setStatus('error')  
    // currentCoords takes string, so should work
    setGeolocation({})
    setCurrentCoords(error.message.length > 0 ? error.message : 'The gelocation encountered an error. Try using a city-state combo for now.')
  }

  const onGeoLocation = (e: React.MouseEvent) => {
    setGeolocation('')
    resetResults()
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
          <div>
            <p><span>Latitude:</span><span>  {currentCoords.lat}</span></p>
            <p><span>Longitude:</span><span>  {currentCoords.lon}</span></p>
          </div>
          <button onClick={onGeoLocation} className=''>{'Re-fetch Coordinates'}</button>
        </div>
      }
      {status === 'fetching' &&
        <p>Fetching the location...</p>
      }
      {status === 'error' &&
      <>
        <p>{currentCoords}</p>
        <button onClick={onGeoLocation}>Try Fetch Again</button>
      </>
      }
    </>
  )
}

export default Geolocation
