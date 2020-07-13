// Foursquare API Info
const clientId = '<--Key-->';
const clientSecret = '<--Key-->';
const url = 'https://api.foursquare.com/v2/venues/explore?near=';

// OpenWeather Info
const openWeatherKey = '<--Key-->';
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';

// Page Elements
const $input = $('#city');
const $submit = $('#button');
const $destination = $('#destination');
const $container = $('.container');
const $venueDivs = [$("#venue1"), $("#venue2"), $("#venue3"), $("#venue4"), $("#venue5"), $("#venue6"), $("#venue7"), $("#venue8"), $("#venue9"), $("#venue10")];
const $weatherDiv = $("#weather1");
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// AJAX functions:
const getVenues = async () => {
  const city = $input.val();

  //Combined text of the entire request URL 
  const urlToFetch = `${url}${city}&limit=10&client_id=${clientId}&client_secret=${clientSecret}&v=20200713`;

  try {
    const response = await fetch(urlToFetch);
    if(response.ok) {
      const jsonResponse = await response.json();
      console.log(jsonResponse);

      //Nesting chain from jsonResponse variable to get an array of venue data:
      const venues = jsonResponse.response.groups[0].items.map(item => item.venue);
      console.log(venues);
      return venues;
    }
  } catch(error) {
    console.log(error);
  }
}

const getForecast = async () => {

    //Combined text of the entire request URL 
    const urlToFetch = `${weatherUrl}?&q=${$input.val()}&APPID=${openWeatherKey}`;

    try {
        const response = await fetch(urlToFetch);
        if(response.ok) {
        const jsonResponse = await response.json();
        console.log(jsonResponse);
        return jsonResponse;
        }
    } catch(error) {
        console.log(error);
    }
}


// Render functions
const renderVenues = (venues) => {
    /* $venueDivs is array <div>s in index.html where you will render the information returned in the response 
    from the Foursquare API */
    $venueDivs.forEach(($venue, index) => {
        let venueContent = '';
        const venue = venues[index]; //represent the individual venue object inside of the .forEach() callback.
        const venueIcon = venue.categories[0].icon; //value of the object representing the venue icon.
        const venueImgSrc = `${venueIcon.prefix}bg_64${venueIcon.suffix}`; //Full source URL for the venue icon.
        venueContent = createVenueHTML(venue.name, venue.location, venueImgSrc); //HTML string to add the new venue.
        $venue.append(venueContent);
    });
  
    $destination.append(`<h2>${venues[0].location.city}</h2>`);
}

const renderForecast = (day) => {
    let weatherContent = '';
    weatherContent = createWeatherHTML(day); //HTML string to add the weather forecast in the renderForecast function. 
    $weatherDiv.append(weatherContent);
}

const executeSearch = () => {
    $venueDivs.forEach(venue => venue.empty());
    $weatherDiv.empty();
    $destination.empty();
    $container.css("visibility", "visible");
    getVenues().then(venues => renderVenues(venues)); //renderVenues() function hooked to the data fetched by getVenues().
    getForecast().then(forecast => renderForecast(forecast))//forecast data hooked up with the render function.
    return false;
}

$submit.click(executeSearch)