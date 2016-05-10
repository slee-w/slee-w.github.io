// Reusable area chart function for chronic absenteeism storymap

function areaChart() {

	// Options accessible to the caller
	// These are the default values
	
	var	width = 960,
		height = 500,
		marginBottom = 20;
		data = [];
		
	var updateWidth,
		updateHeight,
		updateMarginBottom,
		updateData;
		
	function chart(selection) {
		selection.each(function() {
		
		// formats
		
		var	formatComma = d3.format(",f"),
			formatPercent = d3.format(",.1%"),
			formatPercentNoDec = d3.format(",%");
		
		// margins; adjust width and height to account for margins
		
		var margin = {top: 20, right: 20, left: 40},
			widthAdj = width - margin.left - margin.right,
			heightAdj = height - margin.top - marginBottom;		
		
		// selections
		
		var dom = d3.select(this);
		
		var svg = dom.append("svg")
			.attr("class", "col-chart")
			.attr("viewBox", "0 0 " + width + " " + height)
			.attr("preserveAspectRatio", "xMinYMin meet")
			.style("max-width", width)
			.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
		// tooltips using d3-tip
		
		var tipArea = d3.tip()
			.attr("class", "d3-tip-area")
			.offset([-10, 0])
			.html(function(d) {
	
			return formatComma(d.number) + " (" + formatPercent(d.pct) + ")";
	
		});
		
		svg.call(tipArea);
		
		// axis scales and axes
		
		var xScale = d3.scale.ordinal().rangePoints([0, widthAdj], .1),	
			yScale = d3.scale.linear().range([heightAdj, 0]),
			xAxis = d3.svg.axis().scale(xScale).orient("bottom"),
			yAxis = d3.svg.axis().scale(yScale).orient("left").tickFormat(formatPercent);
		
		// domains
		
		xScale.domain(data.map(function(d, i) { return d.level; }).values());
		yScale.domain([0, d3.max(data, function(d) { return d.pct; })]).nice();

		// define area/line
		
		var area = d3.svg.area()
			.x(function(d) { return xScale(d.level); })
			.y0(heightAdj)
			.y1(function(d) { return yScale(d.pct); });
		
		// draw area/line
		
		svg.append("path")
			.datum(data)
			.attr("class", "area")
			.attr("d", area);
		
		// draw axes
	
		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + heightAdj + ")")
			.call(xAxis)
			.selectAll(".tick text")
				.call(wrap, xScale.rangeBand());
	
		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis);
		
		// update functions
		
		updateWidth = function() {
			
			svg.attr("width", widthAdj);
			cols.attr("x", function(d, i) { return xScale(d.level); })
			cols.attr("width", xScale.rangeBand());
			
		};
			
		updateHeight = function() {
			
			svg.attr("height", heightAdj);
			cols.attr("y", function(d) { return yScale(d.pct); })
			cols.attr("height", function(d) { return heightAdj - yScale(d.pct); });
			
		};
		
		updateMarginBottom = function() {
			
			heightAdj = height - margin.top - marginBottom;
			
		};
		
		updateData = function() {
		
			xScale = d3.scale.ordinal().rangePoints([0, widthAdj], .1);
			yScale = d3.scale.linear().range([heightAdj, 0]);
			xAxis = d3.svg.axis().scale(xScale).orient("bottom");
			yAxis = d3.svg.axis().scale(yScale).orient("left");
		
			var update = svg.selectAll("path.area")
				.data(data);
				
			update.attr("d", area);
		
		};
		
	});
	
};
	
    chart.width = function(value) {
	
        if (!arguments.length) return width;
        width = value;
        if (typeof updateWidth === 'function') updateWidth();
        return chart;
		
    };

    chart.height = function(value) {
	
        if (!arguments.length) return height;
        height = value;
        if (typeof updateHeight === 'function') updateHeight();
        return chart;
		
    };

	chart.marginBottom = function(value) {
		
		if (!arguments.length) return marginBottom;
		marginBottom = value;
		if (typeof updateMarginBottom === 'function') updateMarginBottom();
		return chart;
		
	};
	
    chart.data = function(value) {
	
        if (!arguments.length) return data;
        data = value;
        if (typeof updateData === 'function') updateData();
        return chart;
		
    };
	
	return chart;
	
};

// this is for wrapping long axis labels

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
      };
    };
  });
};		