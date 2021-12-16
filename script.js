// Attributes



/* Save:
  - selected Darkmode-Decision
  - selected FIAT and Crypto-Currencies
  (-amount of website used)
*/

/**
 * Findet den Auslösenden Knopf eines Events
 * @param {array} event - die .path Eigenschaft eines Events
 */
function find_button(event) {
  // Dieses durchreisen des Path-Arrays ist notwendig, da z.B. ein Bild in einem
  // Knopf als auslöser gelten könnte (je nach Padding & co)
  let element = event.target
  while (element.tagName !== "BUTTON") {
    if (element.tagName === "HTML"){
      return undefined
    }
    element = element.parentElement
  }
  return element
}

/**
 * Zeigt den Graphen einer Währung an.
 * @param {event} event - Das Event
 */
function show_graph(event) {
  console.log(event)
  const button = find_button(event)
  const currency = get_currency_by_id(button.name)
  const graph_wrapper = currency.element.getElementsByClassName("graph_coin_wrapper")[0]
  
  if (graph_wrapper.style.display == "none") {
    graph_wrapper.style.display = "flex";
  } else {
    graph_wrapper.style.display = "none";
  }
}

//TODO Bilddatei durch CSS ersetzen
/* Removes a Currency from the Screen */
function remove_currency(event) {
  const button = find_button(event)
  const currency = get_currency_by_id(button.name)

  // Löschen des Elements aus dem DOM
  // Das Objekt bleibt erhalten, kann somit später wiederverwendet werden
  currency.element.remove()

  remove_watched_currency(currency)
}


/**
 * Lädt alle Verfügbaren Coins von der API (api.coinpaprika.com)
 * Speichert diese Coins in die globale Variable "coins"
 */
async function load_all_coins() {
  const response = await fetch("https://api.coinpaprika.com/v1/tickers/")
  coins = await response.json()
  // Nach dem die Coins geladen wurden, müssen diese auch in den Suchvorschlägen angezeigt werden
  filter_recommended_currencies()

  // zum Schluss noch die Währungen aus der letzten Sitzung anzeigen.
  const watched_currencies = get_watched_currencies()

  // Jede Währung im Speicher durchgehen und Anzeigen
  watched_currencies.forEach(currency => {
    add_currency_to_watch(currency)
  })
}

/**
 * Filtert die Währungssuche.
 * Die Vorschläge der Währungssuche werden basierend auf dem eingegebenen Suchtext reduziert.
 * Dabei wird der Inhalt nach "ranking" aus der API sortiert und die Anzahl der Ausgabelemente limitiert 
 * Die Suche beachtet sowohl die Anzeigenamen als auch die Symbole, Großschreibung wird nicht beachtet.
 */
function filter_recommended_currencies() {
  const watched_currencies = get_watched_currencies()
  console.log(watched_currencies)
  let recommended_currencies = coins.filter((currency) => {
    // falls die gesuchte Währung bereits in der Anzeige ist, nicht wieder vorschlagen
    if (watched_currencies.includes(currency.id)) {
      return false
    }
    
    let search_string = search_box.value.toLowerCase()
    const name = currency.name.toLowerCase() // Anzeigename (z.B. Bitcoin)
    const symbol = currency.symbol.toLowerCase() // Symbol (z.B BTN)
    return name.startsWith(search_string) || symbol.startsWith(search_string)
  })

  // Kürzen der Liste auf die ersten paar Ergebnisse, um die Anzahl der angezeigten Ergebniss zu limitieren
  recommended_currencies = recommended_currencies.slice(0, 12)

  let options = []
  recommended_currencies.forEach((currency) => {
    options.push(
      `<option label="${currency.name}" value="${currency.id}"/>`
    )
  })
  // Ersetzen der Vorschläge im DOM
  search_listing_recommendations.innerHTML = options.join("")
}

/**
 * Erstellt einen Plot und fügt diesen in das dazugehörige Element ein.
 * @param {Object} currency - Metadaten der Währung, Objekt aus der globalen "coins"-Liste
 * @param {Object} currency_data - Historische Daten zu dem Coin, erhalten aus der Coinpaprika-API
 */
function create_plot(currency, currency_data) {
  // Canvas-Element für den Plot holen
  const ctx = document.getElementById(`graph_${currency.name}`)

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
  }
  const myChart = new Chart(ctx, config);
}

