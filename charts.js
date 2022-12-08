function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
   
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

function change_chart(name) {
  var charts = ['Bar','Gauge','Bubble'];
  charts.forEach(chart => {
    document.getElementById(chart).style.display = "none";
  });

  if (name == "All") 
  {
    charts.forEach(chart => {
      document.getElementById(chart).style.display = "block";
    });
  } else{
    document.getElementById(name).style.display = "block";
  }
}

// Deliverable 1: 1. Create the buildChart function.
function buildCharts(sample) {
  //console.log(sample);
  // Deliverable 1: 2. Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);
    // Deliverable 1: 3. Create a variable that holds the samples array. 
    var samples_array = data.samples;

    // Deliverable 1: 4. Create a variable that filters the samples for the object with the desired sample number.
    var samples_resultArray = samples_array.filter(samples_array => samples_array.id == sample);

    // Deliverable 3: 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata_array = data.metadata;
    var metadata_resultArray = metadata_array.filter(metadata_array => metadata_array.id == sample);


    // Deliverable 1: 5. Create a variable that holds the first sample in the array.
    var first_sample_in_the_array = samples_resultArray[0];

    // Deliverable 3: 2. Create a variable that holds the first sample in the metadata array.
    var first_sample_in_the_metadata_array = metadata_resultArray[0];
    
    // Deliverable 1: 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var out_ids = first_sample_in_the_array.otu_ids, otu_labels = first_sample_in_the_array.otu_labels, sample_values = first_sample_in_the_array.sample_values;

    // Deliverable 3: 3. Create a variable that holds the washing frequency.
    var washing_frequency = first_sample_in_the_metadata_array.wfreq;

    // Deliverable 1: 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order 
    // so the otu_ids with the most bacteria are last. 
    var yticks = out_ids.sort((a,b) =>
    a.sample_values - b.sample_values).slice(0,10).reverse();

    console.log(out_ids);

    // Deliverable 1: 8. Create the trace for the bar chart. 
    var barData = sample_values.sort((a,b) =>
    a.sample_values - b.sample_values).slice(0,10).reverse();

    var text = otu_labels.sort((a,b) =>
    a.sample_values - b.sample_values).slice(0,10).reverse();

    var trace = {
      x: barData,
      y: yticks.map(name => "OTU "+name),
      type: "bar",
      orientation: "h"
    };

    var data = [trace];

    console.log(sample_values);

    // Deliverable 1: 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found"
    };

    // Deliverable 1: 10. Use Plotly to plot the data with the layout. 

    Plotly.newPlot("bar", data, barLayout);

    // Deliverable 2: 1. Create the trace for the bubble chart.
    trace = {
      x: out_ids,
      y: sample_values,
      mode: "markers",
      text:otu_labels,
      hovermode:'closest',
      marker: {
        color: out_ids,
        colorscale: 'Earth',
        size: sample_values
      }
    };

    data = [trace];

    // Deliverable 2: 2. Create the layout for the bubble chart.
    var layout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis:{
        title:{
          text:"OTU ID"
        }
      }
    };

    // Deliverable 2: 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", data, layout);
    
    // Deliverable 3: 4. Create the trace for the gauge chart.
    data = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: washing_frequency,
        title: { text: "Scrubs per Week" },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis:{range:[null, 10]},
          bar: { color: "black" },
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "YellowGreen" },
            { range: [8, 10], color: "green" }
          ],
        }
      }
    ];
    
    
    // Deliverable 3: 5. Create the layout for the gauge chart.
    layout = { title: 'Belly Button Washing Frequency', width: 490, height: 450 };

    // Deliverable 3: 6. Use Plotly to plot the gauge data and layout.
    
    Plotly.newPlot('gauge', data, layout);

  });
}
