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

app.use(express.json())
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
})

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

// Fetches Google places with long/lat data from array of addresses
const createGooglePlaces = async (addresses) => {
  try {
    const places = await Promise.all(addresses.map(async (add, i) => {  
      const thisPlace = await googleClient.findPlaceFromText({
        params: {
          key: process.env.GOOGLE_MAPS_KEY,
          input: `${add} Virginia ABC`,
          inputtype: "textquery",
          fields: ['geometry', 'place_id', 'formatted_address']
        }
      })
      return thisPlace.data
    }))        
    return places
  } catch (error) {
    return error 
  }
}

// Used solely for fetching typed city + state
const getCurrentLocationPlace = async (placeString) => {
  try {
    const currentLocation = await googleClient.findPlaceFromText({
      params: {
        key: process.env.GOOGLE_MAPS_KEY,
        input: placeString,
        inputtype: "textquery",
        fields: ['geometry', 'place_id']
      }
    })
    return currentLocation.data
  } catch (error) {
    return error
  }
}

// Return {lat: , lon: } for typed city + state or coordinates
const resolveCurrentLocation = async (currentLocationString) => {
  if (currentLocationString.includes('lat') && currentLocationString.includes('lon')) {
    return JSON.parse(currentLocationString)
  } else {
    const resolvedCurrentLocation = await getCurrentLocationPlace(currentLocationString)
    const {lat, lng} = resolvedCurrentLocation.candidates[0].geometry.location
    return {lat, lon: lng};
  }
}

// Filter place by distance from home 
// Takes {lat: __, lon: __} object now
const distanceFilterPlaces = (placesCollection, currentLocation) => {
  // Find the close places
  const closePlaces = placesCollection.reduce((acc, curr, i) => {
    if (curr.candidates.length > 0) {
      let { lat, lng } = curr.candidates[0].geometry.location
      let miles = Distance.between(
        currentLocation,
        {lat: lat, lon: lng}
      ).human_readable('customary').distance
      // Only push if the distance is less than 30 miles *and* there are less than 10 results already
      if (Number(miles) < 30) acc.push([miles, curr]);
    }
    return acc
  },[])
  'https://www.google.com/maps/place/?q=place_id:ChIJ_1jx0bG_uokRgSfA4S5ysYM'

  // sort them by distance and return just the place object of the 10 closest results
  const distanceSortedPlaces = closePlaces.sort((a,b) => a[0] - b[0]).map(place => place[1]).slice(0,10);
  return distanceSortedPlaces;
}

const createIndividualLinks = (distanceFilteredPlaces) => {
  console.log('createIndividualLinks')
  let individualLinks;
  if (distanceFilteredPlaces.length > 0) {
    console.log(true)
    individualLinks = distanceFilteredPlaces.map((place) => {
      console.log(place)
      return {
        link: `https://www.google.com/maps/place/?q=place_id:${place.candidates[0].place_id}`,
        address: place.candidates[0].formaatted_address
      }
    })
  }
  return individualLinks
}

// Make final usable URL
const constructUrl = (filteredSortedPlaces) => {
  // This block establishes last filteredSortedPlace as destination
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
  
  return url;
}

// https://www.abc.virginia.gov/limited/allocated_stores_02_06_2023_02_30_pmlhHUeqm1xIf7QPX8FDXhde8V.html
app.post('/processLocations', async (req, res) => {
  console.log("processLocations")
  try {
    const addresses = await parseList(req.body.dropUrl)
    const places = await createGooglePlaces(addresses)
    const currentLocation = await resolveCurrentLocation(req.body.currentLocation)
    const closePlaces = distanceFilterPlaces(places, currentLocation)
    const individualLinks = createIndividualLinks(closePlaces)
    const finalWaypoints = constructUrl(closePlaces)  
    res.json({finalWaypoints, individualLinks})
  } catch (err) {
    res.send(err)
  }
});

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`);
})
