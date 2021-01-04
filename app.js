const express = require("express");
const api = require("novelcovid");
const bodyParser = require("body-parser");
const { render } = require("ejs");
const moment = require('moment');
api.settings({
    baseUrl: 'https://corona.lmao.ninja'
});

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.static("./public"));

let caseData = [];
let deathData = [];
let recoveredData = [];
let caseLabel = [];

app.get('/history/:countryName', async(req, res) => {
    const global = await api.all();
    const updated = global.updated;
    const updatedFormatted = moment(updated).fromNow();
    let countryName = req.params.countryName;
    countryName = countryName.toString();
    const history = await api.historical.countries({country:countryName, days: 'all'});
    const historyCases = history.timeline.cases;
    const historyDeaths = history.timeline.deaths;
    const historyRecovered = history.timeline.recovered;
    for (var i in historyCases){
        caseLabel.push(i);
        caseData.push(historyCases[i]);
    }
    for (var i in historyDeaths){
        deathData.push(historyDeaths[i]);
    }
    for (var i in historyRecovered){
        recoveredData.push(historyRecovered[i]);
    }
    // function capitalizeFirstLetter(string) {
    //     return string.charAt(0).toUpperCase() + string.slice(1);
    //   }
    let  formattedCountry = countryName.toUpperCase(); 
    res.render("country", {caseData, deathData, recoveredData, caseLabel, updatedFormatted, formattedCountry} );
    caseData = [];
    deathData = [];
    recoveredData = [];
    caseLabel = [];
});


app.get('/*', async (req, res) => {
    const global = await api.all();
    const countries = await api.countries({ sort: 'cases' });
    const updated = global.updated;
    //const updatedFormat = new Date(updated).toLocaleString('en-US', {timeZoneName: "short"});//moment.unix(updated).startOf('hour').fromNow(); 
    const updatedFormatted = moment(updated).fromNow();
    res.render('index', { cases: thousands_separators(global.cases), 
        deaths: thousands_separators(global.deaths), 
        recovered: thousands_separators(global.recovered), 
        active: thousands_separators(global.active), 
        countries: countries,
        updatedFormatted
    });
  });

function thousands_separators(num){
let num_parts = num.toString().split(".");
num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
return num_parts.join(".");
} 

app.listen(process.env.PORT || 3000, () => {
    console.log('App listening on port 3000!');
});