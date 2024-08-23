// This application uses three API's
// API 1- RESTCountries API
// API 2 - Google Places API 
// API 3 - Pexels API
// ------------------------Functioning---------------------------------------------------------
// * This application provides the list of countries using RestCountries API with their details as well  
// * User can also search for a paritcular country
// * By selecting any country  user can get the list of tourist attractions in that country  using Google Places API 
// * By selecting any tourist attracion user can details about the destination and  get cool images of the place using Google Places API 
// * Pexels sApi is used for getting asthetic images for countries to display on the home page 
//     - Coutry's Flag image is used as a fall back image for that country in case the API doesnot work as intended 
//     - Country's Flag image is accessed in respone to the restcountries api request
// * Pagination has been used to display only 10 countries at first in order to avoid clutter on the  home page 
//   - User can request more by clicking on  the 'View More' button  

//import required modules
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const RESTCountryAPI = require("./modules/restcountries/api");

const GooglePlacesAPI= require("./modules/googlePlaces/api");

//set up Express object and port
const app = express();
const port = process.env.PORT || "8888";
app.set("views", path.join(__dirname, "views"));//setting for "views" is set to path :  __dirname/views
app.set("view engine", "pug");

// set up a folder for static files
app.use(express.static(path.join(__dirname, "public")));

//PAGE ROUTES
app.get("/", async (request, response) => {
  let countriesList=  await 
RESTCountryAPI.getCountries();
let countryList= countriesList.slice(0,10);
var start=10;
let countriesInfo = [];

//------- logic for images---------
let countryPromises = countryList.map(async country => {
    
  let images= await RESTCountryAPI.getCountryImages(`${country.name.common}`)
  if(images.length>0){
    console.log("Able to fetch image url "+images);
   let newCountryInfo = 
   {
       country: country,
       image: String(images[0])
   }
   return newCountryInfo;
  }
  else{
   let flagImage= `${country.flags.png}`;
   let newCountryInfo = 
   {
       country: country,
       image: flagImage
   }
   return newCountryInfo;
   
  }

});

// Wait for all Promises to resolve
countriesInfo = await Promise.all(countryPromises);
console.log(countriesInfo);
//-----logic for images ends ----------------

  //console.log(countriesList);
  response.render("index", { title: "Countries",countries: countriesInfo,start:start });
});

// page route for the viewMore button to view more countries 
app.get("/loadMore", async (request, response) => {
  var starting = parseInt(request.query.start) || 0;
    let countriesList=  await 
  RESTCountryAPI.getCountries();

  let nextCountries=countriesList.slice(0, starting + 10);
  starting= starting+10;


  let countriesInfo = [];
  //- logic for images
  let countryPromises = nextCountries.map(async country => {
      
    let images= await RESTCountryAPI.getCountryImages(`${country.name.common}`)
    if(images.length>0){
     let newCountryInfo = 
     {
         country: country,
         image: String(images[0])
     }
    return newCountryInfo;
     
  
    }
    else{
     let flagImage= `${country.flags.png}`;
     let newCountryInfo = 
     {
         country: country,
         image: flagImage
     }
    return newCountryInfo;
    }
  
  });

// Wait for all Promises to resolve
countriesInfo = await Promise.all(countryPromises);
 
  response.render("index", { title: "Countries",countries: countriesInfo, start: starting });
  });



// page route for search field
  app.get("/countryName", async (request, response) => {

    let searchedCountry= request.query.countryName;
    if (!searchedCountry) {
      return response.status(400).send('Country name not provided in headers. Please provide Country Name ');
  }
    let countryList=  await 
    
RESTCountryAPI.getSpecificCountry(searchedCountry);

let countriesInfo = [];
  //- logic for images
  let countryPromises = countryList.map(async country => {
      
    let images= await RESTCountryAPI.getCountryImages(`${country.name.common}`)
    if(images.length>0){
     let newCountryInfo = 
     {
         country: country,
         image: String(images[0])
     }
    return newCountryInfo;
     
  
    }
    else{
     let flagImage= `${country.flags.png}`;
     let newCountryInfo = 
     {
         country: country,
         image: flagImage
     }
    return newCountryInfo;
    }
  
  });



// Wait for all Promises to resolve
countriesInfo = await Promise.all(countryPromises);
 
  response.render("index", { title: "Countries",countries: countriesInfo });
  });


  app.get("/region", async (request, response) => {

    let searchedRegion= request.query.region;
    if (!searchedRegion) {
      return response.status(400).send('Region name not provided in headers.Please provide Region Name ');
  }
    let countryList=  await 
    
RESTCountryAPI.getCountriesInRegion(searchedRegion);

let countriesInfo = [];
  //- logic for images
  let countryPromises = countryList.map(async country => {
      
    let images= await RESTCountryAPI.getCountryImages(`${country.name.common}`)
    if(images.length>0){
     let newCountryInfo = 
     {
         country: country,
         image: String(images[0])
     }
    return newCountryInfo;
     
  
    }
    else{
     let flagImage= `${country.flags.png}`;
     let newCountryInfo = 
     {
         country: country,
         image: flagImage
     }
    return newCountryInfo;
    }
  
  });



// Wait for all Promises to resolve
countriesInfo = await Promise.all(countryPromises);
 
  response.render("index", { title: "Countries",countries: countriesInfo });
  });




 //page route to get  tourist places in the country  
 app.get("/places/:country", async (request, response) => {
    let placesList=  await GooglePlacesAPI.getTouristPlaces(request.params.country);
//const places = data.results;
    //console.log(placesList);
    let countrydata= await RESTCountryAPI.getSpecificCountry(request.params.country);
    console.log("Country data fecthed succesfully ------------------------------------------------------------");
    console.log(countrydata);
    response.render("attractions", { title: countrydata[0].name.common,  places:placesList, countryData:countrydata });
  });

// page route to get the details of the place 
  app.get("/placeDetails/placeId=:placeId", async (request, response) => {
    console.log("route function accessed")
    //console.log(request.params.placeId);
    let placedetails=  await GooglePlacesAPI.getPlaceDetails(request.params.placeId);
//const places = data.results;
    console.log(placedetails.photoDataArray);
    response.render("placeDetail", { title: placedetails.data.result.name,  place:placedetails });
  });


//set up server listening
app.listen(port, () => {
 console.log(`Listening on http://localhost:${port}`);
});