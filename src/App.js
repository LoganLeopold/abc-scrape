import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [dropUrl, setDropUrl] = useState('')
  const [listUrl, setListUrl] = useState('')

  const onUrlInputChange = (e) => {
    console.log(e.target.value, "CHANGE")
    setDropUrl(e.target.value)
  }

  const processLocations = async () => {
    try {
      const response = await axios.get(
        'http://localhost:3001/processLocations',
      );
      setListUrl(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="App enable-view">
      <h1>ABC ASSIST</h1>

      <input type="text" name="drop_url" onChange={onUrlInputChange}/>
      <input type="submit" value="Submit" style={{display: 'block'}} onClick={processLocations}/>
      
      { 
        listUrl &&
          <a href={listUrl} target='_blank' rel="noreferrer">Click for Directions</a>
      }
    </div>
  );
}

export default App;
