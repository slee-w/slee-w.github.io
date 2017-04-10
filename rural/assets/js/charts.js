// table arrays

function tableArray() {

	// margins, width, height, dataset

	var chartID = [],
			data = [],
			squareSize = 25;

	function chart(selection) {
		selection.each(function() {

			// set up data for use

			data1 = data.filter(function(d) { return d.measure == "NAEP Mathematics 4"; }); // Initial filter for testing

			// nest data by state

			var data2 = d3.nest()
				.key(function(d) { return d.state; })
				.entries(data1);

			// number formats

			var formatPerc = d3.format(".1%");

			// build the tableArray

			var dom = d3.select("#" + chartID);

			var tableShell = dom.append("table")
				.attr("class", "dataTable")
				.attr("width", 20*squareSize);

			// table header

			// individual rows per state

			var tableRows = tableShell.selectAll(".tableRows")
				.data(data2)
				.enter()
					.append("tr");

 				// state names

				tableRows.append("td")
					.append("text")
						.attr("width", 5*squareSize)
						.text(function(d) { return d.key; });

				// yearly data

				var squares = tableRows.selectAll("tr")
					.data(data2)
					.each()
						.data(function(d) { return d.values; })
						.enter()
							.append("td")
								.attr("width", squareSize*2)
								.attr("height", squareSize*2)
								.append("svg")
									.attr("width", squareSize*2)
									.attr("height", squareSize*2);

				// add squares

				squares.append("rect")
					.attr("width", squareSize*2)
					.attr("height", squareSize*2)
					.attr("fill", function(d) {
						if (d.percent < 0) { return "#FFF"; }
						if (d.percent >= 0 && d.percent < 10) { return "#ffffcc"; }
						if (d.percent >= 10 && d.percent < 20) { return "#c7e9b4"; }
						if (d.percent >= 20 && d.percent < 30) { return "#7fcdbb"; }
						if (d.percent >= 30 && d.percent < 40) { return "#41b6c4"; }
						if (d.percent >= 40 && d.percent < 50) { return "#2c7fb8"; }
						if (d.percent >= 50) { return "#253494"; };
					});

				squares.append("text")
					.attr("x", squareSize)
					.attr("y", squareSize)
					.attr("dy", "0.35em")
					.attr("text-anchor", "middle")
					.text(function(d) {
						if (d.percent == -9) { return "‡"; }
						else { return formatPerc(d.percent/100); };
					});

				/*tableRows.enter()
					.append("tr");*/

					/*.append("td")
						.attr("width", 5*squareSize)
						.append("text")
							.text(function(d) { return d.key; });*/

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

	chart.squareSize = function(value) {
    if (!arguments.length) return squareSize;
    squareSize = value;
    return chart;
  };

	return chart;

};
