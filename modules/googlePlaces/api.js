

// Api key 
const apiKey = process.env.GOOGLE_PLACES_API_KEY;
//Query string
const query = 'tourist attractions in ';


//--------------Function to get tourist attractions in a specific country--------------------------------
async function getTouristPlaces(country) {
  const placesArray = [];
  var m = 0;
  var photoDataBase64;
  const photoReferences = [];
  const touristPlaces = [];
  // url to connect to the api 
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}${country}&key=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

// Logic to get the photos of the tourist attractions
  const places = data.results;
  //console.log(places);
  if (places && places.length > 0) {
    for (var k = 0; k < places.length; k++) {
      if ((places[k].photos)) {
        var photoss = places[k].photos;
        if (photoss.length > 0) {
          for (var l = 0; l < photoss.length; l++) {
            var photoReference = photoss[l].photo_reference;
            const url2 = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${apiKey}`;
            const response2 = await fetch(url2);
            const picture = await response2.arrayBuffer();
            const photoData = Buffer.from(picture);
            photoDataBase64 = `data:image/jpeg;base64,${photoData.toString('base64')}`;

          }
        }
        else {
          console.log('No photos available for this place:');
        }

        const placeObject = {
          place: places[k],
          photo: photoDataBase64
        }
        placesArray.push(placeObject);
      }

      else {
        console.log('No photos available for this place:');
      }
    }
  }
  else {
    console.log('No  places  available for this country:');
  }
  return placesArray;

}

//--------------Function to get details of a Particular Tourist attractions--------------------------------------

async function getPlaceDetails(placeId) {
  var placeDetail;
  //get place details
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
// Logic to get photos of the place 
  const photos = data.result.photos;
  const photoReferences = [];
  const photoDataArray = [];
  
  if (photos) {
    for (var i = 0; i < photos.length; i++) {
      photoReferences.push((photos[i].photo_reference));
    }
    console.log(photoReferences);
    for (var j = 0; j < photoReferences.length; j++) {
      const picReference = photoReferences[j];
      // api reuest to get the  photos of the particular place 
      const url2 = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${picReference}&key=${apiKey}`;

      // Below Logic converts the actual image data into binary data and then to base64 encode string in order to embed it in the html
      const response2 = await fetch(url2);
      // convert the actual image to arrayBuffer
      const picture = await response2.arrayBuffer();
      // Convert ArrayBuffer to Buffer
      const photoData = Buffer.from(picture);
     // convert buffer to Base64
      const photoDataBase64 = `data:image/jpeg;base64,${photoData.toString('base64')}`;
      photoDataArray.push(photoDataBase64);
    }
    placeDetail = {
      data: data,
      photoDataArray: photoDataArray
    }
  }
  else {
    console.log('No photos available for this place:');
  }
  return placeDetail;


}
// exporting the module
module.exports = {
  getTouristPlaces,
  getPlaceDetails
}