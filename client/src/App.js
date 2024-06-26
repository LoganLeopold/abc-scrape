import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './App.css';
import './fonts/youre gone.otf'
import './fonts/youre gone it.otf'
import MethodHousing from './MethodHousing';

const App = () => {
  const [dropUrl, setDropUrl] = useState('')
  const [listUrl, setListUrl] = useState({})
  const [currentLocation, setCurrentLocation] = useState('')
  const formRef = useRef(null)
  const currentLocationMethod = Object.keys(currentLocation)[0]

  console.log(listUrl.written)

  const resetListUrl = () => { // Resets listUrl if underlying City changes
    console.log('resetListUrl')
    setListUrl(({[currentLocationMethod]: value, ...listUrl})=>{
      return listUrl
    })
  }
    
  const onUrlInputChange = (e) => {
    setDropUrl(e.target.value)
  }

  const processLocations = async (e) => {
    e.preventDefault()
    formRef.current.reportValidity()
    if (!formRef.current.checkValidity()) { 
      return 
    }
    
    let payload = { dropUrl }
    if (currentLocation) {
      // is either returning a typed city + state OR json-stringified coordinates
      payload['currentLocation'] = Object.values(currentLocation)[0]
    } else {
      return 
    }

    try {
      const response = await axios.post(
        // '/api/processLocations', 
        'http://localhost:3001/processLocations',
        payload,
      );
      setListUrl({[currentLocationMethod]: response.data})
    } catch (error) {
      console.log(error)
    }
  }

  const totalReset = () => {
    setListUrl('')
    setDropUrl('')
    setCurrentLocation('')
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
          <MethodHousing 
            setCurrentLocation={setCurrentLocation}
            resetListUrl={resetListUrl}
          />
        }

        { dropUrl && 
          <div className="input_group submissions">
            { currentLocation[currentLocationMethod] && !listUrl[currentLocationMethod] &&
              <>
                <h2>3. Get closest stores as waypoints.</h2>
                <input type="submit" value="Get My Link" onClick={processLocations} htmlFor="link_submit"/>
              </>
            }
            { 
              Object.keys(listUrl).includes(currentLocationMethod) &&
                <>
                  <a href={listUrl[currentLocationMethod]} target='_blank' rel="noreferrer">{'Open In Maps >'}</a>
                  <button className='reset' onClick={() => totalReset()}>{'<< Start Over'}</button>
                </>
            }
          </div>
        }
      </form>
    </div>
  );
}

export default App;
