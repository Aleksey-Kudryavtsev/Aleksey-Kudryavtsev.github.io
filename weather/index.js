addEventListener("load", (event) => {
  callWs();
});

callWs = function () {
  // The Endpoint URL
  let url = 'https://pogoda.by/api/v2/maps/meteo-10min';
  fetch(url)
    .then(function (response) {
      // Render the Response Status
      //document.getElementById('result').innerHTML = response.status;
      // Parse the body as JSON
      return response.json();
    })
    .then(function (mesurements) {
      // Render the parsed body
      //document.getElementById('result_json').innerHTML = JSON.stringify(json);


      let resultElement = document.getElementById('result');
      for (let m of mesurements) {
        if (m.coordinates[0] > 27.37241 && m.coordinates[0] < 27.72359
          && m.coordinates[1] > 53.83023 && m.coordinates[1] < 53.98983) {
          let li = document.createElement('li');
          let date = new Date(m.description.date);
          li.innerText = `${date.getHours()}:${date.getMinutes()} ${m.description.temperature} ${m.description.wind} `;
          resultElement.appendChild(li);
        }
      }
    })
}