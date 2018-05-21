
function main () {
  const selectElement = document.getElementById('selectpicker'); // activates function on button click
  const buttonElement = document.querySelector('#btn-search');

  // -- build the map and select the default location to be displayed (without marker)
  const defaultLocation = {
    lat: 41.3977381,
    lng: 2.190471916
  };
  const container = document.getElementById('map');
  const options = {
    zoom: 15,
    center: defaultLocation
  };
  const map = new google.maps.Map(container, options);

  // -- add marker
  function addMarker (map, location, barname, event) {
    const markerOptions = {
      position: location,
      title: barname
    };

    const marker = new google.maps.Marker(markerOptions);
    marker.setMap(map);

    const infowindow = new google.maps.InfoWindow({
      content: `<div class="mylabel"> 
      <b>Title:</b> ${event[1]} <br>
      <b>Music type:</b> ${event[2]} <br>
      <b>Description:</b> ${event[3]}<br>
      <a href="/event/event-details/${event[0]}">See details</a>
      </div>`
    });

    google.maps.event.addListener(marker, 'click', function () {
      infowindow.open(map, marker);
    });

    return marker;
  }

  function getEvents () {
    const musicFilter = {
      musicType: selectElement.value // gets value of picked type
    };

    axios.post('/search', musicFilter) // sending musicFilter to index.js
      .then((response) => { // response is an object containing headers, config, data etc.
        response.data.events.forEach((event) => { // (same events key from index) here we have to access only the data of the result - which is an array of event based on musicFilter
          const location = {
            lat: event.bar.location.coordinates[1],
            lng: event.bar.location.coordinates[0]
          };

          addMarker(map, location, event.bar.barname, Object.values(event));
        });
      });
  }

  buttonElement.addEventListener('click', getEvents); // on click runs getEvents function
}

window.addEventListener('load', main);

// -- show all bars on the map
/* axios.get('/bars/json')
    .then(response => {
      response.data.forEach((bar) => {
        const location = {
          lat: bar.location.coordinates[1],
          lng: bar.location.coordinates[0]
        };
        addMarker(map, location, bar.barname);
      });
    }); */
