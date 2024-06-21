import { useRef, useState } from 'react';
import axios from 'axios';
import './App.css';
import './fonts/youre gone.otf'
import './fonts/youre gone it.otf'

function App() {
  const [dropUrl, setDropUrl] = useState('')
  const [listUrl, setListUrl] = useState('')
  const [currentLocation, setCurrentLocation] = useState('')
  const [currentCoords, setCurrentCoords] = useState('')
  const [submitDisabled, setSubmitDisabled] = useState(true)
  const [locationMethod, setLocationMethod] = useState('')
  const formRef = useRef(null)

  const errorMessages = {
    url: "Add a drop url",
    location: "You haven't given a proper city, state or used your current location to add coordinates."
  }

  const geoLocateSuccess = (data) => {
    const { latitude, longitude } = data.coords
    setCurrentCoords({lat: latitude, lng: longitude})
    setSubmitDisabled(false)
    if (currentLocation) { setCurrentLocation('') }
  }

  const geoLocateError = (error) => {
    console.log(error)
    setSubmitDisabled(false)
  }

  const methodChange = () => {
    console.log("methodChange")
    setLocationMethod(''); 
    setListUrl('');
    setCurrentCoords('')
    setCurrentLocation('')
  }

  const onCurrentLocationChange = (e) => {
    setCurrentLocation(e.target.value)
    if (submitDisabled === true && currentLocation.length > 0) {
      setSubmitDisabled(false)
    }
    if (currentCoords) { setCurrentCoords('') }
  }

  const onGeoLocation = (e) => {
    e.preventDefault()
    setSubmitDisabled(true)
    console.log(navigator.geolocation)
    navigator.geolocation.getCurrentPosition(geoLocateSuccess, geoLocateError)
  }

  const onUrlInputChange = (e) => {
    setDropUrl(e.target.value)
    if (currentCoords.lat) {
      setCurrentCoords('')
    }
  }

  const processLocations = async (e) => {
    e.preventDefault()
    formRef.current.reportValidity()
    if (!formRef.current.checkValidity()) { 
      return 
    }
    if (locationMethod === 'geolocation' && Object.entries(currentCoords).length === 0) { return }

    let payload = { dropUrl }
    if (currentCoords.lat) {
      payload['currentCoords'] = currentCoords
    } else if (currentLocation.length > 0) {
      payload['currentLocation'] = currentLocation
    } else {
      setLocationMethod('')
      return 
    }

    try {
      const response = await axios.post(
        '/api/processLocations', 
        payload,
      );
      setListUrl(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const reset = () => {
    setDropUrl('')
    setListUrl('')
    setCurrentCoords('')
    setLocationMethod('')
  }

  return (
    <div className="App">
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
      <form id="link_submit" ref={formRef}>
        <div className='input_group'>
          <h2>1. Place the latest drop url.</h2>
          <input className="form_input" type="text" name="drop_url" placeholder='Drop Url Goes Here' onChange={onUrlInputChange} htmlFor="link_submit" required value={dropUrl}/>
        </div>

        {dropUrl &&
          <div className='input_group'>
            <h2>2. Choose search area.</h2>
            {locationMethod === '' &&
              <div className='location_method'>
                <button onClick={() => setLocationMethod('written')}>A Typed City, State</button>
                <button onClick={() => setLocationMethod('geolocation')}>Your Current Location</button>
              </div>
            }

            {locationMethod === 'written' && (
              <>
                <input className="form_input" type="text" name="current_location" placeholder='City, State' onChange={onCurrentLocationChange} htmlFor="link_submit" disabled={locationMethod !== 'written'} required={locationMethod === 'written'}/>
                <button onClick={methodChange} className='back'>{listUrl ? '< Change Method' : '< Use Geolocation Instead'}</button>
              </>
            )}
            
            { locationMethod === 'geolocation' && 
              <>
                {Object.entries(currentCoords).length === 0 && 
                  <button type="submit" value="Fetch Location >" onClick={onGeoLocation} htmlFor="location_fetch" disabled={locationMethod !== 'geolocation'} required={locationMethod === 'geolocation'}>Fetch Location</button>
                }
                {Object.entries(currentCoords).length > 0 && 
                  <div className="geolocations">
                    <label>Latitude:</label>
                    <input className="form_input geo" name="lat" value={currentCoords.lat} required/>
                    <label>Longitude</label>
                    <input className="form_input geo" name="lng" value={currentCoords.lng} required/>
                    <button onClick={() => setCurrentCoords('')} className=''>{'Reset Coordinates'}</button>
                  </div>
                }
                <button onClick={methodChange} className='back'>{listUrl ? '< Change Method' : '< Use City, State Instead'}</button>
              </>
            }
          </div>
        }

        {dropUrl && (currentCoords || currentLocation) &&
          <div className="input_group submissions">
            <h2>3. Get closest stores as waypoints.</h2>
            {!listUrl && <input type="submit" value="Get My Link" onClick={processLocations} htmlFor="link_submit"/>}
            { 
              listUrl &&
                <>
                  <a href={listUrl} target='_blank' rel="noreferrer">{'Open In Maps >'}</a>
                  <button className='reset' onClick={() => reset()}>{'<< Start Over'}</button>
                </>
            }
          </div>
        }
      </form>
    </div>
  );
}

export default App;
