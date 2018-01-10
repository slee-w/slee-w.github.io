/* yes/no bar charts */

function bar_yes_no() {

  // default values that can be changed by the caller

  var height = 400,
      marginTop = 20,
      marginRight = 20,
      marginLeft = 20,
      marginBottom = 20,
      chart_id = [],
      data = [];

  function chart(selection) {
    selection.each(function() {

      // filter data to selected district

      var sel_district = d3.select("#district_selector").property("value");
      data_district = data.filter(function(d) { return d.District == sel_district; });

      // number formats

      var formatNum = d3.format(",.0f"),
          formatPer = d3.format(",.0%");

      // margins, adjusted widths and heights

      var width = document.getElementById(chart_id).offsetWidth,
          widthAdj = width - marginLeft - marginRight,
          heightAdj = height - marginTop - marginBottom;

      // scales and domains

      var yScale = d3.scaleBand().rangeRound([0, heightAdj]).padding(0.25);
      var xScale = d3.scaleLinear().range([0, widthAdj]);

      yScale.domain(data.map(function(d) { return d.Item_text; }));

      // svg

      var svg = d3.select("#" + chart_id)
        .append("svg")
          .attr("class", "columnChart")
          .attr("width", width)
          .attr("height", height)
          .append("g")
            .attr("transform", "translate(" + marginLeft + "," + marginTop + ")");

      // axes

      function drawXAxis() {

        svg.append("g")
          .attr("class", "xAxis")
          .attr("transform", "translate(0," + heightAdj + ")")
          .call(d3.axisBottom(xScale))
            .style("opacity", 0)
            .transition()
              .duration(1000)
              .style("opacity", 1);

      };

      drawXAxis();

      function drawYAxis() {

        svg.append("g")
          .attr("class", "yAxis")
          .call(d3.axisLeft(yScale))
            .style("opacity", 0)
            .transition()
              .duration(1000)
              .style("opacity", 1);

      };

      drawYAxis();

      // draw bars

      var bars = svg.selectAll(".bar");

      function drawBars() {

        bars.data(data_district)
          .enter()
          .append("rect")
            .attr("class", "bar")
            .attr("x", 0)
            .attr("y", function(d) { return yScale(d.Item_text); })
            .attr("width", 0)
            .attr("height", yScale.bandwidth())
            .transition()
              .duration(1000)
              .attr("width", function(d) { return xScale(d.WeightedPctEstimate/100); });

      };

      drawBars();

      // change data on district change

      d3.select("#district_selector")
        .on("change", function() {

          // re-filter data

          sel_district = d3.select("#district_selector").property("value");
          data_district = data.filter(function(d) { return d.District == sel_district; });

          // remove bars and re-draw

          svg.selectAll(".bar")
            .transition()
              .duration(1000)
              .attr("width", 0)
              .on("end", function() {

                svg.selectAll(".bar")
                  .remove()

                drawBars();

              });

        });

    });
  };

  // these allow the default values to be changed

  chart.height = function(value) {
    if (!arguments.length) return height;
    height = value;
    return chart;
  };

  chart.marginTop = function(value) {
    if (!arguments.length) return marginTop;
    marginTop = value;
    return chart;
  };

  chart.marginLeft = function(value) {
    if (!arguments.length) return marginLeft;
    marginLeft = value;
    return chart;
  };

  chart.marginRight = function(value) {
    if (!arguments.length) return marginRight;
    marginRight = value;
    return chart;
  };

  chart.marginBottom = function(value) {
    if (!arguments.length) return marginBottom;
    marginBottom = value;
    return chart;
  };

  chart.chart_id = function(value) {
    if (!arguments.length) return chart_id;
    chart_id = value;
    return chart;
  };

  chart.data = function(value) {
    if (!arguments.length) return data;
    data = value;
    return chart;
  };

  return chart;

};
