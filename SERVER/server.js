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

    let response = await axios.get('http://127.0.0.1:5500/Fake.html')

    // Retrieve addresses 
    let doc = new JSDOM(response.data)
    let links = doc.window.document.querySelectorAll("#reportLook a")
    let addresses = Array.from(links).map( link => link.textContent )

    let places = await Promise.all( addresses.map(async (add, i) => {    
      let thisPlace = await googleClient.findPlaceFromText({
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
      console.log(thisPlace.data)
      return thisPlace.data
    }))

    result = places

    console.log(places)
    // just change result var - leave this
    res.send(result)
  } catch (err) {
    res.send(err)
  }
});

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`);
})

/*
  HOLDING PLACES LOGIC DURING FAKE DOC TESTING
*/

    // let places = await Promises.all( addresses.map(async (add, i) => {    
    //   let testPlace = await googleClient.findPlaceFromText({
    //     params: {
    //       key: process.env.GOOGLE_MAPS_KEY,
    //       input: `${add} Virginia ABC`,
    //       inputtype: "textquery",
    //       fields: [
    //         'geometry',
    //         'place_id'
    //       ],
    //     }
    //   })
    //   return testPlace.data.results
    // }))

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
