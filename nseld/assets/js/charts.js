// Tree diagram
// Based on https://bl.ocks.org/d3noob/e7e37cfe0e8763cb0915dee33cc2a24b

function treeDiagram() {

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

      // number formats

      var formatNum = d3.format(",.0f"),
          formatPer = d3.format(",.0%");

      // margins and adjusted widths and heights

      var width = document.getElementById(chart_id).offsetWidth;
          widthAdj = width - marginLeft - marginRight,
          heightAdj = height - marginTop - marginBottom;

      // convert the data into a hierarchy

      var treeData = d3.stratify()
        .id(function(d) { return d.name; })
        .parentId(function(d) { return d.parent; })
        (data);

      // assign name and counts to each node

      treeData.each(function(d) {
        d.name = d.id,
        d.count = +d.count;
      });

      // declare tree layout and assign size

      var treeMap = d3.tree()
        .size([heightAdj, widthAdj]);

      // assign data to hierarchy using parent-child relationships

      var nodes = d3.hierarchy(treeData, function(d) {
        return d.children;
      });

      // map node data to tree layout

      nodes = treeMap(nodes);

      // append svg

      var dom = d3.select("#" + chart_id);

      var svg = dom.append("svg")
        .attr("class", "treeDiagram")
        .attr("width", width)
        .attr("height", height)
        .append("g")
          .attr("transform", "translate(" + marginLeft + "," + marginTop + ")");

      // add links between nodes

      var link = svg.selectAll(".link")
        .data(nodes.descendants().slice(1))
        .enter()
          .append("path")
            .attr("class", "link")
            .attr("d", function(d) { return "M" + d.y + "," + d.x + "C" + (d.y + d.parent.y) / 2 + "," + d.x + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x + " " + d.parent.y + "," + d.parent.x; });

      // add each node as a group

      var node = svg.selectAll(".node")
        .data(nodes.descendants())
        .enter()
          .append("g")
            .attr("class", function(d) { return "node" + (d.children ? " node-internal" : " node--leaf"); })
            .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

      // add circle to each node

      node.append("circle")
        .attr("class", "circle")
        .attr("r", function(d) { return d.data.data.count/50; });

      // add text to the node

      node.append("text")
        .attr("dy", function(d) { return d.children ? "-2em" : ".35em"; })
        .attr("x", function(d) { return d.children ? 0 : 13; })
        .style("text-anchor", function(d) { return d.children ? "middle" : "start"; })
        .text(function(d) { return d.data.name + " (" + formatNum(d.data.data.count) + ")"; });

      // function to update chart when resized/printing

      function resize() {

        dom.select("svg")
          .attr("width", width);

        treeMap = d3.tree()
            .size([heightAdj, widthAdj]);

        nodes = d3.hierarchy(treeData, function(d) {
            return d.children;
        });

        nodes = treeMap(nodes);

        svg.selectAll(".link")
          .data(nodes.descendants().slice(1))
          .attr("d", function(d) { return "M" + d.y + "," + d.x + "C" + (d.y + d.parent.y) / 2 + "," + d.x + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x + " " + d.parent.y + "," + d.parent.x; });

        svg.selectAll(".node")
          .data(nodes.descendants())
          .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

      };

      // resize

      window.addEventListener("resize", function() {

        // update width

        width = document.getElementById(chart_id).offsetWidth;
        widthAdj = width - marginLeft - marginRight;

        // resize chart

        resize();

      });

      // resize for printing

      (function() {

        var beforePrint = function() {

          // set width for printing

          width = 750;
          widthAdj = width - marginLeft - marginRight;

          // resize chart

          resize();

        };

        var afterPrint = function() {

          // update width

          width = document.getElementById(chart_id).offsetWidth;
          widthAdj = width - marginLeft - marginRight;

          // resize chart

          resize();

        };

        if (window.matchMedia) {
          var mediaQueryList = window.matchMedia("print");
          mediaQueryList.addListener(function(mql) {
            if (mql.matches) { beforePrint(); }
            else { afterPrint(); }
          });
        }

        window.onbeforeprint = beforePrint;
        window.onafterprint = afterPrint;

      }());

    })
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

// Donut charts

