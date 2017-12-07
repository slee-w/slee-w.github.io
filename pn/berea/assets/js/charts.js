// Donut charts

/*function donutChart() {

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

      var distType = dom.selectAll(".distType")
        .data(data);

      function drawDistType() {
        if (showDistType == 1) {
          distType.enter()
            .filter(function(d, i) { return i == 0; })
            .append("div")
              .style("display", "inline-block")
              .style("width", "100%")
              .style("text-align", "center")
              .style("margin-top", "15px")
              .attr("class", function(d) { return "donutChart distType"; })
              .append("text")
                .style("font-weight", "bold")
                .attr("class", function(d) { return d.district_type.toLowerCase(); })
                .text(function(d) { return d.district_type.toUpperCase(); });
          }
          else {};
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
            .attr("class", function(d, i) {
              if (i == 0) { return "arc " + d.data.district_type.toLowerCase(); }
              else { return "arc" };
            });

      // add value label

      var label = svg.selectAll("text")
        .data(data)
        .enter()
          .filter(function(d, i) { return i == 0; })
          .append("g");

      label.append("text")
        .attr("class", function(d) { return "valueLabel " + d.district_type.toLowerCase(); })
        .attr("dy", "0.2em")
        .attr("text-anchor", "middle")
        .text(function(d) { return formatPer(d.value); });

      label.append("text")
          .attr("class", function(d) { return d.district_type.toLowerCase(); })
          .attr("dy", "3em")
          .attr("text-anchor", "middle")
          .style("font-weight", "bold")
          .text(function(d) { return d.category.toUpperCase(); });

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

};*/

// Column charts

