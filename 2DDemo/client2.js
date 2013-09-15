function startGame(gs) {

	var textBoxes = null;
	var speechBox = document.getElementById('text');
	var speakerBox = document.getElementById('speaker');
	var pointTime = 3000;
	var pickupTime = 1000;
	var characterSize = 44;
	var objectSize = 10;
	var lookatTime = 1000;
	var sayTime = 100;
	var moveDist = 1;
	var stepTime = 50;
	var characters = null;
	var pawns = null;
	var allObjects = null;
	var logpath = "C:\\temp\\logfiles\\";
	
	
	/*function errorHandler(e) {
		var msg = '';
		switch (e.code) {
			case FileError.QUOTA_EXCEEDED_ERR:
				msg = 'QUOTA_EXCEEDED_ERR';
				break;
			case FileError.NOT_FOUND_ERR:
				msg = 'NOT_FOUND_ERR';
				break;
			case FileError.SECURITY_ERR:
				msg = 'SECURITY_ERR';
				break;
			case FileError.INVALID_MODIFICATION_ERR:
				msg = 'INVALID_MODIFICATION_ERR';
				break;
			case FileError.INVALID_STATE_ERR:
				msg = 'INVALID_STATE_ERR';
				break;
			default:
				msg = 'Unknown Error';
				break;
		};
		//document.querySelector('#example-list-fs-ul').innerHTML = 'Error: ' + msg;
	}*/

	function Character(name, x, y, angle, color, neg) {
		this.name = name;
		this.x = x;
		this.y = y;
		this.angle = angle;
		this.r = characterSize;
		this.fs = 'rgba(' + color + ', 1.0)';
		this.item = null;
		this.pointTo = null;
		this.pointAngle = 0;
		this.gazeTo = null;
		this.moveTo = null;
		if (characters == null) {
			characters = new Array();
			characters[0] = this;
		} else {
			characters[characters.length] = this;
		}
		if (allObjects == null) {
			allObjects = new Array();
			allObjects[0] = this;
		} else {
			allObjects[allObjects.length] = this;
		}
		/*var filesystemobj = new ActiveXObject("Scripting.FileSystemObject");
		this.logfile = filesystemobj.OpenTextFile(logpath+this.name+".log");
		this.logfile.WriteLine((new Date().time).ToString()+"\tFileOpened");*/
		
		/*function onInitFs1(fs) {

			fs.root.getFile(this.name+'log.txt', {
				create : true,
				exclusive : true
			}, function(fileEntry) {
				// fileEntry will have the following functions
				// fileEntry.isFile === true
				// fileEntry.name == 'log.txt'
				// fileEntry.fullPath == '/log.txt'
				//console.log(fileEntry.fullPath+','+fileEntry.name);

			}, errorHandler);
		}
		window.webkitRequestFileSystem(window.PERSISTENT, 1024 * 1024, onInitFs1, errorHandler);
*/

		
		this.update = function(c, gs) {
			// log current location & time to file
			/*function onUpdFs(fs) {

				fs.root.getFile(this.name+'log.txt', {
					create : false
				}, function(fileEntry) {

					fileEntry.createWriter(function(fileWriter) {

						fileWriter.seek(fileWriter.length);
						// Start write position at EOF.

						var bb = new BlobBuilder();
						bb.append('Hello World'+new Date().time+'\n');
						fileWriter.write(bb.getBlob('text/plain'));


					}, errorHandler);
				}, errorHandler);
			}


			window.webkitRequestFileSystem(window.PERSISTENT, 1024 * 1024, onUpdFs, errorHandler);
			*/
			//this.logfile.WriteLine((new Date().time).ToString()+"\t"+this.x+"\t"+this.y+"\t"+this.angle);
			
			// check moveTo target to see if it moved & adjust
			if (this.moveTo != null && (this.moveTo instanceof Character || this.moveTo instanceof Pawn)) {
				// calc angle & save
				this.angle = Math.atan2(this.y - this.moveTo.y, this.moveTo.x - this.x) + Math.PI/2;
			} else if (this.moveTo != null && !(this.moveTo instanceof Character || this.moveTo instanceof Pawn)) {
				// do nothing because moving to a specific point and need to look at the point, not the gaze for now
			} else if (this.gazeTo != null && (this.gazeTo instanceof Character || this.gazeTo instanceof Pawn)) { // check gaze target to see if it moved & adjust
				// calc angle & save
				this.angle = Math.atan2(this.y - this.gazeTo.y, this.gazeTo.x - this.x) + Math.PI/2;
			}
						
			// check point target to see if it moved & adjust
			if (this.pointTo != null && (this.pointTo instanceof Character || this.pointTo instanceof Pawn)) {
				// calc angle & save
				this.pointAngle = Math.atan2(this.y - this.pointTo.y, this.pointTo.x - this.x) + Math.PI/2;
			}
		}



		
		this.draw = function(c, gs) {
			c.fillStyle = this.fs;
			c.beginPath();
			c.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
			c.closePath();
			c.fill();
			c.lineWidth=4;
			c.strokeStyle = 'rgba(' + neg + ', 1.0)';
			c.moveTo(this.x, this.y);
			c.lineTo(this.x + (this.r * Math.sin(this.angle)), this.y + (this.r * Math.cos(this.angle)));
			c.stroke();
			c.fillStyle = '#000';
			c.font = 'bold 10px sans-serif';
			c.textBaseline = 'bottom';
			c.fillText(this.name, this.x -(3.5*this.name.length), this.y - 5);
			
			if (this.pointTo != null) {
				
				c.moveTo(this.x + (this.r*Math.sin(this.pointAngle)), this.y +(this.r*Math.cos(this.pointAngle)));
				c.lineTo(this.x + (this.r*Math.sin(this.pointAngle))+(15*Math.sin(this.pointAngle)), this.y+(this.r*Math.cos(this.pointAngle))+(15*Math.cos(this.pointAngle)));
				c.stroke();
			}
		}
		
		this.Step = function(targetx, targety, targetAngle, callbackFunc) {
			// check if target moved on us first
			if (this.moveTo instanceof Character || this.moveTo instanceof Pawn) {
				targetAngle = Math.atan2(this.y - this.moveTo.y, this.moveTo.x - this.x) + Math.PI/2;//Math.atan2(this.y - y, x - this.x) + Math.PI/2;
				// look in direction moving
				this.angle = targetAngle;
				var distance = Math.sqrt(((this.x - this.moveTo.x)*(this.x - this.moveTo.x)) + ((this.y - this.moveTo.y)*(this.y - this.moveTo.y)));
				if (this.moveTo instanceof Character) {
					// update target to within 44
					distance = distance - (characterSize*2);
					targetx = this.x + (distance*Math.sin(targetAngle));
					targety = this.y + (distance*Math.cos(targetAngle));
				} else {
					// update target to within 10
					distance = distance - objectSize-characterSize;
					targetx = this.x + (distance*Math.sin(targetAngle));
					targety = this.y + (distance*Math.cos(targetAngle));
				}
			}
			if (targetx instanceof Array) {
				//console.log("Moving array, current pt=("+this.x+","+this.y+"), target=("+targetx[0]+","+targety[0]+")");
				if (this.x == targetx[0] && this.y == targety[0]) { // reached current destination
					targetx.splice(0,1);
					targety.splice(0,1);
					if (targetx.length == 0) { // no more destinations left
						this.moveTo = null;
						callbackFunc();
					} else { // more destinations left
						targetAngle = Math.atan2(this.y - targety[0], targetx[0] - this.x) + Math.PI/2;
						this.angle = targetAngle;
						this.moveTo = "Point "+targetx[0]+","+targety[0];
						//console.log("First Step, target=("+targetx[0]+","+targety[0]+")");
						this.Step(targetx, targety, targetAngle, callbackFunc);
					}
				} else { // haven't reached current destination yet
					// set value, then wait to repeat
					if (Math.sin(targetAngle) < 0) {
						this.x = Math.max(this.x + (moveDist*Math.sin(targetAngle)), targetx[0]);
					} else {
						this.x = Math.min(this.x + (moveDist*Math.sin(targetAngle)), targetx[0]);
					}
					if (Math.cos(targetAngle) < 0) {
						this.y = Math.max(this.y + (moveDist*Math.cos(targetAngle)), targety[0]);
					} else {
						this.y = Math.min(this.y + (moveDist*Math.cos(targetAngle)), targety[0]);
					}
					var xthis = this;
					
					setTimeout(function(){xthis.Step(targetx, targety, targetAngle, callbackFunc); xthis=null}, stepTime);
				}
			} else {
				if (this.x == targetx && this.y == targety) {
					this.moveTo = null;
					callbackFunc();
				} else {
					// set value, then wait to repeat
					if (Math.sin(targetAngle) < 0) {
						this.x = Math.max(this.x + (moveDist*Math.sin(targetAngle)), targetx);
					} else {
						this.x = Math.min(this.x + (moveDist*Math.sin(targetAngle)), targetx);
					}
					if (Math.cos(targetAngle) < 0) {
						this.y = Math.max(this.y + (moveDist*Math.cos(targetAngle)), targety);
					} else {
						this.y = Math.min(this.y + (moveDist*Math.cos(targetAngle)), targety);
					}
					var xthis = this;
					
					setTimeout(function(){xthis.Step(targetx, targety, targetAngle, callbackFunc); xthis=null}, stepTime);
				}
			}
		}
		
		this.locomotionPt = function(x, y, callbackFunc) {
			// assume x & y are arrays so can go to multiple points in one call
			var targetAngle = 0;
			if(x instanceof Array) {
				// array of values
				/*for (var i = 0; i < x.length; i++) {
					targetAngle = Math.atan2(this.y - y[i], x[i] - this.x) + Math.PI/2;
					while (this.x != x[i] && this.y != y[i]) {
						this.x = min(this.x + (moveDist*Math.sin(targetAngle)), x[i]);
						this.y = min(this.y + (moveDist*Math.cos(targetAngle)), y[i]);
					}
				}*/
				targetAngle = Math.atan2(this.y - y[0], x[0] - this.x) + Math.PI/2;
				this.angle = targetAngle;
				this.moveTo = "Point "+x[0]+","+y[0];
				this.Step(x, y, targetAngle, callbackFunc);
			} else {
				// only one value
				// get angle
				targetAngle = Math.atan2(this.y - y, x - this.x) + Math.PI/2;//Math.atan2(this.y - y, x - this.x) + Math.PI/2;
				// look in direction moving
				this.angle = targetAngle;
				this.moveTo = "Point "+x+","+y;
				//this.gazeTo = null;
				this.Step(x, y, targetAngle, callbackFunc);
			}
			
		}
		
		this.locomotionTarget = function(item, callbackFunc) {
			// stop just before reaching target by 44 if item is person, by 10 if object
			var targetAngle = 0;
			var isCharacter = (item instanceof Character);
			targetAngle = Math.atan2(this.y - item.y, item.x - this.x) + Math.PI/2;//Math.atan2(this.y - y, x - this.x) + Math.PI/2;
			// look in direction moving
			this.angle = targetAngle;
			var targetx = 0;
			var targety = 0;
			var distance = Math.sqrt(((this.x - item.x)*(this.x - item.x)) + ((this.y - item.y)*(this.y - item.y)));
			if (isCharacter) {
				// update target to within 44
				distance = distance - (characterSize*2);
				targetx = this.x + (distance*Math.sin(targetAngle));
				targety = this.y + (distance*Math.cos(targetAngle));
			} else {
				// update target to within 10
				distance = distance - objectSize-characterSize;
				targetx = this.x + (distance*Math.sin(targetAngle));
				targety = this.y + (distance*Math.cos(targetAngle));
			}
			// call the first step
			this.moveTo = item;
			//this.gazeTo = null;
			this.Step(targetx, targety, targetAngle, callbackFunc);
		}
		
		this.pickup = function(item, callbackFunc) {
			this.item = item;
			item.ownedby = this;
			setTimeout(function(){callbackFunc()},pickupTime);
		}
		
		this.putdown = function(item, callbackFunc) {
			if (this.item == item) {
				this.item = null;
				item.ownedby = null;
			}
			setTimeout(function(){callbackFunc()},pickupTime);
		}
		
		this.lookAtPt = function(x, y, callbackFunc) {
			this.angle = Math.atan2(this.y - y, x - this.x) + Math.PI/2;
			this.gazeTo = "Point "+x+","+y;
			setTimeout(function(){callbackFunc()},lookatTime);
		}
		
		this.lookAtTarget = function(item, callbackFunc) {
			this.angle = Math.atan2(this.y - item.y, item.x - this.x) + Math.PI/2;
			this.gazeTo = item;
			setTimeout(function(){callbackFunc()},lookatTime);
		}
		
		this.stopPointing = function() {
			this.pointTo = null;
			this.pointAngle = 0;
		}
	
		this.pointAtPoint = function(x, y, callbackFunc) {
			// find the angle to the point & save as this.pointAngle
			this.pointTo = "Point "+x+","+y;
			this.pointAngle = Math.atan2(this.y - y, x - this.x) + Math.PI/2;//*180/Math.PI;
			var xthis = this;
			setTimeout(function(){xthis.stopPointing(); xthis = null}, pointTime);
			setTimeout(function(){callbackFunc()},pointTime);
		}
				
		this.pointAtTarget = function(item, callbackFunc) {
			// find the angle to the item & save as this.pointAngle
			this.pointTo = item;
			this.pointAngle = Math.atan2(this.y - item.y, item.x - this.x) + Math.PI/2;//*180/Math.PI;
			var xthis = this;
			setTimeout(function(){xthis.stopPointing(); xthis=null}, pointTime);
			setTimeout(function(){callbackFunc()},pointTime);
		}
		
		this.stopSpeaking = function() {
			speechBox.innerHTML = "";
			speakerBox.innerHTML = "";
		}
		
		this.say = function(text, callbackFunc) {
			textBoxes.updateText(this.name, text);
			xthis = this;
			setTimeout(function(){xthis.stopSpeaking(); xthis=null}, sayTime*text.length);
			setTimeout(function(){callbackFunc()},(text.length )*sayTime);
		}
		
	} // end of Character object
	
	

	function SpeechBox() {
		this.who = null;
		this.text = null;
		textBoxes = this;
		
		this.updateText = function(who, text) {
			this.who = who;
			this.text = text;
			speechBox.innerHTML = this.text;
			speakerBox.innerHTML = this.who;

		}
		
	} // end of SpeechBox object

	function Pawn(name, x, y, color, neg) {
		this.name = name;
		this.x = x;
		this.y = y;
		this.r = objectSize;
		this.color = color;
		this.neg = neg;
		this.showcolor = this.neg;
		this.ownedby = null;
		if (pawns == null) {
			pawns = new Array();
			pawns[0] = this;
		} else {
			pawns[pawns.length] = this;
		}
		if (allObjects == null) {
			allObjects = new Array();
			allObjects[0] = this;
		} else {
			allObjects[allObjects.length] = this;
		}

		this.draw = function(c, gs) {
			c.fillStyle = 'rgba(' + this.showcolor + ', 1.0)';
			c.beginPath();
			c.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
			c.closePath();
			c.fill();

		}
		
		this.update = function(c, gs) {
			if (this.ownedby != null) {
				this.x = this.ownedby.x-characterSize-objectSize/2;
				this.y = this.ownedby.y;
				this.showcolor = this.color;
			} else if (this.showcolor != this.neg){
				this.showcolor = this.neg;
			}
		}
		
	} // end of Object object

	//********************************************
	//* Start of main code
	//********************************************

	gs.addEntity(new SpeechBox());
	// create characters
	var gravedigger1 = gs.addEntity(new Character('GRAVEDIGGER1', 300, 100, 0, '135,206,250', '0,0,128'));
	var gravedigger2 = gs.addEntity(new Character('GRAVEDIGGER2', 100, 60 / 2042 * gs.height, 0, '171,130,255', '85,26,139'));
	var hamlet = gs.addEntity(new Character('HAMLET', 800, 60 / 2042 * gs.height, 0, '0,205,0', '0,100,0'));
	var horatio = gs.addEntity(new Character('HORATIO', 1041 / 2325 * gs.width, 60 / 2042 * gs.height, 0, '233,150,122', '139,69,0'));
	// create pawns
	var shovel = gs.addEntity(new Pawn('SHOVEL', 100-50, 60/2042*gs.height, '0, 0, 0', '234, 234, 234'));
	var skull1 = gs.addEntity(new Pawn('SKULL1', 1371/2-5, 714/2, '0, 0, 0', '234, 234, 234'));
	var skull2 = gs.addEntity(new Pawn('SKULL2', 1371/2+5, 714/2, '0, 0, 0', '234, 234, 234'));
	var lantern = gs.addEntity(new Pawn('LANTERN', 300-50, 60/2042*gs.height, '0, 0, 0', '234, 234, 234'));
	var audience = gs.addEntity(new Pawn('AUDIENCE', 1053/2,2441/2, '255,255,255', '255,255,255'));
	var centerbackstage = gs.addEntity(new Pawn('CENTERBACKSTAGE', 900/2,9/2,'255,255,255','255,255,255'));
	var stageright = gs.addEntity(new Pawn('STAGERIGHT', 2113/2, 1050/2, '255,255,255','255,255,255'));

	// start file parsing & sending messages to characters/pawns
	gravedigger1.pickup(lantern, function other() {console.log("Done lifting");});
	gravedigger2.lookAtTarget(audience, function other() {console.log("Done looking g2 to aud")});
	horatio.lookAtTarget(hamlet, function other() {console.log("Done looking ho to ha")});
	gravedigger1.say("To be or not to be. That is the questionTo be or not to be. That is the questionTo be or not to be. ", function other() {console.log("Done speaking");});
	hamlet.pointAtTarget(gravedigger1, function other() {console.log("Done pointing");});
	hamlet.locomotionPt(311/2,573/2, function other() {console.log("Done moving ha to point")});
	gravedigger1.pointAtTarget(hamlet, function other() {console.log("Done pointing");});
	gravedigger2.pointAtTarget(gravedigger1, function other() {console.log("Done pointing");});
	gravedigger1.lookAtTarget(gravedigger2, function other() {console.log("Done looking");});
	gravedigger2.locomotionTarget(gravedigger1, function other() {console.log("Done moving g2 to g1");gravedigger2.locomotionTarget(shovel, function other() {console.log("Done moving g2 to sh");gravedigger1.locomotionTarget(gravedigger2, function other(){console.log("Done moving g1 to g2");gravedigger1.lookAtTarget(audience,function other(){console.log("Done looking at audience"); gravedigger2.locomotionPt([1689/2, 417/2], [1137/2, 1419/2], function other(){console.log("Done multimovements")})})})})});
	horatio.locomotionTarget(skull1, function other() {console.log("Done moving ho to sk1");horatio.locomotionTarget(hamlet, function other() {console.log("Done moving ho to ha"); hamlet.locomotionTarget(skull2, function other() {console.log("Done moving hamlet to skull2")})})});
}