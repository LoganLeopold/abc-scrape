const express = require('express');
require('dotenv').config()
const axios = require('axios');
const jsdom = require("jsdom");
const {Client: GoogleClient} = require("@googlemaps/google-maps-services-js");

const googleClient = new GoogleClient({})
const { JSDOM } = jsdom;
const app = express();
const port = 3001;

/*
  - Process the DOM 
  - Turn into locations/placeIds
*/
app.get('/processLocations', async (req, res) => {
  console.log("processLocations")
  try {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    let response = await axios.get('https://www.abc.virginia.gov/limited/allocated_stores_02_06_2023_02_30_pmlhHUeqm1xIf7QPX8FDXhde8V.html')

    // Retrieve addresses 

    let doc = new JSDOM(response.data)
    let links = doc.window.document.querySelectorAll("#reportLook a")
    let addresses = Array.from(links).map( link => {
      let processed = link.href.split('place/')[1].replace(/(\+VA)/gm, " VA").replace(/(\+)|(%20)/gm, " ")
      return processed 
    })

    // https://www.google.com/maps/place/3901 Wards Road,+Lynchburg,+VA+24502,+USA
    // https://www.google.com/maps/place/4020 Victory Boulevard,+Portsmouth,+VA+23701,+USA
    // https://www.google.com/maps/place/3940 Valley Gateway Boulevard,+Roanoke,+VA+24012,+USA

    const places = await Promise.all(addresses.map(async (add, i) => {  
      const thisPlace = await googleClient.findPlaceFromText({
        params: {
          key: process.env.GOOGLE_MAPS_KEY,
          input: `${add} Virginia ABC`,
          inputtype: "textquery",
          fields: [
            'geometry',
            'place_id'
          ],
        }
      })
      return [thisPlace.data, add]
    }))

    // just change result var - leave this
    res.send(places)
  } catch (err) {
    res.send(err)
  }
});

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`);
})

/*
  GEOCODE LOGIC
*/
// Retrieve address geocodes
// let locations = await Promise.all(addresses.map( async (value) => {
//   let geocode = await googleClient.geocode({params: {key: process.env.GOOGLE_MAPS_KEY, address: value}})
//   return geocode.data.results
// }))
// result = locations;

// let testPlaceId = googleClient.m

/*
  Initial map creation testing 
*/
// app.get('/testMap', async (req, res) => {
//   try {
//     const test = await googleClient.geocode({params:{ key: process.env.GOOGLE_MAPS_KEY, address: "258 Toy Avenue Virginia Beach, VA 23452"}})
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     res.send(test.data)
//   } catch (err) {
//     console.log(err)
//     return err
//   }
// });
