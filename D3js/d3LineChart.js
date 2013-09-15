/**
 * User: nross
 */
var w = 900,
    h = 450;

var monthNames = [ "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December" ];

var maxDataPointsForDots = 50,
	transitionDuration = 1000;

var svg = null,
	yAxisGroup = null,
	xAxisGroup = null,
	dataCirclesGroup = null,
	dataLinesGroup = null;
	var myonetriangle = null;

function draw() {
	var data = generateData();
	var margin = 40;
	var max = d3.max(data, function(d) { return d.value });
	var min = 0;
	var pointRadius = 4;
	var x = d3.scale.linear().range([0, w - margin * 2]).domain([0, 1200]);
	var y = d3.scale.linear().range([h - margin * 2, 0]).domain([min, max]);

	var xAxis = d3.svg.axis().scale(x).tickSize(h - margin * 2).tickPadding(10);
	var yAxis = d3.svg.axis().scale(y).orient('left').tickSize(-w + margin * 2).tickPadding(10);
	var t = null;

	svg = d3.select('#chart').select('svg').select('g');
	if (svg.empty()) {
		svg = d3.select('#chart')
			.append('svg:svg')
				.attr('width', w)
				.attr('height', h)
				.attr('class', 'viz')
			.append('svg:g')
				.attr('transform', 'translate(' + margin + ',' + margin + ')');
	}

	t = svg.transition().duration(transitionDuration);

	// y ticks and labels
	if (!yAxisGroup) {
		yAxisGroup = svg.append('svg:g')
			.attr('class', 'yTick')
			.call(yAxis);
	}
	else {
		t.select('.yTick').call(yAxis);
	}

	// x ticks and labels
	if (!xAxisGroup) {
		xAxisGroup = svg.append('svg:g')
			.attr('class', 'xTick')
			.call(xAxis);
	}
	else {
		t.select('.xTick').call(xAxis);
	}

	// Draw the lines
	if (!dataLinesGroup) {
		dataLinesGroup = svg.append('svg:g');
	}

	var dataLines = dataLinesGroup.selectAll('.data-line')
			.data([data]);

	var line = d3.svg.line()
		// assign the X function to plot our line as we wish
		.x(function(d,i) { 
			// verbose logging to show what's actually being done
			//console.log('Plotting X value for date: ' + d.date + ' using index: ' + i + ' to be at: ' + x(d.date) + ' using our xScale.');
			// return the X coordinate where we want to plot this datapoint
			//return x(i); 
			return x(d.date); 
		})
		.y(function(d) { 
			// verbose logging to show what's actually being done
			//console.log('Plotting Y value for data value: ' + d.value + ' to be at: ' + y(d.value) + " using our yScale.");
			// return the Y coordinate where we want to plot this datapoint
			//return y(d); 
			return y(d.value); 
		})
		.interpolate("linear");

		 /*
		 .attr("d", d3.svg.line()
		 .x(function(d) { return x(d.date); })
		 .y(function(d) { return y(0); }))
		 .transition()
		 .delay(transitionDuration / 2)
		 .duration(transitionDuration)
			.style('opacity', 1)
                        .attr("transform", function(d) { return "translate(" + x(d.date) + "," + y(d.value) + ")"; });
		  */

	var garea = d3.svg.area()
		.interpolate("linear")
		.x(function(d) { 
			// verbose logging to show what's actually being done
			return x(d.date); 
		})
            	.y0(h - margin * 2)
		.y1(function(d) { 
			// verbose logging to show what's actually being done
			return y(d.value); 
		});
/*
	dataLines
		.enter()
		.append('svg:path')
            	.attr("class", "area")
            	.attr("d", garea(data));

	dataLines.enter().append('path')
		 .attr('class', 'data-line')
		 .style('opacity', 0.3)
		 .attr("d", line(data));
		/*
		.transition()
		.delay(transitionDuration / 2)
		.duration(transitionDuration)
			.style('opacity', 1)
			.attr('x1', function(d, i) { return (i > 0) ? xScale(data[i - 1].date) : xScale(d.date); })
			.attr('y1', function(d, i) { return (i > 0) ? yScale(data[i - 1].value) : yScale(d.value); })
			.attr('x2', function(d) { return xScale(d.date); })
			.attr('y2', function(d) { return yScale(d.value); });
		--

	dataLines.transition()
		.attr("d", line)
		.duration(transitionDuration)
			.style('opacity', 1)
                        .attr("transform", function(d) { return "translate(" + x(d.date) + "," + y(d.value) + ")"; });

	dataLines.exit()
		.transition()
		.attr("d", line)
		.duration(transitionDuration)
                        .attr("transform", function(d) { return "translate(" + x(d.date) + "," + y(0) + ")"; })
			.style('opacity', 1e-6)
			.remove();

	d3.selectAll(".area").transition()
		.duration(transitionDuration)
		.attr("d", garea(data));
		
		*/

	// Draw the points
	if (!dataCirclesGroup) {
		dataCirclesGroup = svg.append('path').attr('d', function(d) {
		var x = 100, y = 100;
		return 'M '+x+' '+y+' l 4 4 l -8 0 z';
		});
	}
	
	if (!myonetriangle) {
		myonetriangle = svg.append('path').attr('d', function(d) {
		var x = 100, y = 100;
		return 'M '+x+' '+y+' l 4 4 l -8 0 z';
		});
	}
	

	var circles = dataCirclesGroup.selectAll('.data-point')
		.data(data);

	circles
		.enter()
			.append('path')
			
			      .attr('d', function(d) { 
			        var x = 100, y = 100; 
			        return 'M ' + x +' '+ y + ' l 4 4 l -8 0 z'; 
      }); 
				//.attr('class', 'data-point')
				//.style('opacity', .3)
				//.attr('cx', function(d) { return x(d.date) })
				//.attr('cy', function() { return y(0) })
			//	.attr('d', function(d) {
			//		console.log('this:'+d.date +','+d.value+','+d.rot);
			//		return 'M 0 0 L 2000 0 L -1000 3000 Z'; })
				//.attr('r', function() { return (data.length <= maxDataPointsForDots) ? pointRadius : 0 })
			//	.attr("transform", function(d, i) {
			//	console.log("translate("+[d.date, d.value]+")rotate("+d.rot+")");
			//		return "translate("+[d.date, d.value]+")rotate("+d.rot+")"})
			//.transition()
			//.duration(transitionDuration)
			//	.style('opacity', 1)
			//	.attr('cx', function(d) { return x(d.date) })
			//	.attr('cy', function(d) { return y(d.value) })
			;

	/*circles
		.transition()
		.duration(transitionDuration)
			.attr('cx', function(d) { return x(d.date) })
			.attr('cy', function(d) { return y(d.value) })
			.attr('r', function() { return (data.length <= maxDataPointsForDots) ? pointRadius : 0 })
			.style('opacity', 1);*/

	circles
		.exit()
			//.transition()
			//.duration(transitionDuration)
				// Leave the cx transition off. Allowing the points to fall where they lie is best.
				//.attr('cx', function(d, i) { return xScale(i) })
			//	.attr('cy', function() { return y(0) })
			//	.style("opacity", 1e-6)
				.remove();

      
}

function generateData() {
	var data = [];
	var i = Math.max(Math.round(Math.random()*100), 3);

	while (i--) {
		var date = new Date();
		date.setDate(date.getDate() - i);
		date.setHours(0, 0, 0, 0);
		data.push({'i' : i, 'value' : Math.round(Math.random()*1200), 'date' : Math.random()*1000, 'rot' : Math.random()*360});
	}
	return data;
	
	var format = d3.time.format("%b %Y");
	
	d3.csv("stocks.csv", function(stocks) {
	  stocks.forEach(function(d) {
	    d.price = +d.price;
	    d.date = format.parse(d.date);
	  });
	  // first line of csv should have symbol,date,price, then access by column
});
}

d3.select('#button').on('click', draw);
draw();