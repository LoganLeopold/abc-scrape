import { useRef, useState } from 'react';
import axios from 'axios';
import MethodHousing from './MethodHousing';
import Results from './Results';
import {ResultsObject, CurrentLocation, ProcessStateObject} from '../types';
import '../css/App.css';

const App = () => {
  const [dropUrl, setDropUrl] = useState<string>('')
  const [results, setResults] = useState<ResultsObject>({})
  const [currentLocation, setCurrentLocation] = useState<CurrentLocation>({})
  const [processState, setProcessState] = useState<ProcessStateObject>({written:'initialized', geolocation:'initialized'})
  const [currentError, setCurrentError] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  const currentLocationMethod = Object.keys(currentLocation)[0]
  const currentState = processState[currentLocationMethod as keyof ProcessStateObject]
  const errors = {
    timeout: "Sorry - the server is taking too long. We're experiencing an error. Eeeembarassing.",
    emptyResponse: "There weren't any results close to the location you chose. Check on your city/geolocation. If you know there are close locations and this is in-error, please reach out!"
  }

  const resetResults = () => { // Resets results if underlying City changes
    setResults(({[currentLocationMethod as keyof ResultsObject]: value, ...results})=>{
      return results
    })
    setProcessState(({[currentLocationMethod as keyof ResultsObject]: value, ...processLocations})=>{
      return {
        [currentLocationMethod]: 'initialized',
        ...processLocations
      }
    })
  }

  const onUrlInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDropUrl(e.target.value)
  }

  const processLocations = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (formRef.current) {
      formRef.current.reportValidity()
      if (!formRef.current.checkValidity()) { 
        return 
      }
    }
    
    let payload = { dropUrl, currentLocation: '' }
    if (currentLocation) {
      // is either returning a typed city + state OR json-stringified coordinates
      payload['currentLocation'] = Object.values(currentLocation)[0]
    } else {
      return 
    }

    const server = window.location.host === "localhost:3050" || window.location.host === "www.abcassist.info" ? '/api/processLocations' : 'http://localhost:3001/processLocations'
    try {
      const response = await axios.post(
        server,
        payload,
        {timeout: 15000},
      );
      if (Object.keys(response.data).length !== 0) {
        setProcessState(({[currentLocationMethod as keyof ProcessStateObject]: value, ...processState})=>{
          return {
            [currentLocationMethod]: 'success',
            ...processState
          }
        })
        setResults(({[currentLocationMethod as keyof ResultsObject]: value, ...results})=>{
          return {
            [currentLocationMethod]: response.data,
            ...results
          }
        })
      } else {
        setProcessState(({[currentLocationMethod as keyof ProcessStateObject]: value, ...processState})=>{
          return {
            [currentLocationMethod]: 'error',
            ...processState
          }
        })
        setResults(({[currentLocationMethod as keyof ResultsObject]: value, ...results})=>{
          return {
            [currentLocationMethod]: {},
            ...results
          }
        })
        setCurrentError(errors.emptyResponse)
      }
    } catch (error: any) {
      if (error.message.includes('timeout')) {
        setCurrentError(errors.timeout)
      } else {
        setCurrentError(errors.emptyResponse)
      }
      setProcessState(({[currentLocationMethod as keyof ProcessStateObject]: value, ...processState})=>{
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
          <input className="drop-url" type="text" name="drop_url" placeholder='' onChange={onUrlInputChange} required value={dropUrl}/>
        </div>

        {dropUrl &&
          <MethodHousing 
            setCurrentLocation={setCurrentLocation}
            resetResults={resetResults}
          />
        }

        { dropUrl && currentLocation[currentLocationMethod as keyof ProcessStateObject] && currentState !== 'error' &&
          <div className={`input_group fadeIn`}>
            <h2>3. Get closest stores.</h2>
            <button
              type="submit" 
              className={`${currentState !== 'initialized' ? 'cursor-disable' : ''}`}
              disabled={currentState !== 'initialized' ? true : false}
              onClick={(e)=>{
                processLocations(e); 
                setProcessState(({[currentLocationMethod as keyof ProcessStateObject]: value, ...processState})=>{
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
            <Results totalReset={totalReset} results={results[currentLocationMethod as keyof ResultsObject]}/>
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
