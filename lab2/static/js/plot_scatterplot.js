function plotScatterPlot(fileName, minY, maxY, tickNumberY, tickFormatY) {
    // set the dimensions and margins of the graph
    const margin = {
            top: 10,
            right: 30,
            bottom: 180,
            left: 100
        },
        width = 700 - margin.left - margin.right,
        height = 650 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select("#svg_scatterplot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Parse the Data
    d3.csv("static/data/" + fileName).then(function (data) {        
        // Add X axis
        var x = d3.scaleLinear()
            .domain([-10, 10])
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([-4, 4])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));


        var calculate_color = d3.scaleSequential()
            .interpolator(d3.interpolateRdYlBu)
            .domain([1, 100])
        
        d3.select("#indicator").on("change.scatterplot", function(){
            var indicator = d3.select("#indicator").property("value");
            d3.select("#svg_scatterplot")
                .selectAll("circle")
                .style("fill", function (d) {
                    let id = `#hm-${d.Country.replaceAll(" ", "-")}-${indicator.replaceAll(" ", "-")}`
                    return d3.select(id).style("fill");
                })
        });

        const tooltip = d3.select("#svg_scatterplot")
            .append("div")
            .attr("class", "tooltip")
            .classed("tooltip", true)
            .style("opacity", 0);

        // Add dots
        svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("id", function(d, i){
                return `dot-${d.Country.replace(/\s/g, '')}`
            })
            .attr("cx", function (d) {
                return x(d.X);
            })
            .attr("cy", function (d) {
                return y(d.Y);
            })
            .attr("r", 5)
            .style("fill", "#00f")
            .on('mouseover', function (d, i) {
                d3.select(this)
                    .attr("stroke", "black")
                    .attr("stroke-width", 1);
                tooltip.style("opacity", 1);
                tooltip.html("The selected country is: " + i.Country)
                    .style("left", (d.pageX + 10) + "px")
                    .style("top", (d.pageY - 15) + "px");

                d3.select("#country").property("value", i.Country);
                d3.select("#country").on("change.scatterplot")()
            })
            .on('mouseout', function (d, i) {
                d3.select(this)
                    .attr("stroke-width", 0);
                tooltip.style("opacity", 0);

                d3.select("#svg_heatmap").select("#highlight_col")
                    .attr("opacity", 0)
                d3.select("#svg_heatmap").select("#highlight_data")
                    .attr("opacity", 0)

            });
            
    })
}
