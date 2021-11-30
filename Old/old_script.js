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

function update_currency(curreny="") {
  var url = "https://coingecko.p.rapidapi.com/simple/price?ids="+curreny+"&vs_currencies=EUR"
  fetch( url, {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "coingecko.p.rapidapi.com",
		"x-rapidapi-key": "fdc94e748amsh81a55b72b4da354p16f16bjsnf20364f17e8e"
	}
})
.then(response => response.json())
.then(data => console.log(data));
}

alert("Sup! Boi")