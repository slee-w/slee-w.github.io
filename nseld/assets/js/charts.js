// Tree diagram
// Based on https://bl.ocks.org/d3noob/e7e37cfe0e8763cb0915dee33cc2a24b

function treeDiagram() {

  // default values that can be changed by the caller

  var width = 750,
      height = 400,
      marginTop = 20,
      marginRight = 20,
      marginLeft = 20,
      marginBottom = 20,
      chart_id = [],
      data = [];

  function chart(selection) {
    selection.each(function() {

      // number formats

      var formatNum = d3.format(",.0f");

      // margins and adjusted widths and heights

      var widthAdj = width - marginLeft - marginRight,
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
    width = value;
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

  var width = 240,
      height = 240,
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

  chart.width = function(value) {
    if (!arguments.length) return width;
    width = value;
    return chart;
  };

  chart.height = function(value) {
    if (!arguments.length) return height;
    width = value;
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
