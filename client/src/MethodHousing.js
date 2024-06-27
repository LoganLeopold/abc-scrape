import { useState, useEffect } from 'react';
import Geolocation from './Geolocation';

const MethodHousing = ({ setCurrentLocation, resetResults }) => {
  const [method, setMethod] = useState('')
  const [typed, setTyped] = useState('')
  const [geolocated, setGeolocation] = useState('')
  const [usedMethods, setUsedMethods] = useState({'written': 0, 'geolocation': 0}) // just for one-time fadeIn purposes

  const typedChange = (e) => {
    setTyped(e.target.value)
    resetResults()
  }

  useEffect(()=>{
    setCurrentLocation({[method]: method === 'geolocation' ? geolocated : typed})
    setUsedMethods((prev) => {
      if (prev[method] <= 2) prev[method]++
      return prev
    })
  },[method, geolocated, typed])
  
  return (
    <div className='input_group'>
      <h2>2. Choose search method.</h2>

      <div className='location_method fadeIn'>
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
      
      { usedMethods['written'] > 0 &&
        <div className={`method ${method === 'written' ? 'active' : ''} ${ usedMethods['written'] <= 2 ? 'fadeIn' : ''}`}>
          <input className="form_input" value={typed} type="text" name="current_location" placeholder='City, State' onChange={typedChange} htmlFor="link_submit" disabled={method !== 'written'} required={method === 'written'}/>
        </div>
      }
      
      { usedMethods['geolocation'] > 0 &&
        <div className={`method ${method === 'geolocation' ? 'active' : ''} ${ usedMethods['geolocation'] <= 2 ? 'fadeIn' : ''}`}>
          <Geolocation 
            setGeolocation={setGeolocation}
            resetResults={resetResults}
          />
        </div>
      }

    </div>
  )
}

export default MethodHousing;