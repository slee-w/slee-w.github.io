// tile grid map

function tileMap() {

	// options available to caller

	var chartID = [],
		regionSelectorID = [], // region selector ID
		selectedRegion = "All states", // default region is all states
		measureSelectorID = [], // measure selector ID
		selectedMeasure = [],
		prSelectorID = [], // percent/rank selector ID
		percRank = 0, // 0 = percent, 1 = rank, default is percent
		data = [],
		squareSize = 65;

	function chart(selection) {
		selection.each(function() {

			// number formats

			var valueFormat = d3.format(",.0f");

			// set up data for use
			// get regions from data

			var regions = d3.nest()
				.key(function(d) { return d.region; })
				.entries(data);

			regions.sort(function(a, b) { return d3.ascending(a.key, b.key); });

			// get measures from data

			var measures = d3.nest()
				.key(function(d) { return d.measure; })
				.entries(data);

			measures.sort(function(a, b) { return d3.ascending(a.key, b.key); });

			// build the map

			var dom = d3.select("#" + chartID);

			// region selector

			var regionSelectDiv = dom.append("div")
				.attr("class", "selectorDiv")
				.style("width", function(d) { return d3.max(data, function(d) { return d.col; }) * squareSize + "px"; });

			regionSelectDiv.append("div")
				.style("width", "15%")
				.append("text")
					.text("Select region:");

			var regionSelect = regionSelectDiv.append("div")
				.style("width", "85%")
				.append("select")
					.attr("id", regionSelectorID)
					.attr("class", "regionSelector")
					.style("width", "100%")
					.on("change", function() {

						// change selected region to new region

						selectedRegion = this.options[this.selectedIndex].text;

						// adjust colors of tiles

						svg.selectAll(".tile")
							.transition()
								.duration(1000)
								.attr("fill", function(d) {
									if (selectedRegion == "All states") {
										if (percRank == 0) {
											if (d.percent < 0) { return "#DDD"; }
											if (d.percent >= 0 && d.percent < 10) { return "#ffffcc"; }
											if (d.percent >= 10 && d.percent < 20) { return "#c7e9b4"; }
											if (d.percent >= 20 && d.percent < 30) { return "#7fcdbb"; }
											if (d.percent >= 30 && d.percent < 40) { return "#41b6c4"; }
											if (d.percent >= 40 && d.percent < 50) { return "#2c7fb8"; }
											if (d.percent >= 50) { return "#253494"; };
										}
										if (percRank == 1) {
											if (d.rank < 0) { return "#DDD"; }
											if (d.rank == 1) { return "#253494"; }
											if (d.rank == 2) { return "#2c7fb8"; }
											if (d.rank == 3) { return "#7fcdbb"; }
											if (d.rank == 4) { return "#c7e9b4"; }
										};
									}
									else if (selectedRegion != "All states") {
										if (d.region != selectedRegion) { return "#EEE"; }
										if (d.region == selectedRegion) {
											if (percRank == 0) {
												if (d.percent < 0) { return "#DDD"; }
												if (d.percent >= 0 && d.percent < 10) { return "#ffffcc"; }
												if (d.percent >= 10 && d.percent < 20) { return "#c7e9b4"; }
												if (d.percent >= 20 && d.percent < 30) { return "#7fcdbb"; }
												if (d.percent >= 30 && d.percent < 40) { return "#41b6c4"; }
												if (d.percent >= 40 && d.percent < 50) { return "#2c7fb8"; }
												if (d.percent >= 50) { return "#253494"; };
											}
											if (percRank == 1) {
												if (d.rank < 0) { return "#DDD"; }
												if (d.rank == 1) { return "#253494"; }
												if (d.rank == 2) { return "#2c7fb8"; }
												if (d.rank == 3) { return "#7fcdbb"; }
												if (d.rank == 4) { return "#c7e9b4"; }
											};
										};
									};
								});

						// adjust text opacity

						svg.selectAll(".tileLabel")
							.transition()
								.duration(1000)
								.attr("opacity", function(d) {
									if (selectedRegion == "All states") { return 1; }
									else if (selectedRegion != "All states") {
										if (d.region != selectedRegion) { return 0; }
										if (d.region == selectedRegion) { return 1; };
									};
								});

					});

			regionSelect.append("option")
				.property("selected", function(d) {
					if (selectedRegion == "All states") { return "All states"; }
					else {};
				})
				.text("All states");

			regionSelect.selectAll(".regionSelector")
				.data(regions)
				.enter()
					.append("option")
						.property("selected", function(d) {
							if (selectedRegion == "All states") {}
							else { return d.key == selectedRegion; };
						})
						.text(function(d) { return d.key; });

			// measure selector

			var measureSelectDiv = dom.append("div")
				.attr("class", "selectorDiv")
				.style("width", function(d) { return d3.max(data, function(d) { return d.col; }) * squareSize + "px"; });

			measureSelectDiv.append("div")
				.style("width", "15%")
				.append("text")
					.text("Select measure:");

			var measureSelect = measureSelectDiv.append("div")
				.style("width", "85%")
				.append("select")
					.attr("id", measureSelectorID)
					.attr("class", "measureSelector")
					.style("width", "100%")
					.on("change", function() {

						// change selected measure to new measure

						selectedMeasure = this.options[this.selectedIndex].text;

						// refilter data

						data1 = data.filter(function(d) { return d.measure == selectedMeasure && d.year == "2015"; }); // INITIAL YEAR FILTER FOR DEVELOPMENT

						svg.selectAll(".tile")
							.data(data1);

						svg.selectAll(".tileLabel")
							.data(data1);

						// adjust tile colors

						svg.selectAll(".tile")
							.transition()
								.duration(1000)
								.attr("fill", function(d) {
									if (selectedRegion == "All states") {
										if (percRank == 0) {
											if (d.percent < 0) { return "#DDD"; }
											if (d.percent >= 0 && d.percent < 10) { return "#ffffcc"; }
											if (d.percent >= 10 && d.percent < 20) { return "#c7e9b4"; }
											if (d.percent >= 20 && d.percent < 30) { return "#7fcdbb"; }
											if (d.percent >= 30 && d.percent < 40) { return "#41b6c4"; }
											if (d.percent >= 40 && d.percent < 50) { return "#2c7fb8"; }
											if (d.percent >= 50) { return "#253494"; };
										}
										if (percRank == 1) {
											if (d.rank < 0) { return "#DDD"; }
											if (d.rank == 1) { return "#253494"; }
											if (d.rank == 2) { return "#2c7fb8"; }
											if (d.rank == 3) { return "#7fcdbb"; }
											if (d.rank == 4) { return "#c7e9b4"; }
										};
									}
									else if (selectedRegion != "All states") {
										if (d.region != selectedRegion) { return "#EEE"; }
										if (d.region == selectedRegion) {
											if (percRank == 0) {
												if (d.percent < 0) { return "#DDD"; }
												if (d.percent >= 0 && d.percent < 10) { return "#ffffcc"; }
												if (d.percent >= 10 && d.percent < 20) { return "#c7e9b4"; }
												if (d.percent >= 20 && d.percent < 30) { return "#7fcdbb"; }
												if (d.percent >= 30 && d.percent < 40) { return "#41b6c4"; }
												if (d.percent >= 40 && d.percent < 50) { return "#2c7fb8"; }
												if (d.percent >= 50) { return "#253494"; };
											}
											if (percRank == 1) {
												if (d.rank < 0) { return "#DDD"; }
												if (d.rank == 1) { return "#253494"; }
												if (d.rank == 2) { return "#2c7fb8"; }
												if (d.rank == 3) { return "#7fcdbb"; }
												if (d.rank == 4) { return "#c7e9b4"; }
											};
										};
									};
								});

						// adjust text colors

						svg.selectAll(".tileLabel")
							.transition()
								.duration(1000)
								.style("fill", function(d) {
									if (percRank == 0) {
										if (d.percent < 0) { return "#000"; }
										if (d.percent >= 0 && d.percent < 10) { return "#000"; }
										if (d.percent >= 10 && d.percent < 20) { return "#000"; }
										if (d.percent >= 20 && d.percent < 30) { return "#000"; }
										if (d.percent >= 30 && d.percent < 40) { return "#000"; }
										if (d.percent >= 40 && d.percent < 50) { return "#FFF"; }
										if (d.percent >= 50) { return "#FFF"; };
									}
									if (percRank == 1) {
										if (d.rank < 0) { return "#000"; }
										if (d.rank == 1) { return "#FFF"; }
										if (d.rank == 2) { return "#FFF"; }
										if (d.rank == 3) { return "#000"; }
										if (d.rank == 4) { return "#000"; }
									};
								});

						// adjust percent value

						svg.selectAll(".tileLabelP")
							.transition()
								.duration(500)
								.style("opacity", 0)
								.on("end", function() {

									svg.selectAll(".tileLabelP")
										.remove();

									tileLabels.append("tspan")
										.attr("class", "tileLabelP")
										.attr("x", squareSize/2)
										.attr("dy", "1.2em") // make this one line lower
										.text(function(d) {
											if (d.percent == -9) { return "‡"; } // Suppressed
											if (d.percent == -8) { return "—"; } // Not available
											else { return valueFormat(d.percent); };
										})
										.attr("opacity", 0)
										.transition()
											.duration(500)
											.attr("opacity", 1);
								});

					});

			measureSelect.selectAll(".measureSelector")
				.data(measures)
				.enter()
					.append("option")
						.property("selected", function(d) { return d.key == selectedMeasure; })
						.text(function(d) { return d.key; });

			// percent or rank selector

			var prSelectDiv = dom.append("div")
				.attr("class", "selectorDiv")
				.style("width", function(d) { return d3.max(data, function(d) { return d.col; }) * squareSize + "px"; });

			prSelectDiv.append("div")
				.style("width", "15%")
				.append("text")
					.text("Color code by:");

			var prSelect = prSelectDiv.append("div")
				.style("width", "85%")
					.append("select")
					.attr("id", prSelectorID)
					.attr("class", "prSelector")
					.style("width", "100%")
					.on("change", function() {

						// change to selected fill type

						if (this.options[this.selectedIndex].text == "Percent") { percRank = 0; }
						if (this.options[this.selectedIndex].text == "Rank") { percRank = 1; };

						// adjust tile colors

						svg.selectAll(".tile")
							.transition()
								.duration(1000)
								.attr("fill", function(d) {
									if (selectedRegion == "All states") {
										if (percRank == 0) {
											if (d.percent < 0) { return "#DDD"; }
											if (d.percent >= 0 && d.percent < 10) { return "#ffffcc"; }
											if (d.percent >= 10 && d.percent < 20) { return "#c7e9b4"; }
											if (d.percent >= 20 && d.percent < 30) { return "#7fcdbb"; }
											if (d.percent >= 30 && d.percent < 40) { return "#41b6c4"; }
											if (d.percent >= 40 && d.percent < 50) { return "#2c7fb8"; }
											if (d.percent >= 50) { return "#253494"; };
										}
										if (percRank == 1) {
											if (d.rank < 0) { return "#DDD"; }
											if (d.rank == 1) { return "#253494"; }
											if (d.rank == 2) { return "#2c7fb8"; }
											if (d.rank == 3) { return "#7fcdbb"; }
											if (d.rank == 4) { return "#c7e9b4"; }
										};
									}
									else if (selectedRegion != "All states") {
										if (d.region != selectedRegion) { return "#EEE"; }
										if (d.region == selectedRegion) {
											if (percRank == 0) {
												if (d.percent < 0) { return "#DDD"; }
												if (d.percent >= 0 && d.percent < 10) { return "#ffffcc"; }
												if (d.percent >= 10 && d.percent < 20) { return "#c7e9b4"; }
												if (d.percent >= 20 && d.percent < 30) { return "#7fcdbb"; }
												if (d.percent >= 30 && d.percent < 40) { return "#41b6c4"; }
												if (d.percent >= 40 && d.percent < 50) { return "#2c7fb8"; }
												if (d.percent >= 50) { return "#253494"; };
											}
											if (percRank == 1) {
												if (d.rank < 0) { return "#DDD"; }
												if (d.rank == 1) { return "#253494"; }
												if (d.rank == 2) { return "#2c7fb8"; }
												if (d.rank == 3) { return "#7fcdbb"; }
												if (d.rank == 4) { return "#c7e9b4"; }
											};
										};
									};
								});

						// adjust text colors

						svg.selectAll(".tileLabel")
							.transition()
								.duration(1000)
								.style("fill", function(d) {
									if (percRank == 0) {
										if (d.percent < 0) { return "#000"; }
										if (d.percent >= 0 && d.percent < 10) { return "#000"; }
										if (d.percent >= 10 && d.percent < 20) { return "#000"; }
										if (d.percent >= 20 && d.percent < 30) { return "#000"; }
										if (d.percent >= 30 && d.percent < 40) { return "#000"; }
										if (d.percent >= 40 && d.percent < 50) { return "#FFF"; }
										if (d.percent >= 50) { return "#FFF"; };
									}
									if (percRank == 1) {
										if (d.rank < 0) { return "#000"; }
										if (d.rank == 1) { return "#FFF"; }
										if (d.rank == 2) { return "#FFF"; }
										if (d.rank == 3) { return "#000"; }
										if (d.rank == 4) { return "#000"; }
									};
								});

					});

			prSelect.append("option")
				.property("selected", function() {
					if (percRank == 0) { return "Percent"; }
					else {};
				})
				.text("Percent");

			prSelect.append("option")
				.property("selected", function() {
					if (percRank == 1) { return "Rank"; }
					else {};
				})
				.text("Rank");

			// add line break before map

			dom.append("br");

			// map begins here
			// initial filtering

			data1 = data.filter(function(d) { return d.measure == selectedMeasure && d.year == "2015"; }); // INITIAL YEAR FILTER FOR DEVELOPMENT

			// begin building map

			var width = d3.max(data1, function(d) { return d.col; }) * squareSize;
			var height = d3.max(data1, function(d) { return d.row; }) * squareSize;

			var svg = dom.append("svg")
				.attr("class", "tileMap")
				.attr("width", width)
				.attr("height", height + 50)
				.append("g")
					.attr("transform", "translate(" + 0 + "," + 0 + ")");

			// draw tiles

			var tiles = svg.selectAll(".tile")
				.data(data1)
				.enter()
					.append("g")
						.attr("transform", function(d) { return "translate(" + ((d.col * squareSize) - squareSize) + "," + ((d.row * squareSize) - squareSize) + ")"; })
						.attr("width", squareSize)
						.attr("height", squareSize);

			tiles.append("rect")
				.attr("class", "tile")
				.attr("x", 0)
				.attr("y", 0)
				.attr("width", squareSize)
				.attr("height", squareSize)
				.attr("fill", function(d) {
					if (selectedRegion == "All states") {
						if (percRank == 0) {
							if (d.percent < 0) { return "#DDD"; }
							if (d.percent >= 0 && d.percent < 10) { return "#ffffcc"; }
							if (d.percent >= 10 && d.percent < 20) { return "#c7e9b4"; }
							if (d.percent >= 20 && d.percent < 30) { return "#7fcdbb"; }
							if (d.percent >= 30 && d.percent < 40) { return "#41b6c4"; }
							if (d.percent >= 40 && d.percent < 50) { return "#2c7fb8"; }
							if (d.percent >= 50) { return "#253494"; };
						}
						if (percRank == 1) {
							if (d.rank < 0) { return "#DDD"; }
							if (d.rank == 1) { return "#253494"; }
							if (d.rank == 2) { return "#2c7fb8"; }
							if (d.rank == 3) { return "#7fcdbb"; }
							if (d.rank == 4) { return "#c7e9b4"; }
						};
					}
					else if (selectedRegion != "All states") {
						if (d.region != selectedRegion) { return "#EEE"; }
						if (d.region == selectedRegion) {
							if (percRank == 0) {
								if (d.percent < 0) { return "#DDD"; }
								if (d.percent >= 0 && d.percent < 10) { return "#ffffcc"; }
								if (d.percent >= 10 && d.percent < 20) { return "#c7e9b4"; }
								if (d.percent >= 20 && d.percent < 30) { return "#7fcdbb"; }
								if (d.percent >= 30 && d.percent < 40) { return "#41b6c4"; }
								if (d.percent >= 40 && d.percent < 50) { return "#2c7fb8"; }
								if (d.percent >= 50) { return "#253494"; };
							}
							if (percRank == 1) {
								if (d.rank < 0) { return "#DDD"; }
								if (d.rank == 1) { return "#253494"; }
								if (d.rank == 2) { return "#2c7fb8"; }
								if (d.rank == 3) { return "#7fcdbb"; }
								if (d.rank == 4) { return "#c7e9b4"; }
							};
						};
					};
				})
				.attr("opacity", 0)
				.transition()
					.duration(1000)
					.attr("opacity", 1);

				// add data labels
				// first, state abbreviations

				var tileLabels = tiles.append("text")
					.attr("class", "tileLabel")
					.attr("y", squareSize/2)
					.attr("opacity", function(d) {
						if (selectedRegion == "All states") { return 1; }
						else if (selectedRegion != "All states") {
							if (d.region != selectedRegion) { return 0; }
							if (d.region == selectedRegion) { return 1; };
						};
					})
					.style("fill", function(d) {
						if (percRank == 0) {
							if (d.percent < 0) { return "#000"; }
							if (d.percent >= 0 && d.percent < 10) { return "#000"; }
							if (d.percent >= 10 && d.percent < 20) { return "#000"; }
							if (d.percent >= 20 && d.percent < 30) { return "#000"; }
							if (d.percent >= 30 && d.percent < 40) { return "#000"; }
							if (d.percent >= 40 && d.percent < 50) { return "#FFF"; }
							if (d.percent >= 50) { return "#FFF"; };
						}
						if (percRank == 1) {
							if (d.rank < 0) { return "#000"; }
							if (d.rank == 1) { return "#FFF"; }
							if (d.rank == 2) { return "#FFF"; }
							if (d.rank == 3) { return "#000"; }
							if (d.rank == 4) { return "#000"; }
						};
					})
					.attr("text-anchor", "middle")
					.attr("dominant-baseline", "mathematical");

				tileLabels.append("tspan")
					.attr("x", squareSize/2)
					.attr("dy", "-0.6em") // move up half
					.attr("font-weight", "bold")
					.text(function(d) { return d.stabbr; })
					.attr("opacity", 0)
					.transition()
						.duration(1000)
						.attr("opacity", 1);

				tileLabels.append("tspan")
					.attr("class", "tileLabelP")
					.attr("x", squareSize/2)
					.attr("dy", "1.2em") // make this one line lower
					.text(function(d) {
						if (d.percent == -9) { return "‡"; } // Suppressed
						if (d.percent == -8) { return "—"; } // Not available
						else { return valueFormat(d.percent); };
					})
					.attr("opacity", 0)
					.transition()
						.duration(1000)
						.attr("opacity", 1);

				// year slider

				function drawSlider() {

					data2 = data.filter(function(d) { return d.measure == selectedMeasure; }); // filter to selected measure

					console.log(d3.map(data2, function(d) { return d.year; }).keys());

					var sliderX = d3.scaleBand()
						.domain(d3.map(data2, function(d) { return d.year; }).keys()) // need to adjust this based on data selected
						.range([0, width - 50]);

					var slider = svg.append("g")
						.attr("class", "slider")
						.attr("transform", "translate(" + 25 + "," + (height + 25) + ")");

					slider.append("line")
						.attr("class", "track")
						.attr("x1", sliderX.range()[0])
						.attr("x2", sliderX.range()[1])
						.select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
							.attr("class", "track-inset")
						.select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
							.attr("class", "track-overlay")
							.call(d3.drag()
								.on("start.interrupt", function() { slider.interrupt(); })
								.on("start drag", function() { /*slide(sliderX*/console.log(sliderX.point(d3.event.x)); }));

					slider.insert("g", ".track-overlay")
				    .attr("class", "ticks")
				    .attr("transform", "translate(0," + 18 + ")")
					  .selectAll("text")
					  .data(sliderX.domain())
					  .enter().append("text")
					    .attr("x", sliderX)
					    .attr("text-anchor", "middle")
					    .text(function(d) { return d; });

					var handle = slider.insert("circle", ".track-overlay")
				    .attr("class", "handle")
				    .attr("r", 9)
						.attr("cx", sliderX(d3.max(data1, function(d) { return d.year; }))); // initially start at most recent year

					function slide(v) {
						handle.attr("cx", sliderX(d3.format(".0f")(v)));
					};

				};

				drawSlider();

		});
	};

	chart.chartID = function(value) {
		if (!arguments.length) return chartID;
		chartID = value;
		return chart;
	};

  chart.regionSelectorID = function(value) {
		if (!arguments.length) return regionSelectorID;
		regionSelectorID = value;
		return chart;
	};

	chart.selectedRegion = function(value) {
		if (!arguments.length) return selectedRegion;
		selectedRegion = value;
		return chart;
	};

  chart.measureSelectorID = function(value) {
		if (!arguments.length) return measureSelectorID;
		measureSelectorID = value;
		return chart;
	};

	chart.selectedMeasure = function(value) {
		if (!arguments.length) return selectedMeasure;
		selectedMeasure = value;
		return chart;
	};

	chart.prSelectorID = function(value) {
		if (!arguments.length) return prSelectorID;
		prSelectorID = value;
		return chart;
	};

	chart.percRank = function(value) {
		if (!arguments.length) return percRank;
		percRank = value;
		return chart;
	};

	chart.data = function(value) {
		if (!arguments.length) return data;
		data = value;
		return chart;
	};

	chart.squareSize = function(value) {
		if (!arguments.length) return squareSize;
		squareSize = value;
		return chart;
	};

	return chart;

};

