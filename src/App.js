import { useState } from 'react';
import axios from 'axios';
import './App.css';
import './fonts/youre gone.otf'
import './fonts/youre gone it.otf'

function App() {
  const [dropUrl, setDropUrl] = useState('')
  const [listUrl, setListUrl] = useState('')
  const [currentLocation, setCurrentLocation] = useState('')

  const onUrlInputChange = (e) => {
    setDropUrl(e.target.value)
  }

  const onCurrentLocationChange = (e) => {
    setCurrentLocation(e.target.value)
  }

  const processLocations = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3001/processLocations', 
        { dropUrl, currentLocation },
      );
      setListUrl(response.data)
      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="App enable-view">
      <h1>
        <span class="title_animate">A</span>
        <span class="title_animate">B</span>
        <span class="title_animate">C </span>
        <span class="title_animate">A</span>
        <span class="title_animate">S</span>
        <span class="title_animate">S</span>
        <span class="title_animate">I</span>
        <span class="title_animate">S</span>
        <span class="title_animate">T</span>
      </h1>
      <label class="form_label">ABC's Drop URL</label>
      <input type="text" name="drop_url" placeholder='Drop Url:' onChange={onUrlInputChange}/>
      <label class="form_label">Optional: Your Location (City, State)</label>
      <input type="text" name="current_location" placeholder="E.g.: Richmond, VA" onChange={onCurrentLocationChange}/>
      <input type="submit" value="Submit" style={{display: 'block'}} onClick={processLocations}/>
      
      { 
        listUrl &&
          <a href={listUrl} target='_blank' rel="noreferrer">Click for Directions</a>
      }
    </div>
  );
}

export default App;
