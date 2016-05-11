// Reusable dot plot function for chronic absenteeism story map

function dotPlot() {
	
	// Options accessible to the caller
	// These are the default values
	
	var	width = 960,
		height = 500,
		marginLeft = 100,
		dotSize = 25,
		data = [];
		
	var updateWidth,
		updateHeight,
		updateMarginLeft,
		updateDotSize,
		updateData;
		
	function chart(selection) {
		selection.each(function() {
		
		// formats
		
		var	formatComma = d3.format(",f"),
			formatPercent = d3.format(",.1%"),
			formatPercentNoDec = d3.format(",%");
		
		// margins; adjust width and height to account for margins
		
		var margin = {top: 20, right: 20, bottom: 60},
			widthAdj = width - marginLeft - margin.right,
			heightAdj = height - margin.top - margin.bottom;

		// selections
		
		var dom = d3.select(this);
		
		var svg = dom.append("svg")
			.attr("class", "dotPlot")
			.attr("viewBox", "0 0 " + width + " " + height)
			.attr("preserveAspectRatio", "xMinYMin meet")
			.style("max-width", width)
			.append("g")
				.attr("transform", "translate(" + marginLeft + "," + margin.top + ")");
		
		// tooltips using d3-tip
		
		var tipDot = d3.tip()
			.attr("class", "d3-tip-dot")
			.direction("e")	
			.offset([0, 10])
			.html(function(d) {
	
			return formatComma(d.var2) + " (" + formatPercent(d.var3) + ")";
	
		});
		
		svg.call(tipDot);
		
		// axis scales and axes
		
		var xScale = d3.scale.linear().range([0, widthAdj]),	
			yScale = d3.scale.ordinal().rangeRoundBands([0, heightAdj], .1),
			xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickFormat(formatPercent),
			yAxis = d3.svg.axis().scale(yScale).orient("left");
		
		// domains
		
		xScale.domain([0, d3.max(data, function(d) { return d.var3; })]).nice();
		yScale.domain(data.map(function(d, i) { return d.var1; }));
	
		// draw dots and lines
		
		var lines = svg.selectAll("line.dotLine")
			.data(data)
			.enter()
			.append("g")
				.attr("transform", "translate(0,0");
				
		lines.append("line")
			.attr("class", "dotLine")
			.attr("x1", 0)
			.attr("y1", function(d) { return yScale (d.var1) + (yScale.rangeBand() / 2); })
			.attr("y2", function(d) { return yScale (d.var1) + (yScale.rangeBand() / 2); })
			.transition()
				.duration(500)
				.attr("x2", function(d) { return xScale(d.var3); });
				
		var dots = svg.selectAll("circle.dot")
			.data(data)
			.enter()
			.append("g")
				.attr("transform", "translate(0,0)");
					
		dots.append("circle")
			.attr("class","dot")
			.attr("cx", 0)
			.attr("cy", function(d) { return yScale(d.var1) + (yScale.rangeBand() / 2); })
			.attr("r", 0)
			.on("mouseover", tipDot.show)
			.on("mouseout", tipDot.hide)
			.transition()
				.duration(500)
				.attr("cx", function(d) { return xScale(d.var3); })
				.attr("r", dotSize);
											
				// highlight if max
			
				//.each("end", function(d) { if (d.var3 == maxValue) {
				//	d3.select(this)
				//		.transition()
				//			.duration(500)
				//			.attr("class", "bar max");
				//}});
		
		// draw axes
	
		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + heightAdj + ")")
			.call(xAxis);
	
		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
			//.selectAll(".tick text") 
			//	.call(wrap, marginLeft - 10);
		
		// update functions
		
		updateWidth = function() {
			
			svg.attr("width", widthAdj);
			dots.attr("cx", function(d) { return xScale(d.var3); });
			
		};
			
		updateHeight = function() {
			
			svg.attr("height", heightAdj);
			dots.attr("cy", function(d) { return yScale.rangeBand(); });
						
		};
		
		updateMarginLeft = function() {
			
			widthAdj = width - marginLeft - margin.right;
			
		};
		
		updateDotSize = function() {
			
			dots.attr("r", dotSize);
			
		};
		
		updateData = function() {
		
		var xScale = d3.scale.linear().range([0, widthAdj]),	
			yScale = d3.scale.ordinal().rangeRoundBands([0, heightAdj], .1),
			xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickFormat(formatPercent),
			yAxis = d3.svg.axis().scale(yScale).orient("left");
		
			var update = svg.selectAll("circle.dot")
				.data(data);
				
			update.attr("cx", function(d) { return xScale(d.var3); })
				.attr("cy", 0)
				.attr("r", dotSize)
		
			update.append("circle")
				.attr("class","dot")
				.attr("cx", function(d) { return xScale(d.var3); })
				.attr("cy", 0)
				.attr("r", dotSize)
		
			update.exit()
				.remove();
		
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

	chart.marginLeft = function(value) {
		
		if (!arguments.length) return marginLeft;
		marginLeft = value;
		if (typeof updateMarginLeft === 'function') updateMarginLeft();
		return chart;
		
	};
	
	chart.dotSize = function(value) {
		
		if (!arguments.length) return dotSize;
		dotSize = value;
		if (typeof updateDotSize === 'function') updateDotSize();
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
// need to examine this for bar charts because it's causing some unintended side effects...

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
};