// Heatmaps
function heatmap() {

  // default values that can be changed by the caller

  var boxSize = 20,
      dataType = "all",
      chartId = [],
      data = [];

  function chart(selection) {
    selection.each(function() {
      // get total number of speakers to determine height
      var speakers = d3.nest()
        .key((d) => { return d.Speaker; })
        .entries(data);

      var totalSpeakers = speakers.length;

      // get episode count to determine width
      data.forEach((d) => {
        if (dataType === "all") { d.EpisodeNumber = d.SeriesNumber; }
        else { d.EpisodeNumber = d.Episode; };
      });

      var episodes = d3.nest()
        .key((d) => { return d.EpisodeNumber; })
        .entries(data);

      var totalEpisodes = episodes.length;

      // set dimensions
      var margin = {top: 20, right: 20, bottom: 20, left: 60},
          height = totalSpeakers * boxSize,
          width = totalEpisodes * boxSize,
          totalHeight = height + margin.top + margin.bottom,
          totalWidth = width + margin.left + margin.right;

      var formatPer = d3.format(".0%");

      // axes
      var yScale = d3.scaleBand().rangeRound([0, height]).domain(data.map((d) => { return d.Speaker; }));
      var yAxis = d3.axisLeft().scale(yScale);

      var xScale = d3.scaleBand().rangeRound([0, width]).domain(data.map((d) => { return d.EpisodeNumber; }));
      var xAxis = d3.axisTop().scale(xScale);

      // div for tooltips
      var div = d3.select("body").append("div")
        .attr("id", "tooltip" + chartId)
        .attr("class", "tooltip")
        .style("opacity", 0);

      // svg
      var zoom = d3.zoom()
        .scaleExtent([1, 1])
        .on('zoom', zoomFunction);

      var svg = d3.select("#" + chartId)
        .append("svg")
          .attr("width", 960)
          .attr("height", totalHeight)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(zoom);

      svg.append("clipPath")
        .attr("id", "clip" + chartId)
        .append("rect")
          .attr("x", 0)
          // Stretch to cover x axis
          .attr("y", -margin.top)
          .attr("width", width)
          .attr("height", height + margin.top);

      // add axes
      svg.append("g")
        .attr("transform", "translate(0,0)")
        .attr("class", "y axis")
        .call(yAxis);

      var viewBox = svg.append("g")
        .attr("clip-path", "url(#clip" + chartId + ")");

      var scrollable = viewBox.append("g")
      .attr("width", width);

      scrollable.append("g")
        .attr("transform", "translate(0,0)")
        .attr("class", "x axis")
        .call(xAxis);

      // color gradient
      var color = d3.scaleLinear()
        .domain([0, 0.5])
        .range(["#fafafa", "#000857"])

      // add boxes
      var boxes = scrollable.selectAll(".box")
        .data(data);

      boxes.enter()
        .append("rect")
          .attr("class", "box")
          .attr("x", (d) => { return xScale(d.EpisodeNumber); })
          .attr("width", boxSize-1)
          .attr("y", (d) => { return yScale(d.Speaker) ;})
          .attr("height", boxSize-1)
          .attr("fill", (d) => { return color(d.EpisodePct); })
          .on("mouseover", function(d) {
            div.transition()
              .duration(100)
              .style("opacity", .9);

            div.html("<strong>" + d.Speaker + "</strong> (Season " + d.Season + ", Episode " + d.Episode + "): " + formatPer(d.EpisodePct))
              .style("left", (d3.event.pageX + boxSize) + "px")
              .style("top", (d3.event.pageY - boxSize) + "px");
            })
          .on("mouseout", function(d) {
          div.transition()
            .duration(100)
            .style("opacity", 0);
          });

      // zoom

      function zoomFunction() {
        scrollable.attr("transform", "translate(" + d3.event.transform.x + ",0)");
      };

      // update data on toggle
      function updateData() { };

    });
  };

  // these allow the default values to be changed
  chart.boxSize = function(value) {
    if (!arguments.length) return boxSize;
    boxSize = value;
    return chart;
  };

  chart.dataType = function(value) {
    if (!arguments.length) return dataType;
    dataType = value;
    return chart;
  };

  chart.chartId = function(value) {
    if (!arguments.length) return chartId;
    chartId = value;
    return chart;
  };

  chart.data = function(value) {
    if (!arguments.length) return data;
    data = value;
    return chart;
  };

  return chart;

};
