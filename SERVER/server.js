const axios = require('axios');
const {Client: GoogleClient} = require("@googlemaps/google-maps-services-js");
require('dotenv').config()

const googleClient = new GoogleClient({})
const express = require('express');
const app = express();
const port = 3001;

app.get('/grabAbc', async (req, res) => {
  try {
    const response = await axios.get(
      'https://www.abc.virginia.gov/limited/allocated_stores_02_06_2023_02_30_pmlhHUeqm1xIf7QPX8FDXhde8V.html',  
    )
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    // let doc = new DOMParser(response.data, 'html')
    res.send(response.data)
  } catch (err) {
    return err
  }
});

app.get('/testMap', async (req, res) => {
  try {
    const test = await googleClient.geocode({params:{ key: process.env.GOOGLE_MAPS_KEY, address: "258 Toy Avenue Virginia Beach, VA 23452"}})
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.send(test.data)
  } catch (err) {
    return err
  }
});

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`);
})



