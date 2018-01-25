/* yes/no bar charts */

function bar_yes_no() {

  // default values that can be changed by the caller

  var height = 400,
      marginTop = 20,
      marginRight = 40,
      marginLeft = 40,
      marginBottom = 20,
      yAxisOff = 0,
      sortDesc = 0,
      chart_id = [],
      data = [];

  function chart(selection) {
    selection.each(function() {

      // filter data to selected subpopulation

      var sel_subpop1 = d3.select("#subpop1_selector").property("value");
      var sel_subpop2 = d3.select("#subpop2_selector").property("value");
      var sel_data = data.filter(function(d) { return d.SubPopVar == sel_subpop1 && d.SubPopVal == sel_subpop2; });

      // sort if needed

      if (sortDesc === 1) { sel_data.sort(function(a,b) { return d3.descending(a.WeightedPctEstimate, b.WeightedPctEstimate); }) }
      else {};

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

      yScale.domain(sel_data.map(function(d) { return d.Item_text; }));
      xScale.domain([0, 1]);

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

      g.append("g")
        .attr("class", "xAxis")
        .attr("transform", "translate(0," + heightAdj + ")")
        .call(d3.axisBottom(xScale).ticks(5).tickFormat(d3.format(",.0%")).tickSizeOuter(0));

      if (yAxisOff == 1) {}
      else {
        g.append("g")
          .attr("class", "yAxis")
          .call(d3.axisLeft(yScale).tickSizeOuter(0))
          .selectAll(".tick text")
            .call(wrap, marginLeft);
      };

      // draw bars

      var bars = g.selectAll(".bar")
        .data(sel_data);

      bars.enter()
        .append("rect")
          .attr("class", "bar")
          .classed("flagged", function(d) {
            if (d.Flag_Item === "Y") { return true; }
            else { return false; };
          })
          .attr("x", 0)
          .attr("y", function(d) { return yScale(d.Item_text); })
          .attr("width", 0)
          .attr("height", yScale.bandwidth())
          .transition()
            .duration(500)
            .attr("width", function(d) { return xScale(d.WeightedPctEstimate/100); });

      // add data labels

      var bar_labels = g.selectAll(".bar_label")
        .data(sel_data);

      function drawLabels() {

        bar_labels.enter()
          .append("text")
            .attr("class", "bar_label")
            .classed("flagged", function(d) {
              if (d.Flag_Item === "Y") { return true; }
              else { return false; };
            })
            .attr("x", function(d) { return xScale(d.WeightedPctEstimate/100) - 5; })
            .attr("y", function(d) { return yScale(d.Item_text) + yScale.bandwidth()/2; })
            .attr("dy", "0.35em")
            .attr("text-anchor", "end")
            .text(function(d) { return formatPer(d.WeightedPctEstimate/100); })
            .style("opacity", 0)
            .transition()
              .duration(500)
              .style("opacity", function(d) {

                if (d.WeightedPctEstimate < 10) { return 0; }
                else { return 1; };

              });

      };

      drawLabels();

      // add rectangles for data bar_labels

      g.selectAll(".bar_label")
        .each(function(d, i) {
          sel_data[i].bb = this.getBBox();
        });

      var label_rects = g.selectAll(".label_rect")
        .data(sel_data);

      label_rects.enter()
        .append("rect")
          .attr("class", "label_rect")
          .classed("flagged", function(d) {
            if (d.Flag_Item === "Y") { return true; }
            else { return false; };
          })
          .attr("x", function(d) { return xScale(d.WeightedPctEstimate/100) - d.bb.width - 7; })
          .attr("y", function(d) { return yScale(d.Item_text) + yScale.bandwidth()/2 - d.bb.height/2; })
          .attr("width", 0)
          .attr("height", function(d) { return d.bb.height; })
          .style("opacity", 0)
          .transition()
            .duration(500)
            .attr("width", function(d) { return d.bb.width + 4; })
            .style("opacity", function(d) {

              if (d.WeightedPctEstimate < 10) { return 0; }
              else { return 1; };

            });

      g.selectAll(".bar_label")
        .remove()

      drawLabels();

      // remove suppressed

      svg.selectAll(".flagged")
        .remove();

      // update data on selector change

      function updateData() {

        // refilter

        sel_subpop1 = d3.select("#subpop1_selector").property("value");
        sel_subpop2 = d3.select("#subpop2_selector").property("value");
        sel_data = data.filter(function(d) { return d.SubPopVar == sel_subpop1 && d.SubPopVal == sel_subpop2; });

        // sort if needed

        if (sortDesc === 1) {
          sel_data.sort(function(a, b) { return d3.descending(a.WeightedPctEstimate, b.WeightedPctEstimate); });
          yScale.domain(sel_data.map(function(d) { return d.Item_text; }));
        }
        else {};

        // redraw y-axis if needed

        if (sortDesc === 1) {

          g.select(".yAxis")
            .remove();

          if (yAxisOff == 1) {}
          else {
            g.append("g")
              .attr("class", "yAxis")
              .call(d3.axisLeft(yScale).tickSizeOuter(0))
              .selectAll(".tick text")
                .call(wrap, marginLeft);
          };
        }
        else {};

        // adjust bars

        g.selectAll(".bar").remove();

        bars = g.selectAll(".bar")
          .data(sel_data);

        bars.enter()
          .append("rect")
            .attr("class", "bar")
            .classed("flagged", function(d) {
              if (d.Flag_Item === "Y") { return true; }
              else { return false; };
            })
            .attr("x", 0)
            .attr("y", function(d) { return yScale(d.Item_text); })
            .attr("width", 0)
            .attr("height", yScale.bandwidth())
            .transition()
              .duration(500)
              .attr("width", function(d) { return xScale(d.WeightedPctEstimate/100); });

        // redo data labels and rects

        svg.selectAll(".bar_label")
          .remove();

        svg.selectAll(".label_rect")
          .remove();

        bar_labels = g.selectAll(".bar_label")
          .data(sel_data);

        bar_labels.enter()
          .append("text")
            .attr("class", "bar_label")
            .classed("flagged", function(d) {
              if (d.Flag_Item === "Y") { return true; }
              else { return false; };
            })
            .attr("x", function(d) { return xScale(d.WeightedPctEstimate/100) - 5; })
            .attr("y", function(d) { return yScale(d.Item_text) + yScale.bandwidth()/2; })
            .attr("dy", "0.35em")
            .attr("text-anchor", "end")
            .text(function(d) { return formatPer(d.WeightedPctEstimate/100); })
            .style("opacity", 0)
            .transition()
              .duration(500)
              .style("opacity", function(d) {

                if (d.WeightedPctEstimate < 10) { return 0; }
                else { return 1; };

              });

        g.selectAll(".bar_label")
          .each(function(d, i) {
            sel_data[i].bb = this.getBBox();
          });

        label_rects = g.selectAll(".label_rect")
          .data(sel_data);

        label_rects.enter()
          .append("rect")
            .attr("class", "label_rect")
            .classed("flagged", function(d) {
              if (d.Flag_Item === "Y") { return true; }
              else { return false; };
            })
            .attr("x", function(d) { return xScale(d.WeightedPctEstimate/100) - d.bb.width - 7; })
            .attr("y", function(d) { return yScale(d.Item_text) + yScale.bandwidth()/2 - d.bb.height/2; })
            .attr("width", function(d) { return d.bb.width + 4; })
            .attr("height", function(d) { return d.bb.height; })
            .style("opacity", 0)
            .transition()
              .duration(500)
              .style("opacity", function(d) {

                if (d.WeightedPctEstimate < 10) { return 0; }
                else { return 1; };

              });

        g.selectAll(".bar_label")
          .remove();

        bar_labels.enter()
          .append("text")
            .attr("class", "bar_label")
            .classed("flagged", function(d) {
              if (d.Flag_Item === "Y") { return true; }
              else { return false; };
            })
            .attr("x", function(d) { return xScale(d.WeightedPctEstimate/100) - 5; })
            .attr("y", function(d) { return yScale(d.Item_text) + yScale.bandwidth()/2; })
            .attr("dy", "0.35em")
            .attr("text-anchor", "end")
            .text(function(d) { return formatPer(d.WeightedPctEstimate/100); })
            .style("opacity", 0)
            .transition()
              .duration(500)
              .style("opacity", function(d) {

                if (d.WeightedPctEstimate < 10) { return 0; }
                else { return 1; };

              });

        // remove suppressed

        svg.selectAll(".flagged")
          .remove();

      };

      d3.select("#subpop1_selector")
        .on("change." + chart_id, function() {

          document.getElementById("subpop2_selector").value = null;
          updateData();

        });

      d3.select("#subpop2_selector")
        .on("change." + chart_id, function() {

          updateData();

        });

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
          x = text.attr("x"),
          y = text.attr("y"),
          dy = parseFloat(text.attr("dy")),
          tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        }
      }
      var breaks = text.selectAll("tspan").size();
      text.selectAll("tspan").attr("y", x * (breaks-1));
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

  chart.yAxisOff = function(value) {
    if (!arguments.length) return yAxisOff;
    yAxisOff = value;
    return chart;
  };

  chart.sortDesc = function(value) {
    if (!arguments.length) return sortDesc;
    sortDesc = value;
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

      // filter data

      var sel_subpop1 = d3.select("#subpop1_selector").property("value");
      var sel_subpop2 = d3.select("#subpop2_selector").property("value");
      var sel_data = data.filter(function(d) { return d.SubPopVar == sel_subpop1 && d.SubPopVal == sel_subpop2; });

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

      yScale.domain([0, d3.max(sel_data, function(d) { return Math.ceil(d.WeightedMean); })]).nice();
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

      g.append("g")
        .attr("class", "xAxis")
        .attr("transform", "translate(0," + heightAdj + ")")
        .call(d3.axisBottom(xScale).tickSizeOuter(0))
        .selectAll(".tick text")
          .call(wrap, xScale.bandwidth());

      g.append("g")
        .attr("class", "yAxis")
        .call(d3.axisLeft(yScale).tickSizeOuter(0)
          .tickFormat(function(e) {
            if (Math.floor(e) != e) { return; }
            return e;
          }));

      g.append("text")
        .attr("x", -1*(marginLeft))
        .attr("y", -20)
        .text(yAxisLabel);

      // draw bars

      var cols = g.selectAll(".col")
        .data(sel_data);

      cols.enter()
        .append("rect")
          .attr("class", "col")
          .classed("flagged", function(d) {
            if (d.Flag_Item === "Y") { return true; }
            else { return false; };
          })
          .attr("x", function(d) { return xScale(d.Item_text); })
          .attr("y", heightAdj)
          .attr("width", xScale.bandwidth())
          .attr("height", 0)
          .transition()
            .duration(500)
            .attr("y", function(d) { return yScale(d.WeightedMean); })
            .attr("height", function(d) { return heightAdj - yScale(d.WeightedMean); });

      // add data labels

      var col_labels = g.selectAll(".col_label")
        .data(sel_data);

      function drawLabels() {

        col_labels.enter()
            .append("text")
              .attr("class", "col_label")
              .classed("flagged", function(d) {
                if (d.Flag_Item === "Y") { return true; }
                else { return false; };
              })
              .attr("x", function(d) { return xScale(d.Item_text) + xScale.bandwidth()/2; })
              .attr("y", function(d) { return yScale(d.WeightedMean); })
              .attr("dy", 19)
              .attr("text-anchor", "middle")
              .text(function(d) { return formatNum(d.WeightedMean); })
              .style("opacity", 0)
              .transition()
                .duration(500)
                .style("opacity", 1);

      };

      drawLabels();

      // add rectangles for data bar_labels

      g.selectAll(".col_label")
        .each(function(d, i) {
          sel_data[i].bb = this.getBBox();
        });

      var label_rects = g.selectAll(".label_rect")
        .data(sel_data);

      label_rects.enter()
        .append("rect")
          .attr("class", "label_rect")
          .classed("flagged", function(d) {
            if (d.Flag_Item === "Y") { return true; }
            else { return false; };
          })
          .attr("x", function(d) { return xScale(d.Item_text) + xScale.bandwidth()/2 - d.bb.width/2 - 2; })
          .attr("y", function(d) { return yScale(d.WeightedMean) + 3; })
          .attr("width", function(d) { return d.bb.width + 4; })
          .attr("height", function(d) { return d.bb.height; })
          .style("opacity", 0)
          .transition()
            .duration(500)
            .style("opacity", 1);

      g.selectAll(".col_label").remove();

      drawLabels();

      // remove suppressed

      svg.selectAll(".flagged")
        .remove();

      // update data function

      function updateData() {

        sel_subpop1 = d3.select("#subpop1_selector").property("value");
        sel_subpop2 = d3.select("#subpop2_selector").property("value");
        sel_data = data.filter(function(d) { return d.SubPopVar == sel_subpop1 && d.SubPopVal == sel_subpop2; });

        // adjust axes

        yScale.domain([0, d3.max(sel_data, function(d) { return Math.ceil(d.WeightedMean); })]).nice();

        g.select(".yAxis")
          .transition()
            .duration(500)
            .call(d3.axisLeft(yScale).tickSizeOuter(0)
              .tickFormat(function(e) {
                if (Math.floor(e) != e) { return; }
                return e;
              }));

        // adjust cols

        g.selectAll(".col")
          .remove();

        cols = g.selectAll(".col")
          .data(sel_data);

        cols.enter()
          .append("rect")
            .attr("class", "col")
            .classed("flagged", function(d) {
              if (d.Flag_Item === "Y") { return true; }
              else { return false; };
            })
            .attr("x", function(d) { return xScale(d.Item_text); })
            .attr("y", heightAdj)
            .attr("width", xScale.bandwidth())
            .attr("height", 0)
            .transition()
              .duration(500)
              .attr("y", function(d) { return yScale(d.WeightedMean); })
              .attr("height", function(d) { return heightAdj - yScale(d.WeightedMean); });

        // re-do data labels and rects

        g.selectAll(".col_label")
          .remove();

        col_labels = g.selectAll(".col_label")
          .data(sel_data);

        col_labels.enter()
          .append("text")
            .attr("class", "col_label")
            .classed("flagged", function(d) {
              if (d.Flag_Item === "Y") { return true; }
              else { return false; };
            })
            .attr("x", function(d) { return xScale(d.Item_text) + xScale.bandwidth()/2; })
            .attr("y", function(d) { return yScale(d.WeightedMean); })
            .attr("dy", 19)
            .attr("text-anchor", "middle")
            .text(function(d) { return formatNum(d.WeightedMean); })
            .style("opacity", 0)
            .transition()
              .duration(500)
              .style("opacity", 1);

        g.selectAll(".col_label")
          .each(function(d, i) {
            sel_data[i].bb = this.getBBox();
          });

        g.selectAll(".label_rect")
          .remove();

        label_rects = g.selectAll(".label_rect")
          .data(sel_data);

        label_rects.enter()
          .append("rect")
            .attr("class", "label_rect")
            .classed("flagged", function(d) {
              if (d.Flag_Item === "Y") { return true; }
              else { return false; };
            })
            .attr("x", function(d) { return xScale(d.Item_text) + xScale.bandwidth()/2 - d.bb.width/2 - 2; })
            .attr("y", function(d) { return yScale(d.WeightedMean) + 3; })
            .attr("width", function(d) { return d.bb.width + 4; })
            .attr("height", function(d) { return d.bb.height; })
            .style("opacity", 0)
            .transition()
              .duration(500)
              .style("opacity", 1);

        g.selectAll(".col_label")
          .remove();

        col_labels.enter()
            .append("text")
              .attr("class", "col_label")
              .classed("flagged", function(d) {
                if (d.Flag_Item === "Y") { return true; }
                else { return false; };
              })
              .attr("x", function(d) { return xScale(d.Item_text) + xScale.bandwidth()/2; })
              .attr("y", function(d) { return yScale(d.WeightedMean); })
              .attr("dy", 19)
              .attr("text-anchor", "middle")
              .text(function(d) { return formatNum(d.WeightedMean); })
              .style("opacity", 0)
              .transition()
                .duration(500)
                .style("opacity", 1);

        // remove suppressed

        svg.selectAll(".flagged")
          .remove();

      };

      // update data on selector change

      d3.select("#subpop1_selector")
        .on("change." + chart_id, function() {

          document.getElementById("subpop2_selector").value = null;
          updateData();

        });

      d3.select("#subpop2_selector")
        .on("change." + chart_id, function() {

          updateData();

        });

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

/* mean bar charts */

function bar_mean() {

  // default values that can be changed by the caller

  var height = 400,
      marginTop = 20,
      marginRight = 40,
      marginLeft = 40,
      marginBottom = 20,
      chart_id = [],
      xAxisLabel = "",
      yAxisOff = 0,
      data = [];

  function chart(selection) {
    selection.each(function() {

      // filter data

      var sel_subpop1 = d3.select("#subpop1_selector").property("value");
      var sel_subpop2 = d3.select("#subpop2_selector").property("value");
      var sel_data = data.filter(function(d) { return d.SubPopVar == sel_subpop1 && d.SubPopVal == sel_subpop2; });

      // number formats

      var formatNum = d3.format(",.1f"),
          formatPer = d3.format(",.0%");

      // margins, adjusted widths and heights

      var width = document.getElementById(chart_id).offsetWidth,
          widthAdj = width - marginLeft - marginRight,
          heightAdj = height - marginTop - marginBottom;

      // scales and domains

      var xScale = d3.scaleLinear().range([0, widthAdj]);
      var yScale = d3.scaleBand().rangeRound([heightAdj, 0]).padding(0.25);

      xScale.domain([0, d3.max(sel_data, function(d) { return Math.ceil(d.WeightedMean); })]).nice();
      yScale.domain(data.map(function(d) { return d.Item_text; }));

      // svg

      var svg = d3.select("#" + chart_id)
        .append("svg")
          .attr("class", "bar_mean")
          .attr("width", width)
          .attr("height", height)
          .style("opacity", 0);

      svg.transition()
        .duration(500)
        .style("opacity", 1);

      var g = svg.append("g")
          .attr("transform", "translate(" + marginLeft + "," + marginTop + ")");

      // axes

      g.append("g")
        .attr("class", "xAxis")
        .attr("transform", "translate(0," + heightAdj + ")")
        .call(d3.axisBottom(xScale).tickSizeOuter(0)
          .tickFormat(function(e) {
            if (Math.floor(e) != e) { return; }
            return e;
          }));

      if (yAxisOff == 1) {}
      else {
        g.append("g")
          .attr("class", "yAxis")
          .call(d3.axisLeft(yScale).tickSizeOuter(0))
          .selectAll(".tick text")
            .call(wrap, yScale.bandwidth());
      };

      g.append("text")
        .attr("x", widthAdj + marginRight/2)
        .attr("y", heightAdj + 40)
        .attr("text-anchor", "end")
        .text(xAxisLabel);

      // draw bars

      var bars = g.selectAll(".bar")
        .data(sel_data);

      bars.enter()
        .append("rect")
          .attr("class", "bar")
          .classed("flagged", function(d) {
            if (d.Flag_Item === "Y") { return true; }
            else { return false; };
          })
          .attr("x", 0)
          .attr("y", function(d) { return yScale(d.Item_text); })
          .attr("width", 0)
          .attr("height", yScale.bandwidth())
          .transition()
            .duration(500)
            .attr("width", function(d) { return xScale(d.WeightedMean); });

      // add data labels

      var bar_labels = g.selectAll(".bar_label")
        .data(sel_data);

      function drawLabels() {

        bar_labels.enter()
          .append("text")
            .attr("class", "bar_label")
            .classed("flagged", function(d) {
              if (d.Flag_Item === "Y") { return true; }
              else { return false; };
            })
            .attr("x", function(d) { return xScale(d.WeightedMean) - 5; })
            .attr("y", function(d) { return yScale(d.Item_text) + yScale.bandwidth()/2; })
            .attr("dy", "0.35em")
            .attr("text-anchor", "end")
            .text(function(d) { return formatNum(d.WeightedMean); })
            .style("opacity", 0)
            .transition()
              .duration(500)
              .style("opacity", 1);

      };

      drawLabels();

      // add rectangles for data bar_labels

      g.selectAll(".bar_label")
        .each(function(d, i) {
          sel_data[i].bb = this.getBBox();
        });

      var label_rects = g.selectAll(".label_rect")
        .data(sel_data);

      label_rects.enter()
        .append("rect")
          .attr("class", "label_rect")
          .classed("flagged", function(d) {
            if (d.Flag_Item === "Y") { return true; }
            else { return false; };
          })
          .attr("x", function(d) { return xScale(d.WeightedMean) - d.bb.width - 7; })
          .attr("y", function(d) { return yScale(d.Item_text) + yScale.bandwidth()/2 - d.bb.height/2; })
          .attr("width", 0)
          .attr("height", function(d) { return d.bb.height; })
          .style("opacity", 0)
          .transition()
            .duration(500)
            .attr("width", function(d) { return d.bb.width + 4; })
            .style("opacity", 1)

      g.selectAll(".col_label").remove();

      drawLabels();

      // remove suppressed

      svg.selectAll(".flagged")
        .remove();

      // update data function

      function updateData() {

        sel_subpop1 = d3.select("#subpop1_selector").property("value");
        sel_subpop2 = d3.select("#subpop2_selector").property("value");
        sel_data = data.filter(function(d) { return d.SubPopVar == sel_subpop1 && d.SubPopVal == sel_subpop2; });

        // adjust axes

        xScale.domain([0, d3.max(sel_data, function(d) { return Math.ceil(d.WeightedMean); })]).nice();

        g.select(".xAxis")
          .transition()
            .duration(500)
            .call(d3.axisBottom(xScale).tickSizeOuter(0).tickFormat(function(e) {
              if (Math.floor(e) != e) { return; }
              return e;
            }));

        // adjust cols

        g.selectAll(".bar")
          .remove();

        bars = g.selectAll(".bar")
          .data(sel_data);

        bars.enter()
          .append("rect")
            .attr("class", "bar")
            .classed("flagged", function(d) {
              if (d.Flag_Item === "Y") { return true; }
              else { return false; };
            })
            .attr("x", 0)
            .attr("y", function(d) { return yScale(d.Item_text); })
            .attr("width", 0)
            .attr("height", yScale.bandwidth())
            .transition()
              .duration(500)
              .attr("width", function(d) { return xScale(d.WeightedMean); });

        // re-do data labels and rects

        svg.selectAll(".bar_label")
          .remove();

        svg.selectAll(".label_rect")
          .remove();

        bar_labels = g.selectAll(".bar_label")
          .data(sel_data);

        bar_labels.enter()
          .append("text")
            .attr("class", "bar_label")
            .classed("flagged", function(d) {
              if (d.Flag_Item === "Y") { return true; }
              else { return false; };
            })
            .attr("x", function(d) { return xScale(d.WeightedMean) - 5; })
            .attr("y", function(d) { return yScale(d.Item_text) + yScale.bandwidth()/2; })
            .attr("dy", "0.35em")
            .attr("text-anchor", "end")
            .text(function(d) { return formatNum(d.WeightedMean); })
            .style("opacity", 0)
            .transition()
              .duration(500)
              .style("opacity", 1);

        g.selectAll(".bar_label")
          .each(function(d, i) {
            sel_data[i].bb = this.getBBox();
          });

        label_rects = g.selectAll(".label_rect")
          .data(sel_data);

        label_rects.enter()
          .append("rect")
            .attr("class", "label_rect")
            .classed("flagged", function(d) {
              if (d.Flag_Item === "Y") { return true; }
              else { return false; };
            })
            .attr("x", function(d) { return xScale(d.WeightedMean) - d.bb.width - 7; })
            .attr("y", function(d) { return yScale(d.Item_text) + yScale.bandwidth()/2 - d.bb.height/2; })
            .attr("width", 0)
            .attr("height", function(d) { return d.bb.height; })
            .style("opacity", 0)
            .transition()
              .duration(500)
              .attr("width", function(d) { return d.bb.width + 4; })
              .style("opacity", 1);

        g.selectAll(".bar_label")
          .remove();

        bar_labels.enter()
          .append("text")
            .attr("class", "bar_label")
            .classed("flagged", function(d) {
              if (d.Flag_Item === "Y") { return true; }
              else { return false; };
            })
            .attr("x", function(d) { return xScale(d.WeightedMean) - 5; })
            .attr("y", function(d) { return yScale(d.Item_text) + yScale.bandwidth()/2; })
            .attr("dy", "0.35em")
            .attr("text-anchor", "end")
            .text(function(d) { return formatNum(d.WeightedMean); })
            .style("opacity", 0)
            .transition()
              .duration(500)
              .style("opacity", 1);

        svg.selectAll(".flagged")
          .remove();

      };

      // update data on selector change

      d3.select("#subpop1_selector")
        .on("change." + chart_id, function() {

          document.getElementById("subpop2_selector").value = null;
          updateData();

        });

      d3.select("#subpop2_selector")
        .on("change." + chart_id, function() {

          updateData();

        });

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
          x = text.attr("x"),
          y = text.attr("y"),
          dy = parseFloat(text.attr("dy")),
          tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        }
      }
      var breaks = text.selectAll("tspan").size();
      text.selectAll("tspan").attr("y", x * (breaks-1));
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

  chart.xAxisLabel = function(value) {
    if (!arguments.length) return xAxisLabel;
    xAxisLabel = value;
    return chart;
  };

  chart.yAxisOff = function(value) {
    if (!arguments.length) return yAxisOff;
    yAxisOff = value;
    return chart;
  };

  chart.data = function(value) {
    if (!arguments.length) return data;
    data = value;
    return chart;
  };

  return chart;

};

/* stacked bar charts */

function stacked_bar() {

  // default values that can be changed by the caller

  var height = 500,
      marginTop = 20,
      marginRight = 40,
      marginLeft = 40,
      marginBottom = 80,
      chart_id = [],
      horiz_legend = 0,
      horiz_legend_spacing = 30,
      data = [];

  function chart(selection) {
    selection.each(function() {

      // convert value to numeric

      data.forEach(function(d) {
        d.Value = +d.Value;
      });

      // identify maximum response value

      var max_response = d3.max(data, function(d) { return d.Value; });

      // sort data

      data.sort(function(a, b) { return d3.descending(a.Value, b.Value) || d3.descending(a.WeightedPctEstimate, b.WeightedPctEstimate); });

      // filter data

      var sel_subpop1 = d3.select("#subpop1_selector").property("value");
      var sel_subpop2 = d3.select("#subpop2_selector").property("value");
      var sel_data = data.filter(function(d) { return d.SubPopVar == sel_subpop1 && d.SubPopVal == sel_subpop2; });

      sel_data.forEach(function(d) {

        // replace suppressed values with 0

        if (d.Flag_Item === "Y") { d.WeightedPctEstimate = 0; }
        else {};

        // indicate data labels to be displayed
        // top two response values should be displayed regardless of values
        // for other values, if % is < 10 they can be hidden

        if (d.Value >= (max_response - 1)) { return d.Display_Label = "Y"; }
        else if (d.WeightedPctEstimate < 10) { return d.Display_Label = "N"; }
        else { return d.Display_Label = "Y"; };

      });

      sel_data.sort(function(a, b) { return d3.descending(a.Value, b.Value) || d3.descending(a.WeightedPctEstimate, b.WeightedPctEstimate); });

      // generate stacked x-coordinates
      // based on https://stackoverflow.com/questions/44416221/proper-data-structure-for-d3-stacked-bar-chart

      var nested_data = d3.nest()
        .key(function(d) { return d.Item_text; })
        .entries(sel_data);

      nested_data.forEach(function(d) {
        d.values.sort(function(a, b) { return d3.ascending(a.Value, b.Value); });
      });

      nested_data.forEach(function(group) {
        var x0 = 0;
        group.values.forEach(function(entry, index) {
          entry.x0 = x0;
          entry.x1 = +entry.WeightedPctEstimate + x0;
          x0 = entry.x1;
        });
        group.total = group.values[group.values.length - 1].x1;
      });

      // number formats

      var formatNum = d3.format(",.0f"),
          formatPer = d3.format(",.0%");

      // margins, adjusted widths and heights

      var width = document.getElementById(chart_id).offsetWidth,
          widthAdj = width - marginLeft - marginRight,
          heightAdj = height - marginTop - marginBottom;

      // scales and domains

      var data_asc = data.sort(function(a, b) { return d3.ascending(a.Value, b.Value); });
      var categories = d3.nest()
        .key(function(d) { return d.ResponseCategory; })
        .entries(data_asc);

      var cat_num = categories.length;

      var yScale = d3.scaleBand().rangeRound([0, heightAdj]).padding(0.25);
      var xScale = d3.scaleLinear().range([0, widthAdj]);
      var zScale = [];

      function color_categories() {

        if (cat_num == 3) { zScale = d3.scaleOrdinal().range(['#e86b01', '#adb6f5', '#0d1969']); }
        else if (cat_num == 4) { zScale = d3.scaleOrdinal().range(['#e86b01','#ffc28f','#adb6f5','#0d1969']); }
        else if (cat_num == 5) { zScale = d3.scaleOrdinal().range(['#e86b01','#ffc28f','#adb6f5','#5769eb','#0d1969']); }
        else if (cat_num == 6) { zScale = d3.scaleOrdinal().range(['#e86b01','#ff943b','#ffc28f','#adb6f5','#5769eb','#0d1969']); }
        else if (cat_num == 7) { zScale = d3.scaleOrdinal().range(['#e86b01','#ff943b','#ffc28f','#d2d7fa','#adb6f5','#5769eb','#0d1969']); };

      };

      color_categories();

      // adjust zScale later to be based on # of categories
      // sort response categories for domains

      yScale.domain(d3.values(nested_data).map(function(d) { return d.key; }));
      xScale.domain([0,1]);
      zScale.domain(d3.values(categories).map(function(d) { return d.key; }));

      // svg

      var svg = d3.select("#" + chart_id)
        .append("svg")
          .attr("class", "stacked_bar")
          .attr("width", width)
          .attr("height", height)
          .style("opacity", 0);

      svg.transition()
        .duration(500)
        .style("opacity", 1);

      var g = svg.append("g")
          .attr("transform", "translate(" + marginLeft + "," + marginTop + ")");

      // draw bars

      var bars = g.selectAll(".bar_group")
          .data(nested_data)
          .enter()
            .append("g")
              .attr("class", "bar_group")
              .attr("transform", function(d) { return "translate(0," + yScale(d.key) + ")"; });

      bars.selectAll("rect")
        .data(function(d) { return d.values; })
        .enter()
          .append("rect")
            .attr("class", "bar")
            .classed("flagged", function(d) {
              if (d.Flag_Item === "Y") { return true; }
              else { return false; };
            })
            .attr("x", function(d) { return xScale(d.x0/100); })
            .attr("width", 0)
            .attr("height", yScale.bandwidth())
            .attr("fill", function(d) { return zScale(d.ResponseCategory); })
            .transition()
              .delay(function(d, i) { return (500/categories.length)*i; })
              .duration(500)
              .attr("width", function(d) { return xScale(d.WeightedPctEstimate/100); });

      // axes

      function drawXAxis() {

        g.append("g")
          .attr("class", "xAxis")
          .attr("transform", "translate(0," + heightAdj + ")")
          .call(d3.axisBottom(xScale).ticks(5).tickFormat(d3.format(",.0%")).tickSizeOuter(0));

      };

      drawXAxis();

      function drawYAxis() {

        g.append("g")
          .attr("class", "yAxis")
          .call(d3.axisLeft(yScale).tickSizeOuter(0))
          .selectAll(".tick text")
            .call(wrap, marginLeft);

      };

      drawYAxis();

      // add data labels

      function drawLabels() {

        bars.selectAll("text")
          .data(function(d) { return d.values; })
          .enter()
            .append("text")
              .attr("class", "bar_label")
              .classed("flagged", function(d) {
                if (d.Flag_Item === "Y") { return true; }
                else { return false; };
              })
              .attr("x", function(d) { return xScale((d.x0/100 + d.x1/100)/2); })
              .attr("y", yScale.bandwidth()/2)
              .attr("dy", "0.35em")
              .attr("text-anchor", "middle")
              .text(function(d) { return formatPer(d.WeightedPctEstimate/100); })
              .style("opacity", 0)
              .transition()
                .delay(function(d, i) { return (500/categories.length)*i; })
                .duration(500)
                .style("opacity", function(d) {

                  if (d.Display_Label == "N") { return 0; }
                  else { return 1; };

                });

      };

      drawLabels();

      // add rectangles for data bar_labels
      // first need to reverse-nest the nested data

      var reversed = [];

      nested_data.forEach(function(group) {
        group.values.forEach(function(vals) {
          reversed.push({
            Item_text: group.key,
            ResponseCategory: vals.ResponseCategory,
            WeightedPctEstimate: vals.WeightedPctEstimate,
            Flag_Item: vals.Flag_Item,
            Display_Label: vals.Display_Label
          });
        });
      });

      g.selectAll(".bar_label")
        .each(function(d, i) {

          reversed[i].bb = this.getBBox();

        });

      // re-nest the data

      var nested_reversed = d3.nest()
        .key(function(d) { return d.Item_text; })
        .entries(reversed);

      nested_reversed.forEach(function(group) {
        var x0 = 0;
        group.values.forEach(function(entry, index) {
          entry.x0 = x0;
          entry.x1 = +entry.WeightedPctEstimate + x0;
          x0 = entry.x1;
        });
        group.total = group.values[group.values.length - 1].x1;
      });

      bars = g.selectAll(".bar_group")
        .data(nested_reversed);

      bars.selectAll(".label_rect")
        .data(function(d) { return d.values; })
        .enter()
          .append("rect")
            .attr("class", "label_rect")
            .classed("flagged", function(d) {
              if (d.Flag_Item === "Y") { return true; }
              else { return false; };
            })
            .attr("x", function(d) { return xScale((d.x1/100 + d.x0/100)/2) - d.bb.width/2 - 2; })
            .attr("y", function(d) { return yScale.bandwidth()/2 - d.bb.height/2; })
            .attr("width", function(d) { return d.bb.width + 4; })
            .attr("height", function(d) { return d.bb.height; })
            .style("opacity", 0)
            .transition()
              .delay(function(d, i) { return (500/categories.length)*i; })
              .duration(500)
              .style("opacity", function(d) {

                if (d.Display_Label == "N") { return 0; }
                else { return 1; };

              });

      bars.selectAll(".bar_label")
        .remove();

      drawLabels();

      // removed suppressed portions

      svg.selectAll(".flagged")
        .remove();

      // add legend

      var legend_data = d3.values(categories).map(function(d) { return d.key; });

      var legend = svg.selectAll(".legend")
        .data(legend_data)
        .enter()
          .append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) {

              if (horiz_legend == 0) { return "translate(0," + (heightAdj + 70 + (i * 30)) + ")"; }
              else if (horiz_legend == 1) { return "translate(" + (i * horiz_legend_spacing) + "," + (heightAdj + 70) + ")"; };

            });

      legend.append("rect")
        .attr("fill", function(d) { return zScale(d); })
        .attr("width", 20)
        .attr("height", 20);

      legend.append("text")
        .attr("x", 30)
        .attr("y", 0)
        .attr("dy", "1em")
        .text(function(d) { return d });

      // update data function

      function updateData() {

        // re-sort data

        data.sort(function(a, b) { return d3.descending(a.Value, b.Value) || d3.descending(a.WeightedPctEstimate, b.WeightedPctEstimate); });

        // re-filter data

        sel_subpop1 = d3.select("#subpop1_selector").property("value");
        sel_subpop2 = d3.select("#subpop2_selector").property("value");
        sel_data = data.filter(function(d) { return d.SubPopVar == sel_subpop1 && d.SubPopVal == sel_subpop2; });

        sel_data.forEach(function(d) {

          // replace suppressed values with 0

          if (d.Flag_Item === "Y") { d.WeightedPctEstimate = 0; }
          else {};

          // indicate data labels to be displayed
          // top two response values should be displayed regardless of values
          // for other values, if % is < 10 they can be hidden

          if (d.Value >= (max_response - 1)) { return d.Display_Label = "Y"; }
          else if (d.WeightedPctEstimate < 10) { return d.Display_Label = "N"; }
          else { return d.Display_Label = "Y"; };

        });

        sel_data.sort(function(a, b) { return d3.descending(a.Value, b.Value) || d3.descending(a.WeightedPctEstimate, b.WeightedPctEstimate); });

        // generate stacked x-coordinates
        // based on https://stackoverflow.com/questions/44416221/proper-data-structure-for-d3-stacked-bar-chart

        nested_data = d3.nest()
          .key(function(d) { return d.Item_text; })
          .entries(sel_data);

        nested_data.forEach(function(d) {
          d.values.sort(function(a, b) { return d3.ascending(a.Value, b.Value); });
        });

        nested_data.forEach(function(group) {
          var x0 = 0;
          group.values.forEach(function(entry, index) {
            entry.x0 = x0;
            entry.x1 = +entry.WeightedPctEstimate + x0;
            x0 = entry.x1;
          });
          group.total = group.values[group.values.length - 1].x1;
        });

        // refresh y domain

        yScale.domain(d3.values(nested_data).map(function(d) { return d.key; }));

        // adjust bars

        g.selectAll(".bar_group")
          .remove();

        bars = g.selectAll(".bar_group")
          .data(nested_data)
          .enter()
            .append("g")
              .attr("class", "bar_group")
              .attr("transform", function(d) { return "translate(0," + yScale(d.key) + ")"; });

        bars.selectAll("rect")
          .data(function(d) { return d.values; })
          .enter()
            .append("rect")
              .attr("class", "bar")
              .classed("flagged", function(d) {
                if (d.Flag_Item === "Y") { return true; }
                else { return false; };
              })
              .attr("x", function(d) { return xScale(d.x0/100); })
              .attr("width", 0)
              .attr("height", yScale.bandwidth())
              .attr("fill", function(d) { return zScale(d.ResponseCategory); })
              .transition()
                .delay(function(d, i) { return (500/categories.length)*i; })
                .duration(500)
                .attr("width", function(d) { return xScale(d.WeightedPctEstimate/100); });

        // redo labels

        g.selectAll(".bar_label")
          .remove();

        drawLabels();

        // add rectangles for data bar_labels

        reversed = [];

        nested_data.forEach(function(group) {
          group.values.forEach(function(vals) {
            reversed.push({
              Item_text: group.key,
              ResponseCategory: vals.ResponseCategory,
              WeightedPctEstimate: vals.WeightedPctEstimate,
              Flag_Item: vals.Flag_Item,
              Display_Label: vals.Display_Label
            });
          });
        });

        g.selectAll(".bar_label")
          .each(function(d, i) {

            reversed[i].bb = this.getBBox();

          });

        // re-nest the data

        nested_reversed = d3.nest()
          .key(function(d) { return d.Item_text; })
          .entries(reversed);

        nested_reversed.forEach(function(group) {
          var x0 = 0;
          group.values.forEach(function(entry, index) {
            entry.x0 = x0;
            entry.x1 = +entry.WeightedPctEstimate + x0;
            x0 = entry.x1;
          });
          group.total = group.values[group.values.length - 1].x1;
        });

        bars = g.selectAll(".bar_group")
          .data(nested_reversed);

        bars.selectAll(".label_rect")
          .data(function(d) { return d.values; })
          .enter()
            .append("rect")
              .attr("class", "label_rect")
              .classed("flagged", function(d) {
                if (d.Flag_Item === "Y") { return true; }
                else { return false; };
              })
              .attr("x", function(d) { return xScale((d.x1/100 + d.x0/100)/2) - d.bb.width/2 - 2; })
              .attr("y", function(d) { return yScale.bandwidth()/2 - d.bb.height/2; })
              .attr("width", function(d) { return d.bb.width + 4; })
              .attr("height", function(d) { return d.bb.height; })
              .style("opacity", 0)
              .transition()
                .delay(function(d, i) { return (500/categories.length)*i; })
                .duration(500)
                .style("opacity", function(d) {

                  if (d.Display_Label == "N") { return 0; }
                  else { return 1; };

                });

        bars.selectAll(".bar_label")
          .remove();

        bars.selectAll("text")
          .data(function(d) { return d.values; })
          .enter()
            .append("text")
              .attr("class", "bar_label")
              .classed("flagged", function(d) {
                if (d.Flag_Item === "Y") { return true; }
                else { return false; };
              })
              .attr("x", function(d) { return xScale((d.x0/100 + d.x1/100)/2); })
              .attr("y", yScale.bandwidth()/2)
              .attr("dy", "0.35em")
              .attr("text-anchor", "middle")
              .text(function(d) { return formatPer(d.WeightedPctEstimate/100); })
              .style("opacity", 0)
              .transition()
                .delay(function(d, i) { return (500/categories.length)*i; })
                .duration(500)
                .style("opacity", function(d) {

                  if (d.Display_Label == "N") { return 0; }
                  else { return 1; };

                });

        // remove flagged items

        g.selectAll(".flagged")
          .remove();

        // redraw axes on top

        g.select(".xAxis").remove();
        g.select(".yAxis").remove();

        drawXAxis();
        drawYAxis();

      };

      // update data on selector change

      d3.select("#subpop1_selector")
        .on("change." + chart_id, function() {

          document.getElementById("subpop2_selector").value = null;
          updateData();

        });

      d3.select("#subpop2_selector")
        .on("change." + chart_id, function() {

          updateData();

        });

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
          x = text.attr("x"),
          y = text.attr("y"),
          dy = parseFloat(text.attr("dy")),
          tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        }
      }
      var breaks = text.selectAll("tspan").size();
      text.selectAll("tspan").attr("y", x * (breaks-1));
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

  chart.horiz_legend = function(value) {
    if (!arguments.length) return horiz_legend;
    horiz_legend = value;
    return chart;
  };

  chart.horiz_legend_spacing = function(value) {
    if (!arguments.length) return horiz_legend_spacing;
    horiz_legend_spacing = value;
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

/* stacked column charts */

/*function stacked_col() {

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

      // generate stacked x-coordinates
      // based on https://stackoverflow.com/questions/44416221/proper-data-structure-for-d3-stacked-bar-chart

      var nested_data = d3.nest()
        .key(function(d) { return d.Item_text; })
        .entries(district_data);

      nested_data.forEach(function(group) {
        var y0 = 0;
        group.values.forEach(function(entry, index) {
          entry.y0 = y0;
          entry.y1 = +entry.WeightedPctEstimate + y0;
          y0 = entry.y1;
        });
        group.total = group.values[group.values.length - 1].y1;
      });

      // number formats

      var formatNum = d3.format(",.0f"),
          formatPer = d3.format(",.0%");

      // margins, adjusted widths and heights

      var width = document.getElementById(chart_id).offsetWidth,
          widthAdj = width - marginLeft - marginRight,
          heightAdj = height - marginTop - marginBottom;

      // scales and domains

      var categories = nested_data[0].values.length;

      var yScale = d3.scaleLinear().range([heightAdj, 0]);
      var xScale = d3.scaleBand().rangeRound([0, widthAdj]).padding(0.25);
      var zScale = [];

      function color_categories() {

        if (categories == 3) { zScale = d3.scaleOrdinal().range(['#e86b01', '#adb6f5', '#0d1969']); }
        else if (categories == 4) { zScale = d3.scaleOrdinal().range(['#e86b01','#ffc28f','#adb6f5','#0d1969']); }
        else if (categories == 5) { zScale = d3.scaleOrdinal().range(['#e86b01','#ffc28f','#adb6f5','#5769eb','#0d1969']); }
        else if (categories == 6) { zScale = d3.scaleOrdinal().range(['#e86b01','#ff943b','#ffc28f','#adb6f5','#5769eb','#0d1969']); }
        else if (categories == 7) { zScale = d3.scaleOrdinal().range(['#e86b01','#ff943b','#ffc28f','#d2d7fa','#adb6f5','#5769eb','#0d1969']); };

      };

      color_categories();

      // adjust zScale later to be based on # of categories

      yScale.domain([0,1]);
      xScale.domain(d3.values(nested_data).map(function(d) { return d.key; }));
      zScale.domain(data.map(function(d) { return d.ResponseCategory; }));

      // svg

      var svg = d3.select("#" + chart_id)
        .append("svg")
          .attr("class", "stacked_col")
          .attr("width", width)
          .attr("height", height)
          .style("opacity", 0);

      svg.transition()
        .duration(500)
        .style("opacity", 1);

      var g = svg.append("g")
          .attr("transform", "translate(" + marginLeft + "," + marginTop + ")");

      // draw bars

      var cols = g.append("g")
        .selectAll("g")
          .data(nested_data)
          .enter()
            .append("g")
              .attr("class", "g")
              .attr("transform", function(d) { return "translate(" + xScale(d.key) + ",0)"; });

      cols.selectAll("rect")
        .data(function(d) { return d.values; })
        .enter()
          .append("rect")
            .attr("class", "col")
            .attr("y", function(d) { return yScale(d.y1/100); })
            .attr("width", xScale.bandwidth())
            .attr("height", function(d) { return heightAdj - yScale(d.WeightedPctEstimate/100); })
            .attr("fill", function(d) { return zScale(d.ResponseCategory); });

      // axes

      function drawXAxis() {

        g.append("g")
          .attr("class", "xAxis")
          .attr("transform", "translate(0," + heightAdj + ")")
          .call(d3.axisBottom(xScale).tickSizeOuter(0))
          .selectAll(".tick text")
            .call(wrap, xScale.bandwidth());

      };

      drawXAxis();

      function drawYAxis() {

        g.append("g")
          .attr("class", "yAxis")
          .call(d3.axisLeft(yScale).ticks(5).tickFormat(d3.format(",.0%")).tickSizeOuter(0));

      };

      drawYAxis();

      // add data labels

      function drawLabels() {

        cols.selectAll("text")
          .data(function(d) { return d.values; })
          .enter()
            .append("text")
              .attr("class", "col_label")
              .attr("y", function(d) { return yScale((d.y0/100 + d.y1/100)/2); })
              .attr("x", xScale.bandwidth()/2)
              .attr("dy", "0.35em")
              .attr("text-anchor", "middle")
              .text(function(d) { return formatPer(d.WeightedPctEstimate/100); })
              .style("opacity", function(d) {

                if (d.WeightedPctEstimate < 10) { return 0; }
                else { return 1; };

              });

      };

      drawLabels();

      // add rectangles for data bar_labels

      g.selectAll(".col_label")
        .each(function(d, i) {
          district_data[i].bb = this.getBBox();
        });

      // re-nest the data

      nested_data = d3.nest()
        .key(function(d) { return d.Item_text; })
        .entries(district_data);

      cols.selectAll(".label_rect")
        .data(function(d) { return d.values; })
        .enter()
          .append("rect")
            .attr("class", "label_rect")
            .attr("y", function(d) { return yScale((d.y1/100 + d.y0/100)/2) - d.bb.height/2 - 2; })
            .attr("x", function(d) { return xScale.bandwidth()/2 - d.bb.width/2; })
            .attr("width", function(d) { return d.bb.width + 4; })
            .attr("height", function(d) { return d.bb.height; })
            .style("opacity", function(d) {

              if (d.WeightedPctEstimate < 10) { return 0; }
              else { return 1; };

            });

      cols.selectAll(".bar_label")
        .remove();

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

  chart.data = function(value) {
    if (!arguments.length) return data;
    data = value;
    return chart;
  };

  return chart;

};*/
