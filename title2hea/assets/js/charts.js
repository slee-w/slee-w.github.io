// Scatter plots

function scatterPlot() {

	// options that can be edited by the caller
	// default values defined below

	var height = 650,
		marginTop = 30,
		marginLeft = 65,
		marginBottom = 60,
		dotSize = 5,
		animateTime = 1000,
		xAxisLabel = [],
		yAxisLabel = [],
		chartID = [],
		data = [];

		function chart(selection) {
			selection.each(function() {

				// formats

				var formatNum = d3.format(",.0f");
				var formatPerc = d3.format(".0%");

				// margins; adjust width and height to account for margins

				var width = document.getElementById(chartID).offsetWidth;

				var margin = {right: 20},
					widthAdj = width - marginLeft - margin.right,
					heightAdj = height - marginTop - marginBottom;

				// axis scales

				var xScale = d3.scaleLinear().rangeRound([0, widthAdj]),
					yScale = d3.scaleLinear().rangeRound([heightAdj, 0]);

				// domains

				xScale.domain([0, 1]);
				yScale.domain([0, 1]);

				var dom = d3.select("#" + chartID);

				// add buttons and state selector

				var tradEnabled = 1,
						altIHEEnabled = 1,
						altNotEnabled = 1,
						selectedState = "All states"; // initial value

				// State selector

				var stateSelector = dom.append("div")
					.attr("class", "stateSelector");

				// Nest the data to get the list of stateSelector

				var stateNest = d3.nest()
					.key(function(d) { return d.state; })
					.entries(data);

				stateSelector.append("div")
					.style("display", "inline-block")
					.text("State: ");

				stateSelector.append("div")
					.style("width", "5px")
					.style("display", "inline-block");

				var dropDown = stateSelector.append("select")
					.attr("name", "stateList");

				// Add all states selector

				dropDown.append("option")
						.text("All states")
						.attr("value", "All states");

				var options = dropDown.selectAll("option")
					.data(stateNest);

				options.enter()
					.append("option")
						.text(function(d) { return d.key; })
						.attr("value", function(d) { return d.key; });

				// Change state on drop down menu change

				dropDown.on("change", changeState);

				// Program type toggles

				var typeSelector = dom.append("div")
					.attr("class", "typeSelector");

				typeSelector.append("div")
					.style("display", "inline-block")
					.text("Program types: ");

				typeSelector.append("div")
					.style("width", "5px")
					.style("display", "inline-block");

				// toggle for Traditional

				typeSelector.append("button")
					.attr("class", "buttonTrad selected")
					.text("Traditional")
					.on("click", toggleTrad);

				// divider

				typeSelector.append("div")
					.style("width", "5px")
					.style("display", "inline-block");

				// toggle for Alternative, IHE-based

				typeSelector.append("button")
					.attr("class", "buttonAltIHE selected")
					.text("Alternative, IHE-based")
					.on("click", toggleAltIHE);

				// divider

				typeSelector.append("div")
					.style("width", "5px")
					.style("display", "inline-block");

				// toggle for Alternative, not IHE-based

				typeSelector.append("button")
					.attr("class", "buttonAltNot selected")
					.text("Alternative, not IHE-based")
					.on("click", toggleAltNot);

				// divider

				typeSelector.append("div")
					.style("width", "5px")
					.style("display", "inline-block");

				// add space before chart

				dom.append("br");
				dom.append("br");

				// build chart

				var svg = dom.append("svg")
					.attr("class", "scatterPlot")
					.attr("width", width)
					.attr("height", height)
					.append("g")
						.attr("transform", "translate(" + marginLeft + "," + marginTop + ")");

				// add axes

				svg.append("g")
					.attr("class", "xAxis")
					.attr("transform", "translate(0," + heightAdj + ")")
					.call(d3.axisBottom(xScale)
						.ticks(5)
						.tickSize(0)
						.tickFormat(formatPerc));

				svg.selectAll(".xAxis text")
					.attr("dy", "1.5em");

				svg.append("text")
					.attr("class", "xAxisTitle")
					.attr("x", widthAdj)
					.attr("y", heightAdj)
					.attr("dy", "3.25em")
					.attr("text-anchor", "end")
					.text(xAxisLabel);

				svg.append("g")
					.attr("class", "yAxis")
					.call(d3.axisLeft(yScale)
						.ticks(5)
						.tickSize(0)
						.tickFormat(formatPerc));

				svg.append("text")
					.attr("class", "yAxisTitle")
					.attr("x", 0)
					.attr("dy", "-3.25em")
					.attr("y", 0)
					.attr("transform", "rotate(-90)")
					.attr("text-anchor", "end")
					.text(yAxisLabel);

				// draw dots, filter out any with nulls and with total enrollment < 10

				var data1 = data.filter(function(d) {
					if ((isNaN(d.var1) == false) && (isNaN(d.var2) == false) && (d.total >= 10)) { return d; };
				});

				// sort so traditional is drawn first so alt appears above

				data1.sort(function(a,b) { return d3.descending(a.provider_type, b.provider_type); });

				var dots = svg.selectAll(".dots")
					.data(data1);

				dots.enter()
					.append("circle")
						.attr("class", function(d) {
								if (d.provider_type == "Traditional") { return "dots trad"; }
								else if (d.provider_type == "Alternative, IHE-based") { return "dots altIHE" }
								else if (d.provider_type == "Alternative, not IHE-based") { return "dots altNot" }
						})
						.attr("r", dotSize)
						.attr("cx", function(d) { return xScale(d.var1); })
						.attr("cy", function(d) { return yScale(d.var2); })
						.attr("opacity", 0);

				//check for scroll to fire transitions

				function fireTransitions() {

					if (document.getElementById(chartID).classList.contains("transitioned") == true) {	}

					else if (document.getElementById(chartID).classList.contains("scroll-active") == true) {

						document.getElementById(chartID).classList.add("transitioned");

						svg.selectAll("circle.dots")
							.transition("move")
								.duration(animateTime)
								.attr("opacity", 0.65);

					};

				};

				window.addEventListener("scroll", fireTransitions);

				// state selector function

				function changeState() {

					selectedState = d3.event.target.value;

					svg.selectAll("circle.dots")
						.transition()
							.duration(animateTime/2)
							.attr("opacity", function(d) {
								if (selectedState == "All states") {
									if (d.provider_type == "Traditional") {
										if (tradEnabled == 0) { return 0; }
										else if (tradEnabled == 1) { return 0.65; };
									}
									else if (d.provider_type == "Alternative, IHE-based") {
										if (altIHEEnabled == 0) { return 0; }
										else if (altIHEEnabled == 1) { return 0.65; };
									}
									else if (d.provider_type == "Alternative, not IHE-based") {
										if (altNotEnabled == 0) { return 0; }
										else if (altNotEnabled == 1) { return 0.65; };
									}
								}
								else if (d.state == selectedState) {
									if (d.provider_type == "Traditional") {
										if (tradEnabled == 0) { return 0; }
										else if (tradEnabled == 1) { return 0.65; };
									}
									else if (d.provider_type == "Alternative, IHE-based") {
										if (altIHEEnabled == 0) { return 0; }
										else if (altIHEEnabled == 1) { return 0.65; };
									}
									else if (d.provider_type == "Alternative, not IHE-based") {
										if (altNotEnabled == 0) { return 0; }
										else if (altNotEnabled == 1) { return 0.65; };
									}
								}
								else { return 0; }
							});
				};

				// toggle functions

				function toggleTrad() {
					if (tradEnabled == 1) {
						svg.selectAll("circle.dots.trad")
							.transition("hide")
								.duration(animateTime/2)
								.attr("opacity", 0);

						typeSelector.selectAll("button.buttonTrad")
							.classed("selected", false);

						tradEnabled = 0;

					}
					else if (tradEnabled == 0) {
						svg.selectAll("circle.dots.trad")
							.transition("appear")
								.duration(animateTime/2)
								.attr("opacity", function(d) {
									if (selectedState == "All states") { return 0.65; }
									else if (d.state == selectedState) { return 0.65; }
									else if (d.state != selectedState) { return 0; }
								});

						typeSelector.selectAll("button.buttonTrad")
							.classed("selected", true);

						tradEnabled = 1;

					};
				};

				function toggleAltIHE() {
					if (altIHEEnabled == 1) {
						svg.selectAll("circle.dots.altIHE")
							.transition("hide")
								.duration(animateTime/2)
								.attr("opacity", 0);

						typeSelector.selectAll("button.buttonAltIHE")
							.classed("selected", false);

						altIHEEnabled = 0;

					}
					else if (altIHEEnabled == 0) {
						svg.selectAll("circle.dots.altIHE")
							.transition("appear")
								.duration(animateTime/2)
								.attr("opacity", function(d) {
									if (selectedState == "All states") { return 0.65; }
									if (d.state == selectedState) { return 0.65; }
									else if (d.state != selectedState) { return 0; }
								});

						typeSelector.selectAll("button.buttonAltIHE")
							.classed("selected", true);

						altIHEEnabled = 1;

					};
				};

				function toggleAltNot() {
					if (altNotEnabled == 1) {
						svg.selectAll("circle.dots.altNot")
							.transition("hide")
								.duration(animateTime/2)
								.attr("opacity", 0);

						typeSelector.selectAll("button.buttonAltNot")
							.classed("selected", false);

						altNotEnabled = 0;

					}
					else if (altNotEnabled == 0) {
						svg.selectAll("circle.dots.altNot")
							.transition("appear")
								.duration(animateTime/2)
								.attr("opacity", function(d) {
									if (selectedState == "All states") { return 0.65; }
									if (d.state == selectedState) { return 0.65; }
									else if (d.state != selectedState) { return 0; }
								});

						typeSelector.selectAll("button.buttonAltNot")
							.classed("selected", true);

						altNotEnabled = 1;

					};
				};

				// resize

				window.addEventListener("resize", function() {

					// update width

					var width = document.getElementById(chartID).offsetWidth,
						widthAdj = width - marginLeft - margin.right;

					// resize chart

					xScale.rangeRound([0, widthAdj]);

					dom.select("svg")
						.attr("width", width);

					svg.selectAll(".xAxis")
						.call(d3.axisBottom(xScale)
							.tickSize(0)
							.ticks(5)
							.tickFormat(formatPerc));

					svg.selectAll(".xAxis text")
						.attr("dy", "1.5em");

					svg.selectAll(".xAxisTitle")
						.attr("x", widthAdj);

					d3.selectAll("circle.dots")
						.attr("cx", function(d) { return xScale(d.var1); });

					// check if animations have already fired

					function checkAnimate() {

						// if fired, just move things

						if (document.getElementById(chartID).classList.contains("transitioned") == true) {

							svg.selectAll("circle.dots")
								.transition()
									.duration(animateTime/2)
									.attr("cx", function(d) { return xScale(d.var1); });

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

	chart.dotSize = function(value) {
		if (!arguments.length) return dotSize;
		dotSize = value;
		return chart;
	};

	chart.xAxisLabel = function(value) {
		if (!arguments.length) return xAxisLabel;
		xAxisLabel = value;
		return chart;
	};

	chart.yAxisLabel = function(value) {
		if (!arguments.length) return yAxisLabel;
		yAxisLabel = value;
		return chart;
	};

	chart.animateTime = function(value) {
		if (!arguments.length) return animateTime;
		animateTime = value;
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

// Bar charts

function barChart() {

	// options that can be edited by the caller
	// these are the default values

	var width,
		height = 400,
		marginTop = 0,
		marginLeft = 75,
		marginBottom = 40,
		barWidth = 75,
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
			yScale.domain(data.map(function(d) { return d.categories; }));

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
						svg.append("g")
						.attr("class", "xAxis")
						.attr("transform", "translate(0," + heightAdj + ")")
						.call(d3.axisBottom(xScale)
							.tickValues([0, xMax])
							.tickSize(0)
							.tickFormat(d3.format(",.0f")));
				}
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
						if (d.var1 === d3.max(data.map(function(d) { return d.var1; }))) { return "barMax"; }
						else if (d.var2 === d3.max(data.map(function(d) { return d.var2; }))) { return "barMax"; }
						else { return "bar"; };
					})
					.attr("x", 0)
					.attr("y", function(d) { return yScale(d.categories) + (yScale.bandwidth()/2) - (barWidth/2); })
					.attr("width", 0)
					.attr("height", barWidth);

			bars.enter()
				.append("text")
					.attr("class", function(d) {
						if (d.var1 === d3.max(data.map(function(d) { return d.var1; }))) { return "barMaxLabel"; }
						else if (d.var2 === d3.max(data.map(function(d) { return d.var2; }))) { return "barMaxLabel"; }
						else { return "barLabel"; };
					})
					.attr("x", function(d) {
								if (percWhole == 0) { return xScale(d.var2/100); }
								else if (percWhole == 1) { return xScale(d.var1); };
					})
					.attr("dx", "0.65em")
					.attr("y", function(d) { return yScale(d.categories) + (yScale.bandwidth()/2); })
					.attr("dy", "0.35em")
					.attr("opacity", 0)
					.text(function(d) {
						if (percWhole == 0) { return formatPerc(d.var2/100); }
						else if (percWhole == 1) { return formatNum(d.var1); }
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
								if (percWhole == 0) { return xScale(d.var2/100); }
								else if (percWhole == 1) { return xScale(d.var1); };
							});

					svg.selectAll("rect.barMax")
						.transition("widen")
							.duration(animateTime)
							.attr("width", function(d) {
								if (percWhole == 0) { return xScale(d.var2/100); }
								else if (percWhole == 1) { return xScale(d.var1); };
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
							if (percWhole == 0) { return xScale(d.var2/100); }
							else if (percWhole == 1) { return xScale(d.var1); };
						})

				svg.selectAll("text.barMaxLabel")
					.transition()
						.duration(animateTime)
						.attr("x", function(d) {
							if (percWhole == 0) { return xScale(d.var2/100); }
							else if (percWhole == 1) { return xScale(d.var1); };
						})

				// check if animations have already fired

				function checkAnimate() {

					// if fired, just move things

					if (document.getElementById(chartID).classList.contains("transitioned") == true) {

						svg.selectAll("rect.bar")
							.transition()
								.duration(animateTime)
								.attr("width", function(d) {
									if (percWhole == 0) { return xScale(d.var2/100); }
									else if (percWhole == 1) { return xScale(d.var1); };
								});

						svg.selectAll("rect.barMax")
							.transition()
								.duration(animateTime)
								.attr("width", function(d) {
									if (percWhole == 0) { return xScale(d.var2/100); }
									else if (percWhole == 1) { return xScale(d.var1); };
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

			xScale.domain(data.map(function(d) { return d.categories; }));

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
						if (d.var1 === d3.max(data.map(function(d) { return d.var1; }))) { return "colMax"; }
						else if (d.var2 === d3.max(data.map(function(d) { return d.var2; }))) { return "colMax"; }
						else { return "col"; };
					})
					.attr("x", function(d) { return xScale(d.categories) + (xScale.bandwidth()/2) - (colWidth/2); })
					.attr("y", heightAdj)
					.attr("width", colWidth)
					.attr("height", 0);

			cols.enter()
				.append("text")
					.attr("class", function(d) {
						if (d.var1 === d3.max(data.map(function(d) { return d.var1; }))) { return "colMaxLabel"; }
						else if (d.var2 === d3.max(data.map(function(d) { return d.var2; }))) { return "colMaxLabel"; }
						else { return "colLabel"; };
					})
					.attr("x", function(d) { return xScale(d.categories) + (xScale.bandwidth()/2); })
					.attr("text-anchor", "middle")
					.attr("y", function(d) {
						if (percWhole == 0) { return yScale(d.var2/100); }
						else if (percWhole == 1) { return yScale(d.var1); };
					})
					.attr("dy", "-0.65em")
					.attr("opacity", 0)
					.text(function(d) {
						if (percWhole == 0) { return formatPerc(d.var2/100); }
						else if (percWhole == 1) {

							var maxVal = d3.max(data.map(function(d) { return d.var1; }));

							if (maxVal < 1000) { return formatNum(d.var1); }
							else if (maxVal < 1000000) { return formatNumDec(d.var1/1000) + "k"; }
							else { return formatNumDec(d.var1/1000000) + "M"; };

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
							.attr("x", function(d) { return xScale(d.categories) + (xScale.bandwidth()/2) - (colWidth/2); })
							.attr("y", function(d) {
								if (percWhole == 0) { return yScale(d.var2/100); }
								else if (percWhole == 1) { return yScale(d.var1); };
							})
							.attr("height", function(d) {
								if (percWhole == 0) { return heightAdj - yScale(d.var2/100); }
								else if (percWhole == 1) { return heightAdj - yScale(d.var1); };
							});

					svg.selectAll("rect.colMax")
						.transition("heighten")
							.duration(animateTime)
							.attr("x", function(d) { return xScale(d.categories) + (xScale.bandwidth()/2) - (colWidth/2); })
							.attr("y", function(d) {
								if (percWhole == 0) { return yScale(d.var2/100); }
								else if (percWhole == 1) { return yScale(d.var1); };
							})
							.attr("height", function(d) {
								if (percWhole == 0) { return heightAdj - yScale(d.var2/100); }
								else if (percWhole == 1) { return heightAdj - yScale(d.var1); };
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
						.attr("x", function(d) { return xScale(d.categories) + (xScale.bandwidth()/2); })
						.attr("y", function(d) {
								if (percWhole == 0) { return yScale(d.var2/100); }
								else if (percWhole == 1) { return yScale(d.var1); };
						});

				svg.selectAll("text.colMaxLabel")
					.transition()
						.duration(animateTime)
						.attr("x", function(d) { return xScale(d.categories) + (xScale.bandwidth()/2); })
						.attr("y", function(d) {
								if (percWhole == 0) { return yScale(d.var2/100); }
								else if (percWhole == 1) { return yScale(d.var1); };
						});

				// check if animations have already fired

				function checkAnimate() {

					// if fired, just move things

					if (document.getElementById(chartID).classList.contains("transitioned") == true) {

						svg.selectAll("rect.col")
							.transition()
								.duration(animateTime)
								.attr("x", function(d) { return xScale(d.categories) + (xScale.bandwidth()/2) - (colWidth/2); })
								.attr("width", colWidth)
								.attr("y", function(d) {
									if (percWhole == 0) { return yScale(d.var2/100); }
									else if (percWhole == 1) { return yScale(d.var1); };
								})
								.attr("height", function(d) {
									if (percWhole == 0) { return heightAdj - yScale(d.var2/100); }
									else if (percWhole == 1) { return heightAdj - yScale(d.var1); };
								});

						svg.selectAll("rect.colMax")
							.transition()
								.duration(animateTime)
								.attr("x", function(d) { return xScale(d.categories) + (xScale.bandwidth()/2) - (colWidth/2); })
								.attr("width", colWidth)
								.attr("y", function(d) {
									if (percWhole == 0) { return yScale(d.var2/100); }
									else if (percWhole == 1) { return yScale(d.var1); };
								})
								.attr("height", function(d) {
									if (percWhole == 0) { return heightAdj - yScale(d.var2/100); }
									else if (percWhole == 1) { return heightAdj - yScale(d.var1); };
								});


					}

					// if not fired, run full transitions

					else {

							svg.selectAll("rect.col")
								.attr("x", function(d) { return xScale(d.categories) + (xScale.bandwidth()/2) - (colWidth/2); })

							svg.selectAll("rect.colMax")
								.attr("x", function(d) { return xScale(d.categories) + (xScale.bandwidth()/2) - (colWidth/2); })

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

// Small multiples waffles

function wafflesMult() {

	// margins, width, height, dataset

	var width,
		height,
		widthSquares = 10, // number of squares wide
		heightSquares = 10, // number of squares tall
		squareSize = 15, // size of squares in pixels
		gap = 1, // size of gap between squares
		typeName = [],
		chartID = [],
		data = [],
		waffleData = [];

		width = (squareSize*widthSquares) + (widthSquares*gap) + squareSize;
		height = (squareSize*heightSquares) + (heightSquares*gap) + squareSize;

	function chart(selection) {
		selection.each(function() {

				// sort data

				// format data for use in waffles

				data.forEach(function(d, i) {
					d.units = Math.round(d.var2);
					waffleData = waffleData.concat(
						Array(d.units+1).join(1).split("").map(function() {
							return {
								year: d.year,
								categories: d.categories,
								squareValue: 1,
								units: d.units,
								percent: d.var2,
								groupIndex: i
							};
						})
					);
				});

				// nest data for multiples

				var years = d3.nest()
					.key(function(d) { return d.year; })
					.entries(waffleData);

				// colors by subject

				var color = d3.scaleOrdinal()
				  .domain(years.map(function(d) { return d.key; }))
				  .range(["#E56C0A", "#5DBF7E", "#2E8A95", "#215F8A", "#1C276E", "#FAC190", "#C8E9D2", "#8ED1E0", "#76B4DE", "#98A2E7"]);

				// build the charts

				var waffleDiv = d3.select("#" + chartID)
					.selectAll("div")
					.data(years)
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
					.data(years);

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
					.data(years);

				var format = d3.format(".1%");

				waffleCounter.each()
					.data(function(d) { return d.values; })
					.enter()
						.filter(function(d, i) { return d.categories == typeName && i === 0; })
						.append("text")
							.text("0.0%")
							.style("color", function(d) { return color(d.year) })
							.attr("class", "waffleCounter");

				var waffleSubject = waffleText.selectAll("p.waffleSubject")
					.data(years);

				waffleSubject.each()
					.data(function(d) { return d.values; })
					.enter()
						.filter(function(d, i) { return i === 0; })
						.append("p")
							.attr("width", width)
							.text(function(d) { return d.year; })
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
									if (d.categories == typeName) { return color(d.year); }
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

		chart.typeName = function(value) {

	        if (!arguments.length) return typeName;
	        typeName = value;
	        return chart;

	    };

	return chart;

};

// Line charts

function lineChart() {

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
		labelPadding = 3,
		chartID = [],
		data = [],
		keys = [];

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

			// draw lines

			var line = d3.line()
				.x(function(d) { return xScale(d.year) + xScale.bandwidth()/2; })
				.y(function(d) {
					if (percWhole == 0) { return yScale(d.var2/100); }
					if (percWhole == 1) { return yScale(d.var1); }
				});

			svg.append("path")
				.datum(data)
				.style("fill", "none")
				.attr("class", "line")
				.attr("d", line);

			// add data labels

			var label = svg.selectAll(".label")
				.data(data)
				.enter()
					.append("g")
						.attr("class", "label")
						.attr("transform", function(d) {
							if (percWhole == 0) { return "translate(" + (xScale(d.year) + (xScale.bandwidth()/2)) + "," + yScale(d.var2/100) + ")"; }
							if (percWhole == 1) { return "translate(" + (xScale(d.year) + (xScale.bandwidth()/2)) + "," + yScale(d.var1) + ")"; }
						});

			label.append("text")
				.attr("dy", "0.35em")
				.style("text-anchor", "middle")
				.text(function(d) {
					if (percWhole == 0) { return formatPerc(d.var2/100); }
					else if (percWhole == 1) {

						var maxVal = d3.max(data.map(function(d) { return d.var1; }));

						if (maxVal < 1000) { return formatNum(d.var1); }
						else if (maxVal < 1000000) { return formatNumDec(d.var1/1000) + "k"; }
						else { return formatNumDec(d.var1/1000000) + "M"; };

					}
				})
				.filter(function(d, i) { return i === data.length - 1; })
					.append("tspan")
						.attr("class", "label")
						.text(function(d) { return " " + d.categories; });

			label.append("rect", "text")
					.attr("x", function() { return this.parentNode.getBBox().x - labelPadding; })
					.attr("y", function() { return this.parentNode.getBBox().y - labelPadding; })
					.attr("width", function() { return this.parentNode.getBBox().width + (2 * labelPadding); })
					.attr("height", function() { return this.parentNode.getBBox().height + (2 * labelPadding); })
					.style("fill", "#FFF");

			label.selectAll("text")
				.remove();

			label.append("text")
				.attr("dy", "0.35em")
				.style("text-anchor", "middle")
				.text(function(d) {
					if (percWhole == 0) { return formatPerc(d.var2/100); }
					else if (percWhole == 1) {

						var maxVal = d3.max(data.map(function(d) { return d.var1; }));

						if (maxVal < 1000) { return formatNum(d.var1); }
						else if (maxVal < 1000000) { return formatNumDec(d.var1/1000) + "k"; }
						else { return formatNumDec(d.var1/1000000) + "M"; };

					}
				})
				.filter(function(d, i) { return i === data.length - 1; })
					.append("tspan")
						.attr("class", "label")
						.text(function(d) { return " " + d.categories; });

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

				if (document.getElementById(chartID).classList.contains("transitioned") == true) { }

				else if (document.getElementById(chartID).classList.contains("scroll-active") == true) {

					document.getElementById(chartID).classList.add("transitioned");

					svg.select("rect.screen")
						.transition("movescreen")
							.ease(d3.easeLinear)
							.duration((data.length/3)*animateTime)
							.attr("x", width)
							.transition()
								.attr("width", 0);

					svg.selectAll("text.levelLabel")
						.transition()
							.delay((data.length/3)*animateTime)
							.duration(animateTime)
							.attr("opacity", 1);

					svg.selectAll("text.valueLabel")
						.transition()
							.delay((data.length/3)*animateTime)
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

				var line = d3.line()
					.x(function(d) { return xScale(d.year) + xScale.bandwidth()/2; })
					.y(function(d) {
						if (percWhole == 0) { return yScale(d.var2/100); }
						if (percWhole == 1) { return yScale(d.var1); }
					});

				// check if animations have already fired

				function checkAnimate() {

					// if fired, just move things

					if (document.getElementById(chartID).classList.contains("transitioned") == true) {

						svg.selectAll("path.line")
							.transition()
								//.duration(animateTime)
								.attr("d", line);

						svg.selectAll("g.label")
							.transition()
								//.duration(animateTime)
								.attr("transform", function(d) {
									if (percWhole == 0) { return "translate(" + (xScale(d.year) + (xScale.bandwidth()/2)) + "," + yScale(d.var2/100) + ")"; }
									if (percWhole == 1) { return "translate(" + (xScale(d.year) + (xScale.bandwidth()/2)) + "," + yScale(d.var1) + ")"; }
								});

					}

					// if not fired, run full transitions

					else {

							svg.selectAll("path.line")
								.attr("d", line);

							svg.select("rect.screen")
								.attr("width", widthAdj);

							svg.selectAll("g.label")
								.attr("transform", function(d) {
									if (percWhole == 0) { return "translate(" + (xScale(d.year) + (xScale.bandwidth()/2)) + "," + yScale(d.var2/100) + ")"; }
									if (percWhole == 1) { return "translate(" + (xScale(d.year) + (xScale.bandwidth()/2)) + "," + yScale(d.var1) + ")"; }
								});

							window.removeEventListener("scroll", fireTransitions); // remove the old scroll listener and start again
							window.addEventListener("scroll", fireTransitions);

					};

				};

				checkAnimate();

			});

		})

	};

	chart.labelPadding = function(value) {
		if (!arguments.length) return labelPadding;
		labelPadding = value;
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

	chart.keys = function(value) {
		if (!arguments.length) return keys;
		keys = value;
		return chart;
	};

	return chart;

};

// Multi-line charts
// not very reusable

function multiLine() {

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
		labelPadding = 3,
		chartID = [],
		data = [],
		keys = [];

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

			xScale.domain(["2009-10", "2010-11", "2011-12", "2012-13", "2013-14", "2014-15"]); // FIX THIS LATER

			// build chart

			var dom = d3.select("#" + chartID);

			var svg = dom.append("svg")
				.attr("class", "multiLine")
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

			// draw lines

			var color = d3.scaleOrdinal()
				.domain(["Total", "Traditional", "Alternative, IHE-based", "Alternative, not IHE-based"]) // NEED TO FIGURE THIS OUT LATER
				.range(["#E56C0A", "#5DBF7E", "#2E8A95", "#215F8A", "#1C276E", "#FAC190", "#C8E9D2", "#8ED1E0", "#76B4DE", "#98A2E7"]);

			var line = d3.line()
				.x(function(d) { return xScale(d.year) + xScale.bandwidth()/2; })
				.y(function(d) {
					if (percWhole == 0) { return yScale(d.value/100); }
					if (percWhole == 1) { return yScale(d.value); }
				});

			var serie = svg.selectAll(".serie")
				.data(data)
				.enter()
					.append("g")
						.attr("class", "serie");

			serie.append("path")
				.style("fill", "none")
				.style("stroke", function(d) { return color(d[0].key); })
				.attr("class", "line")
				.attr("d", line);

			// add data labels

			var label = serie.selectAll(".label")
				.data(function(d) { return d; })
				.enter()
					.append("g")
						.attr("class", "label")
						.attr("transform", function(d) {
							if (percWhole == 0) { return "translate(" + (xScale(d.year) + (xScale.bandwidth()/2)) + "," + yScale(d.value/100) + ")"; }
							if (percWhole == 1) { return "translate(" + (xScale(d.year) + (xScale.bandwidth()/2)) + "," + yScale(d.value) + ")"; }
						});

			label.append("text")
				.attr("dy", "0.35em")
				.style("text-anchor", "middle")
				.style("fill", function(d) { return color(d.key); })
				.text(function(d) {
					if (percWhole == 0) { return formatPerc(d.value/100); }
					else if (percWhole == 1) {

						// var maxVal = d3.max(data.map(function(d) { return d.value; }));

						if (yMax < 1000) { return formatNum(d.value); }
						else if (yMax < 1000000) { return formatNumDec(d.value/1000) + "k"; }
						else { return formatNumDec(d.value/1000000) + "M"; };

					}
				})
				.filter(function(d, i) { return i === data[0].length - 1; })
					.append("tspan")
						.attr("class", "label")
						.style("fill", function(d) { return color(d.key); })
						.text(function(d) { return " " + d.key; });

			label.append("rect", "text")
					.attr("x", function() { return this.parentNode.getBBox().x - labelPadding; })
					.attr("y", function() { return this.parentNode.getBBox().y - labelPadding; })
					.attr("width", function() { return this.parentNode.getBBox().width + (2 * labelPadding); })
					.attr("height", function() { return this.parentNode.getBBox().height + (2 * labelPadding); })
					.style("fill", "#FFF");

			label.selectAll("text")
				.remove();

			label.append("text")
				.attr("dy", "0.35em")
				.style("text-anchor", "middle")
				.style("fill", function(d) { return color(d.key); })
				.text(function(d) {
					if (percWhole == 0) { return formatPerc(d.value/100); }
					else if (percWhole == 1) {

						// var maxVal = d3.max(data.map(function(d) { return d.value; }));

						if (yMax < 1000) { return formatNum(d.value); }
						else if (yMax < 1000000) { return formatNumDec(d.value/1000) + "k"; }
						else { return formatNumDec(d.value/1000000) + "M"; };

					}
				})
				.filter(function(d, i) { return i === data[0].length - 1; })
					.append("tspan")
						.attr("class", "label")
						.style("fill", function(d) { return color(d.key); })
						.text(function(d) { return " " + d.key; });

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

				if (document.getElementById(chartID).classList.contains("transitioned") == true) { }

				else if (document.getElementById(chartID).classList.contains("scroll-active") == true) {

					document.getElementById(chartID).classList.add("transitioned");

					svg.select("rect.screen")
						.transition("movescreen")
							.ease(d3.easeLinear)
							.duration((data.length/3)*animateTime)
							.attr("x", width)
							.transition()
								.attr("width", 0);

					svg.selectAll("text.levelLabel")
						.transition()
							.delay((data.length/3)*animateTime)
							.duration(animateTime)
							.attr("opacity", 1);

					svg.selectAll("text.valueLabel")
						.transition()
							.delay((data.length/3)*animateTime)
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

				var line = d3.line()
					.x(function(d) { return xScale(d.year) + xScale.bandwidth()/2; })
					.y(function(d) {
						if (percWhole == 0) { return yScale(d.value/100); }
						if (percWhole == 1) { return yScale(d.value); }
					});

				// check if animations have already fired

				function checkAnimate() {

					// if fired, just move things

					if (document.getElementById(chartID).classList.contains("transitioned") == true) {

						svg.selectAll("path.line")
							.transition()
								//.duration(animateTime)
								.attr("d", line);

						svg.selectAll("g.label")
							.transition()
								//.duration(animateTime)
								.attr("transform", function(d) {
									if (percWhole == 0) { return "translate(" + (xScale(d.year) + (xScale.bandwidth()/2)) + "," + yScale(d.value/100) + ")"; }
									if (percWhole == 1) { return "translate(" + (xScale(d.year) + (xScale.bandwidth()/2)) + "," + yScale(d.value) + ")"; }
								});

					}

					// if not fired, run full transitions

					else {

							svg.selectAll("path.line")
								.attr("d", line);

							svg.select("rect.screen")
								.attr("width", widthAdj);

							svg.selectAll("g.label")
								.attr("transform", function(d) {
									if (percWhole == 0) { return "translate(" + (xScale(d.year) + (xScale.bandwidth()/2)) + "," + yScale(d.value/100) + ")"; }
									if (percWhole == 1) { return "translate(" + (xScale(d.year) + (xScale.bandwidth()/2)) + "," + yScale(d.value) + ")"; }
								});

							window.removeEventListener("scroll", fireTransitions); // remove the old scroll listener and start again
							window.addEventListener("scroll", fireTransitions);

					};

				};

				checkAnimate();

			});

		})

	};

	chart.labelPadding = function(value) {
		if (!arguments.length) return labelPadding;
		labelPadding = value;
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

	chart.keys = function(value) {
		if (!arguments.length) return keys;
		keys = value;
		return chart;
	};

	return chart;

};
