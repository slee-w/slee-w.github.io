// Grouped bar chart function

function groupedBar() {
	
	// Options accessible to the caller
	// These are the default values
	
	var	width = 960,
		height = 650,
		marginTop = 40,
		marginLeft = 100,
		marginBottom = 40,
		animateTime = 1000,
		barWidth = 15,
		title1 = "Generic chart title #1. Update me using .title1()!",
		title2 = "Generic chart title #2. Update me using .title2()!",
		title3 = "Generic chart title #3. Update me using .title3()!",
		title4 = "Generic chart title #4. Update me using .title4()!",
		containerID = [],
		chartID = [],
		sectionID = [],
		data = [];
		
	var updateWidth,
		updateHeight,
		updateMarginTop,
		updateMarginLeft,
		updateMarginBottom,
		updateAnimateTime,
		updateTitle,
		updateContainerID,
		updateChartID,
		updateSectionID,
		updateData;
		
	function chart(selection) {
		selection.each(function() {
		
		// filter data for default to show r/e categories
		
		var subChartID = 1;
		
		dataFiltered = data.filter(function(d) { return d.subchart == subChartID; });
		
		// formats
		
		var	formatNumber = d3.format(",f"),
			formatPercent = d3.format(",.1%");
					
		// margins; adjust width and height to account for margins
	
		var margin = {right: 20},
			widthAdj = width - marginLeft - margin.right,
			heightAdj = height - marginTop - marginBottom;

		// buttons for filtering

		var buttons = d3.select(this)
			.append("div")
			.style({
					"max-width": width + "px",
					"margin": "0 auto"
				})
				.attr("id", "buttons")
				.attr("class", "filters")
				.html("Show data by: ");
		
		d3.select("#buttons")
			.append("button")
			.attr("class", "filterButton")
			.text("Group 1")
			.on("click", function() { 
			
				updateData(1); 
				updateTitle(1);
				
			});
	
		d3.select("#buttons")
			.append("button")
			.attr("class", "filterButton")
			.text("Group 2")
			.on("click", function() { 
			
				updateData(2); 
				updateTitle(2);
				
			});
			
		d3.select("#buttons")
			.append("button")
			.attr("class", "filterButton")
			.text("Group 3")
			.on("click", function() { 
			
				updateData(3); 
				updateTitle(3);
				
			});

		d3.select("#buttons")
			.append("button")
			.attr("class", "filterButton")
			.text("Group 4")
			.on("click", function() { 
			
				updateData(4); 
				updateTitle(4);
				
			});

		d3.select("#buttons")
			.append("p");
			
		// selections
			
		var dom = d3.select(this)
			.append("div")
			.attr("id", chartID)
				.style({
					"max-width": width + "px",
					"margin": "0 auto"
				})
				.append("div")
					.style({
						"width": "100%",
						"max-width": width + "px",
						"height": 0,
						"max-height": height + "px",
						"padding-top": (100*(height/width)) + "%",
						"position": "relative",
						"margin": "0 auto"
					});				
		
		var svg = dom.append("svg")
			.attr("class", "groupedBar")
			.attr("viewBox", "0 0 " + width + " " + height)
			.attr("preserveAspectRatio", "xMinYMin meet")
			.style({
				"max-width": width,
				"max-height": height,
				"position": "absolute",
				"top": 0,
				"left": 0,
				"width": "100%",
				"height": "100%"
			})
			.append("g")
				.attr("transform", "translate(" + marginLeft + "," + marginTop + ")");
					
		// tooltips using d3-tip
		
		var tipBar = d3.tip()
			.attr("class", "d3-tip-bar")
			.direction("e")	
			.offset([0, 10])
			.html(function(d) {
	
			return d.level + "</br>" + formatNumber(d.number) + " (" + formatPercent(d.pct) + ")";
	
		});
		
		svg.call(tipBar);
		
		// axis scales
		
		var xScale = d3.scale.linear().range([0, widthAdj - 100]),	
			yScale0 = d3.scale.ordinal().rangeRoundBands([0, heightAdj], 0.15),
			yScale1 = d3.scale.ordinal();
		
		var color = d3.scale.ordinal().range(["rgb(239, 142, 173)", "rgb(213, 161, 102)", "rgb(122, 186, 127)", "rgb(0, 189, 213)", "#DDD"]);
		
		// domains
		
		data_nest = d3.nest()
			.key(function(d) { return d.group; })
			.entries(dataFiltered);
					
		var levels = ["Level 1","Level 2","Level 3","Level 4"];
			
		xScale.domain([0, d3.max(data, function(d) { return d.pct; })]).nice();
		yScale0.domain(data_nest.map(function(d) { return d.key; }));		
		yScale1.domain(levels).rangeRoundBands([0, yScale0.rangeBand()], 0.15);
		
		// axes
		
		function formatValueAxis(d) {
			
			var TickValue = formatNumber(d * 100);
			
			return TickValue;
			
		};
		
		var xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickFormat(formatValueAxis).tickSize(-1 * heightAdj),
			yAxis = d3.svg.axis().scale(yScale0).orient("left");
					
		// draw x-axis below bars
	
		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + heightAdj + ")")
			.call(xAxis)
	
		svg.append("text")
			.attr("class", "x axis")
			.attr("x", widthAdj - 100)
			.attr("dx", "0.5em")
			.attr("y", heightAdj)
			.attr("dy", "2em")
			.attr("text-anchor", "end")
			.text("Percent");

		// draw national bars

		data_national = dataFiltered.filter(function(d) { return d.level == "Overall"; });
		
		var nationalBar = svg.selectAll(".national-bar")
			.data(data_national);
		
		nationalBar.enter()
			.append("g")
				.attr("transform", "translate(0,0)")
				.append("rect")
					.attr("class","national-bar")
					.attr("x", 0)
					.attr("width", 0)
					.attr("y", function(d) { return yScale0(d.group); })
					.attr("height", yScale0.rangeBand())
					.on("mouseover", tipBar.show)
					.on("mouseout", tipBar.hide);

		// draw level bars

		data_noavg = dataFiltered.filter(function(d) { return d.level != "Overall"; });
		
		data_nest_noavg = d3.nest()
			.key(function(d) { return d.group; })
			.entries(data_noavg);
		
		var group = svg.selectAll(".group")
			.data(data_nest_noavg, function(d) { return d.key; });

		group.enter()
			.append("g")
				.attr("class", "group")
				.attr("transform", function(d) { return "translate(0," + yScale0(d.key) + ")"; });	
				
		var levelBars = group.selectAll(".bar")
			.data(function(d) { return d.values; });
				
		levelBars.enter()
			.append("rect")
				.attr("class", "bar")
				.attr("x", 0)
				.attr("width", 0)
				.attr("y", function(d) { return yScale1(d.level); })
				.attr("height", 0)
				.style("fill", function(d) { return color(d.level); })
				.on("mouseover", tipBar.show)
				.on("mouseout", tipBar.hide);
			
		var gs = graphScroll()
			.container(d3.select("#container"))
			.graph(d3.selectAll("#" + chartID))
			.sections(d3.selectAll("#chapters > div"))
			.on("active", function() { 
				if (document.getElementById(containerID).className == "graph-scroll-active") {
					
					svg.selectAll(".national-bar")
						.transition()
							.duration(animateTime)
							.attr("width", function(d) { return xScale(d.pct); });

					svg.selectAll(".bar")
						.transition()
							.delay(animateTime / 2)
							.duration(animateTime)
							.attr("width", function(d) { return xScale(d.pct); })
							.attr("height", yScale1.rangeBand());
							
			}});

		// draw y-axis above bars
		
		svg.append("g")
			.attr("class", "y axis")
			.style("opacity", 0)
			.call(yAxis)
			.transition()
				.duration(animateTime)
				.style("opacity", 1);
		
		// chart title (default to title1)
		
		svg.append("text")
			.attr("class", "title")
			.attr("x", 0 - marginLeft)
			.attr("y", 0 - marginTop)
			.attr("dy", "1em")
			.attr("text-anchor", "start")
			.attr("fill-opacity", 0)
			.text(title1)
			.transition()	
				.duration(animateTime)
				.attr("fill-opacity", 1);
		
		// legend
		
		var legend = svg.selectAll(".legend")
			.data(levels.concat(["Overall"]))
			.enter()
			.append("g")
				.attr("class", "legend")
				.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
				
		legend.append("rect")
			.attr("x", widthAdj - 95)
			.attr("width", 18)
			.attr("height", 18)
			.style("fill", color);
			
		legend.append("text")
			.attr("x", widthAdj - 70)
			.attr("y", 9)
			.attr("dy", ".35em")
			.style("text-anchor", "start")
			.text(function(d) { return d; });
		
		// update functions
		
		function updateTitle(titleID) {
			
			svg.select(".title").remove();
			
			svg.append("text")
				.attr("class", "title")
				.attr("x", 0 - marginLeft)
				.attr("y", 0 - marginTop)
				.attr("dy", "1em")
				.attr("text-anchor", "start")
				.attr("fill-opacity", 0)
				.text(function() {
					if (titleID == 1) { return title1; }
					if (titleID == 2) { return title2; }
					if (titleID == 3) { return title3; }
					if (titleID == 4) { return title4; }
				})
				.transition()
					.duration(animateTime)
					.attr("fill-opacity", 1);
					
		};
		
		function updateData(subChartID) {
			
			// re-filter data
			
			dataFiltered = data.filter(function(d) { return d.subchart == subChartID; });
		
			var data_nest = d3.nest()
				.key(function(d) { return d.group; })
				.entries(dataFiltered);
			
			// update scales
			
			xScale.domain([0, d3.max(data, function(d) { return d.pct; })]).nice();
			yScale0.domain(data_nest.map(function(d) { return d.key; }));
			yScale1.domain(levels).rangeRoundBands([0, yScale0.rangeBand()], 0.15);
		
			// update national bars

			data_national = dataFiltered.filter(function(d) { return d.level == "Overall"; });
			
			var updateNational = svg.selectAll(".national-bar")
				.data(data_national);
			
			updateNational.transition()
				.duration(animateTime)
				.attr("x", 0)
				.attr("width", function(d) { return xScale(d.pct); })
				.attr("y", function(d) { return yScale0(d.group); })
				.attr("height", yScale0.rangeBand());
			
			updateNational.enter()
				.append("g")
					.attr("transform", "translate(0,0)")
					.append("rect")
						.attr("class","national-bar")
						.attr("x", 0)
						.attr("width", 0)
						.attr("y", function(d) { return yScale0(d.group); })
						.attr("height", yScale0.rangeBand())
						.on("mouseover", tipBar.show)
						.on("mouseout", tipBar.hide)
						.transition()
							.duration(animateTime)
							.attr("width", function(d) { return xScale(d.pct); })
	
			updateNational.exit()
				.transition()
					.duration(animateTime)
					.style("opacity", 0)
					.attr("x", 0)
					.attr("width", 0)
					.attr("height", 0)
					.remove();
	
			// update level bars

			data_noavg = dataFiltered.filter(function(d) { return d.level != "Overall"; });
			
			data_nest_noavg = d3.nest()
				.key(function(d) { return d.group; })
				.entries(data_noavg);
			
			var updateGroups = svg.selectAll(".group")
				.data(data_nest_noavg, function(d) { return d.key; });

			updateGroups.transition()
				.duration(animateTime)
				.attr("transform", function(d) { return "translate(0," + yScale0(d.key) + ")"; });					

			updateGroups.enter()
				.append("g")
					.attr("class", "group")
					.attr("transform", function(d) { return "translate(0," + yScale0(d.key) + ")"; });	

			updateGroups.exit()
				.transition()
					.duration(animateTime)
					.remove();

			updateGroups.exit()
				.selectAll(".bar")
				.transition()
					.duration(animateTime)
					.style("opacity", 0)
					.attr("x", 0)
					.attr("width", 0)
					.attr("height", 0);				
					
			var updateBars = updateGroups.selectAll(".bar")
				.data(function(d) { return d.values; });
					
			updateBars.transition()
				.duration(animateTime / 2)
				.attr("x", 0)
				.attr("width", function(d) { return xScale(d.pct); })
				.attr("y", function(d) { return yScale1(d.level); })
				.attr("height", yScale1.rangeBand());

			updateBars.enter()
				.append("rect")
					.attr("class", "bar")
					.attr("x", 0)
					.attr("width", 0)
					.attr("y", function(d) { return yScale1(d.level); })
					.attr("height", 0)
					.style("fill", function(d) { return color(d.level); })
					.on("mouseover", tipBar.show)
					.on("mouseout", tipBar.hide)
					.transition()
						.delay(animateTime / 2)
						.duration(animateTime)
						.attr("width", function(d) { return xScale(d.pct); })
						.attr("height", yScale1.rangeBand());

			updateBars.exit()
				.transition()
					.remove();					
					
			// update y axis
			
			svg.selectAll(".y.axis")
				.transition()
					.duration(animateTime)
					.style("opacity", 0)
					.remove();
				
			svg.append("g")
				.attr("class", "y axis")
				.style("opacity", 0)
				.call(yAxis)
				.transition()
					.duration(animateTime)
					.style("opacity", 1);
						
			};
			
		});
		
	};
	
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
	
	chart.marginBottom = function(value) {
		
		if (!arguments.length) return marginBottom;
		marginBottom = value;
		return chart;
		
	};

	chart.animateTime = function(value) {
		
		if (!arguments.length) return animateTime;
		animateTime = value;
		return chart;
		
	};

	chart.barWidth = function(value) {
		
		if (!arguments.length) return barWidth;
		barWidth = value;
		return chart;
		
	};
	
	chart.title1 = function(value) {
		
		if (!arguments.length) return title1;
		title1 = value;
		return chart;
		
	};

	chart.title2 = function(value) {
		
		if (!arguments.length) return title2;
		title2 = value;
		return chart;
		
	};
	
	chart.title3 = function(value) {
		
		if (!arguments.length) return title3;
		title3 = value;
		return chart;
		
	};
	
	chart.title4 = function(value) {
		
		if (!arguments.length) return title4;
		title4 = value;
		return chart;
		
	};

	chart.containerID = function(value) {
		
		if (!arguments.length) return containerID;
		containerID = value;
		return chart;
		
	};	
	
	chart.chartID = function(value) {
		
		if (!arguments.length) return chartID;
		chartID = value;
		return chart;
		
	};

	chart.sectionID = function(value) {
		
		if (!arguments.length) return sectionID;
		sectionID = value;
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