// Reusable chart function

function colChart() {
	
	// Options accessible to the caller
	// These are the default values
	
	var	margin = {top: 20, right: 20, bottom: 60, left: 40},
		width = 960 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom,
		data = [];
		
	var updateWidth,
		updateHeight,
		updateData;
		
	function chart(selection) {
		selection.each(function() {
		
		// selections
		
		var dom = d3.select(this);
		
		var svg = dom.append("svg")
			.attr("class", "col-chart")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
		// tooltips using d3-tip
		
		var tip = d3.tip()
			.attr("class", "d3-tip")
			.offset([-10, 0])
			.html(function(d) {
	
			return formatComma(d.number) + " (" + formatPercent(d.pct) + ")";
	
		});
		
		svg.call(tip);
		
		// axis scales and axes
		
		var xScale = d3.scale.ordinal().rangeRoundBands([0, width], .1),	
			yScale = d3.scale.linear().range([height, 0]),
			xAxis = d3.svg.axis().scale(xScale).orient("bottom"),
			yAxis = d3.svg.axis().scale(yScale).orient("left").tickFormat(formatPercentNoDec);
		
		// domains
		
		xScale.domain(data.map(function(d, i) { return d.group; }));
		yScale.domain([0, d3.max(data, function(d) { return d.pct; })]).nice();
	
		// draw columns
		
		var cols = svg.selectAll("rect.column")
			.data(data)
			.enter()
			.append("g")
				.attr("transform", "translate(0,0)");
		
		var max = d3.max(data, function(d) { return d.pct; });
		
		cols.append("rect")
			.attr("class","column")
			.attr("x", function(d, i) { return xScale(d.group); })
			.attr("width", xScale.rangeBand())
			.attr("y", height)
			.attr("height", 0)
			.on("mouseover", tip.show)
			.on("mouseout", tip.hide)
			.transition()
				.duration(500)
				.attr("height", function(d) { return height - yScale(d.pct); })
				.attr("y", function(d) { return yScale(d.pct); })
				
				// highlight if max
			
				.each("end", function(d) { if (d.pct == max) {
					svg.select(".column")
						.transition()
							.duration(500)
							.style("fill", "#8a89a6");
					}});
		
		// draw axes
	
		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis)
			.selectAll(".tick text")
				.call(wrap, xScale.rangeBand());
	
		yAxis.tickValues(yScale.domain());
	
		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis);
		
		// update functions
		
		updateWidth = function() {
			
			svg.attr("width", width);
			cols.attr("x", function(d, i) { return xScale(d.group); })
			cols.attr("width", xScale.rangeBand());
			
			};
			
		updateHeight = function() {
			
			svg.attr("height", height);
			cols.attr("y", function(d) { return yScale(d.pct); })
			cols.attr("height", function(d) { return height - yScale(d.pct); });
			
			};
		
		updateData = function() {
		
			xScale = d3.scale.ordinal().rangeRoundBands([0, width], .1);
			yScale = d3.scale.linear().range([height, 0]);
			xAxis = d3.svg.axis().scale(xScale).orient("bottom");
			yAxis = d3.svg.axis().scale(yScale).orient("left");
		
			var update = svg.selectAll("rect.column")
				.data(data);
				
			update.attr("x", function(d, i) { return xScale(d.group); })
				.attr("width", xScale.rangeBand())
				.attr("y", function(d) { return yScale(d.pct); })
				.attr("height", function(d) { return height- yScale(d.pct); })
		
			update.enter()
				.append("rect")
				.attr("class","column")
				.attr("x", function(d, i) { return xScale(d.group); })
				.attr("width", xScale.rangeBand())
				.attr("y", function(d) { return yScale(d.pct); })
				.attr("height", function(d) { return height- yScale(d.pct); });
		
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

    chart.data = function(value) {
	
        if (!arguments.length) return data;
        data = value;
        if (typeof updateData === 'function') updateData();
        return chart;
		
    };
	
	return chart;
	
};