import { useRef, useState } from 'react';
import axios from 'axios';
import './App.css';
import './fonts/youre gone.otf'
import './fonts/youre gone it.otf'
import MethodHousing from './MethodHousing';

const App = () => {
  const [dropUrl, setDropUrl] = useState('')
  const [listUrl, setListUrl] = useState('')
  const [currentLocation, setCurrentLocation] = useState({})

  const formRef = useRef(null)

  const errorMessages = {
    url: "Add a drop url",
    location: "You haven't given a proper city, state or used your current location to add coordinates."
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
      payload['currentLocation'] = currentLocation
    } else {
      return 
    }

    try {
      const response = await axios.post(
        // '/api/processLocations', 
        'http://localhost:3001/processLocations',
        payload,
      );
      setListUrl(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  
  const totalReset = () => {
    setListUrl('')
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
          <MethodHousing setCurrentLocation={setCurrentLocation}/>
        }

        {Object.values(currentLocation)[0] &&
          <div className="input_group submissions fade-in">
            <h2>3. Get closest stores as waypoints.</h2>
            {!listUrl && <input type="submit" value="Get My Link" onClick={processLocations} htmlFor="link_submit"/>}
            { 
              listUrl &&
                <>
                  <a href={listUrl} target='_blank' rel="noreferrer">{'Open In Maps >'}</a>
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
