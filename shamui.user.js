// ==UserScript==
// @name         ShamUI for the Grid
// @namespace    https://github.com/Shamadruu/thegrid/raw/master/
// @version      1.0
// @description  try to take over the world!
// @author       Shamadruu
// @downloadURL  https://raw.githubusercontent.com/Shamadruu/thegrid/master/shamui.user.js
// @updateURL    https://raw.githubusercontent.com/Shamadruu/thegrid/master/shamui.user.js
// @match        http://codeelf.com/games/the-grid-2/grid/?ui=1
// @grant        none
// ==/UserScript==
(function() {
    var chainDelay = 250;
    document.head.innerHTML += '<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>'
    //Override built in psybin function
    window.Sq = function() {}
    window.initTouchSq = function() {}
    window.paintSqs = function() {} 
    window.origreadUpdatedSquares = function() {}
    window.readFile = function() {}
	window.updateTime = function() {}
    window.readLog = function(incomingMessageId, milliseconds, username, num){window.num = num;}
	//debug variables
	window.debugSquares = false;
	window.debugChat = false;
	window.debugTime = false;
	window.debugLog = false;
	window.debugNews = false;
	window.debugPlayers = false;
	window.pauseUI = false;
	
    //fixes start here
    function getDataAndUpdate() {
		//Ease the load on the server by not updating the page when the tab isn't active.
		if(!document.hidden && !window.pauseUI){
			var num = window.num;
			
			//these are all async with promises
			updateSquares();
			updateChat();
			updateTime();
			updateLog();
			updateNews();
			updatePlayers();
		}
    }

    async function updateSquares() {
		//Handle Squares
		let response = await $.ajax({
			url: "/games/the-grid-2/grid/updatedSquares.php",
			dataType: "json",
			cache: false
		});
		try{
			var data = response.data;
			updateSquaresObj(data);
			
			for (var i = 0; i < data.length; i++) {
				var id = data[i].td;
				var tdId = "td" + id;
				var td = document.getElementById(tdId);
				var square = squares[id];
				if(window.debugSquares){
					console.log(square);
				}
				if (square.graffiti == undefined && td != null && $("#cn" + id).length != 0) {
					square.graffiti = document.getElementById("cn" + id).textContent.toLowerCase();
				}
				if (td != null && square.graffiti != "MSYT") {
					var str = "";
					str += '<span class="numberBox" style="color:silver;" id="numberBox' + id + '">' + id + '</span><div class="name" title="" style="color:' + square.color + ';" id="name' + id + '">' + square.alias + '</div><div class="units" style="color:silver;" id="u' + id + '">' + commafy(square.units) + '</div><div class="structures">';
					if (square.farms != undefined && square.farms > 0) {
						str += '<span style="color:silver;" id="f' + id + '">F' + commafy(square.farms) + ' </span>';
					} else {
						str += '<span style="color:silver;" id="f' + id + '"> </span>'
					}
					if (square.cities != undefined && square.cities > 0) {
						str += '<span style="color:silver;" id="c' + id + '">C' + commafy(square.cities) + ' </span>';
					} else {
						str += '<span style="color:silver;" id="c' + id + '"> </span>';
					}
					if (square.rebels != undefined && square.rebels > 0) {
						str += '<span style="color:red;" id="r' + id + '">R' + square.rebels + ' </span></div>';
					} else {
						str += '<span style="color:red;" id="r' + id + '"></span> </div>';
					}
					if (square.graffiti != undefined) {
						str += '<div class="countryName" style="color:#' + square.color + ';" id="cn' + id + '">' + square.graffiti.toUpperCase() + ' </div>';
					} else {
						str += '<div class="countryName" style="color:#' + square.color + ';" id="cn' + id + '"> </div>';
					}
					td.innerHTML = str;
					td.style.borderColor = square.borderColor;
					td.style.color = square.color;
					if(square.perm){
						td.style.borderStyle = "double";
					}
					td.style.visibility = "visible"
					
					//manage thick borders for domains
					if(squaresArray.length >= square.domain * 42){
						var lastColor = squares[square.domain*42].borderColor;
						//this domain is complete
						if(id%6 == 1){
							//left border
							td.style.borderLeftWidth = "8px";
							td.style.borderLeftStyle = "solid";
							td.style.borderLeftColor = lastColor
						}
						else if(id%6 == 0){
							//right border
							td.style.borderRightWidth = "8px";
							td.style.borderRightStyle = "solid";
							td.style.borderRightColor = lastColor;
						}
						//check for top/bottom
						if(id%42 <= 6 && id%42 > 0){
							//set top border
							td.style.borderTopWidth = "8px";
							td.style.borderTopStyle = "solid";
							td.style.borderTopColor = lastColor;
						}
						else if(id%42 > 36 || id%42 == 0){
							//set bottom border
							td.style.borderBottomWidth = "8px";
							td.style.borderBottomStyle = "solid";
							td.style.borderBottomColor = lastColor;
						}
						if(id%42 == 0){
							td.style.borderWidth = "8px";
							td.style.borderStyle = "solid";
							td.style.borderColor = lastColor;
						}
					}
					else{
						
					}
				}
				else if(td == null){
					var tableBody = $("#masterTable tbody");
					//check if a new row needs to be added to the table (I don't think I actually need to do this, but I'd like to be sure)
					if($("#masterTable tbody tr").length < Math.ceil(id/6)){
						//add a new row to the table and populate it with the new squares
						tableBody.append('<tr title="Domain ' + Math.ceil(id/42) + '"><td id="td' + id + '"></td><td id="td' + (id+1) + '"></td><td id="td' + (id+2) + '"></td><td id="td' + (id+3) + '"></td><td id="td' + (id+4) + '"></td><td id="td' + (id+5) + '"></td></tr>');
					}	
				}
				else if(square.graffiti == "MYST"){
					td.style.visibility = "hidden";
				}	
			}
		}
		catch(error){
			console.log(response);
			console.log(error);
		}
    }

    async function updateChat() {
		let response = await $.ajax({
			url: "/games/the-grid-2/grid/txt/chat.txt",
			dataType: "html",
			cache: false
		});
		try{
			if(window.debugChat){
				console.log(response);
			}
			let incoming = $("#incoming");
			let initialChatText = incoming.html();
			let finalChatText = response
			if (initialChatText != finalChatText && $("#incoming:hover").length != 1) {
				//if a new message is last, scroll to the bottom
				let element = document.getElementById("incoming");
				element.scrollTop = element.scrollHeight;
			}
			if(initialChatText != finalChatText){
				incoming.html(response);
			}
		}
		catch(error){
			console.log(resonse);
			console.log(error);
		}
    }
	
	async function updateTime(){
		let response = await $.ajax({
			url: "/games/the-grid-2/grid/updateTime.php",
			dataType: "text",
			cache: false
		});
		try{
			if(window.debugTime){
				console.log(response);
			}
			var clock = $("#clock");
			clock.text(response);
		}
		catch(error){
			console.log(response);
			console.log(error);
		}
	}
	
	async function updateLog(){
		if(window.num !== undefined){
			let response = await $.ajax({
				url: "/games/the-grid-2/grid/txt/users/" + window.num + "_log.txt",
				dataType: "html",
				cache: false
			});
			try{
				if(window.debugLog){
					console.log(response);
				}
				var log = $("#log");
				var initialLogText = log.html();
				var finalLogText = response;
				if(initialLogText != finalLogText && $("#log:hover").length != 1){
					var element = document.getElementById("log");
					element.scrollTop = element.scrollHeight;
				}
				if(log.html() != response){
					log.html(response);
				}
			}
			catch(error){
				console.log(response);
				console.log(error);
			}
		}
	}
	
	async function updateNews(){
		let response = await $.ajax({
				url: "/games/the-grid-2/grid/txt/eventLog.txt",
				dataType: "html",
				cache: false
			});
		try{
			if(window.debugNews){
				console.log(response);
			}
			var news = $("#news");
			var initialNewsText = news.html();
			var finalNewsText = response;
			if(initialNewsText != finalNewsText && $("#news:hover").length != 1){
				var element = document.getElementById("news");
				element.scrollTop = element.scrollHeight;
			}
			if(news.html() != response){
				news.html(response);
			}
		}
		catch(error){
			console.log(response);
			console.log(error);
		}
	}
	
	async function updatePlayers(){
		let response = await $.ajax({
			url: "/games/the-grid-2/grid/updatePlayers.php",
			dataType: "html",
			cache: false
		});
		try{
			if(window.debugPlayers){
				console.log(response);
			}
			var players = $("#stats");
			if(players.html() != response){
				players.html(response);
			}
		}
		catch(error){
			console.log(response);
			console.log(error);
		}
	}

    function updateLoop(timeout) {
        //refresh overrides for tampermonkey
        window.Sq = function() {}
        window.initTouchSq = function() {}
        window.paintSqs = function() {}
        window.origreadUpdatedSquares = function() {};
        window.chainTimer = chainDelay;
        window.readFile = function() {};
		window.updateTime = function() {}
		window.readLog = function(incomingMessageId, milliseconds, username, num){window.num = num;}
        getDataAndUpdate();
        window.clearTimeout(timeout);
        timeout = window.setTimeout(function() {
            updateLoop(timeout);
        }, updateDelay);
    }
    var Square = function(name, id, units, farms, cities, rebels, graffiti, perm, domain, borderColor, color, alias) {
        this.owner = name.toLowerCase();
        this.id = id;
        this.units = units;
        this.farms = farms;
        this.cities = cities;
        this.rebels = rebels;
        this.graffiti = (graffiti !== undefined) ? graffiti.toLowerCase() : undefined;
        this.perm = perm;
        this.domain = domain;
        this.borderColor = '#' + borderColor;
        this.color = '#' + color;
        this.alias = alias;

        this.income = 0;
        this.unitProduction = 0;

        return this;
    }
    var squares = {};
    var updateSquaresObj = function(data) {
        for (var i = 0; i < data.length; i++) {
            var square = data[i];
            var id = square.td;
            var perm = square.p == 1;
            squares[id] = new Square(square.nt, id, square.u, square.f, square.c, square.r, square.cn, perm, Math.ceil(id / 42), square.bc, square.co, square.na);
        }
        squaresArray = objectToArray(squares);
    }
    var updateDelay = 1000;
    updateLoop();
    document.body.querySelector("span").style.display = "none";
    chainTimer = chainDelay;
	
	//update manually when the window gains focus
	$(window).on("focus", function(){
		getDataAndUpdate();
	});
	
	window.getDataAndUpdate = getDataAndUpdate;	
})();