function columnChart() {

  // default values that can be changed by the caller

  var height = 400,
      marginTop = 20,
      marginRight = 0,
      marginLeft = 0,
      marginBottom = 20,
      /*showDistType = 0,*/
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

      var xScale = d3.scaleBand().rangeRound([0, widthAdj]).padding(0.25);

      // domains

      xScale.domain(data.map(function(d) { return d.category; }));

      var dom = d3.select("#" + chart_id);

      // append svg

      var svg = dom.append("svg")
        .attr("id", chart_id + "_svg")
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

      /*svg.append("g")
				.attr("class", "yAxis")
				.call(d3.axisLeft(yScale)
					.tickValues([0, 1])
					.tickSize(0)
					.tickFormat(d3.format(".0%")));*/

      // draw columns

			var cols = svg.selectAll(".column")
				.data(data);

			cols.enter()
				.append("rect")
					.attr("class", function(d) { return "column " + d.district_type.toLowerCase(); })
					.attr("x", function(d) { return xScale(d.category); })
					.attr("y", function(d) { return yScale(d.value); })
					.attr("width", xScale.bandwidth())
					.attr("height", function(d) { return heightAdj - yScale(d.value); });

      // add data labels

      var labels = svg.selectAll(".label")
        .data(data);

      labels.enter()
        .append("text")
          .attr("class", function(d) { return "label " + d.district_type.toLowerCase(); })
          .attr("x", function(d) { return xScale(d.category) + xScale.bandwidth()/2; })
          .attr("y", function(d) { return yScale(d.value); })
          .attr("dy", "-0.35em")
          .attr("text-anchor", "middle")
          .text(function(d) { return formatPer(d.value); });

      // add district type

      /*var distType = svg.selectAll(".distType")
        .data(data);

      function drawDistType() {
        if (showDistType == 1) {
          distType.enter()
            .append("text")
              .filter(function(d, i) { return i == 0; })
              .attr("class", function(d) { return "distType " + d.district_type.toLowerCase(); })
              .attr("x", widthAdj/2)
              .attr("y", 0)
              .attr("dy", -marginTop/2)
              .attr("text-anchor", "middle")
              .style("font-weight", "bold")
              .text(function(d) { return d.district_type.toUpperCase(); });
          }
          else { };
      };

      drawDistType();*/

      // save function
      // push CSS styles into defs based on https://stackoverflow.com/a/41998045

      /*function getCSS(file) {

      var rawFile = new XMLHttpRequest();
      var allText = '';
          rawFile.open("GET", file, false);
          rawFile.onreadystatechange = function () {
              if(rawFile.readyState === 4) {
                  if(rawFile.status === 200 || rawFile.status == 0) {
                      allText = rawFile.responseText;
                  }
              }
          };
          rawFile.send(null);
          return allText;

      };

      var svg_style = getCSS('assets/css/main.css');

      dom.select("svg")
        .append("defs")
          .append("style")
            .attr("type", "text/css")
            .html("\n<![CDATA[" + svg_style + "]]>\n");

      // add save button
      // use http://krunkosaurus.github.io/simg/ to convert to PNG for download

      var save = dom.append("div")
        .attr("class", "export_div")
        .append("button")
          .attr("id", chart_id + "_save")
          .attr("class", "export_button")
          .text("Save as PNG");

      var svgElement = document.getElementById(chart_id + "_svg");

      document.getElementById(chart_id + "_save").onclick = function(){
        var simg = new Simg(svgElement);
        // Replace the current SVG with an image version of it.
        simg.replace();
        // And trigger a download of the rendered image.
        simg.download(chart_id);
      };*/

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

  /*chart.showDistType = function(value) {
    if (!arguments.length) return showDistType;
    showDistType = value;
    return chart;
  };*/

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

// Slopegraphs

function slopeGraph() {

  // default values that can be changed by the caller

  var height = 400,
      marginTop = 40,
      marginRight = 0,
      marginLeft = 0,
      marginBottom = 0,
      dotSize = 5,
      yMax = 1,
      percNum = 0, // 0 = perc, 1 = num
      center_multiplier = 0.5,
      group1 = [],
      group2 = [],
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
          heightAdj = height - marginTop - marginBottom,
          centerSpace = widthAdj*center_multiplier;

      // append svg

      var dom = d3.select("#" + chart_id);

      var svg = dom.append("svg")
        .attr("id", chart_id + "_svg")
        .attr("class", "slopeGraph")
        .attr("width", width)
        .attr("height", height)
        .append("g")
          .attr("transform", "translate(" + marginLeft + "," + marginTop + ")");

      // axis scales
      // only need y-axis, the x-spacing is defined manually
      // no need to draw the actual axis

      var yScale = d3.scaleLinear().rangeRound([heightAdj, 0]).domain([0, yMax]);

      // add group lines below chart elements

      svg.append("line")
        .attr("class", "groupLine")
        .attr("x1", (widthAdj/2) - (centerSpace/2))
        .attr("x2", (widthAdj/2) - (centerSpace/2))
        .attr("y1", 0)
        .attr("y2", heightAdj);

      svg.append("line")
        .attr("class", "groupLine")
        .attr("x1", (widthAdj/2) + (centerSpace/2))
        .attr("x2", (widthAdj/2) + (centerSpace/2))
        .attr("y1", 0)
        .attr("y2", heightAdj);

      // add lines

      var lines = svg.selectAll(".line")
        .data(data);

      lines.enter()
        .append("line")
          .attr("class", "line")
          .attr("x1", (widthAdj/2) - (centerSpace/2))
          .attr("x2", (widthAdj/2) + (centerSpace/2))
          .attr("y1", function(d) { return yScale(d.value_1); })
          .attr("y2", function(d) { return yScale(d.value_2); });

      // add circles
      // mainstream on left
      // el on right

      var circles = svg.selectAll(".dot")
        .data(data);

      circles.enter()
        .append("circle")
          .attr("class", "dot group1")
          .attr("cx", (widthAdj/2) - (centerSpace/2))
          .attr("cy", function(d) { return yScale(d.value_1); })
          .attr("r", dotSize);

      circles.enter()
        .append("circle")
          .attr("class", "dot group2")
          .attr("cx", (widthAdj/2) + (centerSpace/2))
          .attr("cy", function(d) { return yScale(d.value_2); })
          .attr("r", dotSize);

      // add labels
      // mainstream on left
      // el on right

      var labels = svg.selectAll(".label")
        .data(data);

      labels.enter()
        .append("text")
          .attr("class", "label group1")
          .attr("x", (widthAdj/2) - (centerSpace/2))
          .attr("y", function(d) { return yScale(d.value_1); })
          .attr("dx", "-1em")
          .attr("dy", "0.35em")
          .attr("text-anchor", "end")
          .text(function(d) {
            if (percNum == 1) { return formatNum(d.value_1); }
            else { return formatPer(d.value_1); }
          });

      labels.enter()
        .append("text")
          .attr("class", "label group2")
          .attr("x", (widthAdj/2) + (centerSpace/2))
          .attr("y", function(d) { return yScale(d.value_2); })
          .attr("dx", "1em")
          .attr("dy", "0.35em")
          .attr("text-anchor", "start")
          .text(function(d) {
            if (percNum == 1) { return formatNum(d.value_2); }
            else { return formatPer(d.value_2); }
          });

      // group labels

      svg.append("text")
        .attr("class", "label group1")
        .attr("x", (widthAdj/2) - (centerSpace/2))
        .attr("y", -marginTop/2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .style("font-weight", "bold")
        .text(group1);

      svg.append("text")
        .attr("class", "label group2")
        .attr("x", (widthAdj/2) + (centerSpace/2))
        .attr("y", -marginTop/2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .style("font-weight", "bold")
        .text(group2);

      /*// save function
      // push CSS styles into defs based on https://stackoverflow.com/a/41998045

      function getCSS(file) {

      var rawFile = new XMLHttpRequest();
      var allText = '';
          rawFile.open("GET", file, false);
          rawFile.onreadystatechange = function () {
              if(rawFile.readyState === 4) {
                  if(rawFile.status === 200 || rawFile.status == 0) {
                      allText = rawFile.responseText;
                  }
              }
          };
          rawFile.send(null);
          return allText;

      };

      var svg_style = getCSS('assets/css/main.css');

      dom.select("svg")
        .append("defs")
          .append("style")
            .attr("type", "text/css")
            .html("\n<![CDATA[" + svg_style + "]]>\n");

      // add save button
      // use http://krunkosaurus.github.io/simg/ to convert to PNG for download

      var save = dom.append("div")
        .attr("class", "export_div")
        .append("button")
          .attr("id", chart_id + "_save")
          .attr("class", "export_button")
          .text("Save as PNG");

      var svgElement = document.getElementById(chart_id + "_svg");

      document.getElementById(chart_id + "_save").onclick = function(){
        var simg = new Simg(svgElement);
        // Replace the current SVG with an image version of it.
        simg.replace();
        // And trigger a download of the rendered image.
        simg.download(chart_id);
      };*/

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

  chart.dotSize = function(value) {
    if (!arguments.length) return dotSize;
    dotSize = value;
    return chart;
  };

  chart.center_multiplier = function(value) {
    if (!arguments.length) return center_multiplier;
    center_multiplier = value;
    return chart;
  };

  chart.yMax = function(value) {
    if (!arguments.length) return yMax;
    yMax = value;
    return chart;
  };

  chart.percNum = function(value) {
    if (!arguments.length) return percNum;
    percNum = value;
    return chart;
  };

  chart.group1 = function(value) {
    if (!arguments.length) return group1;
    group1 = value;
    return chart;
  };

  chart.group2 = function(value) {
    if (!arguments.length) return group2;
    group2 = value;
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

  var width = 150,
      height = 240,
      marginTop = 0,
      marginRight = 20,
      marginLeft = 20,
      marginBottom = 0,
      showDistType = 0,
      chart_id = [],
      data = [];

  function chart(selection) {
    selection.each(function() {

      // number formats

      var formatNum = d3.format(",.0f"),
          formatPer = d3.format(",.0%");

      // margins and adjusted widths and heights

      /*var width = document.getElementById(chart_id).offsetWidth;*/

      var widthAdj = width - marginLeft - marginRight,
          heightAdj = height - marginTop - marginBottom,
          radius = Math.min(widthAdj, heightAdj)/2;

      var dom = d3.select("#" + chart_id);

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
        .value(function(d) { return d.value_1; })
        .sort(null);

      // draw pie

      var path = svg.selectAll("path")
        .data(pie(data))
        .enter()
          .append("path")
            .attr("d", arc)
            .attr("class", function(d, i) {
              if (i == [data.length - 1]) { return "arc_last"; }
              else { return "arc" + i; };
            });

      // add value label

      var label = svg.selectAll("text")
        .data(data)
        .enter()
          .filter(function(d, i) { return i == 0; })
          .append("g");

      label.append("text")
        .attr("class", "valueLabel")
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .text(function(d) { return formatPer(d.value_1); });

    })
  };

  // these allow the default values to be changed

  chart.width = function(value) {
    if (!arguments.length) return width;
    width = value;
    return chart;
  };

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
