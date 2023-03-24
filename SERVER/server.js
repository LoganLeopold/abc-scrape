const axios = require('axios');

const express = require('express');
const app = express();
const port = 3001;

app.get('/grabAbc', async (req, res) => {
  try {
    const response = await axios.post(
      'https://www.abc.virginia.gov/limited/allocated_stores_02_06_2023_02_30_pmlhHUeqm1xIf7QPX8FDXhde8V.html', 
        {
          headers: {
            "Content-Type": "text/html",
            // "Origin": `www.abctest.com`
          },
        }
      );
    return response;
  } catch (err) {
    return err
  }
});

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`);
  // console.log(await fetchRes())
})

// async function fetchRes () {
//   const res = await fetch('localhost:3001/grabAbc')
//   return res
// }

