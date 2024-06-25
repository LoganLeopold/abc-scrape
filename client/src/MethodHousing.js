import { useState, useEffect } from 'react';
import Geolocation from './Geolocation';

const MethodHousing = ({ setCurrentLocation }) => {
  const [method, setMethod] = useState('')
  const [typed, setTyped] = useState('')
  const [geolocated, setGeolocation] = useState('')

  const typedChange = (e) => {
    setTyped(e.target.value)
  }

  useEffect(()=>{
    setCurrentLocation(method === 'geolocation' ? geolocated : typed)
  },[method, geolocated, typed])
  
  return (
    <div className='input_group'>
      <h2>2. Choose search method.</h2>

      <div className='location_method'>
        <button 
          className={`${method === 'written' ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault()
            setMethod('written')
          }}
        >
          Type a City, State
        </button>
        <button 
          className={`${method === 'geolocation' ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault()
            setMethod('geolocation')
          }}
        >
          Geolocation
        </button>
      </div>
      
      <div>
        <div className={`method ${method === 'written' ? 'active' : ''}`}>
          <input className="form_input" value={typed} type="text" name="current_location" placeholder='City, State' onChange={typedChange} htmlFor="link_submit" disabled={method !== 'written'} required={method === 'written'}/>
        </div>
        
        <div className={`method ${method === 'geolocation' ? 'active' : ''}`}>
          <Geolocation 
            setGeolocation={setGeolocation}
          />
        </div>
      </div>

    </div>
  )
}

export default MethodHousing;