import axios from 'axios';

export const getMapTest = async() => {
  try {
    const response = await axios.get(
      'http://localhost:3001/testMap',
    );
    console.log(response)
  } catch (error) { 
    console.log(error)
  }
}

export const getPlaceTest = async() => {
  console.log("placeTest")
  try {
    const response = await axios.get(
      'http://localhost:3001/testPlace',
      {
        params: {
          test: "got 'im"
        }
      }
    );
    console.log(response)
  } catch (error) { 
    console.log(error)
  }
}