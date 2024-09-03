let errorimage = document.querySelector('.image');
let errorimage2 = document.querySelector('.image img');
const weatherTab = document.querySelector('.User-weather');
const searchTab = document.querySelector('.search-weather');
const grantAccessTab = document.querySelector('.grant-locationtab');
const searchformTab = document.querySelector('.searchform-container');
const loadingTab = document.querySelector('.loading-container');
const userinfoTab = document.querySelector('.user-info-container');
const cardTab = document.querySelector('.card-container');
let citynameinput = document.querySelector('.screen');
const API_key = '081e5c094de6b4f41d621281dd354c19';

grantAccessTab.classList.add("active");
let currentTab = weatherTab;
currentTab.classList.add("current-tab");

function switchTab(clickedTab){
    if(clickedTab!= currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");
        if(!searchTab.classList.contains("active") ){
            userinfoTab.classList.remove("active");
            grantAccessTab.classList.remove("active");
            searchTab.classList.add("active");
            errorimage.classList.remove('active');
        }
        else{
            searchTab.classList.remove("active");
            userinfoTab.classList.add("active");
            searchformTab.classList.remove("active");
            errorimage.classList.remove('active');
            getfromSessionStorage();
        }

    }
}

searchTab.addEventListener('click',function(){
    searchformTab.classList.add("active");
})

weatherTab.addEventListener("click" ,()=>{
    switchTab(weatherTab);
});

searchTab.addEventListener("click", ()=>{
   switchTab(searchTab);
});

function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessTab.classList.add("active");
    }

    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherinfo(coordinates);
    }
}

 async function fetchUserWeatherinfo(coordinates){
    const{lat, lon} = coordinates;
    grantAccessTab.classList.remove("active");
    loadingTab.classList.add("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`);
        
        const data = await response.json();
        console.log(data);
        loadingTab.classList.remove("active");
        userinfoTab.classList.add("active");
        renderWeatherInfo(data);

    }
    catch (err){
        loadingTab.classList.remove("active");
        console.log("Error is there",err)
      
    }
 }

 function renderWeatherInfo(weatherInfo){
    console.log('hello');
    const cityName = document.querySelector(".data-cityname");
    const CountryIcon = document.querySelector(".data-image");
    const desc = document.querySelector(".weather-desc");
    const weatherIcon = document.querySelector(".icon");
    const temp = document.querySelector(".temp");
    const windspeed = document.querySelector(".windspeed")
    const humidity = document.querySelector(".humidity");
    const cloudness = document.querySelector(".clouds");
 //fetch values from weatherinfo and put it UI elements
 cityName.innerText = weatherInfo?.name;
 CountryIcon.src= `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
 desc.innerText = weatherInfo?.weather?.[0]?.description;
 weatherIcon.src=  `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
 temp.innerText = `${weatherInfo?.main?.temp}°C`;
 windspeed.innerText =`${weatherInfo?.wind?.speed}m/s` ;
 humidity.innerText = `${weatherInfo?.main?.humidity}%`;
 cloudness.innerText =`${weatherInfo?.clouds?.all}%`;
  
 console.log(windspeed.innerText);
 }



function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
        console.log('hey');
    }
    else{
        alert("No loaction found")
    }
}

async function data_fetch(cityname) {
    loadingTab.classList.add("active");
    try {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${API_key}&units=metric`);
        
        if (!response.ok) {  // Check if the response status is not OK
            errorimage.classList.add("active");
            throw new Error("City not found");
        }

        let data = await response.json();
        loadingTab.classList.remove("active");
        userinfoTab.classList.add("active");
        errorimage.classList.remove('active');  // Hide error image if data is found
        renderWeatherInfo(data);
        console.log(data);
    } catch (error) {
        loadingTab.classList.remove("active");
        console.log(error);
        errorimage.classList.add("active"); // Show error image if an error occurs
    }
}

function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    };

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherinfo(userCoordinates);

}

 const grantAccessbutton= document.querySelector(".btn");
 grantAccessbutton.addEventListener("click",getLocation);


 searchformTab.addEventListener('submit',function(e){
e.preventDefault();
let city =citynameinput.value ;
    data_fetch(city);
 })
 