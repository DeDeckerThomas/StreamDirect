const endpoint = "https://api.themoviedb.org/3/";

let currentIndex = 0,
  genres = [],
  currentItem = { production_countries: [] };

const enableInformationCard = () => {
  resetWorldMap();
  document.querySelector(".js-item-information").scrollTo(0, 0);
  document.querySelector(".js-item-information").classList.remove("o-hide-accessible");
  document.querySelector(".js-item-information").style.top = `${window.scrollY}px`;
  document.body.classList.add("no-scroll");
  let hashInfo = window.location.hash.substring(1).split("=");
  getItem(hashInfo[0], hashInfo[1]);
};

const disableInformationCard = () => {
  document.querySelector(".js-item-information").classList.add("o-hide-accessible");
  document.body.classList.remove("no-scroll");
  window.history.replaceState(
    {},
    document.title,
    window.location.toString().substring(0, window.location.toString().indexOf("#"))
  );
};

const enableBouncer = () => {
  document.querySelector(".js-main-bouncer").classList.remove("hide");
};
const disableBouncer = () => {
  document.querySelector(".js-main-bouncer").classList.add("hide");
};

const changeBouncerPosition = () => {
  document.querySelector(".js-main-bouncer").classList.remove("c-bouncer--top");
  document.querySelector(".js-main-bouncer").classList.add("c-bouncer--bottom");
};

const resetWorldMap = () => {
  for (let country of currentItem.production_countries) {
    document.querySelector(`#${country.name.replaceAll(" ", "_")}`).classList.remove("c-world-map__country--active");
  }
};

const enableDropDown = () => {
  document.querySelector(".js-search-results").style.display = "flex";
};

const disableDropDown = () => {
  document.querySelector(".js-search-results").style.display = "none";
  document.querySelector(".js-search-results").innerHTML = "";
  document.querySelector(".js-search").value = "";
};

const showCastAndCrew = (data) => {
  let html = ``;
  for (const item of data) {
    html += `<li class="c-showcase__item c-showcase__item--person"><img class="c-showcase__person" src="${
      item.profile_path ? `https://image.tmdb.org/t/p/w500${item.profile_path}` : "./img/blank-profile.png"
    }" alt="Picture of ${item.name}" /></a><p class="u-mb-clear u-align-text-center">${item.name}</p></li>`;
  }
  document.querySelector(".js-cast-and-crew").innerHTML = html;
  checkHorizontalScrollButtons();
};

const showItem = (item) => {
  document.querySelector(".js-cast-and-crew").scrollTo(0, 0);
  document.querySelector(".js-related").scrollTo(0, 0);
  currentItem = item;
  document.querySelector(".js-backdrop").src = `https://image.tmdb.org/t/p/w500${item.backdrop_path}`;
  document.querySelector(".js-backdrop").alt = `Backdrop Of ${item.media_type === "tv" ? item.name : item.title}`;
  document.querySelector(".js-poster").src = `https://image.tmdb.org/t/p/w500${item.poster_path}`;
  document.querySelector(".js-poster").alt = `Poster Of ${item.media_type === "tv" ? item.name : item.title}`;
  document.querySelector(".js-title").innerText = item.media_type === "tv" ? item.name : item.title;
  document.querySelector(".js-rating").style.setProperty("--rating", item.vote_average / 2);
  document.querySelector(".js-rating-number").innerText = item.vote_average;
  document.querySelector(".js-overview").innerText = item.overview;
  document.querySelector(".js-genres").innerText = item.genres
    ? item.genres.map((genre) => genre.name).join(", ")
    : "Not known";
  document.querySelector(".js-runtime").innerText = item.runtime
    ? item.runtime
    : item.episode_run_time
    ? item.episode_run_time[0]
    : "Not known";
  document.querySelector(".js-director").innerText = item.created_by
    ? item.created_by.map((director) => director.name).join(", ")
    : item.credits.crew
        .filter((director) => director.job == "Director")
        .map((director) => director.name)
        .join(", ");
  if (document.querySelectorAll(".js-seasons").length !== 0) {
    document.querySelectorAll(".js-seasons").forEach((e) => e.parentNode.removeChild(e));
  }
  if (item.number_of_seasons) {
    document.querySelector(".js-main-information").innerHTML += `
    <p class="u-mb-clear js-seasons">Seasons</p>
    <p class="js-seasons">${item.number_of_seasons}</p>`;
  }

  for (let country of item.production_countries) {
    document.querySelector(`#${country.name.replaceAll(" ", "_")}`).classList.add("c-world-map__country--active");
  }
  showCastAndCrew(item.credits.cast.concat(item.credits.crew));
  getRelatedItems(item.media_type, item.id);
};

