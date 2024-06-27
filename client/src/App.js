import { useRef, useState } from 'react';
import axios from 'axios';
import './App.css';
import './fonts/youre gone.otf'
import './fonts/youre gone it.otf'
import MethodHousing from './MethodHousing';
import Results from './Results';

const App = () => {
  const [dropUrl, setDropUrl] = useState('')
  const [results, setResults] = useState({})
  const [currentLocation, setCurrentLocation] = useState('')
  const [processState, setProcessState] = useState('initialized')
  const formRef = useRef(null)
  const currentLocationMethod = Object.keys(currentLocation)[0]
  const currentState = processState[currentLocationMethod]

  const resetResults = () => { // Resets results if underlying City changes
    setResults(({[currentLocationMethod]: value, ...results})=>{
      return results
    })
    setProcessState(({[currentLocationMethod]: value, ...processLocations})=>{
      return processLocations
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
      console.log(response.data)
      if (Object.keys(response.data).length !== 0) {
        setProcessState(({[currentLocationMethod]: value, ...processState})=>{
          return {
            [currentLocationMethod]: 'success',
            ...processState
          }
        })
        setResults(({[currentLocationMethod]: value, ...results})=>{
          return {
            [currentLocationMethod]: response.data,
            ...results
          }
        })
      } else {
        setProcessState(({[currentLocationMethod]: value, ...processState})=>{
          return {
            [currentLocationMethod]: 'error',
            ...processState
          }
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const totalReset = () => {
    setResults('')
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
            resetResults={resetResults}
          />
        }

        {/* { dropUrl && currentLocation[currentLocationMethod] && !results[currentLocationMethod] && currentState !== 'error' && */}
        { dropUrl && currentLocation[currentLocationMethod] && currentState !== 'error' &&
          <div className='input_group fadeIn'>
            <h2>3. Get closest stores as waypoints.</h2>
            <input 
            type="submit" 
            value="Get My Link" 
            onClick={(e)=>{
              processLocations(e); 
              setProcessState(({[currentLocationMethod]: value, ...processState})=>{
                return {
                  [currentLocationMethod]: 'fetching',
                  ...processState
                }
              })
            }} 
            htmlFor="link_submit"/>
          </div>
        }
        { 
          dropUrl && Object.keys(results).includes(currentLocationMethod) && currentState === 'success' &&
            <Results totalReset={totalReset} results={results[currentLocationMethod]}/>
        }
        {
          currentState === 'fetching' && 
          <p>Fetching for you!</p>
        }
        {
          currentState === 'error' &&
          <p>There weren't any results close to the location you chose. Check on your city/geolocation.</p>
        }
      </form>
    </div>
  );
}

export default App;
