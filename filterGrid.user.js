// ==UserScript==
// @name         Grid Command Builder
// @namespace    https://github.com/Shamadruu/thegrid/raw/master/
// @version      1.88
// @description  try to take over the world!
// @author       Shamadruu
// @downloadURL  https://github.com/Shamadruu/thegrid/raw/master/filterGrid.user.js
// @updateURL    https://github.com/Shamadruu/thegrid/raw/master/filterGrid.user.js
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
			//Handle Squares
			$.ajax({
				url: "/games/the-grid-2/grid/updatedSquares.php",
				success: updateSquares,
				dataType: "json",
				cache: false
			});

			//Update Chat
			$.ajax({
				url: "/games/the-grid-2/grid/txt/chat.txt",
				success: updateChat,
				dataType: "html",
				cache: false
			});
			
			//Update Time
			$.ajax({
				url: "/games/the-grid-2/grid/updateTime.php",
				success: updateTime,
				dataType: "text",
				cache: false
			});
			
			//Update Log
			$.ajax({
				url: "/games/the-grid-2/grid/txt/users/" + window.num + "_log.txt",
				success: updateLog,
				dataType: "html",
				cache: false
			});
			
			//Update News
			$.ajax({
				url: "/games/the-grid-2/grid/txt/eventLog.txt",
				success: updateNews,
				dataType: "html",
				cache: false
			});
			
			//Update Players
			$.ajax({
				url: "/games/the-grid-2/grid/updatePlayers.php",
				success: updatePlayers,
				dataType: "html",
				cache: false
			});
		}
    }

    function updateSquares(response) {
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

            }
			else if(td == null){
				var tableBody = $("#masterTable tbody");
				//check if a new row needs to be added to the table (I don't think I actually need to do this, but I'd like to be sure)
				if($("#masterTable tbody tr").length < Math.ceil(id/6)){
					//add a new row to the table and populate it with the new squares
					tableBody.append('<tr title="Domain ' + Math.ceil(id/42) + '"><td id="td' + id + '"></td><td id="td' + (id+1) + '"></td><td id="td' + (id+2) + '"></td><td id="td' + (id+3) + '"></td><td id="td' + (id+4) + '"></td><td id="td' + (id+5) + '"></td></tr>');
				}	
			}				
        }
    }

    function updateChat(response) {
		if(window.debugChat){
			console.log(response);
		}
        var incoming = $("#incoming");
		var initialChatText = incoming.html();
		var finalChatText = response;
		if (initialChatText != finalChatText && $("#incoming:hover").length != 1) {
			//if a new message is last, scroll to the bottom
			var element = document.getElementById("incoming");
			element.scrollTop = element.scrollHeight;
		}
		incoming.html(response);
    }
	
	function updateTime(response){
		if(window.debugTime){
			console.log(response);
		}
		var clock = $("#clock");
		clock.text(response);
	}
	
	function updateLog(response){
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
		log.html(response);
	}
	
	function updateNews(response){
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
		news.html(response);
	}
	
	function updatePlayers(response){
		if(window.debugPlayers){
			console.log(response);
		}
		var players = $("#stats");
		players.html(response);
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
    getDataAndUpdate();
    updateLoop();
    document.body.querySelector("span").style.display = "none";
    chainTimer = chainDelay;
	
	//update manually when the window gains focus
	$(window).on("focus", function(){
		getDataAndUpdate();
	});
	
	window.getDataAndUpdate = getDataAndUpdate;	

    document.querySelector("#terminal").maxLength = 5000;
    var squares = {};
    var squaresArray;
    var functionalGraffities = ["wall", "spire", "domlord", "seer", "castle", "gnome", "longsheng", "myst", "nospawn", "pil-a", "pil-n", "pil-s", "monk", "rebel", "samurai", "sea", "seer", "spawn", "sword", "thug", "wildcard", "windmill"];
    var filterKeys = ["owner", "units", "rebels", "farms", "cities", "id", "graffiti", "perm", "domain"];
    var filteredSquares;

    var constructUI = function() {
        var filterUIRaw = '<div style="display:none" id="filterUI"> \n <div style="text-align:center;font-size:1.5em">Filter UI <span id="closeUI" style="float: right;font-size: 1em;cursor:pointer;">X</span></div>\n <hr> \n <div id="tabs">\n<span class="active" target="filterTab">Filtering</span>\n<span class="" target="commandTab">Commands</span>\n</div>\n <div class="collapsible collapsible-expanded tab" id="filterTab"> \n <div class="content"> \n <div id="filterParameters" style="width:50%;float:left;border-right:2px solid #999"> \n <div style="text-align:center;font-size:1.25em">Filter Parameters</div>\n <div class="key" id="keyOwner"> \n<span class="name">Owner: </span>\n <span class="comp"> \n <select style="width:50px"> \n <option value="=" selected="">=</option> \n <option value="!=">!=</option> \n </select> \n </span> \n<span class="value">\n<input name="owner" type="text">\n</span>\n </div>\n <div class="key" id="keyUnits"> \n<span class="name">Units:</span>\n <span class="comp"> \n <select style="width:50px"> \n <option value="<">&lt; </option> \n <option value="<=">&lt;=</option> \n <option value="=" selected="">=</option> \n <option value="!=">!=</option> \n <option value=">=">&gt;=</option> \n <option value=">">&gt; </option> \n </select> \n </span> \n<span class="value"><input name="units" type="number"></span>\n </div>\n <div class="key" id="keyRebels"> \n<span class="name">Rebels: </span>\n <span class="comp"> \n <select style="width:50px"> <option value="<">&lt; </option> <option value="<=">&lt;=</option> \n <option value="=" selected="">=</option> \n <option value="!=">!=</option> <option value=">=">&gt;=</option> \n <option value=">">&gt; </option> \n </select> \n </span> \n<span class="value"><input name="rebels" type="number"></span>\n </div>\n <div class="key" id="keyFarms"> \n<span class="name">Farms: </span>\n <span class="comp"> \n <select style="width:50px"> \n <option value="<">&lt; </option> \n <option value="<=">&lt;=</option> \n <option value="=" selected="">=</option> \n <option value="!=">!=</option> \n <option value=">=">&gt;=</option> \n <option value=">">&gt; </option> \n </select> \n </span> \n<span class="value">\n<input name="farms" type="number">\n</span>\n </div>\n <div class="key" id="keyCities"> \n<span class="name">Cities: </span>\n <span class="comp"> \n <select style="width:50px"> \n <option value="<">&lt; </option> \n <option value="<=">&lt;=</option> \n <option value="=" selected="">=</option> \n <option value="!=">!=</option> \n <option value=">=">&gt;=</option> \n <option value=">">&gt; </option> \n </select> \n </span> \n<span class="value"><input name="cities" type="number"></span>\n </div>\n <div class="key" id="keyID"> \n<span class="name">ID: </span>\n <span class="comp"> \n <select style="width:50px"> \n <option value="<">&lt; </option> \n <option value="<=">&lt;=</option> \n <option value="=" selected="">=</option> \n <option value="!=">!=</option> \n <option value=">=">&gt;=</option> \n <option value=">">&gt; </option> \n </select> \n </span> \n<span class="value"><input name="id" type="number"></span>\n </div>\n <div class="key" id="keyDomain"> \n<span class="name">Domain: </span>\n <span class="comp"> \n <select style="width:50px"> \n <option value="<">&lt; </option> \n <option value="<=">&lt;=</option> \n <option value="=" selected="">=</option> \n <option value="!=">!=</option> \n <option value=">=">&gt;=</option> \n <option value=">">&gt; </option> \n </select> \n </span> \n<span class="value"><input name="domain" type="number"></span>\n </div>\n <div class="key" id="keyGraffiti"> \n<span class="name">Graffiti: </span>\n <span class="comp"> \n <select style="width:50px"> \n <option value="=" selected="">=</option> \n <option value="!=">!=</option> \n </select> \n </span> \n <span style="width:30%;display:inline-block;text-align:center"> \n <select style="text-align:center;width:80px;font-size:.8em"> \n <option value="wall">wall</option> \n <option value="spire">spire</option> \n <option value="domlord">domlord</option> \n <option value="seer">seer</option> \n <option value="castle">castle</option> \n <option value="gnome">gnome</option> \n <option value="longsheng">longsheng</option> \n <option value="myst">myst</option> \n <option value="nospawn">nospawn</option> \n <option value="pil-a">pil-a</option> \n <option value="pil-n">pil-n</option> \n <option value="pil-s">pil-s</option> \n <option value="monk">monk</option> \n <option value="rebel">rebel</option> \n <option value="samurai">samurai</option> \n <option value="sea">sea</option> \n <option value="seer">seer</option> \n <option value="spawn">spawn</option> \n <option value="sword">sword</option> \n <option value="thug">thug</option> \n <option value="wildcard">wildcard</option> \n <option value="windmill">windmill</option> \n <option selected=""> </option> \n </select> \n </span> \n<span class="value" style="width:25.8%"><input name="graffiti" style="width:82.5px;font-size:.8em"></span>\n </div>\n <div class="key" id="keyPerm"> \n<span class="name">Permanence: </span>\n <span class="comp"> \n <select style="width:50px"> \n <option value="=" selected="">=</option> \n <option value="!=">!=</option> \n </select> </span> \n <span class="value"> \n <select style="width:50px"> \n <option value="" selected=""></option> \n <option value="true">true</option> \n <option value="false">false</option> \n </select> \n </span> \n </div>\n <div style="text-align:center">\n<button id="filterSquares" style="background:#999;color:white;border:1px outset #999">Filter Squares</button>\n</div>\n </div>\n <div id="filterOutputPane" style="width:calc(50% - 2px);float:left"> \n <div style="text-align:center;font-size:1.25em">Filter Output</div>\n <div id="filterOutput" style="overflow-y:scroll;overflow-wrap:normal;font-size:1em"></div>\n </div>\n </div>\n </div>\n <div class="collapsible collapsible-collapsed tab" id="commandTab"> \n <div class="content"> \n <div id="commandSelectionPane"> \n <div style="text-align:center;font-size:1.25em">Command Selection</div>\n <div id="commandOptions"> \n <div class="collapsible collapsible-collapsed" id="deploy"> \n<input type="radio" name="commandOptions" id="choiceDeploy" value="deploy"> <label for="choiceDeploy">Deploy</label>\n <ul class="content" id="deployOptions"> \n <li>\n<input type="radio" name="deployOptions" id="deployOption1" value="deployOption1">\n<label for="deployOption1">Deploy from [filtered squares] to\n<input type="number" value="" name="targetSquare"> so [units on filtered square]=\n<input type="number" value="" name="targetAmount">\n</label>\n</li>\n <li>\n<input type="radio" name="deployOptions" id="deployOption2" value="deployOption2">\n<label for="deployOption2">Deploy all units from [filtered squares] to\n<input type="number" value="" name="targetSquare">\n</label>\n</li>\n <li>\n<input type="radio" name="deployOptions" id="deployOption3" value="deployOption3">\n<label for="deployOption3">Deploy from\n<input type="number" value="" name="targetSquare"> to [filtered squares] so [units deployed from square]=\n<input type="number" value="" name="targetAmount">\n</label>\n</li>\n <li>\n<input type="radio" name="deployOptions" id="deployOption3" value="deployOption4">\n<label for="deployOption4">Deploy from\n<input type="number" value="" name="targetSquare"> to [filtered squares] so [units deployed on square]=\n<input type="number" value="" name="targetAmount">\n</label>\n</li>\n </ul> \n </div>\n <div class="collapsible collapsible-collapsed" id="exchange"> \n<input type="radio" name="commandOptions" id="choiceExchange" value="exchange"> <label for="choiceExchange">Exchange</label>\n <ul class="content" id="exchangeOptions"> \n <li>\n<input type="radio" name="exchangeOptions" id="exchangeOption1" value="exchangeOption1">\n<label for="exchangeOption1">Exchange\n<input type="number" value="" name="targetAmount"> units on [filtered squares]\n</label>\n</li>\n <li>\n<input type="radio" name="exchangeOptions" id="exchangeOption2" value="exchangeOption2">\n<label for="exchangeOption2">Exchange all units on [filtered squares] </label>\n</li>\n <li>\n<input type="radio" name="exchangeOptions" id="exchangeOption3" value="exchangeOption3">\n<label for="exchangeOption3">Exchange until [units] on [filtered squares]=\n<input type="number" value="" name="targetAmount">\n</label>\n</li>\n </ul> \n </div>\n <div class="collapsible collapsible-collapsed" id="graffiti"> \n<input type="radio" name="commandOptions" id="choiceGraffiti" value="graffiti"> <label for="choiceGraffiti">Graffiti</label>\n <ul class="content" id="graffitiOptions"> \n <li><input type="radio" name="graffitiOptions" id="graffitiOption1" value="graffitiOption1"><label for="graffitiOption1">Graffiti [filtered squares] with <input type="text" value=""></label></li>\n </ul> \n </div>\n <div class="collapsible collapsible-collapsed"id="razeF"> \n<input type="radio" name="commandOptions" id="choiceRazeFarms" value="razeFarms"> <label for="choiceRazeFarms">Raze Farms</label>\n <ul class="content" id="razeFarmsOptions"> \n <li>\n<input type="radio" name="razeFarmsOptions" id="razeFarmsOption1" value="razeFarmsOption1">\n<label for="razeFarmsOption1">raze f\n<input type="number" value="" name="targetAmount"> on [filtered squares]\n</label>\n</li>\n <li>\n<input type="radio" name="razeFarmsOptions" id="razeFarmsOption2" value="razeFarmsOption2"><label for="razeFarmsOption2">raze f all on [filtered squares]</label>\n</li>\n <li>\n<input type="radio" name="razeFarmsOptions" id="razeFarmsOption3" value="razeFarmsOption3">\n<label for="razeFarmsOption3">raze f until [farms] on [filtered squares]=\n<input type="number" value="" name="targetAmount">\n</label>\n</li>\n </ul> \n </div>\n <div class="collapsible collapsible-collapsed" id="razeC"> \n<input type="radio" name="commandOptions" id="choiceRazeCities" value="razeCities"> <label for="choiceRazeCities">Raze Cities</label>\n <ul class="content" id="razeFarmOptions"> \n <li>\n<input type="radio" name="razeCitiesOptions" id="razeCitiesOption1" value="razeCitiesOption1">\n<label for="razeCitiesOption1">raze c\n<input type="number" value="" name="targetAmount"> on [filtered squares]\n</label>\n</li>\n <li>\n<input type="radio" name="razeCitiesOptions" id="razeCitiesOption2" value="razeCitiesOption2">\n<label for="razeCitiesOption2">raze c all on [filtered squares]\n</label>\n</li>\n <li>\n<input type="radio" name="razeCitiesOptions" id="razeCitiesOption3" value="razeCitiesOption3">\n<label for="razeCitiesOption3">raze c until [cities] on [filtered squares]=\n<input type="number" value="" name="targetAmount">\n</label>\n</li>\n </ul> \n </div>\n <div class="collapsible collapsible-collapsed" id="rebels"> \n<input type="radio" name="commandOptions" id="choiceRebels" value="rebels"> <label for="choiceRebels">Rebels</label>\n <ul class="content" id="rebelOptions"> \n <li><input type="radio" name="rebelOptions" id="rebelOption1" value="rebelOption1"><label for="rebelOption1">r r [filtered squares]</label></li>\n <li><input type="radio" name="rebelOptions" id="rebelOption2" value="rebelOption2"><label for="rebelOption2">r i [filtered squares]</label>	</li>\n <li><input type="radio" name="rebelOptions" id="rebelOption3" value="rebelOptions3"><label for="rebelOptions3">r p <input type="number" value="" name="targetAmount"> [filtered squares]</label></li>\n <li><input type="radio" name="rebelOptions" id="rebelOption4" value="rebelOptions4"><label for="rebelOptions4">r p all [filtered squares]</label></li>\n </ul> \n </div>\n <div class="collapsible collapsible-collapsed"> \n<input type="radio" name="commandOptions" id="choiceAnnex" value="annex"> <label for="choiceAnnex">Annex</label>\n <ul class="content" id="annexOptions"> \n <li><input type="radio" name="annexOptions" id="annexOptions1" value="annexOptions1"><label for="annexOption1">annex [filtered squares]</label></li>\n </ul> \n </div>\n <div class="collapsible collapsible-collapsed" id="buildF"> \n<input type="radio" name="commandOptions" id="choiceFarms" value="farms"> <label for="choiceFarms">Build Farms</label>\n <ul class="content" id="farmOptions"> \n <li><input type="radio" name="farmOptions" id="farmOption1" value="farmOption1"><label for="farmOption1">f <input type="number" value="" name="targetAmount"> [filtered squares]</label></li><li><input type="radio" name="farmOptions" id="farmOption2" value="farmOption2"><label for="farmOption2">Build until f <input type="number" value="" name="targetAmount"> [filtered squares]</label></li>\n </ul> \n </div>\n <div class="collapsible collapsible-collapsed" id="buildC"> \n<input type="radio" name="commandOptions" id="choiceCities" value="citys"> <label for="choiceCities">Build Cities</label>\n <ul class="content" id="cityOptions"> \n <li><input type="radio" name="cityOptions" id="cityOption1" value="cityOption1"><label for="cityOption1">c <input type="number" value="" name="targetAmount"> [filtered squares]</label></li><li><input type="radio" name="cityOptions" id="cityOption2" value="cityOption2"><label for="cityOption2">Build until c <input type="number" value="" name="targetAmount"> [filtered squares]</label></li>\n </ul> \n </div>\n </div><div id="constructButtonF"><button id="constructButton">Construct Command</button></div>\n </div>\n <div id="constructedCommandPane"> \n <div style="text-align:center;font-size:1.25em">Constructed Command</div><div><textarea id="constructedCommand" name="constructedCommand" rows="10" cols="50"></textarea></div></div>\n </div>\n </div>\n</div>';


        //Create button to open ui
        links = document.querySelector("#links");
        var openUIButton = document.createElement("button");
        openUIButton.id = "openUIButton";
        openUIButton.textContent = "Open UI";
        openUIButton.onclick = function() {
            toggleUI();
        };

        links.appendChild(openUIButton);

        var filterUI = document.createElement("div");
        document.body.appendChild(filterUI);

        filterUI.innerHTML = filterUIRaw;
        var closeUIButton = document.querySelector("#closeUI");
        closeUIButton.onclick = function() {
            toggleUI();
        }
        var filterButton = filterUI.querySelector("#filterSquares");
        var filterOutput = filterUI.querySelector("#filterOutput");
        var nextButton = filterUI.querySelector("#nextButton");
        var constructButton = filterUI.querySelector("#constructButton");
        var commandTextArea = filterUI.querySelector("#constructedCommand");
        var results = [];

        //handle command construction
        constructButton.onclick = function() {
            var commandString = "";
            var selectedCommand = filterUI.querySelector("#commandOptions input:checked");
            var selectedOption = filterUI.querySelector("#commandOptions input:checked + label + ul li input:checked");
            var optionElements;
            var optionParameters = [];
            if (selectedCommand == undefined || selectedOption == undefined) {
                console.log("No command selected!");
            } else {
                selectedCommand = selectedCommand.value;
                selectedOption = selectedOption.value;
                optionElements = filterUI.querySelectorAll("#commandOptions input:checked + label + ul li input:checked + label > input");
                for (var i = 0; i < optionElements.length; i++) {
                    var param = {};
                    param.name = optionElements[i].name;
                    param.value = optionElements[i].value;
                    optionParameters.push(param);
                }
                commandString = buildCommand(selectedOption, optionParameters);
                filterUI.querySelector("#constructedCommand").textContent = commandString;
            }
        }
        //set up commands collapsible elements
        filterUI.querySelectorAll("#commandOptions > .collapsible").forEach(function(e) {
            e.onclick = function() {
                document.querySelectorAll("#commandOptions > .collapsible").forEach(function(el) {
                    el.classList.remove("collapsible-expanded");
                    el.classList.add("collapsible-collapsed");
                });
                this.classList.add("collapsible-expanded");
                this.querySelector("input").checked = true;
            }
        });
        //set up tabs
        filterUI.querySelectorAll("#tabs > span").forEach(function(e) {
            e.onclick = function() {
                this.parentNode.querySelectorAll("span").forEach(function(el) {
                    el.classList.remove("active");
                });
                document.querySelectorAll("#filterUI > .tab").forEach(function(el) {
                    el.classList.remove("collapsible-expanded");
                    el.classList.add("collapsible-collapsed");
                });
                this.classList.add("active");
                document.querySelector("#" + this.attributes.target.value).classList.add("collapsible-expanded");
            }
        });

        filterButton.onclick = function() {
            //Wipe filter output
            filterOutput.innerHTML = "";
            //construct parameter object
            var params = {};
            filterUI.querySelector("#filterParameters").querySelectorAll(".key").forEach(function(e) {
                if (e.id !== "keyGraffiti") {
                    if ((e.querySelector("input") != null && e.querySelector("input").value != "") || (e.querySelectorAll("select").item(1) != null && e.querySelectorAll("select").item(1).value != "")) {
                        var keyName = e.id.slice(3).toLowerCase();;
                        var comparison = e.querySelector("select").value;
                        var value;
                        if (e.querySelector("input")) {
                            value = e.querySelector("input").value;
                        } else {
                            value = e.querySelectorAll("select").item(1).value;
                        }
                        if (keyName == "owner") {
                            value = value.toLowerCase();
                        }
                        params[keyName] = comparison + value;
                    }
                } else {
                    var value;
                    if (e.querySelector("input").value != "" || e.querySelectorAll("select").item(1).value != "") {
                        if (e.querySelector("input").value != "") {
                            value = e.querySelector("input").value;
                        } else {
                            value = e.querySelectorAll("select").item(1).value;
                        }
                        var keyName = "graffiti";
                        var comparison = e.querySelector("select").value;
                        value = value.toLowerCase();

                        params[keyName] = comparison + value;
                    }
                }
            });
            results = filterSquares(squaresArray, params)
            filteredSquares = results;
            filterOutput.innerHTML = "There are " + results.length + " matches.<br>";
            for (var i = 0; i < filteredSquares.length; i++) {
                var s = filteredSquares[i];
                var wrapper = document.createElement("div");
                wrapper.classList.add("collapsible");
                wrapper.classList.add("collapsible-collapsed");
                wrapper.innerHTML = '<div class="collapsible">' + s.id + '</div>';

                var content = document.createElement("ul");
                content.classList.add("content")
                content.innerHTML = '<li>Owner: ' + s.owner + '</li><li>Units: ' + s.units.toLocaleString() + '</li><li>Farms: ' + s.farms.toLocaleString() + '</li><li>Cities: ' + s.cities.toLocaleString() + '</li><li>Rebels: ' + s.rebels + '</li><li>Graffiti: ' + s.graffiti.toUpperCase() + '</li><li>Permanence: ' + s.perm + '</li><li>Domain: ' + s.domain + '</li><li>Estimated Income: ' + s.income.toLocaleString() + '</li><li>Estimated Unit Production: ' + s.unitProduction.toLocaleString() + '</li>';

                wrapper.onclick = function() {
                    this.classList.toggle("collapsible-collapsed");
                    this.classList.toggle("collapsible-expanded");
                }

                wrapper.appendChild(content);
                filterOutput.appendChild(wrapper);
            }

        }
    }


    var filter = function(key, comp, value, square) {
        if (comp === "=" && square[key] == value) {
            return true;
        } else if (comp === "!=" && square[key] != value) {
            return true;
        } else if (comp === "<=" && square[key] <= value) {
            return true;
        } else if (comp === ">=" && square[key] >= value) {
            return true;
        } else if (comp === "<" && square[key] < value) {
            return true;
        } else if (comp === ">" && square[key] > value) {
            return true;
        } else {
            return false;
        }
    }
    var filterSquares = function(sqs, parameters) {
        var matches = sqs;
        var keys = Object.keys(parameters);
        //var filterKeys = ["owner", "units", "rebels", "farms", "cities", "id", "graffiti", "perm"];
        // {owner: "name", units: ">50", "farms: =50" }
        if (keys.length == 0) {
            return;
        }
        for (var i = 0; i < keys.length; i++) {
            if (filterKeys.indexOf(keys[i].toLowerCase()) == -1) {
                console.warn("Error: Invalid filter key!");
                return null;
            }
            var value = parameters[keys[i]];
            if (keys[i] != "owner" && keys[i] !== "graffiti" && keys[i] !== "perm" && value.match(/[a-df-z]/i) !== null && value.match(/[=<>]{0,2}[0-9e]+/i) !== null) {
                console.warn("Error: Invalid filter value!");
                return null;
            }
        }

        for (var parameter in parameters) {
            var m = []
            var comp;
            var value = parameters[parameter];
            if (parameter === "owner") {
                comp = value.match(/[!=<>]{1,2}/)[0];
                if (comp != "=" && comp != "!=") {
                    console.warn("Error: Invalid comparison value!");
                    return;
                }
                value = value.match(/[a-z]+/i)[0].toLowerCase();
            } else if (parameter === "graffiti") {
                comp = value.match(/[!=<>]{1,2}/)[0];
                value = value.match(/[a-z]+/i)[0].toLowerCase();
                //console.log(comp, value);
            } else if (parameter === "perm") {
                comp = value.match(/[!=<>]{1,2}/)[0];
                value = value.match(/[a-z]+/i)[0].toLowerCase();
                if (value == "true") {
                    value = true;
                } else {
                    value = false;
                }
            } else {
                comp = value.match(/[!=<>]{1,2}/)[0];
                value = value.match(/[0-9\.e]+/i)[0]
            }
            for (var i = 0; i < matches.length; i++) {
                //console.log(i);
                if (parameter === "perm") {
                    console.log(parameter, comp, value);
                }
                var result = filter(parameter, comp, value, matches[i]);
                if (result) {
                    m.push(matches[i]);
                }
            }

            matches = m;
        }
        return matches;
    }

    var buildCommand = function(commandType, params) {
        var commandString = "";
        if (commandType == "deployOption1") {
            for (var i = 0; i < filteredSquares.length; i++) {
                var square = filteredSquares[i];
                var val = square.units - params[1].value;
                if (val > 0) {
                    commandString += "d " + (val) + " " + square.id + " " + params[0].value + ";";
                }
            }
        } else if (commandType == "deployOption2") {
            for (var i = 0; i < filteredSquares.length; i++) {
                var square = filteredSquares[i];
                var val = square.units - 1;
                if (val > 0) {
                    commandString += "d " + (val) + " " + square.id + " " + params[0].value + ";";
                }
            }
        } else if (commandType == "deployOption3") {
            for (var i = 0; i < filteredSquares.length; i++) {
                var square = filteredSquares[i];
                var val = params[1].value;
                if (val > 0) {
                    commandString += "d " + (val) + " " + params[0].value + " " + square.id + ";";
                }
            }
        } else if (commandType == "deployOption4") {
            for (var i = 0; i < filteredSquares.length; i++) {
                var square = filteredSquares[i];
                var val = params[1].value - square.units;
                if (val > 0) {
                    commandString += "d " + (val) + " " + params[0].value + " " + square.id + ";";
                }
            }
        } else if (commandType == "exchangeOption1") {
            for (var i = 0; i < filteredSquares.length; i++) {
                var square = filteredSquares[i];
                var val = params[0].value
                if (val > 0) {
                    commandString += "ex " + (val) + " " + square.id + ";";
                }
            }
        } else if (commandType == "exchangeOption2") {
            for (var i = 0; i < filteredSquares.length; i++) {
                var square = filteredSquares[i];
                var val = square.units - 1;
                if (val > 0) {
                    commandString += "ex " + (val) + " " + square.id + ";";
                }
            }
        } else if (commandType == "exchangeOption3") {
            for (var i = 0; i < filteredSquares.length; i++) {
                var square = filteredSquares[i];
                var val = square.units - params[0].value;
                if (val) {
                    commandString += "ex " + (val) + " " + square.id + ";";
                }
            }
        } else if (commandType == "graffitiOption1") {
            for (var i = 0; i < filteredSquares.length; i++) {
                var square = filteredSquares[i];
                commandString += "gr " + square.id + " " + params[0].value + ";";
            }
        } else if (commandType == "razeFarmsOption1") {
            for (var i = 0; i < filteredSquares.length; i++) {
                var square = filteredSquares[i];
                var val = params[0].value;
                if (val > 0) {
                    commandString += "raze f " + square.id + " " + val + ";";
                }
            }
        } else if (commandType == "razeFarmsOption2") {
            for (var i = 0; i < filteredSquares.length; i++) {
                var square = filteredSquares[i];
                var val = square.farms;
                if (val > 0) {
                    commandString += "raze f " + square.id + " " + val + ";";
                }
            }
        } else if (commandType == "razeFarmsOption3") {
            for (var i = 0; i < filteredSquares.length; i++) {
                var square = filteredSquares[i];
                var val = square.farms - params[0].value;
                if (val > 0) {
                    commandString += "raze f " + square.id + " " + (val) + ";";
                }
            }
        } else if (commandType == "razeCitiesOption1") {
            for (var i = 0; i < filteredSquares.length; i++) {
                var square = filteredSquares[i];
                var val = parms[0].value;
                if (val > 0) {
                    commandString += "raze c " + square.id + " " + val + ";";
                }
            }
        } else if (commandType == "razeCitiesOption2") {
            for (var i = 0; i < filteredSquares.length; i++) {
                var square = filteredSquares[i];
                var val = square.cities;
                if (val > 0) {
                    commandString += "raze c " + square.id + " " + val + ";";
                }
            }
        } else if (commandType == "razeCitiesOption3") {
            for (var i = 0; i < filteredSquares.length; i++) {
                var square = filteredSquares[i];
                var val = square.cities - params[0].value;
                if (val > 0) {
                    commandString += "raze c " + square.id + " " + (val) + ";";
                }
            }
        } else if (commandType == "rebelOptions3") {
            for (var i = 0; i < filteredSquares.length; i++) {
                var square = filteredSquares[i];
                var val = params[0].value;
                if (val > 0) {
                    commandString += "r p " + square.id + " "  + val +  ";";
                }
            }
        } else if (commandType == "rebelOptions4") {
            for (var i = 0; i < filteredSquares.length; i++) {
                var square = filteredSquares[i];
                var val = square.rebels;
                if (val > 0) {
                    commandString += "r p " + square.id + " "  + val +  ";";
                }
            }
        } else if (commandType == "annexOptions1") {
            for (var i = 0; i < filteredSquares.length; i++) {
                var square = filteredSquares[i];
                commandString += "an " + square.id + ";";
            }
        } else if (commandType == "farmOption1") {
            for (var i = 0; i < filteredSquares.length; i++) {
                var square = filteredSquares[i];
                commandString += "f " + params[0].value + " " + square.id + ";";
            }
        } else if (commandType == "farmOption2") {
            for (var i = 0; i < filteredSquares.length; i++) {
                var square = filteredSquares[i];
                commandString += "f " + (params[0].value - square.farms) + " " + square.id + ";";
            }
        } else if (commandType == "cityOption1") {
            for (var i = 0; i < filteredSquares.length; i++) {
                var square = filteredSquares[i];
                commandString += "c " + params[0].value + " " + square.id + ";";
            }
        } else if (commandType == "cityOption2") {
            for (var i = 0; i < filteredSquares.length; i++) {
                var square = filteredSquares[i];
                commandString += "c " + (params[0].value - square.farms) + " " + square.id + ";";
            }
        }
        return commandString;
    }

    var objectToArray = function(obj) {
        var arr = [];
        for (var key in obj) {
            arr.push(obj[key]);
        }
        return arr;
    }
    var addGlobalStyle = function(style) {
        var styleElement = document.createElement("style");
        styleElement.innerHTML = style;
        document.head.appendChild(styleElement);
    }

    function toggleUI() {
        if (filterUI.style.display == "none") {
            filterUI.style.display = "block";
        } else {
            filterUI.style.display = "none";
        }
    }

    constructUI();
    addGlobalStyle("::-webkit-scrollbar {width: 12px;}");
    addGlobalStyle("::-webkit-scrollbar-track {-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); border-radius: 10px;}");
    addGlobalStyle("::-webkit-scrollbar-thumb {border-radius: 10px;-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5); }");
    addGlobalStyle('#filterParameters {width: 50%;float: left;border-right: 2px solid #999;height: 100%;}');
    addGlobalStyle("#filterOutputPane {height: calc(500px - 1em);}");
    addGlobalStyle('#filterOutput {overflow-y: auto; height:calc(100% - 1em); }');
    addGlobalStyle('#filterOutput > div:nth-child(odd) {background-color: #666}');
    addGlobalStyle('#filterOutput > div:nth-child(even) {background-color: #555}');
    addGlobalStyle('#filterUI  {background: #333 none repeat scroll 0% 0%; width: calc(50% - 30px); min-height: 30%; position: absolute; left: calc(25%); top: 25px; padding: 25px 15px; color: white; height: auto; border-radius: 25px; border: 2px solid rgb(153, 153, 153);}');
    addGlobalStyle('#filterUI .collapsible:not(.tabs):hover  {background-color: #777;}');
    addGlobalStyle('#filterUI .collapsible.collapsible-collapsed > .content {display: none;}');
    addGlobalStyle('#filterUI .collapsible.collapsible-expanded > .content {display: block;}');
    addGlobalStyle('#filterUI .key > .name {width: 20%; display: inline-block;}');
    addGlobalStyle('#filterUI .key > .comp {width: 20%; display: inline-block; text-align: center;}');
    addGlobalStyle('#filterUI .key > .value {width: 57%;display: inline-block;text-align: right;position: relative;right: 0;}');
    addGlobalStyle('#tabs .active { background-color: #4d4d4d;}');
    addGlobalStyle('#tabs { margin: 0; cursor: pointer;)');
    addGlobalStyle('.tab > .content {background-color: #4d4d4d; height: 500px; max-height:500px;}');
    addGlobalStyle('#filterUI ul { margin: 0;)');
    addGlobalStyle('#filterUI li { list-style: none; }');
    addGlobalStyle('#tabs > span{padding: 0.5em;}');
    addGlobalStyle('#constructedCommand {left: 20%;position: relative;}');
})();
