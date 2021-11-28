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

function searchFromListingPage() {
  /*location.href="./finder.html"*/
  let used_form = document.getElementById("search_listing");
  searched_currency = used_form.elements[0].value;
  
  /*fiat_currency = document.querySelector("input[name='fiat_currency']:checked").value;*/

  alert("Getting " + searched_currency ) /* + "/" + fiat_currency)*/

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
var coins = null 
async function load_all_coins(per_request_limit = 2000) {
  /*
  Mögliche Probleme in der Funkton:
  - Falls wir einen Fehler bekommen, gilt die Abfrage als fertig (da len = 0)
  - Damit wäre ein unvollständiges Laden der Liste möglich (Fehler durch zu viele Anfragen, in dem Fall sollte kurz gewartet werden und dann nochmal gefragt)
  */
  var complete_currency_list = []
  var json
  var new_json = null
  var offset = 0
  do {
    var query = "https://api.coincap.io/v2/assets?limit=" + per_request_limit + "&offset=" + offset
    console.log(query)
    const response = await fetch(query, {
      "method": "GET"
    })
    offset += per_request_limit
    json = await response
    console.log(json)
    json = await json.json()
    complete_currency_list.push(...json.data)
    console.log(json.data.length)
  } while (json.data.length >= per_request_limit)
  coins = complete_currency_list
  console.log(complete_currency_list)
}
load_all_coins()
//load_all_coins(101)
//load_all_coins(201)
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