const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-btn");
const clearButton = document.getElementById("clear-btn");
const resultsContainer = document.getElementById("results");

searchButton.addEventListener("click", searchFunction);
clearButton.addEventListener("click", clearSearch);

function searchFunction() {
  console.log("Searching...");
  const query = searchInput.value.toLowerCase().trim();

  fetch("./travel_recomendations_api.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const matchedItems = [];

      data.countries.forEach((country) => {
        country.cities.forEach((city) => {
          if (city.name.toLowerCase().includes(query)) {
            matchedItems.push(city);
          }
        });
      });

      data.temples.forEach((temple) => {
        if (temple.name.toLowerCase().includes(query)) {
          matchedItems.push(temple);
        }
      });

      data.beaches.forEach((beach) => {
        if (beach.name.toLowerCase().includes(query)) {
          matchedItems.push(beach);
        }
      });

      showFloatingCards(matchedItems);
    })
    .catch((error) => { 
      console.error("Error fetching data:", error);
      const container = document.getElementById("floating-results");
      container.innerHTML = `<div class="floating-card"><p>Error fetching data. Please try again later.</p></div>`;
    });
}


function clearSearch() {
  searchInput.value = "";
  const container = document.getElementById("floating-results");
  container.innerHTML = "";
  container.classList.add("hidden");
}


function showFloatingCards(places) {
  const container = document.getElementById("floating-results");
  container.innerHTML = ""; // clear previous results
  container.classList.remove("hidden");

  if (places.length === 0) {
    container.innerHTML = `<div class="floating-card"><p>No matching destinations found.</p></div>`;
    return;
  }

  places.forEach((place) => {
    const card = document.createElement("div");
    card.className = "floating-card";

    card.innerHTML = `
      <h4>${place.name}</h4>
      <img src="${place.imageUrl}" alt="${place.name}" />
      <p>${place.description}</p>
      <button>Select</button>
    `;

    container.appendChild(card);
  });
}