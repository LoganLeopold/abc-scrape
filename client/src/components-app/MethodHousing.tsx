import { useState, useEffect, PropsWithChildren, Dispatch, SetStateAction } from 'react';
import Geolocation from './Geolocation';
import * as types from '../types'
import {CurrentLocation, SearchMethod, Coordinates} from '../types'

interface Props {
  setCurrentLocation: Dispatch<SetStateAction<CurrentLocation>>
  resetResults: () => void
}

const MethodHousing: React.FC<PropsWithChildren<Props>> = ({ setCurrentLocation, resetResults }) => {
  const [method, setMethod] = useState<SearchMethod>('geolocation')
  const [typed, setTyped] = useState<string>()
  const [geolocated, setGeolocation] = useState('')
  const [usedMethods, setUsedMethods] = useState<{
    [k in types.SearchMethod]: number
  }>({'written': 0, 'geolocation': 0}) // just for one-time fadeIn purposes

  const typedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    <div className='input_group method-housing fadeIn'>
      <h2>2. Choose search method.</h2>

      <div className='button--select'>
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
      // ${ usedMethods['written'] <= 2 ? 'fadeIn' : ''}
        <div className={`method ${method === 'written' ? 'active' : ''}`}>
          <input className="city-input" value={typed} type="text" name="current_location" placeholder='City, State' onChange={typedChange} disabled={method !== 'written'} required={method === 'written'}/>
        </div>
      }
      
      { usedMethods['geolocation'] > 0 &&
      // ${ usedMethods['geolocation'] <= 2 ? 'fadeIn' : ''}
        <div className={`method ${method === 'geolocation' ? 'active' : ''}`}>
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
