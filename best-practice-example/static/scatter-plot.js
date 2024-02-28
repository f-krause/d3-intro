// Description: This file contains the code to display a scatter plot in the right column of the web page.

function displayScatterPlot() {
    console.log("Displaying scatter plot")

    // Remove old scatter plot(s)
    d3.selectAll("#scatterPlot").remove();

    // Load data from CSV and build scatter plot
    d3.text("static/data/data.csv").then(data => {
        // Parse data to array of numbers
        var parsedData = d3.csvParseRows(data, d => [+d[1], +d[2]]);

        // Drop the first row (column names)
        parsedData = parsedData.slice(1);

        // Store values for svg creation
        var parent = d3.select("#right_column")
        const width = parent._groups[0][0].clientWidth - 40;
        const height = width * 0.6 + 20;  // make plot height always 60% of the width

        // Define padding around the svg
        var padding = {top: 0, right: 10, bottom: 50, left: 55};

        // Append SVG
        var svg = parent.append("svg")
            .attr("id", "scatterPlot")
            .attr("width", width)
            .attr("height", height);

        // x and y scales
        const xMinMax = d3.extent(parsedData, d => d[0]) // returns list [min, max] of provided data
        var xScale = d3.scaleLinear()
            .domain([xMinMax[0] * 0.95, xMinMax[1] * 1.05])
            .range([padding.left, width - padding.right]);

        const yMinMax = d3.extent(parsedData, d => d[1])
        var yScale = d3.scaleLinear()
            .domain([yMinMax[0] * 0.95, yMinMax[1] * 1.05])
            .range([height - padding.bottom, padding.top]);  // Note that the "origin" is defined as the upper left corner, thus we need to invert the range

        // Plot x axis
        svg.append("g")
            .attr("transform", "translate(0," + (height - padding.bottom) + ")")
            .call(d3.axisBottom(xScale))

        // Plot y axis
        svg.append("g")
            .attr("transform", "translate(" + (padding.left) + ",0)")
            .call(d3.axisLeft(yScale))

        // Create circles for each data point
        svg.selectAll(".dot")
            .data(parsedData)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", d => xScale(d[0]))
            .attr("cy", d => yScale(d[1]))
            .attr("r", 2);

        // Add an x-axis label
        svg.append("text")
            .attr("class", "label")
            .attr("x", padding.left + (width - padding.left - padding.right) / 2)
            .attr("y", height - 6)
            .style("text-anchor", "middle")
            .text("☕ Consumption");

        // Add a y-axis label
        svg.append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("x", -(height - padding.top - padding.bottom)/2  - padding.top)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("🦩 Enthusiasm Level");
    });
}
