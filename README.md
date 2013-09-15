IVA2012
=======

Code from IVA 2012 conference paper in 2DDemo folder
Code from IVA 2012 charts in D3js folder

****All instructions are written with the assumption of running on a Mac****

2D BML Realizer for Hamlet Graveyard Scene utilizing only natural language processing (named entity recognition and part of speech tagging)

Utilizing jsGameSoup for UI components and Node.js for processing, with natural, socket.io, and xml2js modules, and with javascript and HTML front-end.
		Install jsGameSoup
		install node.js
		npm natural
		npm socket.io
		npm xml2js
		

In main.js, change line:
		var BML = false;
to true if you want to use the BML baseline file, false if you want to use the natural language processing of the actual play-script.

		InputFile.txt ==> Hand-mapped BML code with some "triggers" for coinciding movements based on the 1964 Hamlet video
		InputScript.txt ==> Play-script from 1964 Hamlet video in natural language and formatted to play-script standards

To run:
start python for page hosting
		python -m SimpleHTTPServer 8888
start NodeJS module by running
		node server
Then, open index.html file to begin running the scene and logging the character traces.
		http://localhost:8888/index.html



Charting utilizes output log files from the 2D BML Realizer to create character traces with D3js component.  One sample file is included for initial load in this directory (GRAVEDIGGER1.csv)

To run:
start python for page hosting
		python -m SimpleHTTPServer 8888
Open chartrace.html file to display the character trace
		http://localhost:8888/chartrace.html
		
Change the filename (placed in the D3js folder) to whatever log file you want to show from running the GameSoup application & click Generate Chart button to see the new trace.  Colors go from red to blue and show arrows pointing in the direction that the character was facing at each point.