const getItem = async (mediaType, id) => {
  const data = await fetch(`${endpoint}${mediaType}/${id}?api_key=${apiKey}&language=en-US&append_to_response=credits`)
    .then((response) => response.json())
    .catch((error) => console.log("An error occured:", error));
  data.media_type = mediaType;
  showItem(data);
};

const showRelatedItems = (carousel, data, mediaType) => {
  let html = "";
  if (data.results.length === 0) {
    html += "<p>No related items found.</p>";
  }
  for (const item of data.results) {
    html += `<li class="c-showcase__item"><a href="${window.location.href.replace(location.hash, "")}#${
      item.media_type ? item.media_type : mediaType
    }=${item.id}" target="_self"><img class="c-showcase__poster" src="https://image.tmdb.org/t/p/w500${
      item.poster_path
    }" alt="Poster of ${item.title}" /></a></li>`;
  }
  carousel.innerHTML = html;
  checkHorizontalScrollButtons();
};

const getRelatedItems = async (mediaType, id) => {
  const data = await fetch(`${endpoint}${mediaType}/${id}/similar?api_key=${apiKey}&language=en-US`)
    .then((response) => response.json())
    .catch((error) => console.log("An error occured:", error));
  showRelatedItems(document.querySelector(".js-related"), data, mediaType);
};

const addCarousel = (name, data, mediaType) => {
  const appMain = document.querySelector(".js-app-main");
  let html = "";
  for (const item of data.results) {
    html += `<li class="c-showcase__item"><a href="${window.location.href.replace(location.hash, "")}#${
      item.media_type ? item.media_type : mediaType
    }=${item.id}" target="_self"><img class="c-showcase__poster" src="https://image.tmdb.org/t/p/w500${
      item.poster_path
    }" alt="Poster of ${item.title}" /></a></li>`;
  }
  appMain.innerHTML += `
  <section class="o-row c-showcase">
    <button class="o-button-reset c-slide-button c-slide-button--back js-slide-back hide">
      <svg class="c-arrow" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24">
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
      </svg>
    </button>
    <p class="c-showcase__title u-mb-xs u-color-white">${name}</p>
    <ul class="o-list c-showcase__list u-mb-clear js-showcase js-${name.replace(" ", "-").toLowerCase()}">
      ${html}
    </ul>
    <button class="o-button-reset c-slide-button js-slide">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        class="c-arrow"
      >
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path
          d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"
        />
      </svg>
    </button>
  </section>`;
  listenToSlideButtons();
};

const getItemsByGenre = async (genre) => {
  const data = await fetch(`${endpoint}discover/movie?api_key=${apiKey}&language=en-US&with_genres=${genre.id}`)
    .then((response) => response.json())
    .catch((error) => console.log("An error occured:", error));
  addCarousel(genre.name, data, "movie");
};

const getGenres = async () => {
  const data = await fetch(`${endpoint}genre/movie/list?api_key=${apiKey}&language=en-US`)
    .then((response) => response.json())
    .catch((error) => console.log("An error occured:", error));
  genres = data.genres;
  getItemsByGenre(genres[currentIndex]);
  currentIndex++;
  getItemsByGenre(genres[currentIndex]);
};

const getPopular = async () => {
  const data = await fetch(`${endpoint}discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc`)
    .then((response) => response.json())
    .catch((error) => console.log("An error occured:", error));
  addCarousel("Popular", data, "movie");
};

const getTrending = async () => {
  const data = await fetch(`${endpoint}trending/all/day?api_key=${apiKey}`)
    .then((response) => response.json())
    .catch((error) => console.log("An error occured:", error));
  addCarousel("Trending", data);
};

