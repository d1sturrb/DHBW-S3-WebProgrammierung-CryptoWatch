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

async function load_all_coins() {
  const response = await fetch("https://coingecko.p.rapidapi.com/coins/list", {
    "method": "GET",
    "headers": {
      "x-rapidapi-host": "coingecko.p.rapidapi.com",
      "x-rapidapi-key": "fdc94e748amsh81a55b72b4da354p16f16bjsnf20364f17e8e"
    }
  })
  if (!response.ok) return null
  // const json = await response.json()
  const json = response.json().then(json => json)
  return json
}
const all_coins = load_all_coins()
console.log(all_coins)
console.log(all_coins[10])

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