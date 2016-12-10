// Small multiples waffles

function waffles() {
			
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
					d.units = d.percent;
					waffleData = waffleData.concat(
						Array(d.units+1).join(1).split("").map(function() {
							return {
								subject: d.subject,
								use_type: d.use_type,
								squareValue: 1,
								units: d.units,
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
							.style("opacity", 0)
							.style("fill", function(d) {
								if (d.use_type == "For") { return color(d.subject) }
								else { return "#F1F2F1"}
							})
							.transition()
								.ease(d3.easeQuadInOut)
								.delay(function(d, i) { return i*25; })
								.duration(0)
								.style("opacity", 100);

				var waffleText = waffleDiv.append("div")
					.attr("width", width);

				var waffleCounter = waffleText.selectAll("text.waffleCounter")
					.data(subjects);
					
				waffleCounter.each()
					.data(function(d) { return d.values; })
					.enter()
						.filter(function(d, i) { return d.use_type == "For" && i === 0; })
						.append("text")
							.text("0")
							.style("color", function(d) { return color(d.subject) })
							.attr("class", "waffleCounter");

				var format = d3.format(".0%");	

				waffleText.selectAll("text")
					.transition()
					.duration(function(d) { return 25*d.units; })
					.tween("text", function(d) {
					
						var that = d3.select(this),
							i = d3.interpolateNumber(that.text(), d.units/100);
							
						return function(t) { that.text(format(i(t))); };
						
					});

				var waffleSubject = waffleText.selectAll("p.waffleSubject")
					.data(subjects);
				
				waffleSubject.each()
					.data(function(d) { return d.values; })
					.enter()
						.filter(function(d, i) { return i === 0; })
						.append("p")
							.text(function(d) { return d.subject; })
							.attr("class", "waffleSubject");
			
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
	