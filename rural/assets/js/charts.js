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

						dom.select(".dataTable").remove();

						// redraw table with new region

						buildTable();

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

						dom.select(".dataTable").remove();

						// redraw table with new measure

						buildTable();

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

						// remove existing table

						dom.select(".dataTable").remove();

						// redraw table with new fill

						buildTable();

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
