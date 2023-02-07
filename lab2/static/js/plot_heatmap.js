function plotHeatmap(fileName) {
    // set the dimensions and margins of the graph
    const margin = {
            top: 10,
            right: 30,
            bottom: 180,
            left: 300
        },
        width = 900 - margin.left - margin.right,
        height = 650 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select("#svg_heatmap")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Parse the Data
    d3.csv("static/data/" + fileName).then(function (data) {
        var countries = d3.map(data, d => d.Country);
        var indicators = d3.map(data, d => d.variable);

        // Add X axis
        var x = d3.scaleBand()
            .domain(countries)
            .range([0, width])
            .padding(0.15);
        svg.append("g")
            .style("font-size", 12)
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).ticks(10))
            .selectAll("text")
                .style("text-anchor", "start")
                .attr("dx", "0.6em")
                .attr("dy", ".015em")
                .attr("transform", "rotate(65)");

        // Add Y axis
        var y = d3.scaleBand()
            .range([height, 0])
            .domain(indicators)
            .padding(0.15);
        svg.append("g")
            .style("font-size", 12)
            .call(d3.axisLeft(y).tickSize(5));

        // Build color scale
        var calculate_color = d3.scaleSequential()
            .interpolator(d3.interpolateRdYlBu)
            .domain([1, 100])

        const tooltip = d3.select("#svg_heatmap")
            .append("div")
            .attr("class", "tooltip")
            .classed("tooltip", true)
            .style("opacity", 0);

        const hightlight_row = svg.append('rect')
            .attr("id", "highlight_row")
            .attr("width", x.bandwidth() + 2)
            .attr("height", height - 4)
            .attr("x", 0)
            .attr("y", 2)
            .attr("rx", 5)
            .attr("ry", 5)
            .attr("opacity", 0)
            .attr("stroke", '#ffffff')
            .attr("stroke-width", 2)

        const hightlight_col = svg.append('rect')
            .attr("id", "highlight_col")
            .attr("width", width - 4)
            .attr("height", y.bandwidth() + 2)
            .attr("x", 2)
            .attr("y", 0)
            .attr("rx", 5)
            .attr("ry", 5)
            .attr("opacity", 0)
            .attr("stroke", '#ffffff')
            .attr("stroke-width", 2)

        const highlight_data = svg.append('rect')
            .attr("id", "highlight_data")
            .attr("width", x.bandwidth() + 2)
            .attr("height", y.bandwidth() + 2)
            .attr("x", 0)
            .attr("y", 0)
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("opacity", 0)
            .attr("stroke", '#ffffff')
            .attr("stroke-width", 1)


        d3.select("#country").on("change.heatmap", function (e) {
            var country = d3.select("#country").property("value");
            d3.select("#svg_scatterplot").select(`#dot-${country.replace(/\s/g, '')}`).attr("stroke", "black").attr("stroke-width", 1)
            hightlight_row.attr("x", x(country) - 1).attr("opacity", 1)
        });

        d3.select("#country").on("change.scatterplot", function (e) {
            var indicator = d3.select("#indicator").property("value");
            if (!indicator) {
                indicator = "Air pollution"
            }
            var country = d3.select("#country").property("value");
            hightlight_col.attr("y", y(indicator) - 1).attr("opacity", 1)
            highlight_data.attr("x", x(country) - 1)
                .attr("y", y(indicator)- 1).attr("opacity", 1);
        });

        d3.select("#indicator").on("change.heatmap", function(e){
            var indicator = d3.select("#indicator").property("value");
            hightlight_col.attr("y", y(indicator) - 1).attr("opacity", 1)
        });

        svg.selectAll()
            .data(data, function (d) {
                return d;
            })
            .enter()
            .append("rect")
            .attr("x", function (d) {
                return x(d.Country)
            })
            .attr("y", function (d) {
                return y(d.variable)
            })
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .attr("id", d => `hm-${d.Country.replaceAll(" ", "-")}-${d.variable.replaceAll(" ", "-")}`)
            .style("fill", function (d) {
                max = parseFloat(d.value)
                max_country = "";
                min = parseFloat(d.value)
                min_country = "";
                data.forEach(function(d_i){
                    if(!isNaN(d_i.value)){
                        if (parseFloat(d_i.value) > max && d_i.variable === d.variable) {
                            max = parseFloat(d_i.value);
                            max_country = d_i.Country
                        }
                        if (parseFloat(d_i.value) < min && d_i.variable === d.variable) {
                            min = parseFloat(d_i.value);
                            min_country = d_i.Country;
                        }
                    }
                })
                color_value = (d.value - min)/ (max - min)
                return calculate_color(color_value * 100)
            })
            .style("stroke-width", 4)
            .style("stroke", "none")
            .attr("opacity", 0.8)
            .on('mouseover', function (d, i) {                    
                tooltip.style("opacity", 1);
                tooltip.html(`The "${i.variable}" in ${i.Country} is: ${i.value}`)
                    .style("left", (d.pageX + 10) + "px")
                    .style("top", (d.pageY - 15) + "px");
                
                d3.select("#country").property("value", i.Country)
                d3.select("#country").on("change.heatmap")()
                //d3.select("#country").on("change.scatterplot")()
                d3.select("#indicator").property("value", i.variable)
                d3.select("#indicator").on("change.heatmap")()
                d3.select("#indicator").on("change.scatterplot")()
            })
            .on('mouseout', function (d, i) {
                d3.select(this).attr("r", 5);
                tooltip.style("opacity", 0);
                hightlight_row.attr("opacity", 0);
                hightlight_col.attr("opacity", 0);

                d3.select(`#dot-${i.Country.replace(/\s/g, '')}`).attr("stroke", "none")
            })
    });
}
