// Bar charts

function barChart() {
	
	// options that can be edited by the caller
	// these are the default values
	
	var width,
		height = 400,
		marginTop = 0,
		marginLeft = 75,
		marginBottom = 40,
		barWidth = 50,
		animateTime = 1000,
		xMax = 100,
		percWhole = 0, // 0 = perc, 1 = whole; default is perc
		sortDir = 0, // 0 = ascending, 1 = descending; default is ascending
		chartID = [],
		data = [];
	
	function chart(selection) {
		selection.each(function() {
			
			// sort data
			
			data.sort(function(a, b) { 
				if (sortDir == 0) { return d3.ascending(a.order, b.order); }
				else if (sortDir == 1) { return d3.descending(a.order, b.order); };
			});
			
			// formats
			
			var formatNum = d3.format(",.0f");
			var formatNumDec = d3.format(",.1f");
			var formatPerc = d3.format(".1%");
			
			// margins; adjust width and height to account for margins
			
			var width = document.getElementById(chartID).offsetWidth;
			
			var margin = {right: 20},
				widthAdj = width - marginLeft - margin.right,
				heightAdj = height - marginTop - marginBottom;
	
			// axis scales
			
			var xScale = d3.scaleLinear().rangeRound([0, widthAdj]),
				yScale = d3.scaleBand().rangeRound([heightAdj, 0]).padding(0.1);
				
			// domains
			
			xScale.domain([0, xMax]);
			yScale.domain(data.map(function(d) { return d.group; }));
	
			// build chart
			
			var dom = d3.select("#" + chartID);
			
			var svg = dom.append("svg")
				.attr("class", "barChart")
				.attr("width", width)
				.attr("height", height)
				.append("g")
					.attr("transform", "translate(" + marginLeft + "," + marginTop + ")");
						
			// add axes
			// x-axis depends on units
			
			function xAxis() { 
				if (percWhole == 0) { 
					svg.append("g")
						.attr("class", "xAxis")
						.attr("transform", "translate(0," + heightAdj + ")")
						.call(d3.axisBottom(xScale)
							.tickValues([0, xMax])
							.tickSize(0)
							.tickFormat(d3.format(".1%")));
				}
				else if (percWhole == 1) { 
					if (xMax < 1000) {
						svg.append("g")
						.attr("class", "xAxis")
						.attr("transform", "translate(0," + heightAdj + ")")
						.call(d3.axisBottom(xScale)
							.tickValues([0, xMax])
							.tickSize(0)
							.tickFormat(d3.format(",.0f")));						
					}
					if (xMax < 1000000) {
						svg.append("g")
						.attr("class", "xAxis")
						.attr("transform", "translate(0," + heightAdj + ")")
						.call(d3.axisBottom(xScale)
							.tickValues([0, xMax])
							.tickSize(0)
							.tickFormat(d3.formatPrefix(".1", 1e4)));							
					}
					else {
						svg.append("g")
							.attr("class", "xAxis")
							.attr("transform", "translate(0," + heightAdj + ")")
							.call(d3.axisBottom(xScale)
								.tickValues([0, xMax])
								.tickSize(0)
								.tickFormat(d3.formatPrefix(".1", 1e6)));
					};
				};
			};
			
			xAxis();
				
			svg.selectAll(".xAxis text")
				.attr("dy", "1.5em");
			
			svg.append("g")
				.attr("class", "yAxis")
				.call(d3.axisLeft(yScale));
				
			// draw bars
			
			var bars = svg.selectAll(".bar")
				.data(data);
			
			bars.enter()
				.append("rect")
					.attr("class", function(d) {
						if (d.percent === d3.max(data.map(function(d) { return d.percent; }))) { return "barMax"; }
						else { return "bar"; };
					})
					.attr("x", 0)
					.attr("y", function(d) { return yScale(d.group) + (yScale.bandwidth()/2) - (barWidth/2); })
					.attr("width", 0)
					.attr("height", barWidth);
					
			bars.enter()
				.append("text")
					.attr("class", function(d) {
						if (d.percent === d3.max(data.map(function(d) { return d.percent; }))) { return "barMaxLabel"; }
						else { return "barLabel"; };
					})
					.attr("x", function(d) { 
								if (percWhole == 0) { return xScale(d.percent/100); }
								else if (percWhole == 1) { return xScale(d.percent); }; 
					})
					.attr("dx", "0.5em")
					.attr("y", function(d) { return yScale(d.group) + (yScale.bandwidth()/2); })
					.attr("dy", "0.35em")
					.attr("opacity", 0)
					.text(function(d) { 
						if (percWhole == 0) { return formatPerc(d.percent/100); }
						else if (percWhole == 1) { 
						
							var maxVal = d3.max(data.map(function(d) { return d.percent; }));
						
							if (maxVal < 1000) { return formatNum(d.percent); }
							else if (maxVal < 1000000) { return formatNumDec(d.percent/1000) + "k"; }
							else { return formatNumDec(d.percent/1000000) + "M"; };
							
						}
					});
				
			//check for scroll to fire transitions
			
			function fireTransitions() { 
			
				if (document.getElementById(chartID).classList.contains("transitioned") == true) {	}
			
				else if (document.getElementById(chartID).classList.contains("scroll-active") == true) {
					
					document.getElementById(chartID).classList.add("transitioned");
					
					svg.selectAll("rect.bar")
						.transition("widen")
							.duration(animateTime)
							.attr("width", function(d) { 
								if (percWhole == 0) { return xScale(d.percent/100); }
								else if (percWhole == 1) { return xScale(d.percent); }; 
							});
	
					svg.selectAll("rect.barMax")
						.transition("widen")
							.duration(animateTime)
							.attr("width", function(d) { 
								if (percWhole == 0) { return xScale(d.percent/100); }
								else if (percWhole == 1) { return xScale(d.percent); }; 
							});
	
					svg.selectAll("text.barLabel")
						.transition("appear")
							.delay(animateTime)
							.duration(animateTime)
							.attr("opacity", 1);
							
					svg.selectAll("text.barMaxLabel")
						.transition("appear")
							.delay(animateTime)
							.duration(animateTime)
							.attr("opacity", 1);
					
				};
				
			};
			
			window.addEventListener("scroll", fireTransitions);
			
			// resize

			window.addEventListener("resize", function() {

				// update width

				var width = document.getElementById(chartID).offsetWidth,
					widthAdj = width - marginLeft - margin.right;

				// resize chart

				xScale.rangeRound([0, widthAdj]);
				
				dom.select("svg")
					.attr("width", width);
				
				svg.select(".xAxis").remove();
				
				xAxis();
				
				svg.selectAll(".xAxis text")
					.attr("dy", "1.5em");
								
				
				// move the data labels (base position does not depend on transitions)
					
				svg.selectAll("text.barLabel")
					.transition()
						.duration(animateTime)
						.attr("x", function(d) { 
							if (percWhole == 0) { return xScale(d.percent/100); }
							else if (percWhole == 1) { return xScale(d.percent); }; 
						})
						
				svg.selectAll("text.barMaxLabel")
					.transition()
						.duration(animateTime)
						.attr("x", function(d) { 
							if (percWhole == 0) { return xScale(d.percent/100); }
							else if (percWhole == 1) { return xScale(d.percent); }; 
						})
					
				// check if animations have already fired
					
				function checkAnimate() { 

					// if fired, just move things
				
					if (document.getElementById(chartID).classList.contains("transitioned") == true) {	
					
						svg.selectAll("rect.bar")
							.transition()
								.duration(animateTime)
								.attr("width", function(d) { 
									if (percWhole == 0) { return xScale(d.percent/100); }
									else if (percWhole == 1) { return xScale(d.percent); }; 
								});
								
						svg.selectAll("rect.barMax")
							.transition()
								.duration(animateTime)
								.attr("width", function(d) { 
									if (percWhole == 0) { return xScale(d.percent/100); }
									else if (percWhole == 1) { return xScale(d.percent); }; 
								});
														
					}
					
					// if not fired, run full transitions
					
					else {
							
							window.removeEventListener("scroll", fireTransitions); // remove the old scroll listener and start again
							window.addEventListener("scroll", fireTransitions);
									
					};						
					
				};
				
				checkAnimate();
					
			});
			
		})
		
	};

	chart.sortDir = function(value) {
		if (!arguments.length) return sortDir;
		sortDir = value;
		return chart;
	}

	chart.percWhole = function(value) {
		if (!arguments.length) return percWhole;
		percWhole = value;
		return chart;
	}	
	
	chart.xMax = function(value) {
		if (!arguments.length) return xMax;
		xMax = value;
		return chart;
	};

	chart.marginLeft = function(value) {
		if (!arguments.length) return marginLeft;
		marginLeft = value;
		return chart;
	};
	
	chart.chartID = function(value) {
		if (!arguments.length) return chartID;
		chartID = value;
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

function colChart() {
	
	// options that can be edited by the caller
	// these are the default values
	
	var width,
		height = 400,
		marginTop = 20,
		marginLeft = 40,
		marginBottomSpec = 20,
		colWidthSpec = 75,
		animateTime = 1000,
		yMax = 100,
		percWhole = 0, // 0 = perc, 1 = whole; default is perc
		sortDir = 0, // 0 = ascending, 1 = descending; default is ascending
		chartID = [],
		data = [];
	
	function chart(selection) {
		selection.each(function() {
			
			// sort data
			
			data.sort(function(a, b) { 
				if (sortDir == 0) { return d3.ascending(a.order, b.order); }
				else if (sortDir == 1) { return d3.descending(a.order, b.order); };
			});
			
			// formats
			
			var formatNum = d3.format(",.0f");
			var formatNumDec = d3.format(",.1f");
			var formatPerc = d3.format(".1%");
			
			// margins; adjust width and height to account for margins
			
			var width = document.getElementById(chartID).offsetWidth;
			
			var margin = {right: 20},
				widthAdj = width - marginLeft - margin.right;
	
			// axis scales
			
			var xScale = d3.scaleBand().rangeRound([0, widthAdj]).padding(0.1);
				
			// domains
			
			xScale.domain(data.map(function(d) { return d.group; }));
	
			// build chart
			
			var dom = d3.select("#" + chartID);
			
			var svg = dom.append("svg")
				.attr("class", "colChart")
				.attr("width", width)
				.attr("height", height)
				.append("g")
					.attr("transform", "translate(" + marginLeft + "," + marginTop + ")");
						
			// add axes
			// x-axis will need label wrapping
			
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
				//.attr("transform", "translate(0," + height + ")")
				.call(d3.axisBottom(xScale))
				.selectAll(".xAxis text")
					.call(wrap, xScale.bandwidth());

			// figure out max number of tspans from wrapping
		
			var tspanMax;
		
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
		
			tspanMaxCount();
			
			svg.selectAll(".xAxis text")
				.attr("dy", "1.5em");
			
			// move the x-axis based on bottom margin
			
			var marginBottom;
			
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
					.call(wrap, xScale.bandwidth());
			
			// y-axis stuff depends on adjusted height
			
			var	yScale = d3.scaleLinear().rangeRound([heightAdj, 0]).domain([0, yMax]);

			// y-axis depends on units
			
			function yAxis() { 
				if (percWhole == 0) { 
					svg.append("g")
						.attr("class", "yAxis")
						.call(d3.axisLeft(yScale)
							.tickValues([0, yMax])
							.tickSize(0)
							.tickFormat(d3.format(".1%")));
				}
				else if (percWhole == 1) { 
					if (yMax < 1000) {
						svg.append("g")
							.attr("class", "yAxis")
							.call(d3.axisLeft(yScale)
								.tickValues([0, yMax])
								.tickSize(0)
								.tickFormat(d3.format(",.0f")));						
					}
					if (yMax < 1000000) {
						svg.append("g")
							.attr("class", "yAxis")
							.call(d3.axisLeft(yScale)
								.tickValues([0, yMax])
								.tickSize(0)
								.tickFormat(d3.formatPrefix(".1", 1e4)));							
					}
					else {
						svg.append("g")
							.attr("class", "yAxis")
							.call(d3.axisLeft(yScale)
								.tickValues([0, yMax])
								.tickSize(0)
								.tickFormat(d3.formatPrefix(".1", 1e6)));
					};
				};
			};
			
			yAxis();
			
			// determine column width
			
			var colWidth;
			
			function colWidthAdj() {
				if (xScale.bandwidth() < colWidthSpec) { colWidth = xScale.bandwidth(); }
				else { colWidth = colWidthSpec; };
			};
			
			colWidthAdj();
			
			// draw columns
			
			var cols = svg.selectAll(".col")
				.data(data);
			
			cols.enter()
				.append("rect")
					.attr("class", function(d) {
						if (d.percent === d3.max(data.map(function(d) { return d.percent; }))) { return "colMax"; }
						else { return "col"; };
					})
					.attr("x", function(d) { return xScale(d.group) + (xScale.bandwidth()/2) - (colWidth/2); })
					.attr("y", heightAdj)
					.attr("width", colWidth)
					.attr("height", 0);
					
			cols.enter()
				.append("text")
					.attr("class", function(d) {
						if (d.percent === d3.max(data.map(function(d) { return d.percent; }))) { return "colMaxLabel"; }
						else { return "colLabel"; };
					})
					.attr("x", function(d) { return xScale(d.group) + (xScale.bandwidth()/2); })
					.attr("text-anchor", "middle")
					.attr("y", function(d) { 
						if (percWhole == 0) { return yScale(d.percent/100); }
						else if (percWhole == 1) { return yScale(d.percent); }; 
					})
					.attr("dy", "-0.5em")
					.attr("opacity", 0)
					.text(function(d) { 
						if (percWhole == 0) { return formatPerc(d.percent/100); }
						else if (percWhole == 1) { 
						
							var maxVal = d3.max(data.map(function(d) { return d.percent; }));
						
							if (maxVal < 1000) { return formatNum(d.percent); }
							else if (maxVal < 1000000) { return formatNumDec(d.percent/1000) + "k"; }
							else { return formatNumDec(d.percent/1000000) + "M"; };
							
						}
					});
				
			//check for scroll to fire transitions
			
			function fireTransitions() { 
			
				if (document.getElementById(chartID).classList.contains("transitioned") == true) {	}
			
				else if (document.getElementById(chartID).classList.contains("scroll-active") == true) {
					
					document.getElementById(chartID).classList.add("transitioned");
					
					svg.selectAll("rect.col")
						.transition("heighten")
							.duration(animateTime)
							.attr("x", function(d) { return xScale(d.group) + (xScale.bandwidth()/2) - (colWidth/2); })
							.attr("y", function(d) { 
								if (percWhole == 0) { return yScale(d.percent/100); }
								else if (percWhole == 1) { return yScale(d.percent); }; 
							})
							.attr("height", function(d) { 
								if (percWhole == 0) { return heightAdj - yScale(d.percent/100); }
								else if (percWhole == 1) { return heightAdj - yScale(d.percent); }; 
							});
	
					svg.selectAll("rect.colMax")
						.transition("heighten")
							.duration(animateTime)
							.attr("x", function(d) { return xScale(d.group) + (xScale.bandwidth()/2) - (colWidth/2); })
							.attr("y", function(d) { 
								if (percWhole == 0) { return yScale(d.percent/100); }
								else if (percWhole == 1) { return yScale(d.percent); }; 
							})
							.attr("height", function(d) { 
								if (percWhole == 0) { return heightAdj - yScale(d.percent/100); }
								else if (percWhole == 1) { return heightAdj - yScale(d.percent); }; 
							});
	
					svg.selectAll("text.colLabel")
						.transition("appear")
							.delay(animateTime)
							.duration(animateTime)
							.attr("opacity", 1);
							
					svg.selectAll("text.colMaxLabel")
						.transition("appear")
							.delay(animateTime)
							.duration(animateTime)
							.attr("opacity", 1);
					
				};
				
			};
			
			window.addEventListener("scroll", fireTransitions);
					
			// resize

			window.addEventListener("resize", function() {

				// update width

				var width = document.getElementById(chartID).offsetWidth,
					widthAdj = width - marginLeft - margin.right;
					
				// resize chart

				xScale.rangeRound([0, widthAdj]);
				
				dom.select("svg")
					.attr("width", width);

				svg.select(".xAxis")
					.call(d3.axisBottom(xScale))
					.selectAll(".xAxis text")
						.call(wrap, xScale.bandwidth());					
					
				tspanMaxCount();
				marginBottomAdj();
				
				// redraw the x-axis based on new bottom margin
				
				heightAdj = height - marginTop - marginBottom;
				
				svg.select(".xAxis").remove();
				
				svg.append("g")
					.attr("class", "xAxis")
					.attr("transform", "translate(0," + heightAdj + ")")
					.call(d3.axisBottom(xScale))
					.selectAll(".xAxis text")
						.call(wrap, xScale.bandwidth());			
				
				svg.selectAll(".xAxis text")
					.attr("dy", "1.5em");
				
				// redraw the y-axis based on new bottom margin
				
				yScale.rangeRound([heightAdj, 0]);
				
				svg.select(".yAxis").remove();
				
				yAxis();
				
				colWidthAdj();
				
				// move the data labels (base position does not depend on transitions)
					
				svg.selectAll("text.colLabel")
					.transition()
						.duration(animateTime)
						.attr("x", function(d) { return xScale(d.group) + (xScale.bandwidth()/2); })
						.attr("y", function(d) { 
								if (percWhole == 0) { return yScale(d.percent/100); }
								else if (percWhole == 1) { return yScale(d.percent); }; 
						});
						
				svg.selectAll("text.colMaxLabel")
					.transition()
						.duration(animateTime)
						.attr("x", function(d) { return xScale(d.group) + (xScale.bandwidth()/2); })
						.attr("y", function(d) { 
								if (percWhole == 0) { return yScale(d.percent/100); }
								else if (percWhole == 1) { return yScale(d.percent); }; 
						});
					
				// check if animations have already fired
					
				function checkAnimate() { 

					// if fired, just move things
				
					if (document.getElementById(chartID).classList.contains("transitioned") == true) {	
					
						svg.selectAll("rect.col")
							.transition()
								.duration(animateTime)
								.attr("x", function(d) { return xScale(d.group) + (xScale.bandwidth()/2) - (colWidth/2); })
								.attr("width", colWidth)
								.attr("y", function(d) { 
									if (percWhole == 0) { return yScale(d.percent/100); }
									else if (percWhole == 1) { return yScale(d.percent); }; 
								})
								.attr("height", function(d) { 
									if (percWhole == 0) { return heightAdj - yScale(d.percent/100); }
									else if (percWhole == 1) { return heightAdj - yScale(d.percent); }; 
								});
								
						svg.selectAll("rect.colMax")
							.transition()
								.duration(animateTime)
								.attr("x", function(d) { return xScale(d.group) + (xScale.bandwidth()/2) - (colWidth/2); })
								.attr("width", colWidth)
								.attr("y", function(d) { 
									if (percWhole == 0) { return yScale(d.percent/100); }
									else if (percWhole == 1) { return yScale(d.percent); }; 
								})
								.attr("height", function(d) { 
									if (percWhole == 0) { return heightAdj - yScale(d.percent/100); }
									else if (percWhole == 1) { return heightAdj - yScale(d.percent); }; 
								});

														
					}
					
					// if not fired, run full transitions
					
					else {
							
							window.removeEventListener("scroll", fireTransitions); // remove the old scroll listener and start again
							window.addEventListener("scroll", fireTransitions);
									
					};						
					
				};
				
				checkAnimate();
					
			});
			
		})
		
	};

	chart.sortDir = function(value) {
		if (!arguments.length) return sortDir;
		sortDir = value;
		return chart;
	}

	chart.percWhole = function(value) {
		if (!arguments.length) return percWhole;
		percWhole = value;
		return chart;
	}	
	
	chart.colWidthSpec = function(value) {
		if (!arguments.length) return colWidthSpec;
		colWidthSpec = value;
		return chart;
	}
	
	chart.yMax = function(value) {
		if (!arguments.length) return yMax;
		yMax = value;
		return chart;
	};

	chart.marginLeft = function(value) {
		if (!arguments.length) return marginLeft;
		marginLeft = value;
		return chart;
	};

	chart.marginBottomSpec = function(value) {
		if (!arguments.length) return marginBottomSpec;
		marginBottomSpec = value;
		return chart;
	};
	
	chart.chartID = function(value) {
		if (!arguments.length) return chartID;
		chartID = value;
		return chart;
	};
	
	chart.data = function(value) {
		if (!arguments.length) return data;
		data = value;
		return chart;
	};
	
	return chart;
		
};

// Dumbbell plot

function dumbBell() {
	
	// options that can be edited by the caller
	// these are the default values
	
	var	width = [],
		height = 400,
		marginTop = 0,
		marginLeft = 100,
		marginBottom = 45,
		dotSize = 7,
		animateTime = 1000,
		xMax = 100,
		percWhole = 0, // 0 = perc, 1 = whole; default is perc
		sortDir = 0, // 0 = ascending, 1 = descending; default is ascending
		chartID = [],
		data = [];
	
	function chart(selection) {
		selection.each(function() {

		// sort data
			
		data.sort(function(a, b) { 
			if (sortDir == 0) { return d3.ascending(a.order, b.order); }
			else if (sortDir == 1) { return d3.descending(a.order, b.order); };
		});
			
		// formats
		
		var formatNum = d3.format(",.0f");
		var formatNumDec = d3.format(",.1f");
		var formatPerc = d3.format(".1%");
		
		// margins; adjust width and height to account for margins
		
		var width = document.getElementById(chartID).offsetWidth;
		
		var margin = {right: 20},
			widthAdj = width - marginLeft - margin.right,
			heightAdj = height - marginTop - marginBottom;

		// axis scales
		
		var xScale = d3.scaleLinear().rangeRound([0, widthAdj]),
			yScale = d3.scaleBand().rangeRound([heightAdj, 0]).padding(0.1);
			
		// domains
		
		xScale.domain([0, xMax]);
		yScale.domain(data.map(function(d) { return d.group; }));

		// build chart
		
		var dom = d3.select("#" + chartID);
		
		var svg = dom.append("svg")
			.attr("class", "dumbBell")
			.attr("width", width)
			.attr("height", height)
			.append("g")
				.attr("transform", "translate(" + marginLeft + "," + marginTop + ")");
					
		// add axes
		// x-axis depends on units
		
		function xAxis() { 
			if (percWhole == 0) { 
				svg.append("g")
					.attr("class", "xAxis")
					.attr("transform", "translate(0," + heightAdj + ")")
					.call(d3.axisBottom(xScale)
						.tickValues([0, xMax])
						.tickSize(0)
						.tickFormat(d3.format(".1%")));
			}
			else if (percWhole == 1) { 
				if (xMax < 1000) {
					svg.append("g")
					.attr("class", "xAxis")
					.attr("transform", "translate(0," + heightAdj + ")")
					.call(d3.axisBottom(xScale)
						.tickValues([0, xMax])
						.tickSize(0)
						.tickFormat(d3.format(",.0f")));						
				}
				if (xMax < 1000000) {
					svg.append("g")
					.attr("class", "xAxis")
					.attr("transform", "translate(0," + heightAdj + ")")
					.call(d3.axisBottom(xScale)
						.tickValues([0, xMax])
						.tickSize(0)
						.tickFormat(d3.formatPrefix(".1", 1e4)));							
				}
				else {
					svg.append("g")
						.attr("class", "xAxis")
						.attr("transform", "translate(0," + heightAdj + ")")
						.call(d3.axisBottom(xScale)
							.tickValues([0, xMax])
							.tickSize(0)
							.tickFormat(d3.formatPrefix(".1", 1e6)));
				};
			};
		};
		
		xAxis();
			
		svg.selectAll(".xAxis text")
			.attr("dy", "1.5em");
		
		svg.append("g")
			.attr("class", "yAxis")
			.call(d3.axisLeft(yScale));		

		// draw lines and dots
			
		var lines = svg.selectAll(".line")
			.data(data);
			
		lines.enter()
			.append("line")
				.attr("class", "dotLine")
				.attr("x1", function(d) { 
					if (percWhole == 0) { return xScale((d.group1_val/100) + (d.group2_val/100))/2; }
					else if (percWhole == 1) { return xScale(d.group1_val + d.group2_val)/2; }; 
				})
				.attr("x2", function(d) { 
					if (percWhole == 0) { return xScale((d.group1_val/100) + (d.group2_val/100))/2; }
					else if (percWhole == 1) { return xScale(d.group1_val + d.group2_val)/2; }; 
				})
				.attr("y1", function(d) { return yScale(d.group) + (yScale.bandwidth()/2); })
				.attr("y2", function(d) { return yScale(d.group) + (yScale.bandwidth()/2); })
				
		var dots1 = svg.selectAll(".dot1")
			.data(data);
				
		dots1.enter()
			.append("circle")
				.attr("class", "dot1")
				.attr("cx", 0)
				.attr("cy", function(d) { return yScale(d.group) + (yScale.bandwidth()/2); })
				.attr("r", dotSize);
				
		dots1.enter()
			.append("text")
				.attr("class", "dot1Label")
				.attr("opacity", 0)
				.attr("x", function(d) { 
					if (percWhole == 0) { return xScale((d.group1_val/100)); }
					else if (percWhole == 1) { return xScale(d.group1_val); }; 
				})
				.attr("dx", function(d) { 
					if (d.group1_val > d.group2_val) { return "1em"; }
					else { return "-1em"; };
				})
				.attr("y", function(d) { return yScale(d.group) + (yScale.bandwidth()/2); })
				.attr("dy", "0.35em")
				.attr("text-anchor", function(d) { 
					if (d.group1_val > d.group2_val) { return "start"; }
					else { return "end"; };
				})
				.text(function(d) { 
					if (percWhole == 0) { return d.group1 + ": " + formatPerc(d.group1_val/100); }
					else if (percWhole == 1) { 
					
						var maxVal = d3.max(data.map(function(d) { return d.group1_val; }));
					
						if (maxVal < 1000) { return d.group1 + ": " + formatNum(d.group1_val); }
						else if (maxVal < 1000000) { return d.group1 + ": " + formatNumDec(d.group1_val/1000) + "k"; }
						else { return d.group1 + ": " + formatNumDec(d.group1_val/1000000) + "M"; };
						
					}
				});
				
		var dots2 = svg.selectAll(".dot2")
			.data(data);
				
		dots2.enter()
			.append("circle")
				.attr("class", "dot2")
				.attr("cx", 0)
				.attr("cy", function(d) { return yScale(d.group) + (yScale.bandwidth()/2); })
				.attr("r", dotSize);

		dots2.enter()
			.append("text")
				.attr("class", "dot2Label")
				.attr("opacity", 0)
				.attr("x", function(d) { 
					if (percWhole == 0) { return xScale((d.group2_val/100)); }
					else if (percWhole == 1) { return xScale(d.group2_val); }; 
				})
				.attr("dx", function(d) { 
					if (d.group1_val > d.group2_val) { return "-1em"; }
					else { return "1em"; };
				})
				.attr("y", function(d) { return yScale(d.group) + (yScale.bandwidth()/2); })
				.attr("dy", "0.35em")
				.attr("text-anchor", function(d) { 
					if (d.group1_val > d.group2_val) { return "end"; }
					else { return "start"; };
				})
				.text(function(d) { 
					if (percWhole == 0) { return d.group2 + ": " + formatPerc(d.group2_val/100); }
					else if (percWhole == 1) { 
					
						var maxVal = d3.max(data.map(function(d) { return d.group2_val; }));
					
						if (maxVal < 1000) { return d.group2 + ": " + formatNum(d.group2_val); }
						else if (maxVal < 1000000) { return d.group2 + ": " + formatNumDec(d.group2_val/1000) + "k"; }
						else { return d.group2 + ": " + formatNumDec(d.group1_val/1000000) + "M"; };
						
					}
				});
				
			//check for scroll to fire transitions
			
			function fireTransitions() { 
			
				if (document.getElementById(chartID).classList.contains("transitioned") == true) {	}
			
				else if (document.getElementById(chartID).classList.contains("scroll-active") == true) {
					
					document.getElementById(chartID).classList.add("transitioned");
					
					svg.selectAll("circle.dot1")
						.transition("move1")
							.duration(animateTime)
							.attr("cx", function(d) { 
								if (percWhole == 0) { return xScale(d.group1_val/100); }
								else if (percWhole == 1) { return xScale(d.group1_val); }; 
							});

					svg.selectAll("circle.dot2")
						.transition("move2")
							.duration(animateTime)
							.attr("cx", function(d) { 
								if (percWhole == 0) { return xScale(d.group2_val/100); }
								else if (percWhole == 1) { return xScale(d.group2_val); }; 
							});
							
					svg.selectAll("line.dotLine")
						.transition("widen")
							.delay(animateTime)
							.duration(animateTime)
							.attr("x1", function(d) { 
								if (percWhole == 0) { return xScale((d.group1_val/100)); }
								else if (percWhole == 1) { return xScale(d.group1_val); }; 
							})
							.attr("x2", function(d) { 
								if (percWhole == 0) { return xScale((d.group2_val/100)); }
								else if (percWhole == 1) { return xScale(d.group2_val); }; 
							});
	
					svg.selectAll("text.dot1Label")
						.transition("appear")
							.delay(animateTime)
							.duration(animateTime)
							.attr("opacity", 1);
							
					svg.selectAll("text.dot2Label")
						.transition("appear")
							.delay(animateTime)
							.duration(animateTime)
							.attr("opacity", 1);
					
				};
				
			};			
			
			window.addEventListener("scroll", fireTransitions);
			
			// resize

			window.addEventListener("resize", function() {

				// update width

				var width = document.getElementById(chartID).offsetWidth,
					widthAdj = width - marginLeft - margin.right;

				// resize chart

				xScale.rangeRound([0, widthAdj]);
				
				dom.select("svg")
					.attr("width", width);
				
				svg.select(".xAxis").remove();
				
				xAxis();
				
				svg.selectAll(".xAxis text")
					.attr("dy", "1.5em");
								
				// move the data labels (base position does not depend on transitions)
				// also move the position of the lines
					
				svg.selectAll("text.dot1Label")
					.transition()
						.duration(animateTime)
						.attr("x", function(d) { 
							if (percWhole == 0) { return xScale((d.group1_val/100)); }
							else if (percWhole == 1) { return xScale(d.group1_val); }; 
						})
						
				svg.selectAll("text.dot2Label")
					.transition()
						.duration(animateTime)
						.attr("x", function(d) { 
							if (percWhole == 0) { return xScale((d.group2_val/100)); }
							else if (percWhole == 1) { return xScale(d.group2_val); }; 
						})
						
				svg.selectAll("line.dotLine")
					.attr("x1", function(d) { 
						if (percWhole == 0) { return xScale((d.group1_val/100) + (d.group2_val/100))/2; }
						else if (percWhole == 1) { return xScale(d.group1_val + d.group2_val)/2; }; 
					})
					.attr("x2", function(d) { 
						if (percWhole == 0) { return xScale((d.group1_val/100) + (d.group2_val/100))/2; }
						else if (percWhole == 1) { return xScale(d.group1_val + d.group2_val)/2; }; 
					})
					
				// check if animations have already fired
					
				function checkAnimate() { 

					// if fired, just move things
				
					if (document.getElementById(chartID).classList.contains("transitioned") == true) {	
					
						svg.selectAll("circle.dot1")
							.transition("move")
								.duration(animateTime)
								.attr("cx", function(d) { 
									if (percWhole == 0) { return xScale(d.group1_val/100); }
									else if (percWhole == 1) { return xScale(d.group1_val); }; 
								});

						svg.selectAll("circle.dot2")
							.transition("move")
								.duration(animateTime)
								.attr("cx", function(d) { 
									if (percWhole == 0) { return xScale(d.group2_val/100); }
									else if (percWhole == 1) { return xScale(d.group2_val); }; 
								});

						svg.selectAll("line.dotLine")
							.transition("widen")
								.duration(animateTime)
								.attr("x1", function(d) { 
									if (percWhole == 0) { return xScale((d.group1_val/100)); }
									else if (percWhole == 1) { return xScale(d.group1_val); }; 
								})
								.attr("x2", function(d) { 
									if (percWhole == 0) { return xScale((d.group2_val/100)); }
									else if (percWhole == 1) { return xScale(d.group2_val); }; 
								});
														
					}
					
					// if not fired, run full transitions
					
					else {
							
							window.removeEventListener("scroll", fireTransitions); // remove the old scroll listener and start again
							window.addEventListener("scroll", fireTransitions);
									
					};						
					
				};
				
				checkAnimate();
					
			});
			
		})
		
	};

	chart.dotSize = function(value) {
		if (!arguments.length) return dotSize;
		dotSize = value;
		return chart;
	}
	
	chart.sortDir = function(value) {
		if (!arguments.length) return sortDir;
		sortDir = value;
		return chart;
	}

	chart.percWhole = function(value) {
		if (!arguments.length) return percWhole;
		percWhole = value;
		return chart;
	}	
	
	chart.xMax = function(value) {
		if (!arguments.length) return xMax;
		xMax = value;
		return chart;
	};

	chart.marginLeft = function(value) {
		if (!arguments.length) return marginLeft;
		marginLeft = value;
		return chart;
	};
	
	chart.chartID = function(value) {
		if (!arguments.length) return chartID;
		chartID = value;
		return chart;
	};
	
	chart.data = function(value) {
		if (!arguments.length) return data;
		data = value;
		return chart;
	};
	
	return chart;
		
};	

// Stacked line chart
// This is built quite specifically for these data, and is **NOT** very reusable 

function stackedLine() {
	
	// options that can be edited by the caller
	// these are the default values
	
	var width,
		height = 400,
		marginTop = 20,
		marginLeft = 40,
		marginBottomSpec = 20,
		animateTime = 1000,
		yMax = 100,
		percWhole = 0, // 0 = perc, 1 = whole; default is perc
		sortDir = 0, // 0 = ascending, 1 = descending; default is ascending
		chartID = [],
		data = [];
	
	function chart(selection) {
		selection.each(function() {
			
			// sort data
			
			data.sort(function(a, b) { 
				if (sortDir == 0) { return d3.ascending(a.order, b.order); }
				else if (sortDir == 1) { return d3.descending(a.order, b.order); };
			});
			
			// formats
			
			var formatNum = d3.format(",.0f");
			var formatNumDec = d3.format(",.1f");
			var formatPerc = d3.format(".1%");
			
			// margins; adjust width and height to account for margins
			
			var width = document.getElementById(chartID).offsetWidth;
			
			var margin = {right: 20},
				widthAdj = width - marginLeft - margin.right;
	
			// axis scales
			
			var xScale = d3.scaleBand().rangeRound([0, widthAdj]).padding(0.1);
				
			// domains
			
			xScale.domain(data.map(function(d) { return d.year; }));
	
			// build chart
			
			var dom = d3.select("#" + chartID);
			
			var svg = dom.append("svg")
				.attr("class", "lineChart")
				.attr("width", width)
				.attr("height", height)
				.append("g")
					.attr("transform", "translate(" + marginLeft + "," + marginTop + ")");
						
			// add axes
			// x-axis will need label wrapping
			
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
				//.attr("transform", "translate(0," + height + ")")
				.call(d3.axisBottom(xScale))
				.selectAll(".xAxis text")
					.call(wrap, xScale.bandwidth());

			// figure out max number of tspans from wrapping
		
			var tspanMax;
		
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
		
			tspanMaxCount();
			
			svg.selectAll(".xAxis text")
				.attr("dy", "1.5em");
			
			// move the x-axis based on bottom margin
			
			var marginBottom;
			
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
					.call(wrap, xScale.bandwidth());
			
			// y-axis stuff depends on adjusted height
			
			var	yScale = d3.scaleLinear().rangeRound([heightAdj, 0]).domain([0, yMax]);

			// y-axis depends on units
			
			function yAxis() { 
				if (percWhole == 0) { 
					svg.append("g")
						.attr("class", "yAxis")
						.call(d3.axisLeft(yScale)
							.tickValues([0, yMax])
							.tickSize(0)
							.tickFormat(d3.format(".1%")));
				}
				else if (percWhole == 1) { 
					if (yMax < 1000) {
						svg.append("g")
							.attr("class", "yAxis")
							.call(d3.axisLeft(yScale)
								.tickValues([0, yMax])
								.tickSize(0)
								.tickFormat(d3.format(",.0f")));						
					}
					if (yMax < 1000000) {
						svg.append("g")
							.attr("class", "yAxis")
							.call(d3.axisLeft(yScale)
								.tickValues([0, yMax])
								.tickSize(0)
								.tickFormat(d3.formatPrefix(".1", 1e4)));							
					}
					else {
						svg.append("g")
							.attr("class", "yAxis")
							.call(d3.axisLeft(yScale)
								.tickValues([0, yMax])
								.tickSize(0)
								.tickFormat(d3.formatPrefix(".1", 1e6)));
					};
				};
			};
			
			yAxis();
			
			// setting up the data
						
			var stack = d3.stack()
				.keys(["ES", "MS", "HS", "UG"]);
			
			var line = d3.line()
				.x(function(d) { return xScale(d.data.year) + (xScale.bandwidth()/2); })
				.y(function(d) { return yScale(d[1]); });
			
			var series = stack(data);
			
			var color = d3.scaleOrdinal()
				.domain(["ES", "MS", "HS", "UG"])
				.range(["#E56C0A", "#5DBF7E", "#2E8A95", "#215F8A", "#1C276E", "#FAC190", "#C8E9D2", "#8ED1E0", "#76B4DE", "#98A2E7"]);
			
			// build chart
			
			var layer = svg.selectAll(".layer")
				.data(series)
				.enter()
					.append("g")
						.attr("class", "layer");
				
			layer.append("path")
				.attr("class", "line")
				.style("stroke", function(d) { return color(d.key); })
				.style("fill", "none")
				.attr("d", line);
			
			console.log(series);
			
			// add first label (level)
	
			layer.append("text")
				.attr("class", "levelLabel")
				.attr("x", function(d) { return xScale(d[0].data.year) + (xScale.bandwidth()/2); })
				.attr("dx", "-0.5em")
				.attr("y", function(d) { return yScale(d[0][1]); })
				.attr("dy", "0.35em")
				.attr("text-anchor", "end")
				.attr("fill", function(d) { return color(d.key); })
				.attr("opacity", 0)
				.text(function(d) { return d.key; });
	
			// add last label (values)
			
			layer.append("text")
				.attr("class", "valueLabel")
				.attr("x", function(d) { return xScale(d[d.length-1].data.year) + (xScale.bandwidth()/2); })
				.attr("dx", "0.5em")
				.attr("y", function(d) { return yScale(d[d.length-1][1]); })
				.attr("dy", "0.35em")
				.attr("text-anchor", "start")
				.attr("fill", function(d) { return color(d.key); })
				.attr("opacity", 0)
				.text(function(d) { return formatNum(d[d.length-1][1] - d[d.length-1][0]); });
			
			// add rect on top for animations
			
			svg.append("rect")
				.attr("class", "screen")
				.attr("x", marginLeft)
				.attr("y", 0)
				.attr("width", widthAdj)
				.attr("height", heightAdj)
				.attr("fill", "#FFF");
			
			//check for scroll to fire transitions
			
			function fireTransitions() { 
			
				if (document.getElementById(chartID).classList.contains("transitioned") == true) {	}
			
				else if (document.getElementById(chartID).classList.contains("scroll-active") == true) {
					
					document.getElementById(chartID).classList.add("transitioned");
					
					svg.select("rect.screen")
						.transition("movescreen")
							.ease(d3.easeLinear)
							.duration((series.length/3)*animateTime)
							.attr("x", widthAdj)
							.transition()
								.attr("width", 0);
			
					svg.selectAll("text.levelLabel")
						.transition()
							.delay((series.length/3)*animateTime)
							.duration(animateTime)
							.attr("opacity", 1);
							
					svg.selectAll("text.valueLabel")
						.transition()
							.delay((series.length/3)*animateTime)
							.duration(animateTime)
							.attr("opacity", 1);
			
				};
				
			};
			
			window.addEventListener("scroll", fireTransitions);
					
			// resize

			window.addEventListener("resize", function() {

				// update width

				var width = document.getElementById(chartID).offsetWidth,
					widthAdj = width - marginLeft - margin.right;
					
				// resize chart

				xScale.rangeRound([0, widthAdj]);
				
				dom.select("svg")
					.attr("width", width);

				svg.select(".xAxis")
					.call(d3.axisBottom(xScale))
					.selectAll(".xAxis text")
						.call(wrap, xScale.bandwidth());					
					
				tspanMaxCount();
				marginBottomAdj();
				
				// redraw the x-axis based on new bottom margin
				
				heightAdj = height - marginTop - marginBottom;
				
				svg.select(".xAxis").remove();
				
				svg.append("g")
					.attr("class", "xAxis")
					.attr("transform", "translate(0," + heightAdj + ")")
					.call(d3.axisBottom(xScale))
					.selectAll(".xAxis text")
						.call(wrap, xScale.bandwidth());			
				
				svg.selectAll(".xAxis text")
					.attr("dy", "1.5em");
				
				// redraw the y-axis based on new bottom margin
				
				yScale.rangeRound([heightAdj, 0]);
				
				svg.select(".yAxis").remove();
				
				yAxis();
				
				// recalculate line positions
				
				line = d3.line()
					.x(function(d) { return xScale(d.data.year) + (xScale.bandwidth()/2); })
					.y(function(d) { return yScale(d[1]); });
				
				// check if animations have already fired
					
				function checkAnimate() { 

					// if fired, just move things
				
					if (document.getElementById(chartID).classList.contains("transitioned") == true) {	
	
						svg.selectAll("text.levelLabel")
							.transition()
								.duration(animateTime)
								.attr("x", function(d) { return xScale(d[0].data.year) + (xScale.bandwidth()/2); })
							
						svg.selectAll("text.valueLabel")
							.transition()
								.duration(animateTime)
								.attr("x", function(d) { return xScale(d[d.length-1].data.year) + (xScale.bandwidth()/2); })
	
						svg.selectAll("path.line")
							.transition()
								.duration(animateTime)
								.attr("d", line);
														
					}
					
					// if not fired, run full transitions
					
					else {
							
							svg.selectAll("path.line")
								.attr("d", line);
								
							svg.select("rect.screen")
								.attr("width", widthAdj);

							svg.selectAll("text.levelLabel")
								.attr("x", function(d) { return xScale(d[0].data.year) + (xScale.bandwidth()/2); })
								
							svg.selectAll("text.valueLabel")
								.attr("x", function(d) { return xScale(d[d.length-1].data.year) + (xScale.bandwidth()/2); })
								
							window.removeEventListener("scroll", fireTransitions); // remove the old scroll listener and start again
							window.addEventListener("scroll", fireTransitions);
									
					};						
					
				};
				
				checkAnimate();
					
			});
			
		})
		
	};

	chart.sortDir = function(value) {
		if (!arguments.length) return sortDir;
		sortDir = value;
		return chart;
	}

	chart.percWhole = function(value) {
		if (!arguments.length) return percWhole;
		percWhole = value;
		return chart;
	}	
		
	chart.yMax = function(value) {
		if (!arguments.length) return yMax;
		yMax = value;
		return chart;
	};

	chart.marginLeft = function(value) {
		if (!arguments.length) return marginLeft;
		marginLeft = value;
		return chart;
	};

	chart.marginBottomSpec = function(value) {
		if (!arguments.length) return marginBottomSpec;
		marginBottomSpec = value;
		return chart;
	};
	
	chart.chartID = function(value) {
		if (!arguments.length) return chartID;
		chartID = value;
		return chart;
	};
	
	chart.data = function(value) {
		if (!arguments.length) return data;
		data = value;
		return chart;
	};
	
	return chart;
		
};

// Small multiples waffles

function wafflesMult() {
			
	// margins, width, height, dataset
	
	var width,
		height,
		widthSquares = 10, // number of squares wide
		heightSquares = 10, // number of squares tall
		squareSize = 16, // size of squares in pixels
		gap = 1, // size of gap between squares
		chartID = [],
		data = [],
		waffleData = []; 			

		width = (squareSize*widthSquares) + (widthSquares*gap) + squareSize;
		height = (squareSize*heightSquares) + (heightSquares*gap) + squareSize;

	function chart(selection) {
		selection.each(function() {
			
				// format data for use in waffles
				
				data.forEach(function(d, i) {
					d.units = Math.round(d.percent);
					waffleData = waffleData.concat(
						Array(d.units+1).join(1).split("").map(function() {
							return {
								subject: d.subject,
								use_type: d.use_type,
								squareValue: 1,
								units: d.units,
								percent: d.percent,
								groupIndex: i
							};
						})
					);
				});	

				// nest data for multiples
				
				var subjects = d3.nest()
					.key(function(d) { return d.subject; })
					.entries(waffleData);	

				// colors by subject
				
				var color = d3.scaleOrdinal()
				  .domain(subjects.map(function(d) { return d.key; }))
				  .range(["#E56C0A", "#5DBF7E", "#2E8A95", "#215F8A", "#1C276E", "#FAC190", "#C8E9D2", "#8ED1E0", "#76B4DE", "#98A2E7"]);
						
				// build the charts

				var waffleDiv = d3.select("#" + chartID)
					.selectAll("div")
					.data(subjects)
					.each()
						.enter()
							.append("div")
								.attr("width", width)
								.style("display", "inline-block");
				
				var waffleSVG = waffleDiv.append("div")
					.append("svg")
						.attr("width", width)
						.attr("height", height)
						.append("g");
				
				var waffle = waffleSVG.selectAll("rect")
					.data(subjects);
					
				waffle.each()
					.data(function(d) { return d.values; })
					.enter()
						.append("rect")
							.attr("width", squareSize)
							.attr("height", squareSize)
							.attr("x", function(d, i) {
								
								// group number of squares for columns
								
								col = i%heightSquares;
								return (col*squareSize) + (col*gap) + (squareSize/2);
								
							})
							.attr("y", function(d, i) {
							
								row = Math.floor(i/heightSquares);
								return (heightSquares*squareSize) - ((row*squareSize) + (row*gap) - 1);
							
							})
							.style("fill", "#F1F2F1");

				var waffleText = waffleDiv.append("div")
					.attr("width", width);

				var waffleCounter = waffleText.selectAll("text.waffleCounter")
					.data(subjects);
					
				var format = d3.format(".1%");		
					
				waffleCounter.each()
					.data(function(d) { return d.values; })
					.enter()
						.filter(function(d, i) { return d.use_type == "For" && i === 0; })
						.append("text")
							.text("0.0%")
							.style("color", function(d) { return color(d.subject) })
							.attr("class", "waffleCounter");

				var waffleSubject = waffleText.selectAll("p.waffleSubject")
					.data(subjects);
				
				waffleSubject.each()
					.data(function(d) { return d.values; })
					.enter()
						.filter(function(d, i) { return i === 0; })
						.append("p")
							.attr("width", width)
							.text(function(d) { return d.subject; })
							.attr("class", "waffleSubject");

				//check for scroll to fire transitions
				
				window.addEventListener("scroll", function() { 
				
					if (document.getElementById(chartID).classList.contains("transitioned") == true) {	}
				
					else if (document.getElementById(chartID).classList.contains("scroll-active") == true) {
						
						document.getElementById(chartID).classList.add("transitioned");
						
						waffleSVG.selectAll("rect")
							.transition()
								.delay(function(d, i) { return i*25; })
								.duration(500)
								.style("fill", function(d) { 
									if (d.use_type == "For") { return color(d.subject); }
									else { return "#F1F2F1"; };
								});
								
						waffleText.selectAll(".waffleCounter")
							.transition()
							.duration(function(d) { return 25*d.units + 500; })
							.tween("text", function(d) {
							
								var that = d3.select(this),
									i = d3.interpolateNumber(0, d.percent/100);
									
								return function(t) { that.text(format(i(t))); };
								
							});						
								
					};
				});			
		});
	};
		
	chart.chartID = function(value) {

		if (!arguments.length) return chartID;
		chartID = value;
		return chart;

	};
	
	chart.data = function(value) {

        if (!arguments.length) return data;
        data = value;
        return chart;

    };
	
	return chart;
	
};
	