/**
 * User: nross
 */
var w = 1060,
    h = 916;



var svg = null,
	yAxisGroup = null,
	xAxisGroup = null,
	dataCirclesGroup = null,
	dataLinesGroup = null;
//	var colors = ['red','green','blue'];
	var roundtime = 0;
	var starttime = 0;
	var timespan = 0;




function calccolor(time) {
	var amt =  0;
	time = time - starttime;
	if (time == 0) {
		amt = 0;
	} else if (time > timespan/2) {
		amt = (time - (timespan/2))*255/(timespan/2);
	} else if (time < timespan/2) {
		amt = (time)*255/(timespan/2);
	} else {
		amt = 0;
	}
	
	if (time == 0) {
		//console.log("time="+time+", timespan="+timespan+", amt="+amt+",color=255,0,0");
		return d3.rgb(255,0,0);
	} else if (time  < timespan/2) {
		//console.log("time="+time+", timespan="+timespan+", amt="+amt+",color="+(255-amt)+","+amt+",0");
		return d3.rgb(255-amt, amt, 0);// blue = 0;
	} else if (time > timespan/2) {
		//console.log("time="+time+", timespan="+timespan+", amt="+amt+",color=0,"+(255-amt)+","+(amt));
		return d3.rgb(0,255-amt,amt);//red=0, blue+amt*time, green-amt*time;
	} else {
		//console.log("time="+time+", timespan="+timespan+", amt="+amt+",color=0,0,255");
		return d3.rgb(0,0,255);//red=0,blue=0,green=255;
	}
}

function draw(postns) {
	var data = postns;
	svg = null;
	yAxisGroup = null;
	xAxisGroup = null;
	dataCirclesGroup = null;
	dataLinesGroup = null;
	d3.selectAll(".viz").remove();
	
	
	  var colors = ["red", "orange", "yellow", "green", "blue", "violet"]; 
	    var scale = d3.scale.linear() 
	        .domain([0, colors.length - 1]) 
	     // .range(d3.extent(data, function(d) { return d.time; })); 
	     .range([1335277524791,1335278026270]);
	      
	      var color = d3.scale.linear() 
	            .domain(d3.range(colors.length).map(scale)) 
      .range(colors); 
	
	
	//console.log("reading new file");
	var numrecs = data.length;
	//timespan = data[numrecs-1].time - data[0].time;
	//starttime = data[0].time;
	//starttime = 1335277524791;
	//timespan = 1335278026270 - starttime;
	console.log("started="+starttime+", duration="+timespan);
	var margin = 40;
	//var max = 5000;
	//var min = -10000;
	//var pointRadius = 4;
	var minx = 0;//d3.min(data, function(d) {return d.x}) - 100;
	var maxx = 1060;//d3.max(data, function(d) {return d.x}) + 100;
	var miny = 0;//d3.min(data, function(d) {return d.y}) - 100;
	var maxy = 916;//d3.max(data, function(d) {return d.y}) + 100;
	var x = d3.scale.linear().range([0, w - margin * 2]).domain([minx, maxx]);
	var y = d3.scale.linear().range([h - margin * 2, 0]).domain([miny, maxy]);

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

	t = svg.transition().duration(1000);
	
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

/*	// Draw the lines
	if (!dataLinesGroup) {
		dataLinesGroup = svg.append('svg:g');
	}

	var dataLines = dataLinesGroup.selectAll('.data-line')
			.data([data]);

	var line = d3.svg.line()
		// assign the X function to plot our line as we wish
		.x(function(d) { 
			return (d.x - minx)*(w-margin*2)/(maxx-minx);
			//return d.x; //need to scale to chart - subtract the min, then multiply by the width of the chart?
		})
		.y(function(d) { 
			return (d.y - miny)*(h-margin*2)/(maxy-miny);
			//return d.y;
		})
		.interpolate("linear");



	dataLines.enter().append('path')
		 .attr('class', 'data-line')
		 .style('opacity', 0.3)
		 .attr("d", line)
		 //.style('stroke', function(d) {return color(d);});
		 .style('stroke', function(d, i) { console.log("time="+d[i].time+"color="+calccolor(d[i].time)); return calccolor(d[i].time);});
		
	
	
	dataLines.exit()
		.remove();


*/
				
				
				// Draw the points
					if (!dataCirclesGroup) {
						dataCirclesGroup = svg.append('svg:g');
					}
				
					var circles = dataCirclesGroup.selectAll('.data-point')
						.data(data);
				
					circles
						.enter()
							.append('svg:path')
								.attr('class', 'data-point')
								.attr('d', function(d) { 
										//console.log("d="+d.x+","+d.y);	         
									//return 'M ' + (d.x - minx)*(w-margin*2)/(maxx-minx) +' '+ (d.y - miny)*(h-margin*2)/(maxy-miny) + ' l 4 0 l -8 0'; 
									return 'M ' + (d.x - minx)*(w-margin*2)/(maxx-minx) +' '+ (d.y - miny)*(h-margin*2)/(maxy-miny) + ' l 2 0 l -2 6 l -2 -6 z'; 
      								}) 
      								.style('stroke', function(d) {return calccolor(d.time);})
      								//.style('stroke', function(d) {return color(d);})
								.style('opacity', 1e-6)
								//.style('stroke', function(d,i) { if(i == (60)) { console.log("found");return 'green'} })
								.attr('cx', function(d) { return x(d.x) })
								.attr('cy', function() { return y(0) })
								.attr('r', function() { return 4 })
								.attr("transform", function(d, i) {
									return "rotate("+[d.rot, (d.x - minx)*(w-margin*2)/(maxx-minx), (d.y - miny)*(h-margin*2)/(maxy-miny)]+")"})
							.transition()
							.duration(1000)
								.style('opacity', 1)
								.attr('cx', function(d) { return x(d.x) })
								.attr('cy', function(d) { return y(d.y) });
				
					circles
						.transition()
						.duration(1000)
							.attr('cx', function(d) { return x(d.x) })
							.attr('cy', function(d) { return y(d.y) })
							.attr('r', function() { return 4  })
							.style('opacity', 1);
				
					circles
						.exit()
							.transition()
							.duration(1000)
								// Leave the cx transition off. Allowing the points to fall where they lie is best.
								//.attr('cx', function(d, i) { return xScale(i) })
								.attr('cy', function() { return y(0) })
								.style("opacity", 1e-6)
								.remove();


//console.log("done drawing");
      
}

