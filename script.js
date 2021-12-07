function showDiv(Div) {
  var x = document.getElementById(Div);
  if(x.style.display=="none") {
      x.style.display = "flex";
  } else {
      x.style.display = "none";
  }
};

/*
setTimeout(function(){
  alert("Sup! Boi"); 
}, 20000);
*/

function searchFromLandingPage() {
  /*location.href="./finder.html"*/
  let used_form = document.getElementById("form_search_landing_page");
  searched_currency = used_form.elements[0].value;
  
  fiat_currency = document.querySelector("input[name='fiat_currency']:checked").value;

  alert("Getting " + searched_currency + "/" + fiat_currency)

}

function CryptoWatch() {
  location.href="./index.html"
}

/*

alert("Sup! Boi")

fetch("https://coingecko.p.rapidapi.com/simple/price?ids=BTC&vs_currencies=EUR", {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "coingecko.p.rapidapi.com",
		"x-rapidapi-key": "fdc94e748amsh81a55b72b4da354p16f16bjsnf20364f17e8e"
	}
})
.then(response => {
	console.log(response);
})
.catch(err => {
	console.error(err);
});
*/

/*
async function test_api() {
  console.log("Klick start")
  const response = await fetch("https://coingecko.p.rapidapi.com/coins/list", {
    "method": "GET",
    "headers": {
      "x-rapidapi-host": "coingecko.p.rapidapi.com",
      "x-rapidapi-key": "fdc94e748amsh81a55b72b4da354p16f16bjsnf20364f17e8e"
    }
  })
  console.log(await response.json())
  console.log("Klick end")
} 

const btn_test = document.getElementById("test")
btn_test.addEventListener("click", test_api)
*/

async function load_all_coins(per_request_limit = 2000) {
  const response = await fetch("https://api.coinpaprika.com/v1/coins")
  const json = await response.json()
  coins = json
  return coins
}


function search_currencies() {
  let search_string = search_box.value.toLowerCase()

  const currencies = coins.filter(currency => {
    const name = currency.name.toLowerCase()
    const symbol = currency.symbol.toLowerCase()
    return name.startsWith(search_string) || symbol.startsWith(search_string)
  })

  update_data_list(currencies)
}


function remove_all_children(element) {
  element.childNodes.forEach(childNode => {
    childNode.remove()
  })
}


function update_data_list(currencies) {
  remove_all_children(search_listing_recommendations)
  let options = []
  currencies.forEach(currency => {
    options.push(`<option label="${currency.symbol}" value="${currency.name}"/>`)
  })
  search_listing_recommendations.innerHTML = options.slice(0, 12).join("")
}

async function add_currency_to_watch() {
  const currency_id = search_box.value
  const currency = coins.filter(currency => {
    return currency.name === currency_id
  })[0]
  console.log(currency)
  if (currency === undefined) {
    return
  }
  search_box.value = ""
  curr = await fetch(`https://api.coinpaprika.com/v1/coins/${currency.id}`)
  console.log(await curr.json())
  historical = await (await fetch(`https://api.coinpaprika.com/v1/coins/${currency.id}/ohlcv/historical?start=2020-11-29&end=2021-11-30`)).json()
  console.log(Date.now() - 82800)
  today = await (await fetch(`https://api.coinpaprika.com/v1/tickers/${currency.id}/historical?start=${Math.floor(Date.now()/1000) - 82800}`)).json()
  console.log(historical)
  console.log(today)
  watched_currencies.push(currency)
  update_data_list(coins)
  finder_container.innerHTML += `
  <div class="finder_item">
    <div class="short_desc_coin_wrapper">
      <div class="coin_column_small">
        <img class="coin_icon" src="https://cdn.glitch.me/d77ae1d5-67ec-4b34-8bd3-2dedbeb4d130%2F1175251_bitcoin_btc_cryptocurrency_icon.svg?v=1638100220235">
      </div>
      <div class="coin_column_wide">
        <div class="coin_info_wrapper">
          <div class="info_column">
            <p class="coin_name">${currency.name}</p>
          </div>
          <div class="info_column">
            <p class="coin_value">${Intl.NumberFormat("de-DE", {style: "currency", currency: "USD"}).format(today[today.length - 1].price)}</p>
          </div>
        </div>
        <div class="coin_info_wrapper">
          <div class="info_column">
            <p class="coin_name">24 Hours</p>
          </div>
          <div class="info_column">
            <p class="coin_value">${Intl.NumberFormat("de-DE", {style: "percent"}).format(today[today.length - 1].price / today[1].price - 1)}</p>
          </div>
        </div>
        <div class="coin_info_wrapper">
          <div class="info_column">
            <p class="coin_name">7 Days</p>
          </div>
          <div class="info_column">
            <p class="coin_value">- 5%</p>
          </div>
        </div>
        <div class="coin_info_wrapper">
          <div class="info_column">
            <p class="coin_name">One Month</p>
          </div>
          <div class="info_column">
            <p class="coin_value">+ 20%</p>
          </div>
        </div>
      </div>
      <div class="coin_column_small">
        <input class="open_graph" type="button" name="open" value="Open Graph" onclick="showDiv('${currency.name}')"/>
      </div>
    </div>
    <div class="graph_coin_wrapper" id="${currency.name}" style="display: none;"> <!-- The needs to be set to the Coin ID and the open_graph Function need to put the data from here to open it. -->
      <div class="graph_wrapper">
        <p>Whitepaper-Link, Kurs plotten (evtl. mit Filtern)</p>
      </div>
    </div>
  </div>
  `
}


var coins = null
const api_address = "https://api.coincap.io/v2/"
const watched_currencies = []
const search_box = document.getElementById("search_listing_input")
const search_listing_recommendations = document.getElementById("search_listing_recommendations")
const finder_container = document.getElementById("finder_container")

search_box.addEventListener("input", search_currencies)
search_box.addEventListener("change", add_currency_to_watch)

load_all_coins()
  .then(coins => update_data_list(coins))
console.log(coins)
/*
var slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}
*/

function darkMode() {
  var darkBody = document.body;
  darkBody.classList.toggle("body_dark_mode");

  if (document.getElementById("dark_mode_img").src == "https://cdn.glitch.me/d77ae1d5-67ec-4b34-8bd3-2dedbeb4d130%2Fsun-line.svg?v=1638406942274") 
  {
      document.getElementById("dark_mode_img").src = "https://cdn.glitch.me/d77ae1d5-67ec-4b34-8bd3-2dedbeb4d130%2Fcontrast-2-line.svg?v=1638406942274";
  }
  else 
  {
      document.getElementById("dark_mode_img").src = "https://cdn.glitch.me/d77ae1d5-67ec-4b34-8bd3-2dedbeb4d130%2Fsun-line.svg?v=1638406942274";
  }
}