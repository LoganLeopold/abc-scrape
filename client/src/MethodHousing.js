import { useState, useEffect } from 'react';
import Geolocation from './Geolocation';
import Method from './Method';

const MethodHousing = ({ setCurrentLocation }) => {
  const [method, setMethod] = useState('')
  const [typed, setTyped] = useState('')
  const [geolocation, setGeolocation] = useState('')

  const typedChange = (e) => {
    setTyped(e.target.value)
  }

  useEffect(()=>{ 
    setCurrentLocation({[method]: method === 'geolocation' ? geolocation : typed})
  },[method, geolocation, typed])
  
  return (
    <div className='input_group'>
      <h2>2. Choose search method.</h2>

      <div className='location_method fade-in'>
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
      
      <Method thisMethod={'written'} currentMethod={method}>
        <input className="form_input" value={typed} type="text" name="current_location" placeholder='City, State' onChange={typedChange} htmlFor="link_submit" disabled={method !== 'written'} required={method === 'written'}/>
      </Method>
      
      <Method thisMethod={'geolocation'} currentMethod={method}>
        <Geolocation 
          setGeolocation={setGeolocation}
        />
      </Method>
    </div>
  )
}

export default MethodHousing;