const checkHorizontalScrollButtons = () => {
  const buttons = document.querySelectorAll(".js-slide");
  const backButtons = document.querySelectorAll(".js-slide-back");
  const showcases = document.querySelectorAll(".js-showcase");
  for (let i = 0; i < showcases.length; i++) {
    if (showcases[i].scrollLeft === 0) {
      backButtons[i].classList.add("hide");
      buttons[i].classList.remove("hide");
    } else if (showcases[i].scrollLeft + showcases[i].clientWidth === showcases[i].scrollWidth) {
      buttons[i].classList.add("hide");
      backButtons[i].classList.remove("hide");
    } else {
      buttons[i].classList.remove("hide");
      backButtons[i].classList.remove("hide");
    }
    if (showcases[i].offsetWidth >= showcases[i].scrollWidth || showcases[i].clientHeight == 0) {
      buttons[i].classList.add("hide");
      backButtons[i].classList.add("hide");
    }
  }
};

const showSearchResults = (data) => {
  let html = "";

  for (let item of data) {
    if (item.media_type === "movie" || item.media_type === "tv") {
      html += `<a class="c-search-box__item" href="#${item.media_type}=${item.id}">${
        item.title ? item.title : item.name
      }</a>`;
    }
  }
  document.querySelector(".js-search-results").innerHTML = html;
  enableDropDown();
};

const listenToSearch = () => {
  document.querySelector(".js-search").addEventListener("input", async () => {
    let query = document.querySelector(".js-search").value;
    if (query !== "") {
      const data = await fetch(`${endpoint}search/multi?api_key=${apiKey}&language=en-US&query=${query}`)
        .then((response) => response.json())
        .catch((error) => console.log("An error occured:", error));
      showSearchResults(data.results);
    } else {
      disableDropDown();
    }
  });
  document.querySelector(".js-app").addEventListener("click", () => {
    disableDropDown();
  });
};

const listenToBackButton = () => {
  document.querySelector(".js-back-button").addEventListener("click", () => {
    disableInformationCard();
  });
};

const listenToSlideButtons = () => {
  const buttons = document.querySelectorAll(".js-slide");
  const backButtons = document.querySelectorAll(".js-slide-back");
  const showcases = document.querySelectorAll(".js-showcase");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", async () => {
      showcases[i].scrollTo({
        left: showcases[i].scrollLeft + document.documentElement.clientWidth - 16,
        behavior: "smooth",
      });
    });
  }
  for (let i = 0; i < backButtons.length; i++) {
    backButtons[i].addEventListener("click", () => {
      showcases[i].scrollTo({
        left: showcases[i].scrollLeft - document.documentElement.clientWidth - 16,
        behavior: "smooth",
      });
    });
    showcases[i].addEventListener("scroll", async () => {
      checkHorizontalScrollButtons();
      setTimeout(async () => {
        if (showcases[i].scrollLeft >= showcases[i].scrollWidth / 2.5) {
        }
      }, 500);
    });
  }
};

const listenToHash = () => {
  window.addEventListener(
    "hashchange",
    () => {
      enableInformationCard();
      disableDropDown();
    },
    false
  );
  document.querySelector(".js-info-page").addEventListener("click", function (e) {
    if (e.target !== this) return;
    disableInformationCard();
  });
};

const listenToScroll = () => {
  window.addEventListener("scroll", (event) => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (clientHeight + scrollTop >= scrollHeight) {
      currentIndex++;
      if (currentIndex < genres.length) {
        enableBouncer();
        setTimeout(async () => {
          await getItemsByGenre(genres[currentIndex]);
          currentIndex++;
          if (currentIndex < genres.length) {
            await getItemsByGenre(genres[currentIndex]);
          }
          disableBouncer();
          checkHorizontalScrollButtons();
        }, 1000);
      }
    }
  });
};

const enableEventListeners = () => {
  listenToHash();
  listenToScroll();
  listenToBackButton();
  listenToSearch();
};

const init = async () => {
  await setTimeout(async () => {
    await getTrending();
    disableBouncer();
    await getPopular();
    await getGenres();
    changeBouncerPosition();
    enableEventListeners();
  }, 1500);
};

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM Loaded! 🥳");
  init();
});
