// ===============================
// TOGGLE FUNCTIONS
// ===============================
function showMaps(){
  document.getElementById("mapSection").style.display = "block";
  document.getElementById("graphSection").style.display = "none";
}

function showGraphs(){
  document.getElementById("mapSection").style.display = "none";
  document.getElementById("graphSection").style.display = "block";
}


// ===============================
// MAIN FUNCTION
// ===============================
async function getHeatData(){

  let place = document.getElementById("location").value;

  // Fetch JSON data
  let res = await fetch("./landsatData.json");
  let data = await res.json();

  if(!data[place]){
    alert("Data not available!");
    return;
  }

  let temp = data[place].temp;
  let veg = data[place].veg;
  let density = data[place].density;

  // Heat Score Formula
  let score = (temp * 0.6) + (density * 2) - (veg * 10);

  let result = "";

  // Prediction
  if(score > 40){
    result = "High Urban Heat Zone (Red Zone)";
    document.body.style.backgroundColor = "#ffb3b3";
  }
  else if(score > 25){
    result = "Moderate Heat Zone (Orange Zone)";
    document.body.style.backgroundColor = "#ffe0b3";
  }
  else{
    result = "Low Heat Zone (Green Zone)";
    document.body.style.backgroundColor = "#b3ffcc";
  }

  // ALERT SYSTEM
  if(temp > 40){
    alert("⚠️ Extreme Heat Alert! Avoid going outside.");
  }
  else if(score > 40){
    alert("⚠️ High Heat Zone! Stay hydrated.");
  }

  // SMART SUGGESTIONS
  let suggestion = "";

  if(score > 40){
    suggestion = `
    <b>Suggestions:</b><br>
    • Increase green cover 🌿<br>
    • Use cool roofs 🏠<br>
    • Avoid outdoor activities ☀️<br>
    • Install heat-resistant materials<br>
    `;
  }
  else if(score > 25){
    suggestion = `
    <b>Suggestions:</b><br>
    • Plant more trees 🌳<br>
    • Reduce vehicle usage 🚗<br>
    • Use reflective surfaces<br>
    `;
  }
  else{
    suggestion = `
    <b>Suggestions:</b><br>
    • Area is relatively cool ✅<br>
    • Maintain greenery 🌿<br>
    • Promote sustainable practices<br>
    `;
  }

  // DISPLAY RESULT
  document.getElementById("result").innerHTML =
    `Location: ${place}<br>
     LST: ${temp} °C<br>
     NDVI: ${veg}<br>
     Density: ${density}<br>
     Heat Score: ${score.toFixed(2)}<br>
     Prediction: ${result}<br><br>
     ${suggestion}`;

  // CHANGE MAP IMAGES
  let placeLower = place.toLowerCase();

  document.getElementById("ndviMap").src = `ndvi_${placeLower}.png`;
  document.getElementById("lstMap").src = `lst_${placeLower}.png`;

  // UPDATE GRAPHS
  updateGraphs(temp, veg, density);
}


// ===============================
// GRAPH FUNCTION (DYNAMIC)
// ===============================
let tempChartInstance;
let vegChartInstance;

function updateGraphs(temp, veg, density){

  let score = (temp * 0.6) + (density * 2) - (veg * 10);

  // Destroy old charts (IMPORTANT)
  if(tempChartInstance){
    tempChartInstance.destroy();
  }
  if(vegChartInstance){
    vegChartInstance.destroy();
  }

  // TEMP GRAPH
  let ctx1 = document.getElementById("tempChart").getContext("2d");

  tempChartInstance = new Chart(ctx1,{
    type:"line",
    data:{
      labels:["Current"],
      datasets:[{
        label:"Heat Score",
        data:[score],
        borderWidth:2
      }]
    },
    options:{ responsive:true }
  });

  // VEG GRAPH
  let ctx2 = document.getElementById("vegChart").getContext("2d");

  vegChartInstance = new Chart(ctx2,{
    type:"line",
    data:{
      labels:["Current"],
      datasets:[{
        label:"NDVI",
        data:[veg],
        borderWidth:2
      }]
    },
    options:{ responsive:true }
  });
}