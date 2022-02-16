// Create a variable "url" that contains the data used to draw the chart
let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

// Create the variables "data" and "values", which store the data parsed from the url
let data;
let values;

// Create the variables "xAxisScale" and "yAxisScale", which contain the scales used to draw the axes
let xAxisScale;
let yAxisScale;

// Create the "xScale" and "yScale" variables, which will contain the scales for the the bars
let xScale;
let yScale;

// Create the variables "width", "height" and "padding", which values are going to be applied to the chart
let width = 800;
let height = 600;
let padding = 40;

// Create the "svg" variable, making it easier to apply actions to the svg item
let svg = d3.select("svg");

// Create the "drawCanvas" function, which applies the attributes pre defined to draw the canvas
let drawCanvas = () => {
  svg.attr("width", width);
  svg.attr("height", height);
}

// Create the "setTitle" function, which gives the chart a title
let setTitle = () => {
  svg.append("text")
  .attr("id", "title")
  .attr("x", (width - padding)/2)
  .attr("y", padding)
  .text("USA GDP")
}

// Create the "setScales" function, which defines the scales used to draw the bars and the axes
const setScales = () => {
  yScale = d3.scaleLinear()
             .domain([0, d3.max(values, (d) => d[1])])
             .range([0, height - 2 * padding])
  
  xScale = d3.scaleLinear()
             .domain([0, values.length - 1])
             .range([padding, width - padding]);
                 
  let dates = values.map(value => new Date(value[0]));
  
  xAxisScale = d3.scaleTime()
                       .domain([d3.min(dates), d3.max(dates)])
                       .range([padding, width - padding]);
  
  yAxisScale = d3.scaleLinear()
                       .domain([0, d3.max(values, value => value[1])])
                       .range([height - padding, padding])
}

// Create the "drawBars" function, which defines the way the bars are going to be drawn onto the chart
const drawBars = () => {
  
  let tooltip = d3.select(".visHolder")
                  .append("div")
                  .attr("id", "tooltip")
                  .style("opacity", 0)
  
  svg.selectAll("rect")
     .data(values)
     .enter()
     .append("rect")
     .attr("class", "bar")
     .attr("width", (width - (2 * padding)) / values.length)
     .attr("data-date", (d) => d[0])
     .attr("data-gdp", (d) => d[1])
     .attr("height", (d) => yScale(d[1]))
     .attr("x", (d, i) => xScale(i))
     .attr("y", (d) => height - padding - yScale(d[1]))
     .on("mouseover", (d) => {
       tooltip.attr("data-date", d[0])
              .style("opacity", 0.9)
              .style("top", d3.event.pageY - 70 + "px")
              .style("left", d3.event.pageX + "px")
              .html(`Date: ${d[0]}<br>GDP: ${d[1]}`)
     })
     .on("mouseout", () => {
       tooltip.style("opacity", 0)
     })
}
// Create the "setAxes" function, which applies the pre defined scales to draw the axes onto the chart
const setAxes = () => {
  let xAxis = d3.axisBottom(xAxisScale);
  let yAxis = d3.axisLeft(yAxisScale);
  
  svg.append("g")
     .call(xAxis)
     .attr("id", "x-axis")
     .attr("transform", `translate(0, ${height - padding})`)
     
  svg.append("g")
     .call(yAxis)
     .attr("id", "y-axis")
     .attr("transform", `translate(${padding}, 0)`)
}

// Create the async request to parse the data and once the request gets a response, apply the pre defined functions to draw all the elements of the chart
let req = new XMLHttpRequest();
req.open("GET", url, true);
req.onload = () => {
  data = JSON.parse(req.responseText);
  values = data.data;
  console.log(values);
  drawCanvas();
  setTitle();
  setScales();
  setAxes();
  drawBars();
}
req.send()