// TODO: Kann / Muss evtl. gelöscht werden, da viele verwendet Infos durch die verwendung des Tickers erhalten werden
/**
 * Lade zusätzliche Daten zu einer Währung
 * Falls die Währung bereits erweitert wurde, wird dieser Schritt übersprungen
 * @param {object} currency - currency aus der "coins"-Liste, welche erweitert werden soll
 */
async function fetch_extended_coin_data(currency) {
  // Falls die Währung bereits erweitert ist, müssen die Daten nicht erneut geladen werden.
  if ("extended_information" in currency) {
    return
  }
  currency["extended_information"] = await(await fetch(`https://api.coinpaprika.com/v1/coins/${currency.id}`)).json()
}

/**
 * Formatiert das gegebene Datum in einem String, passend für die Coinpaprika-Api
 * Das verwendete Format ist "YYYY-MM-DD"
 * @param {Date} date - Datum, welches in einen String umgewandelt werden soll
 */
function get_date_as_string(date = new Date()){
  // Der Tag muss ggf. mit führenden nullen Aufgefüllt werden
  // Die Methode dafür ist Date, nicht Day, da Day nur den Tag in der Woche gibt
  let day = date.getDate()
  day = day.toString().padStart(2, "0")

  // Da der Monat in Javascript 0-Basiert ist, muss noch eine 1 dazu addiert werden.
  // Zusätzlich kann ein Äuffüllen notwendig sein.
  let month = date.getMonth()
  month += 1
  month = month.toString().padStart(2, "0")

  // Das Jahr kann einfach übernommen werden, da es (im erwartbaren Zeitraum) immer 4-Stellig ist
  let year = date.getFullYear()
  year = year.toString()

  // Schlussendliche wird das Datum mit Bindestrichen zusammengesetzt.
  return `${year}-${month}-${day}`
}

/**
 * Formatiert das gegebene Datum - 1 Jahr in einem String, passend für die Coinpaprika-Api
 * Das verwendete Format ist "YYYY-MM-DD"
 * @param {Date} date - Datum, welches in einen String umgewandelt werden soll
 */
function get_last_year_as_string(date = new Date()) {
  let day = date.getDate()
  let month = date.getMonth()
  let year = date.getFullYear() - 1

  return get_date_as_string(new Date(year, month, day))
}

/**
 * Lade historische Daten für die Gegebene Währung.
 * @param {object} currency - currency aus der "coins"-Liste, zu der die historischen Daten gesucht werden sollen.
 */
async function fetch_historical_data(currency) {
  currency["historical_data"] = await (
    await fetch(
      `https://api.coinpaprika.com/v1/coins/${currency.id}/ohlcv/historical?start=${get_last_year_as_string()}&end=${get_date_as_string()}`
    )
  ).json()
}

/**
 * Hole alle überwachten Währungen aus dem Lokalen Speicher
 * @returns Eine Liste mit allen Currency-IDs als Strings
 */
function get_watched_currencies(){
  let currencies = JSON.parse(localStorage.getItem("watched_currencies"))
  if (currencies === null) {
    currencies = []
  }
  return currencies
}

/**
 * Füge eine Währung der überwachung hinzu
 * @param {object} currency - Metadaten der Währung, Objekt aus der globalen "coins"-Liste
 */
function add_currency_to_watched_list(currency){
  watched_currencies = get_watched_currencies()

  // Falls die Währung bereits in der Liste vorhanden ist, sollte sie nicht doppelt abgespeichert werden.
  if (watched_currencies.indexOf(currency.id) > -1) {
    return
  }

  // Die neue Währung hinzufügen
  watched_currencies.push(currency.id)

  // Alles wieder abspeichern.
  localStorage.setItem("watched_currencies", JSON.stringify(watched_currencies))
}

/**
 * Entferne eine Währung aus der angezeigten Liste
 * @param {object} currency - Metadaten der Währung, Objekt aus der globalen "coins"-Liste
 */
