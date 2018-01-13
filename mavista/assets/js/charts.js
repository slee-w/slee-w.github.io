/* yes/no bar charts */

function bar_yes_no() {

  // default values that can be changed by the caller

  var height = 400,
      marginTop = 20,
      marginRight = 40,
      marginLeft = 40,
      marginBottom = 20,
      chart_id = [],
      data = [];

  function chart(selection) {
    selection.each(function() {

      // filter data to selected district

      var sel_district = d3.select("#district_selector").property("value");
      district_data = data.filter(function(d) { return d.District == sel_district; });

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
          .attr("class", "bar_yes_no")
          .attr("width", width)
          .attr("height", height)
          .style("opacity", 0);

      svg.transition()
        .duration(500)
        .style("opacity", 1);

      var g = svg.append("g")
          .attr("transform", "translate(" + marginLeft + "," + marginTop + ")");

      // axes

      function drawXAxis() {

        g.append("g")
          .attr("class", "xAxis")
          .attr("transform", "translate(0," + heightAdj + ")")
          .call(d3.axisBottom(xScale).ticks(5).tickFormat(d3.format(",.0%")).tickSizeOuter(0));
            /*.style("opacity", 0)
            .transition()
              .duration(1000)
              .style("opacity", 1);*/

      };

      drawXAxis();

      function drawYAxis() {

        g.append("g")
          .attr("class", "yAxis")
          .call(d3.axisLeft(yScale).tickSizeOuter(0));
            /*.style("opacity", 0)
            .transition()
              .duration(1000)
              .style("opacity", 1);*/

      };

      drawYAxis();

      // draw bars

      var bars = g.selectAll(".bar")
        .data(district_data);

      function drawBars() {

        bars.enter()
          .append("rect")
            .attr("class", "bar")
            .attr("x", 0)
            .attr("y", function(d) { return yScale(d.Item_text); })
            .attr("width", function(d) { return xScale(d.WeightedPctEstimate/100); })
            .attr("height", yScale.bandwidth());
            /*.transition()
              .duration(1000)*/


      };

      drawBars();

      // add data labels

      var bar_labels = g.selectAll(".bar_label")
        .data(district_data);

      function drawLabels() {

        bar_labels.enter()
            .append("text")
              .attr("class", "bar_label")
              .attr("x", function(d) { return xScale(d.WeightedPctEstimate/100) - 5; })
              .attr("y", function(d) { return yScale(d.Item_text) + yScale.bandwidth()/2; })
              .attr("dy", "0.35em")
              .attr("text-anchor", "end")
              .text(function(d) { return formatPer(d.WeightedPctEstimate/100); });
              /*.style("opacity", 0)
              .transition()
                .delay(1000)
                .duration(1000)
                .style("opacity", 1);*/

      };

      drawLabels();

      // add rectangles for data bar_labels

      g.selectAll(".bar_label")
        .each(function(d, i) {
          district_data[i].bb = this.getBBox();
        });

      var label_rects = g.selectAll(".label_rect")
        .data(district_data);

      label_rects.enter()
        .append("rect")
          .attr("class", "label_rect")
          .attr("x", function(d) { return xScale(d.WeightedPctEstimate/100) - d.bb.width - 7; })
          .attr("y", function(d) { return yScale(d.Item_text) + yScale.bandwidth()/2 - d.bb.height/2; })
          .attr("width", function(d) { return d.bb.width + 4; })
          .attr("height", function(d) { return d.bb.height; });
          /*.style("opacity", 0)
          .transition()
            .delay(1000)
            .duration(1000)
            .style("opacity", 1);*/

      bar_labels.remove()

      drawLabels();

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

/* mean column charts */
/* these are primarily to deal with long question names */

function col_mean() {

  // default values that can be changed by the caller

  var height = 400,
      marginTop = 20,
      marginRight = 40,
      marginLeft = 40,
      marginBottom = 20,
      chart_id = [],
      yAxisLabel = "",
      data = [];

  function chart(selection) {
    selection.each(function() {

      // filter data to selected district

      var sel_district = d3.select("#district_selector").property("value");
      district_data = data.filter(function(d) { return d.District == sel_district; });

      // number formats

      var formatNum = d3.format(",.1f"),
          formatPer = d3.format(",.0%");

      // margins, adjusted widths and heights

      var width = document.getElementById(chart_id).offsetWidth,
          widthAdj = width - marginLeft - marginRight,
          heightAdj = height - marginTop - marginBottom;

      // scales and domains

      var yScale = d3.scaleLinear().range([heightAdj, 0]);
      var xScale = d3.scaleBand().rangeRound([0, widthAdj]).padding(0.25);

      yScale.domain([0, d3.max(district_data, function(d) { return d.WeightedMean; })]).nice();
      xScale.domain(data.map(function(d) { return d.Item_text; }));

      // svg

      var svg = d3.select("#" + chart_id)
        .append("svg")
          .attr("class", "col_mean")
          .attr("width", width)
          .attr("height", height)
          .style("opacity", 0);

      svg.transition()
        .duration(500)
        .style("opacity", 1);

      var g = svg.append("g")
          .attr("transform", "translate(" + marginLeft + "," + marginTop + ")");

      // axes

      function drawXAxis() {

        g.append("g")
          .attr("class", "xAxis")
          .attr("transform", "translate(0," + heightAdj + ")")
          .call(d3.axisBottom(xScale).tickSizeOuter(0))
          .selectAll(".tick text")
            .call(wrap, xScale.bandwidth());
            /*.style("opacity", 0)
            .transition()
              .duration(1000)
              .style("opacity", 1);*/

      };

      drawXAxis();

      function drawYAxis() {

        g.append("g")
          .attr("class", "yAxis")
          .call(d3.axisLeft(yScale).tickSizeOuter(0));
            /*.style("opacity", 0)
            .transition()
              .duration(1000)
              .style("opacity", 1);*/

        g.append("text")
          .attr("x", -1*(marginLeft))
          .attr("y", -1*(marginTop/2))
          .text(yAxisLabel);

      };

      drawYAxis();

      // draw bars

      var cols = g.selectAll(".col")
        .data(district_data);

      function drawCols() {

        cols.enter()
          .append("rect")
            .attr("class", "col")
            .attr("x", function(d) { return xScale(d.Item_text); })
            .attr("y", function(d) { return yScale(d.WeightedMean); })
            .attr("width", xScale.bandwidth())
            .attr("height", function(d) { return heightAdj - yScale(d.WeightedMean); });
            /*.transition()
              .duration(1000)*/

      };

      drawCols();

      // add data labels

      var col_labels = g.selectAll(".col_label")
        .data(district_data);

      function drawLabels() {

        col_labels.enter()
            .append("text")
              .attr("class", "col_label")
              .attr("x", function(d) { return xScale(d.Item_text) + xScale.bandwidth()/2; })
              .attr("y", function(d) { return yScale(d.WeightedMean); })
              .attr("dy", 19)
              .attr("text-anchor", "middle")
              .text(function(d) { return formatNum(d.WeightedMean); });
              /*.style("opacity", 0)
              .transition()
                .delay(1000)
                .duration(1000)
                .style("opacity", 1);*/

      };

      drawLabels();

      // add rectangles for data bar_labels

      g.selectAll(".col_label")
        .each(function(d, i) {
          district_data[i].bb = this.getBBox();
        });

      var label_rects = g.selectAll(".label_rect")
        .data(district_data);

      label_rects.enter()
        .append("rect")
          .attr("class", "label_rect")
          .attr("x", function(d) { return xScale(d.Item_text) + xScale.bandwidth()/2 - d.bb.width/2 - 2; })
          .attr("y", function(d) { return yScale(d.WeightedMean) + 3; })
          .attr("width", function(d) { return d.bb.width + 4; })
          .attr("height", function(d) { return d.bb.height; });
          /*.style("opacity", 0)
          .transition()
            .delay(1000)
            .duration(1000)
            .style("opacity", 1);*/

      col_labels.remove()

      drawLabels();

    });
  };

  // for wrapping long labels
  // from https://bl.ocks.org/mbostock/7555321 (mbostock)

  function wrap(text, width) {
    text.each(function() {
      var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          y = text.attr("y"),
          dy = parseFloat(text.attr("dy")),
          tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        }
      }
    });
  }

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

  chart.yAxisLabel = function(value) {
    if (!arguments.length) return yAxisLabel;
    yAxisLabel = value;
    return chart;
  };

  chart.data = function(value) {
    if (!arguments.length) return data;
    data = value;
    return chart;
  };

  return chart;

};

/* yes/no bar charts */

function stacked_bar_3() {

  // default values that can be changed by the caller

  var height = 400,
      marginTop = 20,
      marginRight = 40,
      marginLeft = 40,
      marginBottom = 20,
      chart_id = [],
      data = [];

  function chart(selection) {
    selection.each(function() {

      // filter data to selected district

      var sel_district = d3.select("#district_selector").property("value");
      district_data = data.filter(function(d) { return d.District == sel_district; });

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
      var zScale = d3.scaleOrdinal().range(["#e86b01", "#adb6f5", "#0d1969"]);

      yScale.domain(data.map(function(d) { return d.Item_text; }));
      xScale.domain([0,1]);
      zScale.domain(data.map(function(d) { return d.ResponseCategory; }));

      // svg

      var svg = d3.select("#" + chart_id)
        .append("svg")
          .attr("class", "stacked_bar_3")
          .attr("width", width)
          .attr("height", height)
          .style("opacity", 0);

      svg.transition()
        .duration(500)
        .style("opacity", 1);

      var g = svg.append("g")
          .attr("transform", "translate(" + marginLeft + "," + marginTop + ")");

      // axes

      function drawXAxis() {

        g.append("g")
          .attr("class", "xAxis")
          .attr("transform", "translate(0," + heightAdj + ")")
          .call(d3.axisBottom(xScale).ticks(5).tickFormat(d3.format(",.0%")).tickSizeOuter(0));
            /*.style("opacity", 0)
            .transition()
              .duration(1000)
              .style("opacity", 1);*/

      };

      drawXAxis();

      function drawYAxis() {

        g.append("g")
          .attr("class", "yAxis")
          .call(d3.axisLeft(yScale).tickSizeOuter(0));
            /*.style("opacity", 0)
            .transition()
              .duration(1000)
              .style("opacity", 1);*/

      };

      drawYAxis();

      // draw bars

      // subset the data to what we care about

      var subset = data.slice()

      var stack = d3.stack().keys(data.map(function(d) { return d.ResponseCategory; }));

      var bars = g.selectAll(".bar")
        .data(stack(district_data));

      function drawBars() {

        bars.enter()
          .append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return xScale(d[0]); })
            .attr("y", function(d) { return yScale(d.Item_text); })
            .attr("width", function(d) { return xScale(d[1]) - xScale(d[0]); })
            .attr("height", yScale.bandwidth());
            /*.transition()
              .duration(1000)*/


      };

      drawBars();

      // add data labels

      var bar_labels = g.selectAll(".bar_label")
        .data(stack(district_data));

      function drawLabels() {

        bar_labels.enter()
            .append("text")
              .attr("class", "bar_label")
              .attr("x", function(d) { return xScale(d[1]); })
              .attr("y", function(d) { return yScale(d.Item_text) + yScale.bandwidth()/2; })
              .attr("dy", "0.35em")
              .attr("text-anchor", "end")
              .text(function(d) { return formatPer(d.WeightedPctEstimate/100); });
              /*.style("opacity", 0)
              .transition()
                .delay(1000)
                .duration(1000)
                .style("opacity", 1);*/

      };

      drawLabels();

      // add rectangles for data bar_labels

      g.selectAll(".bar_label")
        .each(function(d, i) {
          district_data[i].bb = this.getBBox();
        });

      var label_rects = g.selectAll(".label_rect")
        .data(stack(district_data));

      label_rects.enter()
        .append("rect")
          .attr("class", "label_rect")
          .attr("x", function(d) { return xScale(d[1]) - d.bb.width - 7; })
          .attr("y", function(d) { return yScale(d.Item_text) + yScale.bandwidth()/2 - d.bb.height/2; })
          .attr("width", function(d) { return d.bb.width + 4; })
          .attr("height", function(d) { return d.bb.height; });
          /*.style("opacity", 0)
          .transition()
            .delay(1000)
            .duration(1000)
            .style("opacity", 1);*/

      bar_labels.remove()

      drawLabels();

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
