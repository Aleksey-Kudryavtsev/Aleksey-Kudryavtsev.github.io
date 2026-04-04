addEventListener("load", (event) => {
  callWs();
});

function formatMinutes(minutes) {
  return minutes > 9  ? `${minutes}` : `0${minutes}`;
}

callWs = function () {
  let dataUrl = 'https://pogoda.by/api/v2/maps/meteo-10min';
  let radarUrl = 'https://pogoda.by/api/v2/radar/33008';
  fetch(dataUrl, {referrerPolicy: 'no-referrer'})
    .then(function (response) {
      return response.json();
    })
    .then(function (mesurements) {
      let resultElement = document.getElementById('result');
      for (let m of mesurements) {
        if (m.coordinates[0] > 23.396 && m.coordinates[0] < 23.980
          && m.coordinates[1] > 51.918 && m.coordinates[1] < 52.278) {
          let li = document.createElement('li');
          let date = new Date(m.description.date);
          li.innerText = `${date.getHours()}:${formatMinutes(date.getMinutes())} ${m.description.temperature} ${m.description.wind}`;
          resultElement.appendChild(li);
        }
      }
    })
    .then(
      function() {
        return fetch(radarUrl, {referrerPolicy: 'no-referrer'}).then(function(response) {
          return response.json();
        });
      }
    )
    .then(function(radarImageData) {
       let imageUrl = 'https://pogoda.by/files/radars/static/33008/' + radarImageData[radarImageData.length-1].url;
       let imageElement = document.getElementById('radarImage');
       imageElement.src = imageUrl;
    });
}