function remove_watched_currency(currency){

  const index = watched_currencies.indexOf(currency.id)
  
  // Falls der Index -1 ist, ist die Währung nicht in der Watched-Liste, ergo nichts ändern 
  if (index == -1) {
    return
  }

  // an der Position index genau 1 Item löschen
  watched_currencies.splice(index, 1)

  // Alles wieder abspeichern.
  localStorage.setItem("watched_currencies", JSON.stringify(watched_currencies))
}

function get_currency_by_id(currency_id){
  return coins.find((currency) => {
    return currency.id === currency_id
  })
}

/**
 * get_exchange_course(coin_amount)
 * Gibt das zu der Währung gehörende Element zurück, falls noch keins Existiert, wird eins erstellt.
 * @param {object} currency - Metadaten der Währung, Objekt aus der globalen "coins"-Liste 
 * @returns Das zu der Währung gehörende Element für das DOM
 */
function get_currency_card(currency) {
  if ("element" in currency) {
    return currency["element"]
  }
  const currency_price = Intl.NumberFormat("de-DE", {style: "currency", currency: "USD",}).format(currency.quotes["USD"].ath_price)
  const element = document.createElement("div")
  element.classList.add("finder_item")
  element.id = `${currency.id}_wrapper`
  element.innerHTML = `
    <div class="short_desc_coin_wrapper">
      <div class="coin_column_small">
        <button class="close_button_wrapper" name="${currency.id}">
          <img
              class="close_button"
              src="http://cdn.onlinewebfonts.com/svg/img_211963.png"
          />
        </button>
      </div>
      <div class="coin_column_wide">
        <div class="coin_info_wrapper">
          <div class="info_column">
            <p class="coin_name">${currency.name}</p>
          </div>
          <div class="info_column">
            <p class="coin_value">
              ${currency_price}
            </p>
          </div>
        </div>
        <div class="coin_info_wrapper">
          <div class="info_column">
            <p class="coin_name">24 Hours</p>
          </div>
          <div class="info_column">
            <p class="coin_value">
              ${Intl.NumberFormat("de-DE", {
                style: "percent",
                maximumFractionDigits: 2,
                signDisplay: 'always',
              }).format(currency.quotes["USD"].percent_change_24h / 100)}
            </p>
          </div>
        </div>
        <div class="coin_info_wrapper">
          <div class="info_column">
            <p class="coin_name">7 Days</p>
          </div>
          <div class="info_column">
            <p class="coin_value">
              ${Intl.NumberFormat("de-DE", {
                style: "percent",
                maximumFractionDigits: 2,
                signDisplay: 'always',
              }).format(currency.quotes["USD"].percent_change_7d / 100)}
            </p>
          </div>
        </div>
        <div class="coin_info_wrapper">
          <div class="info_column">
            <p class="coin_name">One Month</p>
          </div>
          <div class="info_column">
            <p class="coin_value">
              ${Intl.NumberFormat("de-DE", {
                style: "percent",
                maximumFractionDigits: 2,
                signDisplay: 'always',
              }).format(currency.quotes["USD"].percent_change_30d / 100)}
            </p>
          </div>
        </div>
      </div>
      <div clsas="coin_column_small">
        <button class="open_graph" name="${currency.id}"/>Open Graph</button>
      </div>
    </div>
    <div class="graph_coin_wrapper"style="display: none;">
      <canvas class="graph" height="100%"></canvas>
    </div>
  `

  element.getElementsByClassName("open_graph")[0].addEventListener("click", show_graph)
  element.getElementsByClassName("close_button_wrapper")[0].addEventListener("click", remove_currency)

  currency["element"] = element
  return element 
}

async function add_currency_to_watch(currency_id) {
  // TODO: Folgende zeile noch verwenden
  // selected_fiat_currency = document.querySelector('input[name=fiat_currency]:checked').value  /* Get selected FIAT-Currency from Radio Buttons */

  const currency = get_currency_by_id(currency_id)
  if (currency === undefined) {
    return;
  }
  search_box.value = "";

  // Paralelles Ausführen der beiden Datensammlungen / Erweiterungen
  Promise.all([
    fetch_extended_coin_data(currency),
    fetch_historical_data(currency),
  ])

  add_currency_to_watched_list(currency)

  finder_container.append(get_currency_card(currency))

  filter_recommended_currencies()

  // TODO: Nutzt noch historical info, korrekt einarbeiten
  create_plot(currency)
}

