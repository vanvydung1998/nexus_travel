const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const clearBtn = document.getElementById("clear-btn");
const result = document.getElementById("result");
const form = document.getElementById("searchForm");
const contactForm = document.getElementById("submit");
const temples = "temples";
const beaches = "beaches";
const countries = "countries";

/* Add listeners */
if (searchBtn) {
    searchBtn.addEventListener( "click", ( e ) => {
    e.preventDefault();
    searchData();
    });
}

if (clearBtn) {
    clearBtn.addEventListener( "click", ( e ) => {
    e.preventDefault();
    clearSearch();
    });
}

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for contacting us. We will get back to you soon.');
    e.target.reset();
    });
}

/* function to add unique object to an array */
function addUnique(array, newObject) {
  // Check if an object with the same name already exists
  const exists = array.some(obj => obj.name === newObject.name);

  // If it doesn't exist, add the new object
  if (!exists) {
    array.push(newObject);
  }

  return array;
}

function localTime(timeZone) {
    const options = { timeZone: timeZone, hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return new Date().toLocaleTimeString('en-US', options);
}

function searchData() {

  let query = searchInput.value.toLowerCase().trim();

  switch (query) {

     case "temple":
        query = temples;
        break;
     case "beach":
        query = beaches;
        break;
     case "country": 
        query = countries;
        break;
  }

  fetch("./travel_recommendation_api.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
        const foundCities = [];
        switch (query) {
            case countries:
                data.countries.forEach((country) => {
                    country.cities.forEach((city) => {
                       addUnique(foundCities,city);
                   });
                 });
                 break;
            case temples:
                data.temples.forEach((temple) => {
                       addUnique(foundCities,temple);
                });
                data.countries.forEach((country) => {
                    country.cities.forEach((city) => {
                        if (city.description.toLowerCase().includes(query)) {
                            addUnique(foundCities,city);
                        }
                   });
                 });
                break;   
            case beaches:
                data.beaches.forEach((beach) => {
                       addUnique(foundCities,beach);
                });
                data.countries.forEach((country) => {
                    country.cities.forEach((city) => {
                        if (city.description.toLowerCase().includes(query)) {
                            addUnique(foundCities,city);
                        }
                    });
                });
                break;   
            default:
                data.countries.forEach((country) => {
                    if (country.name.toLowerCase().includes(query)) {
                        country.cities.forEach((city) => {
                            addUnique(foundCities,city);
                        });
                    };
                });
                
        }        

      showResults(foundCities);
    })
    .catch((error) => { 
      console.error("Error fetching data:", error);
      result.innerHTML = `<div><p id="errorLabel">Error fetching data. Please try again later.</p></div>`;
    });
}


function clearSearch() {
  form.reset();
  result.innerHTML = "";
}


function showResults(cities) {
 
  result.innerHTML = ""; // clear results

  if (cities.length === 0) {
    result.innerHTML = `<div><p id="errorLabel">No matching destinations found.</p></div>`;
    return;
  }

  result.innerHTML = ` <div id="resultLabel"> Our Recommendations </div>`;
  cities.forEach((city) => {
    const cityTime = localTime(city.timeZone);
    const cityName = city.name.slice(0, city.name.indexOf(","));
    const card = document.createElement("div");
    card.className = "resultCard";
    card.innerHTML = `<div class="cardImg"> <img src="${city.imageUrl}" alt="${city.name}" /> </div>`;
    card.innerHTML += `<div class="cardContent"><h3 class="cityName">${city.name}</h3>
                       <p class="description">Current time in ${cityName} is <strong> ${cityTime} </strong>
                       <br><br>${city.description}</p>
                       <button type="button" class="visit">Visit</button> </div>`;

    result.appendChild(card);
  });
}