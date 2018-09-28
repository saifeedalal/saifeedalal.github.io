
// Fetching the input data from data.js
var tableData = data;

//Selecting the tbody tag where data would be inserted as rows
var ufoTable = d3.select("tbody");

//To display data when page loads
displayData(data);

/*
@author - Saifee Dalal
@Name - resetFields
@Input - None
@Output - None
@Description - This function will reset all the filter fields to blank.
*/
function resetFields(){

  console.log("Inside resetFields(): Begin");

  datetime.value = "";
  state.value = "";
  city.value = "";
  country.value = "";
  shape.value = "";

  console.log("Inside resetFields(): End");
}

/*
@author - Saifee Dalal
@Name - resetData
@Input - inputData
@Output - None
@Description - This function will replace any existing content under tbody with the data passed as parameter.
*/

function resetData(inputData){

  console.log("Inside resetData(): Begin");

  //Remove all existing rows under tbody
  ufoTable.selectAll("tr").remove();

  displayData(inputData);

  console.log("Inside resetData(): End");
}

/*
@author - Saifee Dalal
@Name - displayData
@Input - inputData
@Output - None
@Description - This function will add data (passed as input parameters)  under the tbody tag .
*/

function displayData(inputData){

  console.log("Inside displayData(): Begin");

  inputData.forEach((ufoSighting) => {
    var row = ufoTable.append("tr");
    Object.entries(ufoSighting).forEach(([key, value]) => {
      var cell = row.append("td");
      cell.text(value);
    });
  });

  console.log("Inside displayData(): End");
}

/*
@author - Saifee Dalal
@Name - filterData
@Input - inputData
@Output - filteredData
@Description - This function will filter the inputData as per values entered in filter fields and returns
                the filteredData.
@Note - The function trims and converts filter values to lowercase before filtering as the provided data is in lower case.
*/
function filterData(inputData){

  console.log("Inside filterData(): Begin");

  var inputElement = "";
  var inputValue = "";
  var filteredData = "";
  
  //Initializing filtered data with the input data
  filteredData = inputData;

  //
  inputElement = d3.select("#datetime");
  inputValue = inputElement.property("value").trim();
  if (inputValue != ""){
    console.log(`Filter applied for Date: ${inputValue}`);
    filteredData = filteredData.filter(ufo => ufo.datetime === inputValue.toLowerCase());
  }
   

  inputElement = d3.select("#city");
  inputValue = inputElement.property("value").trim();
  if (inputValue != ""){
    console.log(`Filter applied for City: ${inputValue}`);
    filteredData = filteredData.filter(ufo => ufo.city === inputValue.toLowerCase());
  }
  
  inputElement = d3.select("#state");
  inputValue = inputElement.property("value").trim();
  if (inputValue != ""){
    console.log(`Filter applied for STate: ${inputValue}`);
    filteredData = filteredData.filter(ufo => ufo.state === inputValue.toLowerCase());
  }
 
  inputElement = d3.select("#country");
  inputValue = inputElement.property("value").trim();
  if (inputValue != ""){
    console.log(`Filter applied for Country: ${inputValue}`);
    filteredData = filteredData.filter(ufo => ufo.country === inputValue.toLowerCase());
  }

  inputElement = d3.select("#shape");
  inputValue = inputElement.property("value").trim();
  if (inputValue != ""){
    console.log(`Filter applied for Shape: ${inputValue}`);
    filteredData = filteredData.filter(ufo => ufo.shape === inputValue.toLowerCase());
  }
  
  console.log("Inside filterData(): End");
  return filteredData;

}
// Selecting the "Filter Table" button
var filter_btn = d3.select("#filter-btn");

// logic to handle onClick event on "Filter Table" button
filter_btn.on("click", function() {

  console.log("Onclick Event on Filter Table Button: Begin");

  //preventing refresh
  d3.event.preventDefault();

  //filtering the data
  var processedData = filterData(data);

  //reset the table with filtered data
  resetData(processedData);

  console.log("Onclick Event on Filter Table Button: End");
});

// Selecting the "Reset" button
var reset_btn = d3.select("#clear-btn");

// logic to handle onClick event on "Reset" button
reset_btn.on("click", function() {

  console.log("Onclick Event on Reset Button: Begin");

  //Clearing the filter fields
  resetFields();

  //reset the table with original/unfiltered data
  resetData(data);

  console.log("Onclick Event on Reset Button: End");
});

