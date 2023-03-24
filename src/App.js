import { useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const render = useRef(false)

  useEffect(() => {
    const getDoc = async () => {
      console.log("GETDOC")
      try {
        const response = await axios.get(
          'http://localhost:3001/grabAbc',
          // 'https://crossorigin.me/https://www.abc.virginia.gov/limited/allocated_stores_03_17_2023_12_00_pmNAreOczMH7TnXRb6s2r05MJZ.html',
        );
        console.log(response, "response");
      } catch (error) {
        console.log(error)
      }
    }
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
