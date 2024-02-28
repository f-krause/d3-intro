// Description: This file contains the code to display a scatter plot in the right column of the web page.

function displayScatterPlot() {
    console.log("Displaying scatter plot")

    // Remove old scatter plot(s)
    d3.selectAll("#scatterPlot").remove();

    // Load data from CSV and build scatter plot
    d3.csv("static/data/data.csv", d => ({
            employee: d.employee,
            coffeeConsumption: +d.coffee_consumption, // convert values to number
            flamingoEnthusiasm: +d.flamingo_enthusiasm,
            peelSkill: +d.peel_skill
        })
    ).then(data => {

        // Store values for svg creation
        var parent = d3.select("#right_column");
        const width = parent.node().clientWidth - 100;
        const height = width * 0.6;  // make plot height always 60% of the width

        // Define padding around the svg
        var padding = {top: 5, right: 10, bottom: 55, left: 70};

        // Append SVG
        var svg = parent.append("svg")
            .attr("id", "scatterPlot")
            .attr("width", width)
            .attr("height", height);

        // Scale for x-axis
        // Check out https://www.d3indepth.com/scales/ for other scales
        var xScale = d3.scaleLinear()  // linearly map data to pixels
            .domain(d3.extent(data, d => d.coffeeConsumption)) // returns list [min, max] of provided data
            .nice()  // prevents points from lying exactly on the axis
            .range([padding.left, width - padding.right]); // defines which pixel values can be used for the axis
            // Note that the "origin" is defined as the upper left corner, thus we need to invert the range

        // Scale for y-axis
        var yScale = d3.scaleLinear()
            .domain(d3.extent(data, d => d.flamingoEnthusiasm))
            .nice()
            .range([height - padding.bottom, padding.top]);

        // Add x-axis
        svg.append("g")
            .attr("transform", "translate(0," + (height - padding.bottom) + ")")
            .call(d3.axisBottom(xScale))
            .selectAll("text") // Select all text elements in the axis
                .style("font-size", "12px");

        // Add y-axis
        svg.append("g")
            .attr("transform", "translate(" + (padding.left) + ",0)")
            .call(d3.axisLeft(yScale))
            .selectAll("text") // Select all text elements in the axis
                .style("font-size", "12px");

        // Circle size scaler
        const circleScaler = d3.scaleSqrt()  // as area scales with the square of the radius, we use a sqrt scale
            .domain(d3.extent(data, d => d.peelSkill))
            .range([2, 12]);  // range for radius of dots in pixels

        // Plot actual data: Create circles for each data point
        svg.selectAll(".dot")
            .data(data)
            .enter()
            .append("circle")
                .attr("class", "dot")
                .attr("fill-opacity", "0.6")
                .attr("cx", d => xScale(d.coffeeConsumption))
                .attr("cy", d => yScale(d.flamingoEnthusiasm))
                .attr("r", d => circleScaler(d.peelSkill));

        // Add an x-axis label
        svg.append("text")
            .attr("class", "label")
            .attr("x", padding.left + (width - padding.left - padding.right) / 2)
            .attr("y", height - 5)
            .style("text-anchor", "middle")
            .text("☕ Consumption / month");

        // Add a y-axis label
        svg.append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("x", -(height - padding.top - padding.bottom)/2  - padding.top)
            .attr("dy", "1.2em")
            .style("text-anchor", "middle")
            .text("🦩 Enthusiasm Level");
    });
}