function generateData(filename) {
roundtime++;
	if (roundtime > 2) {
		roundtime = 0;
	}
console.log('clicked, filename='+filename);
	//var data = [];

	var format = d3.time.format("%b %Y");
	if (filename == null || filename == "") {
		filename = "HAMLET.csv";
	}
	var data = d3.csv(filename, function(postns) {
	var retpostns = [];
	var i = 0;
	var prior = null;
	var origfirst = {x: postns[0].x, y:postns[0].y, rot:postns[0].rot};
	var first = postns[0];
	
	var firstfound = false;
	
	  postns.forEach(function(d) {
	  	
	  	if (!firstfound) {
	  		//console.log("comparing first="+d.x+","+ origfirst.x +","+ d.y +","+ origfirst.y +","+ d.rot +","+origfirst.rot);
	  		if (d.x != origfirst.x || d.y != origfirst.y || d.rot != origfirst.rot) {
	  			first = prior;
	  			firstfound = true;
	  		}
	  	}
	  	
	   
	    d.time = (+d.time);
	    d.x = +d.x;
	    d.y = +d.y;
	  
	    d.rot = 360 - (+d.rot)*180/Math.PI;
	   
	    if (prior == null || i%30 == 0) { //( !(prior.x == d.x && prior.y == d.y && prior.rot == d.rot) && i%30 == 0) ){
	    
	    	retpostns.push(d);
	    }
	    i++;
	    prior = d;
	  
	  });
	
	 retpostns.push(prior);
	 
	 
	 var origlast = {x:postns[postns.length-1].x, y:postns[postns.length-1].y, rot:postns[postns.length-1].rot};
	 	var last = postns[postns.length-1];
	var lastfound = false;
	 
	 prior = postns[postns.length-1];
	 j = postns.length-1;
	 postns.reverse().forEach(function (d) {
	 	if (!lastfound) {
	 	  		if (+(d.x) != +(origlast.x) || +(d.y) != +(origlast.y) || +(d.rot) != +(origlast.rot)) {
	 	  			last = prior;
	 	  			lastfound = true;
	 	  		}
	  	}
	  	j--;
	  	prior = d;
	  });
	 
	 //j = postns.length-1;
	 //while (!lastfound) {
	 //	if (postns[j].x != last.x || postns[j].y != last.y || postns[j].rot != last.rot) {
	 //		lastfound = true;
	 //		last = postns[j+1];
	 //	}
	 //}
	 starttime = first.time;
	 timespan = last.time - first.time;
	 console.log("file calc start="+starttime+", dur="+timespan+","+last.time);
	 
	  draw(retpostns);
	  // first line of csv should have symbol,date,price, then access by column
	});
	
}
//d3.select('#button').on('click', generateData(d3.select('#text').property("value")));
generateData(d3.select('#text').property("value"));