// Wrapperfunktion um das Event-Argument abzufangen und die Währung auszuwählen 
function add_currency_event() {
  add_currency_to_watch(search_box.value)
}

var coins = null;
const search_box = document.getElementById("search_listing_input");
const search_listing_recommendations = document.getElementById("search_listing_recommendations");
const finder_container = document.getElementById("finder_container");

search_box.addEventListener("input", filter_recommended_currencies);
search_box.addEventListener("change", add_currency_event);

load_all_coins()


// ======================================================================

/* Toggle the DarkMode */

function clearStorage(){
  localStorage.clear();
  window.location.reload();
}

/* Default value for Storage of DarkMode-Presets */
function get_preset_dark_mode(){
  let darkmode_enabled = JSON.parse(localStorage.getItem("darkmode_enabled"))
  if (darkmode_enabled === null) {
    darkmode_enabled = false;
    document.getElementById("dark_mode_img").src = "pictures/sun.svg";
    document.body.style.backgroundColor = 'rgb(' + 147 + ',' + 163 + ',' + 188 + ')';
    }
  
  if (darkmode_enabled) {
    document.getElementById("dark_mode_img").src = "pictures/moon.svg";
    document.body.style.backgroundColor = 'rgb(' + 39 + ',' + 48 + ',' + 63 + ')';
  }

  return darkmode_enabled;
}


// Toggles the darkmode every time the darkmode-Button is clicked
function toggle_dark_mode() {
  
  if(darkmode_enabled){
    document.getElementById("dark_mode_img").src = "pictures/sun.svg";
    document.body.style.backgroundColor = 'rgb(' + 147 + ',' + 163 + ',' + 188 + ')';
  }
  else {
    document.getElementById("dark_mode_img").src = "pictures/moon.svg";
    document.body.style.backgroundColor = 'rgb(' + 39 + ',' + 48 + ',' + 63 + ')';
  }

  darkmode_enabled = !darkmode_enabled;
  localStorage.setItem("darkmode_enabled", darkmode_enabled);
}

darkmode_enabled = get_preset_dark_mode();
//darkBody.classList.toggle("body_dark_mode");




/* Get the selected FIAT-Currency from localStorage */
function get_preset_fiat_currency(){
  let fiat_currency = localStorage.getItem("fiat_currency");

  if (fiat_currency === null) {
    fiat_currency = "USD";
    document.getElementById("radio_USD").checked = true;
  }
  else if (fiat_currency == "USD"){ document.getElementById("radio_USD").checked = true; }
  else { document.getElementById("radio_EUR").checked = true; }

  return fiat_currency;
}

/* Save the selected FIAT-Currency in localStorage */
function save_preset_fiat_currency() {
  current_fiat_currency = document.querySelector('input[name=fiat_currency]:checked').value;  /* Get selected FIAT-Currency from Radio Buttons */
  localStorage.setItem("fiat_currency", current_fiat_currency);
  console.log("Fiat is now:", current_fiat_currency)
}

let fiat_currency = get_preset_fiat_currency();

/* Get the Exchange Course from the EZB */
/*
const host_exchange = 'api.frankfurter.app';
fetch(`https://${host_exchange}/latest?amount=68000&from=USD&to=EUR`)
  .then(resp => resp.json())
  .then((data) => {
    alert(`68000 USD = ${data.rates.EUR} EUR`);
  });
*/

const host_exchange = 'api.frankfurter.app';
/* var course_rate */
async function get_exchange_course(coin_amount) {
  await fetch(`https://${host_exchange}/latest?amount=${coin_amount}&from=USD&to=EUR`)
  .then(resp => resp.json())
  .then((data) => {
    var eur_price = data.rates.EUR;
  });
  return eur_price
  }


 /* alert(await (await get_exchange_course(13)).text())*/

alert(get_exchange_course(13)) 




  /**
 

const host_exchange = 'api.frankfurter.app';
var course_rate
async function get_exchange_course(coin_amount) {
  const response_exchange = await fetch(`https://${host_exchange}/latest?amount=${coin_amount}&from=USD&to=EUR`)
  exchange = await response_exchange.json()
  response.json().then(data => {
    exchange.rates.EUR course_rate
  });
  course_rate = exchange.rates.EUR
  return course_rate
  }


 */