// table arrays

function tableArray() {

	// options available to caller

	var chartID = [],
		regionSelectorID = [], // region selector ID
		selectedRegion = "All states", // default region is all states
		measureSelectorID = [], // measure selector ID
		selectedMeasure = [],
		prSelectorID = [], // percent/rank selector ID
		percRank = 0, // 0 = percent, 1 = rank, default is percent
		data = [],
		squareSize = 20;

	function chart(selection) {
		selection.each(function() {

			// number formats

			var valueFormat = d3.format(",.0f");

			// set up data for use
			// get regions from data

			var regions = d3.nest()
				.key(function(d) { return d.region; })
				.entries(data);

			regions.sort(function(a, b) { return d3.ascending(a.key, b.key); });

			// get measures from data

			var measures = d3.nest()
				.key(function(d) { return d.measure; })
				.entries(data);

			measures.sort(function(a, b) { return d3.ascending(a.key, b.key); });

			// build the table

			var dom = d3.select("#" + chartID);

			// region selector

			var regionSelectDiv = dom.append("div")
				.attr("class", "selectorDiv")
				.style("width", (16*squareSize) + "px");

			regionSelectDiv.append("div")
				.style("width", 6*squareSize + "px")
				.append("text")
					.text("Select region:");

			var regionSelect = regionSelectDiv.append("div")
				.style("width", (10*squareSize) + "px")
				.append("select")
					.attr("id", regionSelectorID)
					.attr("class", "regionSelector")
					.style("width", "100%")
					.on("change", function() {

						// change selected region to new region

						selectedRegion = this.options[this.selectedIndex].text;

						// remove existing table

						dom.select(".dataTable")
							.transition()
								.duration(500)
									.style("opacity", 0)
									.on("end", function() {

										dom.select(".dataTable")
											.remove();

										// redraw table with new measure

										buildTable();

										dom.select(".dataTable")
											.transition()
												.duration(500)
												.style("opacity", 1);

									})

					});

			regionSelect.append("option")
				.property("selected", function(d) {
					if (selectedRegion == "All states") { return "All states"; }
					else {};
				})
				.text("All states");

			regionSelect.selectAll(".regionSelector")
				.data(regions)
				.enter()
					.append("option")
						.property("selected", function(d) {
							if (selectedRegion == "All states") {}
							else { return d.key == selectedRegion; };
						})
						.text(function(d) { return d.key; });

			// measure selector

			var measureSelectDiv = dom.append("div")
				.attr("class", "selectorDiv")
				.style("width", (16*squareSize) + "px");

			measureSelectDiv.append("div")
				.style("width", 6*squareSize + "px")
				.append("text")
					.text("Select measure:");

			var measureSelect = measureSelectDiv.append("div")
				.style("width", (10*squareSize) + "px")
				.append("select")
					.attr("id", measureSelectorID)
					.attr("class", "measureSelector")
					.style("width", "100%")
					.on("change", function() {

						// change selected region to new region

						selectedMeasure = this.options[this.selectedIndex].text;

						// remove existing table

						dom.select(".dataTable")
							.transition()
								.duration(500)
									.style("opacity", 0)
									.on("end", function() {

										dom.select(".dataTable")
											.remove();

										// redraw table with new measure

										buildTable();

										dom.select(".dataTable")
											.transition()
												.duration(500)
												.style("opacity", 1);

									})

					});

			measureSelect.selectAll(".measureSelector")
				.data(measures)
				.enter()
					.append("option")
						.property("selected", function(d) { return d.key == selectedMeasure; })
						.text(function(d) { return d.key; });

			// percent or rank selector

			var prSelectDiv = dom.append("div")
				.attr("class", "selectorDiv")
				.style("width", (16*squareSize) + "px");

			prSelectDiv.append("div")
				.style("width", 6*squareSize + "px")
				.append("text")
					.text("Color code by:");

			var prSelect = prSelectDiv.append("div")
				.style("width", (10*squareSize) + "px")
					.append("select")
					.attr("id", prSelectorID)
					.attr("class", "prSelector")
					.style("width", "100%")
					.on("change", function() {

						// change to selected fill type

						if (this.options[this.selectedIndex].text == "Percent") { percRank = 0; }
						if (this.options[this.selectedIndex].text == "Rank") { percRank = 1; };

						// re-color squares

						dom.selectAll(".squares")
							.transition()
								.duration(1000)
								.style("background-color", function(d) {
									if (percRank == 0) {
										if (d.percent < 0) { return "#FFF"; }
										if (d.percent >= 0 && d.percent < 10) { return "#ffffcc"; }
										if (d.percent >= 10 && d.percent < 20) { return "#c7e9b4"; }
										if (d.percent >= 20 && d.percent < 30) { return "#7fcdbb"; }
										if (d.percent >= 30 && d.percent < 40) { return "#41b6c4"; }
										if (d.percent >= 40 && d.percent < 50) { return "#2c7fb8"; }
										if (d.percent >= 50) { return "#253494"; };
									}
									if (percRank == 1) {
										if (d.rank < 0) { return "#FFF"; }
										if (d.rank == 1) { return "#253494"; }
										if (d.rank == 2) { return "#2c7fb8"; }
										if (d.rank == 3) { return "#7fcdbb"; }
										if (d.rank == 4) { return "#c7e9b4"; }
									}
								});

						dom.selectAll(".squareText")
							.transition()
								.duration(1000)
								.style("color", function(d) {
									if (percRank == 0) {
										if (d.percent < 0) { return "#000"; }
										if (d.percent >= 0 && d.percent < 10) { return "#000"; }
										if (d.percent >= 10 && d.percent < 20) { return "#000"; }
										if (d.percent >= 20 && d.percent < 30) { return "#000"; }
										if (d.percent >= 30 && d.percent < 40) { return "#000"; }
										if (d.percent >= 40 && d.percent < 50) { return "#FFF"; }
										if (d.percent >= 50) { return "#FFF"; };
									}
									if (percRank == 1) {
										if (d.rank < 0) { return "#000"; }
										if (d.rank == 1) { return "#FFF"; }
										if (d.rank == 2) { return "#FFF"; }
										if (d.rank == 3) { return "#000"; }
										if (d.rank == 4) { return "#000"; }
									}
								});

						// redraw table with new fill

						//buildTable();

					});

			prSelect.append("option")
				.property("selected", function() {
					if (percRank == 0) { return "Percent"; }
					else {};
				})
				.text("Percent");

			prSelect.append("option")
				.property("selected", function() {
					if (percRank == 1) { return "Rank"; }
					else {};
				})
				.text("Rank");

			// add line break before table

			dom.append("br");

			// table begins here

			function buildTable() {

				// initial filtering

				data1 = data.filter(function(d) {
					if (selectedRegion == "All states") { return d.measure == selectedMeasure; }
					if (selectedRegion !== "All states") { return d.region == selectedRegion && d.measure == selectedMeasure; };
				});

				// nest data by state

				var data2 = d3.nest()
					.key(function(d) { return d.state; })
					.entries(data1);

				// begin building table

				var tableShell = dom.append("div")
					.attr("class", "dataTable")
					.style("opacity", 0)
					.style("width", 16*squareSize + "px");

				// table header

				var tableHeader = tableShell.selectAll(".tableHeader")
					.data(data2.filter(function(d, i) { return i === 0; })) // pull the years from the first observation
					.enter()
						.append("div")
							.attr("class", "tableHeader");

				tableHeader.append("div")
					.style("width", 6*squareSize + "px");

				var years = tableHeader.selectAll(".tableHeader")
					.data(function(d) { return d.values; })
					.enter()
						.append("div")
							.attr("class", "years")
							.style("width", squareSize*2 + "px")
							.style("height", squareSize + "px");

				years.append("text")
					.text(function(d) { return d.year; });

				// individual rows per state

				var tableRows = tableShell.selectAll(".tableRow")
					.data(data2)
					.enter()
						.append("div")
							.attr("class", "tableRow");

					// state names

					tableRows.append("div")
						.attr("class", "stateNames")
						.style("width", 6*squareSize + "px")
						/*.style("height", squareSize*2 + "px")
						.style("line-height", squareSize*2 + "px")*/
						.append("text")
							.text(function(d) { return d.key; });

					// data squares

					var squares = tableRows.selectAll(".squares")
						.data(data2)
						.each()
							.data(function(d) { return d.values; })
							.enter()
								.append("div")
									.attr("class", "squares")
									.style("width", squareSize*2 + "px")
									.style("height", squareSize*2 + "px")
									.style("line-height", squareSize*2 + "px")
									.style("background-color", function(d) {
										if (percRank == 0) {
											if (d.percent < 0) { return "#FFF"; }
											if (d.percent >= 0 && d.percent < 10) { return "#ffffcc"; }
											if (d.percent >= 10 && d.percent < 20) { return "#c7e9b4"; }
											if (d.percent >= 20 && d.percent < 30) { return "#7fcdbb"; }
											if (d.percent >= 30 && d.percent < 40) { return "#41b6c4"; }
											if (d.percent >= 40 && d.percent < 50) { return "#2c7fb8"; }
											if (d.percent >= 50) { return "#253494"; };
										}
										if (percRank == 1) {
											if (d.rank < 0) { return "#FFF"; }
											if (d.rank == 1) { return "#253494"; }
											if (d.rank == 2) { return "#2c7fb8"; }
											if (d.rank == 3) { return "#7fcdbb"; }
											if (d.rank == 4) { return "#c7e9b4"; }
										}
									});

					// percent labels

					squares.append("text")
						.attr("class", "squareText")
						.style("color", function(d) {
							if (percRank == 0) {
								if (d.percent < 0) { return "#000"; }
								if (d.percent >= 0 && d.percent < 10) { return "#000"; }
								if (d.percent >= 10 && d.percent < 20) { return "#000"; }
								if (d.percent >= 20 && d.percent < 30) { return "#000"; }
								if (d.percent >= 30 && d.percent < 40) { return "#000"; }
								if (d.percent >= 40 && d.percent < 50) { return "#FFF"; }
								if (d.percent >= 50) { return "#FFF"; };
							}
							if (percRank == 1) {
								if (d.rank < 0) { return "#000"; }
								if (d.rank == 1) { return "#FFF"; }
								if (d.rank == 2) { return "#FFF"; }
								if (d.rank == 3) { return "#000"; }
								if (d.rank == 4) { return "#000"; }
							}
						})
						.text(function(d) {
							if (d.percent == -9) { return "‡"; } // Suppressed
							if (d.percent == -8) { return "—"; } // Not available
							else { return valueFormat(d.percent); };
						});

			tableShell.append("br"); // add line break at the end of the table

			};

			buildTable();

			dom.select(".dataTable")
				.transition()
					.duration(1000)
					.style("opacity", 1);

		});
	};

	chart.chartID = function(value) {
		if (!arguments.length) return chartID;
		chartID = value;
		return chart;
	};

  chart.regionSelectorID = function(value) {
		if (!arguments.length) return regionSelectorID;
		regionSelectorID = value;
		return chart;
	};

	chart.selectedRegion = function(value) {
		if (!arguments.length) return selectedRegion;
		selectedRegion = value;
		return chart;
	};

  chart.measureSelectorID = function(value) {
		if (!arguments.length) return measureSelectorID;
		measureSelectorID = value;
		return chart;
	};

	chart.selectedMeasure = function(value) {
		if (!arguments.length) return selectedMeasure;
		selectedMeasure = value;
		return chart;
	};

	chart.prSelectorID = function(value) {
		if (!arguments.length) return prSelectorID;
		prSelectorID = value;
		return chart;
	};

	chart.percRank = function(value) {
		if (!arguments.length) return percRank;
		percRank = value;
		return chart;
	};

	chart.data = function(value) {
		if (!arguments.length) return data;
		data = value;
		return chart;
	};

	chart.squareSize = function(value) {
		if (!arguments.length) return squareSize;
		squareSize = value;
		return chart;
	};

	return chart;

};
