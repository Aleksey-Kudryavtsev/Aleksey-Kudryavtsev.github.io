addEventListener("load", (event) => {
  callWs();
});

function formatMinutes(minutes) {
  return minutes > 9  ? `${minutes}` : $`0${minutes}`;
}

callWs = function () {
  // The Endpoint URL
  let dataUrl = 'https://pogoda.by/api/v2/maps/meteo-10min';
  let radarUrl = 'https://pogoda.by/api/v2/radar/26850';
  fetch(dataUrl)
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
          li.innerText = `${date.getHours()}:${formatMinutes(date.getMinutes())} ${m.description.temperature} ${m.description.water} ${m.description.wind}`;          
          resultElement.appendChild(li);
        }
      }
    })
    .then(
      function() {
        return fetch(radarUrl).then(function(response) {
          return response.json();
        });
      }
    )
    .then(function(radarImageData) {
       let imageUrl = 'https://pogoda.by/files/radars/static/26850/' + radarImageData[radarImageData.length-1].url;
       let imageElement = document.getElementById('radarImage');
       imageElement.src = imageUrl;
    });  

}