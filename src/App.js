import { useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const render = useRef(false)

  const getDoc = async () => {
    console.log("GETDOC")
    try {
      const response = await axios.get(
        'http://localhost:3001/grabAbc',
      );
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getMapTest = async() => {
    try {
      const response = await axios.get(
        'http://localhost:3001/testMap',
      );
      console.log(response)
    } catch (error) { 
      console.log(error)
    }
  }

  useEffect(() => {
    if (render.current === false) {
      render.current = true
    } else {
      getDoc();
    }
  });

  return (
    <div className="App">
      
    </div>
  );
}

export default App;
