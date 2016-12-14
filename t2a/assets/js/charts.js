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
		chartID = [],
		data = [];
	
	function chart(selection) {
		selection.each(function() {
			
			// sort data
			
			data.sort(function(a, b) { return d3.descending(a.order, b.order); });
			
			// formats
			
			var format = d3.format(".0%");
			
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
						
			svg.append("g")
				.attr("class", "xAxis")
				.attr("transform", "translate(0," + heightAdj + ")")
				.call(d3.axisBottom(xScale).tickValues([0, xMax]).tickSize(0));
				
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
					.attr("x", function(d) { return xScale(d.percent); })
					.attr("dx", "0.5em")
					.attr("y", function(d) { return yScale(d.group) + (yScale.bandwidth()/2); })
					.attr("dy", "0.35em")
					.attr("opacity", 0)
					.text(function(d) { return format(d.percent/100); });
				
			//check for scroll to fire transitions
			
			window.addEventListener("scroll", function() { 
			
				if (document.getElementById(chartID).classList.contains("transitioned") == true) {	}
			
				else if (document.getElementById(chartID).classList.contains("scroll-active") == true) {
					
					document.getElementById(chartID).classList.add("transitioned");
					
					svg.selectAll("rect.bar")
						.transition("widen")
							.duration(animateTime)
							.attr("width", function(d) { return xScale(d.percent); })
	
					svg.selectAll("rect.barMax")
						.transition("widen")
							.duration(animateTime)
							.attr("width", function(d) { return xScale(d.percent); })
	
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
				
			});
			
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
					.call(d3.axisBottom(xScale).tickValues([0, xMax]).tickSize(0));

				// move the data labels (base position does not depend on transitions)
					
				svg.selectAll("text.barLabel")
					.transition()
						.duration(animateTime)
						.attr("x", function(d) { return xScale(d.percent); })
						
				svg.selectAll("text.barMaxLabel")
					.transition()
						.duration(animateTime)
						.attr("x", function(d) { return xScale(d.percent); })					
					
				// check if animations have already fired
					
				function checkAnimate() { 

					// if fired, just move things
				
					if (document.getElementById(chartID).classList.contains("transitioned") == true) {	
					
						svg.selectAll("rect.bar")
							.transition()
								.duration(animateTime)
								.attr("width", function(d) { return xScale(d.percent); })
								
						svg.selectAll("rect.barMax")
							.transition()
								.duration(animateTime)
								.attr("width", function(d) { return xScale(d.percent); })
														
					}
					
					// if not fired, run full transitions
					
					else if (document.getElementById(chartID).classList.contains("scroll-active") == true) {
						
						document.getElementById(chartID).classList.add("transitioned");
						
						svg.selectAll("rect.bar")
							.transition("widen")
								.duration(animateTime)
								.attr("width", function(d) { return xScale(d.percent); })
		
						svg.selectAll("rect.barMax")
							.transition("widen")
								.duration(animateTime)
								.attr("width", function(d) { return xScale(d.percent); })
		
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
				
				checkAnimate();
					
			});
			
		})
		
	};

	chart.xMax = function(value) {
		if (!arguments.length) return xMax;
		xMax = value;
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
							.style("fill", "#F1F2F1");

				var waffleText = waffleDiv.append("div")
					.attr("width", width);

				var waffleCounter = waffleText.selectAll("text.waffleCounter")
					.data(subjects);
					
				var format = d3.format(".0%");		
					
				waffleCounter.each()
					.data(function(d) { return d.values; })
					.enter()
						.filter(function(d, i) { return d.use_type == "For" && i === 0; })
						.append("text")
							.text("0%")
							.style("color", function(d) { return color(d.subject) })
							.attr("class", "waffleCounter");

				var waffleSubject = waffleText.selectAll("p.waffleSubject")
					.data(subjects);
				
				waffleSubject.each()
					.data(function(d) { return d.values; })
					.enter()
						.filter(function(d, i) { return i === 0; })
						.append("p")
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
									i = d3.interpolateNumber(0, d.units/100);
									
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
	