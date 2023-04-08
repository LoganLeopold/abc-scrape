const express = require('express');
require('dotenv').config()
const axios = require('axios');
const jsdom = require("jsdom");
const {Client: GoogleClient} = require("@googlemaps/google-maps-services-js");

const googleClient = new GoogleClient({})
const { JSDOM } = jsdom;
const app = express();
const port = 3001;

app.get('/grabAbc', async (req, res) => {
  try {
    const response = await axios.get(
      'https://www.abc.virginia.gov/limited/allocated_stores_02_06_2023_02_30_pmlhHUeqm1xIf7QPX8FDXhde8V.html',  
    )
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    // Retrieve addresses 
    let doc = new JSDOM(response.data)
    let links = doc.window.document.querySelectorAll("#reportLook a")
    let addresses = Array.from(links).map( link => link.textContent )
    result = addresses

    // Retrieve address geocodes
    // let locations = await Promise.all(addresses.map( async (value) => {
    //   let geocode = await googleClient.geocode({params: {key: process.env.GOOGLE_MAPS_KEY, address: value}})
    //   return geocode.data.results
    // }))
    // result = locations;

    // let testPlaceId = googleClient.m

    // just change result var - leave this
    res.send(result)
  } catch (err) {
    res.send(err)
  }
});

app.get('/testMap', async (req, res) => {
  try {
    const test = await googleClient.geocode({params:{ key: process.env.GOOGLE_MAPS_KEY, address: "258 Toy Avenue Virginia Beach, VA 23452"}})
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.send(test.data)
  } catch (err) {
    console.log(err)
    return err
  }
});

app.get("/testPlace", async (req, res) => {
  console.log(req.query.test)
  // try {
  //   const placeTest = await googleClient.findPlaceFromText({
  //     params: {
  //       key: process.env.GOOGLE_MAPS_KEY,
  //       input: "Virginia ABC",
  //       inputtype: "textquery",
  //       fields: [
  //         'geometry',
  //         'place_id'
  //       ],
  //       locationbias: {
  //         lat: 38.852790127368536, 
  //         lng: -77.05175441936312
  //       }
  //     }
  //   })
  //   res.header("Access-Control-Allow-Origin", "*");
  //   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  //   console.log("placeTest Data \n",placeTest.data)
  //   res.send(placeTest.data)
  // } catch (err) {
  //   console.log(err.response)
  //   return err
  // }
})

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`);
})



