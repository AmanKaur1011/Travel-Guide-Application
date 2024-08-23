
const countries = "https://restcountries.com/v3.1/all"; //base URL for getting the list of countries using  REST Countries API requests


//-------------------------Function to get the countries List-----------------------------------------
// api request to the RESTcountries API

async function getCountries(){

let reqUrl= `${countries}`;
let response= await fetch(reqUrl);
const data= await response.json();
 return data;
}
//-------------------------Function to get the images  for countries using PEXELS API -----------------------------------------

// PEXELS API 

// NOTE: This api sometimes doesn't fetch all the images accuratly due to the api issue
// so for the fallback image - countries flag image is used that is provided in response of 
// the restCountires api request

async function getCountryImages(countryName){
    const url = `https://api.pexels.com/v1/search`;
    const params = new URLSearchParams({
    query: countryName,
    per_page: 1  // Number of images to return
});

try {
    const res = await fetch(`${url}?${params.toString()}`, {
        headers: {
            Authorization: process.env.PEXELS_API_KEY 
        }
    });
    const data2 = await res.json();
    const images= data2.photos;
    var pictures=[];

    if(images.length>0){
    pictures.push((images[0].src.medium));}
    else{
        return pictures;
    }
    
    return pictures;

} catch (error) {
    console.error('Error fetching images:', error);
    return [];
}
}
//--------------------------------- Function to get Specific countryby searching for it by entering the name of the country--------------------------------------------------
// api request to the RESTcountries API

async function getSpecificCountry(countryName){
    let  url = `https://restcountries.com/v3.1/name/${countryName}`;
        let  response = await fetch(url);
        return await response.json();
        
   }
//--------------------------------- Function to get Specific countries by searching for it by entering the region--------------------------------------------------
// api request to the RESTcountries API
   async function getCountriesInRegion(region){
    let  url = `https://restcountries.com/v3.1/region/${region}`;
        let  response = await fetch(url);
        return await response.json();
        
   }

// exporting module
module.exports={
    getCountries,
    getSpecificCountry,
    getCountryImages,
    getCountriesInRegion
}
