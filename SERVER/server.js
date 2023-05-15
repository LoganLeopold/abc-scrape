const express = require('express');
require('dotenv').config()
const axios = require('axios');
const jsdom = require("jsdom");
const {Client: GoogleClient} = require("@googlemaps/google-maps-services-js");
const {DistanceCalculator} = require('distance-calculator-js');
const { parse } = require('dotenv');

const googleClient = new GoogleClient({})
const { JSDOM } = jsdom;
const app = express();
const port = 3001;

// This function retrieves the ABC store list and creates addresses
const parseList = async (listUrl) => {
  try {
    let response = await axios.get(listUrl)

    // Retrieve addresses 
    let doc = new JSDOM(response.data)
    let links = doc.window.document.querySelectorAll("#reportLook a")
    // Clean some link instances
    let addresses = Array.from(links).map( link => {
      let processed = link.href.split('place/')[1].replace(/(\+VA)/gm, " VA").replace(/(\+)|(%20)/gm, " ")
      return processed 
    })

    return addresses
  } catch (error) {
    return error
  }
}

// Fetches Google places with long/lat data
const createGooglePlaces = async (addresses) => {
  try {
    const places = await Promise.all(addresses.map(async (add, i) => {  
      const thisPlace = await googleClient.findPlaceFromText({
        params: {
          key: process.env.GOOGLE_MAPS_KEY,
          input: `${add} Virginia ABC`,
          inputtype: "textquery",
          fields: ['geometry']
        }
      })
      return thisPlace.data
    }))
    return places
  } catch (error) {
    return error 
  }
}
/*
  - Process the DOM 
  - Turn into locations/placeIds
*/
app.get('/processLocations', async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  console.log("processLocations")
  try {
    let addresses = await parseList('https://www.abc.virginia.gov/limited/allocated_stores_02_06_2023_02_30_pmlhHUeqm1xIf7QPX8FDXhde8V.html')
    let places = await createGooglePlaces(addresses)
   
    /*
      For potentially filtering by distance
    */
      // let homeLocation = {lat: , long: }
      // let closePlaces = places.reduce((acc, curr, i) => {
      //   if (curr.candidates.length > 0) {
      //     let { geometry: { location } } = curr.candidates[0]
      //     let miles = DistanceCalculator.calculate({lat: location.lat, long: location.lng}, homeLocation, M)
      //   }
      //   return acc
      // },[])
    res.send(places)
  } catch (err) {
    res.send(err)
  }
});

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`);
})