function donutChart() {

  // default values that can be changed by the caller

  var height = 240,
      marginTop = 20,
      marginRight = 20,
      marginLeft = 20,
      marginBottom = 20,
      showDistType = 0,
      chart_id = [],
      data = [];

  function chart(selection) {
    selection.each(function() {

      // number formats

      var formatNum = d3.format(",.0f"),
          formatPer = d3.format(",.0%");

      // margins and adjusted widths and heights

      var width = document.getElementById(chart_id).offsetWidth;

      var widthAdj = width - marginLeft - marginRight,
          heightAdj = height - marginTop - marginBottom,
          radius = Math.min(widthAdj, heightAdj)/2;

      var dom = d3.select("#" + chart_id);

      // add district type

      function drawDistType() {
        if (showDistType == 1) {
          dom.append("div")
            .data(data)
            .attr("class", "distTypeHeader")
            .append("text")
              .text(function(d) { return d.district_type; });
        }
        else if (showDistType == 0) {};
      };

      drawDistType();

      // append svg

      var svg = dom.append("svg")
        .attr("class", "donutChart")
        .attr("width", width)
        .attr("height", height)
        .append("g")
          .attr("transform", "translate(" + (width/2) + "," + (height/2) + ")");

      // define arc and pie

      var arc = d3.arc()
        .innerRadius(radius/1.5)
        .outerRadius(radius);

      var pie = d3.pie()
        .value(function(d) { return d.value; })
        .sort(null);

      // draw pie

      var path = svg.selectAll("path")
        .data(pie(data))
        .enter()
          .append("path")
            .attr("d", arc)
            .attr("fill", "#bbb")
            .attr("stroke", "#000")
            .attr("stroke-width", "1px");

      // add value label

      var label = svg.append("text")
        .data(data)
        .attr("dy", "0.35em")
        .style("text-anchor", "middle")
        .text(function(d) { return formatPer(d.value); });

    })
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

  chart.showDistType = function(value) {
    if (!arguments.length) return showDistType;
    showDistType = value;
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

// Column charts

function columnChart() {

  // default values that can be changed by the caller

  var height = 400,
      marginTop = 20,
      marginRight = 20,
      marginLeft = 20,
      marginBottom = 20,
      showDistType = 0,
      chart_id = [],
      data = [];

  function chart(selection) {
    selection.each(function() {

      // number formats

      var formatNum = d3.format(",.0f"),
          formatPer = d3.format(",.0%");

      // margins and adjusted widths and heights

      var width = document.getElementById(chart_id).offsetWidth;

      var widthAdj = width - marginLeft - marginRight,
          heightAdj = height - marginTop - marginBottom;

      // axis scales

      var xScale = d3.scaleBand().rangeRound([0, widthAdj]).padding(0.1);

      // domains

      xScale.domain(data.map(function(d) { return d.category; }));

      var dom = d3.select("#" + chart_id);

      // add district type

      function drawDistType() {
        if (showDistType == 1) {
          dom.append("div")
            .data(data)
            .attr("class", "distTypeHeader")
            .append("text")
              .text(function(d) { return d.district_type; });
        }
        else if (showDistType == 0) {};
      };

      drawDistType();

      // append svg

      var svg = dom.append("svg")
        .attr("class", "columnChart")
        .attr("width", width)
        .attr("height", height)
        .append("g")
          .attr("transform", "translate(" + marginLeft + "," + marginTop + ")");

      // add axes, labels will need wrapping on the x-axis

      // wrap labels (from mbostock)

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

      svg.append("g")
        .attr("class", "xAxis")
        .attr("transform", "translate(0," + heightAdj + ")")
        .call(d3.axisBottom(xScale))
        .selectAll(".xAxis text")
          .call(wrap, xScale.bandwidth());

      // figure out max number of tspans from wrapping

			/*var tspanMax;

			function tspanMaxCount() {

				// find all tspans within the chart

				var tspans = document.getElementById(chartID).getElementsByTagName("tspan");

				// nest the tspans by the label

				var tspanNest = d3.nest()
					.key(function(d) { return d.__data__; })
					.entries(tspans);

				// find maximum length of the nested tspans

				tspanMax = d3.max(tspanNest, function(d) { return d.values.length; });

			}

			tspanMaxCount(); */

			svg.selectAll(".xAxis text")
				.attr("dy", "1.5em");

			// move the x-axis based on bottom margin

			/*var marginBottom;

			function marginBottomAdj() {
				marginBottom = tspanMax * marginBottomSpec;
			}

			marginBottomAdj();

			var	heightAdj = height - marginTop - marginBottom;

			svg.select(".xAxis").remove();

			svg.append("g")
				.attr("class", "xAxis")
				.attr("transform", "translate(0," + heightAdj + ")")
				.call(d3.axisBottom(xScale))
				.selectAll(".xAxis text")
					.call(wrap, xScale.bandwidth());*/

			// y-axis stuff depends on adjusted height

			var	yScale = d3.scaleLinear().rangeRound([heightAdj, 0]).domain([0, 1]);

      svg.append("g")
				.attr("class", "yAxis")
				.call(d3.axisLeft(yScale)
					.tickValues([0, 1])
					.tickSize(0)
					.tickFormat(d3.format(".0%")));

      // draw columns

			var cols = svg.selectAll(".column")
				.data(data);

			cols.enter()
				.append("rect")
					.attr("class", "column")
					.attr("x", function(d) { return xScale(d.category); })
					.attr("y", function(d) { return yScale(d.value); })
					.attr("width", xScale.bandwidth())
					.attr("height", function(d) { return heightAdj - yScale(d.value); });

      // add data labels

      var labels = svg.selectAll(".labels")
        .data(data);

      labels.enter()
        .append("text")
          .attr("x", function(d) { return xScale(d.category) + xScale.bandwidth()/2; })
          .attr("y", function(d) { return yScale(d.value); })
          .attr("dy", "-0.35em")
          .attr("text-anchor", "middle")
          .text(function(d) { return formatPer(d.value); });

    })
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

  chart.showDistType = function(value) {
    if (!arguments.length) return showDistType;
    showDistType = value;
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

// Diverging bar charts

function divergingBar() {

  // default values that can be changed by the caller

  var height = 400,
      marginTop = 40,
      marginRight = 20,
      marginLeft = 20,
      marginBottom = 20,
      chart_id = [],
      data = [];

  function chart(selection) {
    selection.each(function() {

      // sort data by highest mainstream

      data.sort(function(x, y) { return d3.descending(x.order, y.order); });

      // number formats

      var formatNum = d3.format(",.0f"),
          formatPer = d3.format(",.0%");

      // margins and adjusted widths and heights

      var width = document.getElementById(chart_id).offsetWidth;

      var widthAdj = width - marginLeft - marginRight,
          heightAdj = height - marginTop - marginBottom;

      // append svg

      var dom = d3.select("#" + chart_id);

      var svg = dom.append("svg")
        .attr("class", "divergingBar")
        .attr("width", width)
        .attr("height", height)
        .append("g")
          .attr("transform", "translate(" + marginLeft + "," + marginTop + ")");

      // axis scales

      var xScale = d3.scaleLinear().rangeRound([0, widthAdj]).domain([-1, 1]),
          yScale = d3.scaleBand().rangeRound([heightAdj, 0]).padding(0.1);

      // domains

      yScale.domain(data.map(function(d) { return d.category; }));

      // add axes

      svg.append("g")
        .attr("class", "xAxis")
        .attr("transform", "translate(0," + heightAdj + ")")
        .call(d3.axisBottom(xScale)
          .tickValues([-1, 0, 1])
          .tickSize(0)
          .tickFormat(d => Math.abs(100*d) + "%"));

      svg.selectAll(".xAxis text")
				.attr("dy", "1.5em");

      svg.append("g")
				.attr("class", "yAxis")
				.call(d3.axisLeft(yScale));

      // draw bars

			var bars = svg.selectAll(".bar")
				.data(data);

      // mainstream goes left

			bars.enter()
				.append("rect")
					.attr("class", "bar main")
					.attr("x", function(d) { return xScale(-1 * d.value_m); })
					.attr("y", function(d) { return yScale(d.category); })
					.attr("width", function(d) { return xScale(d.value_m - 1); })
					.attr("height", yScale.bandwidth());

      // EL specialist goes right

      bars.enter()
        .append("rect")
          .attr("class", "bar el")
          .attr("x", function(d) { return xScale(0); })
          .attr("y", function(d) { return yScale(d.category); })
          .attr("width", function(d) { return xScale(d.value_e - 1); })
          .attr("height", yScale.bandwidth());

      // add data labels

      var labels = svg.selectAll(".labels")
        .data(data);

      // mainstream

      labels.enter()
        .append("text")
          .attr("x", function(d) { return xScale(-1 * d.value_m); })
          .attr("y", function(d) { return yScale(d.category) + yScale.bandwidth()/2; })
          .attr("dx", function(d) {
            if (d.value_m > .9) { return "0.35em"; }
            else { return "-0.35em"; };
          })
          .attr("dy", "0.35em")
          .attr("text-anchor", function(d) {
            if (d.value_m > .9) { return "start"; }
            else { return "end"; };
          })
          .text(function(d) { return formatPer(d.value_m); });

      svg.append("text")
        .attr("x", function(d) { return xScale(0); })
        .attr("y", -marginTop/2)
        .attr("dx", "-0.5em")
        .attr("dy", "0.35em")
        .attr("text-anchor", "end")
        .text("Mainstream");

      // el

      labels.enter()
        .append("text")
          .attr("x", function(d) { return xScale(d.value_e); })
          .attr("y", function(d) { return yScale(d.category) + yScale.bandwidth()/2; })
          .attr("dx", function(d) {
            if (d.value_e > .9) { return "-0.35em"; }
            else { return "0.35em"; };
          })
          .attr("dy", "0.35em")
          .attr("text-anchor", function(d) {
            if (d.value_e > .9) { return "end"; }
            else { return "start"; };
          })
          .text(function(d) { return formatPer(d.value_e); });

      svg.append("text")
        .attr("x", function(d) { return xScale(0); })
        .attr("y", -marginTop/2)
        .attr("dx", "0.5em")
        .attr("dy", "0.35em")
        .attr("text-anchor", "start")
        .text("EL specialist");

    })
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
