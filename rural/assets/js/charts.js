// table arrays

function tableArray() {

	// margins, width, height, dataset

	var chartID = [],
			data = [],
			squareSize = 25;

	function chart(selection) {
		selection.each(function() {

			// set up data for use

			data1 = data.filter(function(d) { return d.measure == "NAEP Mathematics 4" && d.region == "South"; }); // Initial filter for testing

			// nest data by state

			var data2 = d3.nest()
				.key(function(d) { return d.state; })
				.entries(data1);

			// number formats

			var formatPerc = d3.format(".1%");

			// build the tableArray

			var dom = d3.select("#" + chartID);

			var tableShell = dom.append("div")
				.attr("class", "dataTable")
				.attr("width", 16*squareSize + "px");

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
					.style("height", squareSize*2 + "px")
					.style("line-height", squareSize*2 + "px")
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
										if (d.percent < 0) { return "#FFF"; }
										if (d.percent >= 0 && d.percent < 10) { return "#ffffcc"; }
										if (d.percent >= 10 && d.percent < 20) { return "#c7e9b4"; }
										if (d.percent >= 20 && d.percent < 30) { return "#7fcdbb"; }
										if (d.percent >= 30 && d.percent < 40) { return "#41b6c4"; }
										if (d.percent >= 40 && d.percent < 50) { return "#2c7fb8"; }
										if (d.percent >= 50) { return "#253494"; };
									});

				// percent labels

				squares.append("text")
					.style("color", function(d) {
						if (d.percent < 0) { return "#000"; }
						if (d.percent >= 0 && d.percent < 10) { return "#000"; }
						if (d.percent >= 10 && d.percent < 20) { return "#000"; }
						if (d.percent >= 20 && d.percent < 30) { return "#000"; }
						if (d.percent >= 30 && d.percent < 40) { return "#000"; }
						if (d.percent >= 40 && d.percent < 50) { return "#FFF"; }
						if (d.percent >= 50) { return "#FFF"; };
					})
					.text(function(d) {
						if (d.percent == -9) { return "‡"; } // Suppressed
						if (d.percent == -8) { return "—"; } // Not available
						else { return formatPerc(d.percent/100); };
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

	chart.squareSize = function(value) {
    if (!arguments.length) return squareSize;
    squareSize = value;
    return chart;
  };

	return chart;

};
