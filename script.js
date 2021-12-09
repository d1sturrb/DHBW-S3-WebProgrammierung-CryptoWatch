function showDiv(Div) {
  var x = document.getElementById(Div);
  if (x.style.display == "none") {
    x.style.display = "flex";
  } else {
    x.style.display = "none";
  }
}

/*
setTimeout(function(){
  alert("Sup! Boi"); 
}, 20000);
*/

function searchFromLandingPage() {
  /*location.href="./finder.html"*/
  let used_form = document.getElementById("form_search_landing_page");
  searched_currency = used_form.elements[0].value;

  fiat_currency = document.querySelector(
    "input[name='fiat_currency']:checked"
  ).value;

  alert("Getting " + searched_currency + "/" + fiat_currency);
}

function CryptoWatch() {
  /*location.href = "./index.html";*/
  location.reload()
}

async function load_all_coins(per_request_limit = 2000) {
  const response = await fetch("https://api.coinpaprika.com/v1/coins");
  const json = await response.json();
  coins = json;
  return coins;
}

function search_currencies() {
  let search_string = search_box.value.toLowerCase();

  const currencies = coins.filter((currency) => {
    const name = currency.name.toLowerCase();
    const symbol = currency.symbol.toLowerCase();
    return name.startsWith(search_string) || symbol.startsWith(search_string);
  });

  update_data_list(currencies);
}

function remove_all_children(element) {
  element.childNodes.forEach((childNode) => {
    childNode.remove();
  });
}

function update_data_list(currencies) {
  remove_all_children(search_listing_recommendations);
  let options = [];
  currencies.forEach((currency) => {
    options.push(
      `<option label="${currency.symbol}" value="${currency.name}"/>`
    );
  });
  search_listing_recommendations.innerHTML = options.slice(0, 12).join("");
}

function create_plot(currency, currency_data) {
  const ctx = document.getElementById(`graph_${currency.name}`);

  const data = [];
  currency_data.forEach((curr) =>
    data.push({
      x: new Date(curr.time_open),
      //x: Math.floor(new Date(curr.time_open) / 1000),
      y: curr.open,
    })
  );
  const labels = []
  data.forEach(element =>
    labels.push(element.x.toTimeString())
    )

  const config = {
    type: "line",
    data: {
      datasets: [
        {
          data: currency_data,
        },
      ],
    },
    options: {
      parsing: {
        xAxisKey: "time_open",
        yAxisKey: "open",
      },
      scales: {
        x: {
          //type: "time",
          //time: {
          //  unit: "minute",
          //},
        },
      },
    },
  };
  console.log(data)
  const myChart = new Chart(ctx, config);
}

async function add_currency_to_watch() {
  const currency_id = search_box.value;
  const currency = coins.filter((currency) => {
    return currency.name === currency_id;
  })[0];
  console.log(currency);
  if (currency === undefined) {
    return;
  }
  search_box.value = "";
  curr = await fetch(`https://api.coinpaprika.com/v1/coins/${currency.id}`);
  console.log(await curr.json());
  historical = await (
    await fetch(
      `https://api.coinpaprika.com/v1/coins/${currency.id}/ohlcv/historical?start=2020-11-29&end=2021-11-30`
    )
  ).json();
  console.log(Date.now() - 82800);
  today = await (
    await fetch(
      `https://api.coinpaprika.com/v1/tickers/${currency.id}/historical?start=${
        Math.floor(Date.now() / 1000) - 82800
      }`
    )
  ).json();
  console.log(historical);
  console.log(today);
  watched_currencies.push(currency);
  update_data_list(coins);
  finder_container.innerHTML += `
  <div class="finder_item" id="${currency.name}_wrapper">
    <div class="short_desc_coin_wrapper">
      <div class="coin_column_small">
      <button class="close_button_wrapper"  onclick=remove_currency('${currency.name}_wrapper')>
                    <img
                        class="close_button"
                        src="https://cdn.glitch.me/d77ae1d5-67ec-4b34-8bd3-2dedbeb4d130%2Fclose-circle-line.png?v=1638979457007"
                    />
                    </button>
      </div>
      <div class="coin_column_wide">
        <div class="coin_info_wrapper">
          <div class="info_column">
            <p class="coin_name">${currency.name}</p>
          </div>
          <div class="info_column">
            <p class="coin_value">${Intl.NumberFormat("de-DE", {
              style: "currency",
              currency: "USD",
            }).format(today[today.length - 1].price)}</p>
          </div>
        </div>
        <div class="coin_info_wrapper">
          <div class="info_column">
            <p class="coin_name">24 Hours</p>
          </div>
          <div class="info_column">
            <p class="coin_value">${Intl.NumberFormat("de-DE", {
              style: "percent",
            }).format(today[today.length - 1].price / today[1].price - 1)}</p>
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
        <input class="open_graph" type="button" name="open" value="Open Graph" onclick="showDiv('${
          currency.name
        }')"/>
      </div>
    </div>
    <div class="graph_coin_wrapper" id="${
      currency.name
    }" style="display: none;"> <!-- The needs to be set to the Coin ID and the open_graph Function need to put the data from here to open it. -->
      <canvas class="graph_wrapper" id="graph_${currency.name}" height="100%">
      </div>
      </div>
      </div>
      `;
  create_plot(currency, historical);
}

var coins = null;
const api_address = "https://api.coincap.io/v2/";
const watched_currencies = [];
const search_box = document.getElementById("search_listing_input");
const search_listing_recommendations = document.getElementById(
  "search_listing_recommendations"
);
const finder_container = document.getElementById("finder_container");

search_box.addEventListener("input", search_currencies);
search_box.addEventListener("change", add_currency_to_watch);

load_all_coins().then((coins) => update_data_list(coins));
console.log(coins);

function darkMode() {
  var darkBody = document.body;
  darkBody.classList.toggle("body_dark_mode");

  if (
    document.getElementById("dark_mode_img").src ==
    "https://cdn.glitch.me/d77ae1d5-67ec-4b34-8bd3-2dedbeb4d130%2Fsun-line.svg?v=1638406942274"
  ) {
    document.getElementById("dark_mode_img").src =
      "https://cdn.glitch.me/d77ae1d5-67ec-4b34-8bd3-2dedbeb4d130%2Fcontrast-2-line.svg?v=1638406942274";
  } else {
    document.getElementById("dark_mode_img").src =
      "https://cdn.glitch.me/d77ae1d5-67ec-4b34-8bd3-2dedbeb4d130%2Fsun-line.svg?v=1638406942274";
  }
}

function remove_currency(Div) {
  var element = document.getElementById(Div);
  element.remove();
}