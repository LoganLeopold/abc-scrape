import { useRef, useState } from 'react';
import axios from 'axios';
import '../css/App.css';
import '../fonts/youre gone.otf'
import '../fonts/youre gone it.otf'
import MethodHousing from './MethodHousing';
import Results from './Results';

const App = () => {
  const [dropUrl, setDropUrl] = useState('')
  const [results, setResults] = useState({})
  const [currentLocation, setCurrentLocation] = useState('')
  const [processState, setProcessState] = useState({written:'initialized', geolocation:'initialized'})
  const [currentError, setCurrentError] = useState('')
  const formRef = useRef(null)
  const currentLocationMethod = Object.keys(currentLocation)[0]
  const currentState = processState[currentLocationMethod]
  const errors = {
    timeout: "Sorry - the server is taking too long. We're experiencing an error. Eeeembarassing.",
    emptyResponse: "There weren't any results close to the location you chose. Check on your city/geolocation. If you know there are close locations and this is in-error, please reach out!"
  }

  const resetResults = () => { // Resets results if underlying City changes
    setResults(({[currentLocationMethod]: value, ...results})=>{
      return results
    })
    setProcessState(({[currentLocationMethod]: value, ...processLocations})=>{
      return {
        [currentLocationMethod]: 'initialized',
        ...processLocations
      }
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

    const server = process.env.REACT_APP_ENV === 'dev' ? 'http://localhost:3001/processLocations' : '/api/processLocations' 
    console.log(server, process.env.REACT_APP_ENV)

    try {
      const response = await axios.post(
        server,
        // '/api/processLocations', 
        // 'http://localhost:3001/processLocations',
        payload,
        {timeout: 15000},
      );
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
        setResults(({[currentLocationMethod]: value, ...results})=>{
          return {
            [currentLocationMethod]: {},
            ...results
          }
        })
        setCurrentError(errors.emptyResponse)
      }
    } catch (error) {
      if (error.message.includes('timeout')) {
        setCurrentError(errors.timeout)
      } else {
        setCurrentError(errors.emptyResponse)
      }
      setProcessState(({[currentLocationMethod]: value, ...processState})=>{
        return {
          [currentLocationMethod]: 'error',
          ...processState
        }
      })
    }
  }

  const totalReset = () => {
    setResults({})
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

        { dropUrl && currentLocation[currentLocationMethod] && currentState !== 'error' &&
          <div className={`input_group fadeIn`}>
            <h2>3. Get closest stores as waypoints.</h2>
            <button
              type="submit" 
              className={`${currentState !== 'initialized' ? 'cursor-disable' : ''}`}
              disabled={`${currentState !== 'initialized' ? 'disabled' : ''}`}
              onClick={(e)=>{
                processLocations(e); 
                setProcessState(({[currentLocationMethod]: value, ...processState})=>{
                  return {
                    [currentLocationMethod]: 'fetching',
                    ...processState
                  }
                })
              }} 
            >
              {`${currentState !== 'initialized' ? 'Results Already Retrieved' : 'Get Closest Stores'}`}
            </button>
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
          <p>{currentError}</p>
        }
      </form>
    </div>
  );
}

export default App;
