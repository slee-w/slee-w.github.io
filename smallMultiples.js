// Reusable dot plot small multiples function for chronic absenteeism story map

function smallMultiples() {

	// Options accessible to the caller
	// These are the default values
	
	var	width = 250,
		height = 200,
		marginLeft = 30,
		marginBottom = 50,
		dotSize = 5,
		animateTime = 1000,
		data = [];
		
	var updateWidth,
		updateHeight,
		updateMarginLeft,
		updateMarginBottom,
		updateDotSize,
		updateAnimateTime,
		updateData;
		
	function chart(selection) {
		selection.each(function() {
		
		// formats
		
		var	formatComma = d3.format(",f"),
			formatPercent = d3.format(",.1%"),
			formatPercentNoDec = d3.format(",%");
		
		// margins; adjust width and height to account for margins
		
		var margin = {top: 20, right: 20},
			widthAdj = width - marginLeft - margin.right,
			heightAdj = height - margin.top - marginBottom;

		// nest the data
		
		var nest = d3.nest()
			.key(function(d) { return d.var2; })
			.entries(data);
			
		// selections
		
		var dom = d3.select(this);
			
		var svg = dom.selectAll("svg.dotPlotSM")
			.data(nest)
			.enter()
			.append("svg")
				.attr("class", "dotPlotSM")
				.attr("viewBox", "0 0 " + width + " " + height)
				.attr("preserveAspectRatio", "xMinYMin meet")
				.style({
					"max-width": width,
					"max-height": height
				})
				.append("g")
					.attr("transform", "translate(" + marginLeft + "," + margin.top + ")");
		
		// tooltips using d3-tip
		
		var tipDotSM = d3.tip()
			.attr("class", "d3-tip-dotSM")
			.direction("e")	
			.offset([0, 10])
			.html(function(d) {
	
			return formatComma(d.var3) + " (" + formatPercent(d.var4) + ")";
	
		});
		
		svg.call(tipDotSM);
		
		// axis scales
		
		var xScale = d3.scale.linear().range([0, widthAdj]),	
			yScale = d3.scale.ordinal().rangeRoundBands([0, heightAdj], .1);
			
		// domains (these must be the same across all multiples, so calculate across non-nested dataset)
		
		xScale.domain([0, d3.max(data, function(d) { return d.var4; })]).nice(),
		yScale.domain(data.map(function(d) { return d.var1; }));
		
		// axes
		
		var xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickFormat(formatPercent).tickValues(xScale.domain()),
			yAxis = d3.svg.axis().scale(yScale).orient("left");
		
		// draw dotsSM and linesSM
		
		var linesSM = svg.selectAll("line.dotLineSM")
			.data(function(d) { return d.values; })
			.enter()
			.append("g")
				.attr("transform", "translate(0,0)");
				
		linesSM.append("line")
			.attr("class", "dotLineSM")
			.attr("x1", 0)
			.attr("x2", 0)
			.attr("y1", function(d) { return yScale(d.var1) + (yScale.rangeBand() / 2); })
			.attr("y2", function(d) { return yScale(d.var1) + (yScale.rangeBand() / 2); })
			.transition()
				.duration(animateTime)
				.attr("x2", function(d) { return xScale(d.var4); });
				
		var dotsSM = svg.selectAll("circle.dotSM")
			.data(function(d) { return d.values; })
			.enter()
			.append("g")
				.attr("transform", "translate(0,0)");
		
		var max = d3.max(nest, function(d) { return d.values.var4; });
		
		dotsSM.append("circle")
			.attr("class", "dotSM")
			.attr("clip-path", "url(#clip)")
			.attr("cx", 0)
			.attr("cy", function(d) { return yScale(d.var1) + (yScale.rangeBand() / 2); })
			.attr("r", 3)
			.on("mouseover", tipDotSM.show)
			.on("mouseout", tipDotSM.hide)
			.transition()
				.duration(animateTime)
				.attr("cx", function(d) { return xScale(d.var4); })
				.each("end", function(d) { 
					d3.select(this)
						.transition()
							.duration(animateTime)
							.attr("r", dotSize)
								
							// highlight if max
							
							.each("end", function(d) { if (d.var4 == d3.max(d.var4)) {
								d3.select(this)
									.transition()
										.duration(animateTime)
										.attr("class", "dotSM max")
							}});
				});
											
		// add clip path
		
		svg.append("defs")
			.append("clipPath")
				.attr("id", "clip")
					.append("rect")
						.attr("width", widthAdj)
						.attr("height", heightAdj);
		
		// add group labels
		
		svg.append("text")
			.attr("x", (width / 2) - marginLeft)
			.attr("y", -margin.top / 2)
			.attr("text-anchor", "middle")
			.attr("class", "labelSM")
			.text(function(d) { return d.key; });
		
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
			dotsSM.attr("cx", function(d) { return xScale(d.var4); });
			d3.select("#clip.rect").attr("width", widthAdj);
			
		};
			
		updateHeight = function() {
			
			svg.attr("height", heightAdj);
			dotsSM.attr("cy", function(d) { return yScale.rangeBand(); });
			d3.select("#clip.rect").attr("height", heightAdj);
						
		};
		
		updateMarginLeft = function() {
			
			widthAdj = width - marginLeft - margin.right;
			
		};

		updateMarginBottom = function() {
			
			heightAdj = width - margin.top - marginBottom;
			
		};
		
		updateDotSize = function() {
			
			dotsSM.attr("r", dotSize);
			
		};
		
		updateAnimateTime = function() {
			
			linesSM.transition().duration(animateTime);
			dotsSM.transition().duration(animateTime);
		
		};
		
		updateData = function() {
		
		var xScale = d3.scale.linear().range([0, widthAdj]),	
			yScale = d3.scale.ordinal().rangeRoundBands([0, heightAdj], .1),
			xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickFormat(formatPercent),
			yAxis = d3.svg.axis().scale(yScale).orient("left");
		
			var update = svg.selectAll("circle.dotSM")
				.data(function(d) { return d.values; });
				
			update.attr("cx", function(d) { return xScale(d.var4); })
				.attr("cy", 0)
				.attr("r", dotSize)
		
			update.append("circle")
				.attr("class","dotSM")
				.attr("cx", function(d) { return xScale(d.var4); })
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

	chart.marginBottom = function(value) {
		
		if (!arguments.length) return marginBottom;
		marginBottom = value;
		if (typeof updateMarginBottom === 'function') updateMarginBottom();
		return chart;
		
	};
	
	chart.dotSize = function(value) {
		
		if (!arguments.length) return dotSize;
		dotSize = value;
		if (typeof updateDotSize === 'function') updateDotSize();
		return chart;
		
	};
	
	chart.animateTime = function(value) {
		
		if (!arguments.length) return animateTime;
		animateTime = value;
		if (typeof updateAnimateTime === 'function') updateAnimateTime();
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
// need to examine this for horizontal charts because it's causing some unintended side effects...

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