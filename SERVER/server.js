const express = require('express');
require('dotenv').config()
const axios = require('axios');
const jsdom = require("jsdom");
const {Client: GoogleClient} = require("@googlemaps/google-maps-services-js");
var Distance = require('geo-distance');
const dummyData = require('./dummydata.json');

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
          fields: ['geometry', 'place_id']
        }
      })
      return thisPlace.data
    }))
    return places
  } catch (error) {
    return error 
  }
}

// Filter place by distance from home
const distanceFilterPlaces = (placeArr) => {
  const homeLocation = {lat: 38.885474, lon: -76.992642} 
  // Find the close places
  const closePlaces = placeArr.reduce((acc, curr, i) => {
    if (curr.candidates.length > 0) {
      let { lat, lng } = curr.candidates[0].geometry.location
      let miles = Distance.between(
        homeLocation,
        {lat: lat, lon: lng}
      ).human_readable('customary').distance
      // Only push if the distance is less than 10 miles
      if (Number(miles) < 10) acc.push([miles, curr]);
    }
    return acc
  },[])

  // sort them by distance and return just the place object
  const distanceSortedPlaces = closePlaces.sort((a,b) => a[0] - b[0]).map(place => place[1]);

  return distanceSortedPlaces;
}

// Make final usable URL
const constructUrl = (filteredSortedPlaces) => {
  const { 
    geometry: {location: { lat: destinationLat, lng: destinationLng }}, place_id: destinationPlaceId 
  } = filteredSortedPlaces[filteredSortedPlaces.length - 1].candidates[0];
  const urlDestination = `${destinationLat},${destinationLng}`

  let waypoints = '';
  let waypointIds = '';

  // Build waypoint components of URL
  for (i = 0; i < filteredSortedPlaces.length - 1; i++) {
    const curr = filteredSortedPlaces[i];
    const {lat, lng} = curr.candidates[0].geometry.location;
    waypoints += `${lat},${lng}${i < filteredSortedPlaces.length - 2 ? '%7C' : ''}`;
    waypointIds += `${curr.candidates[0].place_id}${i < filteredSortedPlaces.length - 2 ? '%7C' : ''}`
  }

  const url = `https://www.google.com/maps/dir/?api=1&waypoints=${waypoints}&waypoint_place_ids=${waypointIds}&destination=${urlDestination}&destination_place_id=${destinationPlaceId}`;

  console.log(url);

  return url;
}

// https://www.abc.virginia.gov/limited/allocated_stores_02_06_2023_02_30_pmlhHUeqm1xIf7QPX8FDXhde8V.html
app.get('/processLocations', async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  console.log("processLocations")
  try {
    let addresses = await parseList('https://www.abc.virginia.gov/limited/allocated_stores_02_06_2023_02_30_pmlhHUeqm1xIf7QPX8FDXhde8V.html')
    let places = await createGooglePlaces(addresses)
    const closePlaces = distanceFilterPlaces(places)
    const finalUrl = constructUrl(closePlaces)
    res.json(finalUrl);
  } catch (err) {
    res.send(err)
  }
});

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`);
})
