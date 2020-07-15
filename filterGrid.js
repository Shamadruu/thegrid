//Override psybin ui with fixed function
function origreadUpdatedSquares(milliseconds) {
    var xmlhttp = generateXmlhttpObject();
    var url = "/games/the-grid-2/grid/updatedSquares.php?" + Math.random();
    var text = "";
    var read = "";
    var id = "";
    var tdId = "";
    var name = "";
    var units = "";
    var farms = "";
    var cities = "";
    var rebels = "";
    var numberBox = "";
    var carvings = "";
    var serfs = "";
    var tmpname = ""; // PSY: Added

    /*if (isHolidayMode) {
       resetXmasTree();
    }*/

    if (!US.readOnce) {

        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                // on page load error can occur reading empty JSON
                if (xmlhttp.responseText.length < 20) // may need to adjust
                {
                    window.clearTimeout(timeout);
                    timeout = window.setTimeout(function() {
                        readUpdatedSquares(milliseconds)
                    }, milliseconds);
                }
	
                // every so often a syntax error can occur from a partial response
                try {
                    read = eval("(" + xmlhttp.responseText + ")");
                } catch (error) {
                    //document.getElementById("terminal").value = "Please refresh the page. " + xmlhttp.responseText; //TEMP
                    //document.getElementById("terminal").value = "Something might have gotten out of whack in the code. Please refresh the page if you notice any bugs."; 
                    try {
                        console.log("Something might have gotten out of whack in the code. Please refresh the page if you notice any bugs.");
                    } catch (error) {}
                    window.clearTimeout(timeout);
                    timeout = window.setTimeout(function() {
                        readUpdatedSquares(milliseconds)
                    }, milliseconds);
                }

                var dataLength = 0;
                if (read.data != undefined) {
                    dataLength = read.data.length;
                    //if (readData == "") {
                    readData = read.data;
                    //}
                }

                for (var i = 0; i < dataLength; i++) {
                    id = read.data[i].td;
                    tdId = "td" + id;
                    if (document.getElementById("name" + id) !== null) {
                        tmpname = document.getElementById("name" + id).title.toLowerCase();
                    } else {
                        tmpname = "myst";
                    }
                    // if the square id is OK, update the square attributes
                    if (document.getElementById(tdId) != null && tmpname !== "myst") {
                        name = "name" + id;
                        units = "u" + id;
                        farms = "f" + id;
                        cities = "c" + id;
                        rebels = "r" + id;
                        numberBox = "numberBox" + id;
                        carvings = "cn" + id;
                        serfs = "se" + id;

                        document.getElementById(name).innerHTML = read.data[i].na;
                        document.getElementById(name).title = read.data[i].nt;
                        document.getElementById(units).innerHTML = commafy(read.data[i].u);
                        document.getElementById("name" + id).style.fontSize = '14px';
                        document.getElementById("name" + id).style.fontFamily = 'Arial';
                        //document.getElementById("name" + id).style.fontWeight = 'bold';
                        //document.getElementById("name" + id).style.textShadow = '-1px -1px 0 #FFFFFF, 1px -1px 0 #FFFFFF, -1px 1px 0 #FFFFFF, 1px 1px 0 #FFFFFF';
                        document.getElementById("name" + id).style.textShadow = '1px 1px 0 #000000';
                        if (parseInt(read.data[i].u) < 1) {
                            document.getElementById(units).innerHTML = "";
                        }

                        // farms
                        document.getElementById("f" + id).innerHTML = "<img src='http://upload.wikimedia.org/wikipedia/commons/9/98/Farm-Fresh_tree.png' height='9px'>" + " " + read.data[i].f;
                        //document.getElementById(farms).innerHTML = "F" + read.data[i].f;
                        if (read.data[i].f > 0) {
                            document.getElementById(farms).style.display = "";
                        } else {
                            document.getElementById(farms).style.display = "none";
                        }

                        // cities
                        document.getElementById("c" + id).innerHTML = "<img src = 'https://cdn1.iconfinder.com/data/icons/berlin/32x32/bank.png' height='9px'>" + " " + read.data[i].c;
                        //document.getElementById(cities).innerHTML = "C" + read.data[i].c;
                        if (read.data[i].c > 0) {
                            document.getElementById(cities).style.display = "";
                        } else {
                            document.getElementById(cities).style.display = "none";
                        }

                        // rebels
                        document.getElementById(rebels).innerHTML = "R" + read.data[i].r;
                        if (read.data[i].r > 0) {
                            document.getElementById(rebels).style.display = "";
                        } else {
                            document.getElementById(rebels).style.display = "none";
                        }

                        // perm square
                        if (read.data[i].p == 1) {
                            document.getElementById(tdId).style.borderStyle = "double";
                            document.getElementById(tdId).style.borderWidth = "6px";
                        } else {
                            document.getElementById(tdId).style.borderStyle = "solid";
                            document.getElementById(tdId).style.borderWidth = "2px";
                        }

                        // karma border
                        if (read.data[i].nt.match('kb_')) {
                            var kb = read.data[i].nt;
                            kb = kb.slice(3) + "px";
                            document.getElementById(tdId).style.borderWidth = kb;
                        }

                        // colors

                        if (tmpname in nameOverride) {
                            document.getElementById(name).style.color = nameOverride[tmpname];
                        } else {
                            document.getElementById(name).style.color = "#" + read.data[i].co;
                        }


                        // PSY: borderOverride stuff below
                        if (tmpname in borderOverride) {
                            document.getElementById(tdId).style.borderColor = borderOverride[tmpname];
                        } else {
                            document.getElementById(tdId).style.borderColor = "#" + read.data[i].bc;
                        }
                        savedBorderColors[i] = read.data[i].bc;

                        // activity color 
                        if (read.data[i].t != undefined) {
                            document.getElementById(numberBox).style.color = read.data[i].t;
                            document.getElementById(units).style.color = read.data[i].t;
                        }

                        // serfs
                        if (read.data[i].se != undefined) {
                            document.getElementById(serfs).innerHTML = read.data[i].se;
                        }

                        // carvings 
                        if (read.data[i].cn != undefined) {
                            var cnvar = read.data[i].cn;
                            var cnvarLength = cnvar.length;
                            if (cnvarLength > 11) {
                                document.getElementById(carvings).title = cnvar;
                                cnvar = cnvar.substr(0, 11) + "...";
                            } else {
                                document.getElementById(carvings).title = "";
                            }
                            //cnvar = cnvar.replace("GRIDDLE", "G.");
                            if (read.data[i].cn != 'sea') {
                                document.getElementById(carvings).innerHTML = cnvar;
                            }
                            document.getElementById(carvings).style.color = "#" + read.data[i].co;
                            //document.getElementById(carvings).style.color = "silver";
                            savedCarvings[i] = cnvar;

                            // polymuf
                            /*
                            if (read.data[i].cn == "POLYMUF")
                            {
                               document.getElementById(carvings).style.color = "#" + randomColorValue();
                               document.getElementById(name).style.color = "#" + randomColorValue();
                               document.getElementById(tdId).style.borderColor = "#" + randomColorValue();
                            }  
                            */

                            // sea
                            if (read.data[i].cn == "SEA") {
                                document.getElementById(tdId).style.backgroundColor = "#010f40";
                            } else {
                                // PSY: Comment this out to prevent flickering.
                                //document.getElementById(tdId).style.backgroundColor = "#000";
                            }

                            // Holiday carvings
                            if (isHolidayMode) {
                                // egg
                                if (read.data[i].cn == "EGG") {
                                    document.getElementById(carvings).innerHTML = "EGGNOG";
                                }
                                // LONGSHENG
                                if (read.data[i].cn == "LONGSHENG") {
                                    document.getElementById(carvings).innerHTML = "STOCKINGS";
                                }
                                // sword
                                if (read.data[i].cn == "SWORD") {
                                    document.getElementById(carvings).innerHTML = "CANDYCANE";
                                    //candycane(carvings);
                                }
                                // headband
                                if (read.data[i].cn.match('HEADBAND')) {
                                    var santaHat = read.data[i].cn;
                                    santaHat = santaHat.replace("HEADBAND", "SANTAHAT");
                                    document.getElementById(carvings).innerHTML = santaHat;
                                }
                                // wall
                                if (read.data[i].cn == "WALL") {
                                    document.getElementById(carvings).innerHTML = "X-MAS TREE";
                                    xmasTree(carvings);
                                }
                                // seer
                                if (read.data[i].cn == "SEER") {
                                    document.getElementById(carvings).innerHTML = "HIGH ELF";
                                }
                                // blank
                                if (read.data[i].cn == "") {
                                    document.getElementById(carvings).style.color = "#FFFFFF";
                                    document.getElementById(carvings).innerHTML = "SNOW";
                                }
                                // spires
                                if (read.data[i].cn == "SPIRES") {
                                    document.getElementById(carvings).innerHTML = "CHIMNEY";
                                }
                                // twinkle
                                if (i == dataLength - 1 && !treesLit) {
                                    twinkle();
                                    treesLit = true;
                                }
                            }
                        }

                        // domains 
                        if (id % 42 == 0 /* && savedCarvings[i] == "SEER"*/ ) {
                            changeToSeerBorderColor(id, savedBorderColors[i], savedCarvings[i]);
                        }




                    }
					else if(tmpname == "myst"){
						var sq = document.getElementById(tdId);
						sq.innerHTML = '<span class="numberBox" style="color:silver;" id="numberBox' + id + '">' + id + '</span><span class="serf" title="" style="color:#;" id="se' + id + '"></span><div class="name" title="" id="name' + id + '" style="color:#;">?</div><div class="units" style="color:silver;" id="u' + id + '">?</div><div class="structures"><span style="color:silver;display:none;" id="f' + id + '">?</span><span style="color:silver;display:none;" id="' + id + '">?</span><span style="color:red;display:none;" id="r' + id + '">?</span></div><div class="countryName" style="color:#;" id="cn' + id + '">MYST</div>';
						sq.style.visibility = "";
					}
                }

                // recursive function call to continually read in messages
                //window.clearTimeout(timeout);
                //timeout = window.setTimeout(function(){readUpdatedSquares(milliseconds)}, milliseconds);

                US.readOnce = true;

                xmlhttp = null;
            }
        };

        xmlhttp.open("GET", url, true);
        xmlhttp.send(null);

    } else {
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                US.lastCheckedNum = US.checkNum;
                US.checkNum = xmlhttp.responseText;
                if (US.lastCheckedNum != US.checkNum && US.lastCheckedNum != 0) {
                    US.readOnce = false;
                }

                xmlhttp = null;
            }
        };

        xmlhttp.open("GET", "/games/the-grid-2/grid/txt/check_updatedSquaresLog.txt?" + Math.random(), true);
        xmlhttp.send(null);

    }

    window.clearTimeout(timeout);
    timeout = window.setTimeout(function() {
        readUpdatedSquares(milliseconds)
    }, milliseconds);
}

(function(){
document.querySelector("#terminal").maxLength = 2500;
var runInterval = 1000;
var squares = {};
var players = {};
var squaresArray;
var functionalGraffities = ["wall", "spire", "domlord", "seer", "castle", "gnome", "longsheng", "myst", "nospawn", "pil-a", "pil-n", "pil-s", "monk", "rebel", "samurai", "sea", "seer", "spawn", "sword", "thug", "wildcard", "windmill"];
var filterKeys = ["owner", "units", "rebels", "farms", "cities", "id", "graffiti", "perm", "domain"];
var filteredSquares;

var Player = function(name){
	this.name = name;
	this.units = 0;
	this.rebels = 0;
	this.farms = 0;
	this.cities = 0; 
	this.squares = 0;
	this.squareList = {};
	
	this.incomeMultiplier = 1;
	this.income = 100;
	this.unitMultiplier = 1;
	this.unitProduction = 0;
	this.additionalEnergyIncome = 0;
	
	this.graffiti = {};
	
	for(var i=0;i<functionalGraffities.length;i++){
		this.graffiti[functionalGraffities[i]] = 0;
	}
	
	return this;
}
Player.prototype.update = function(){
	for(var square in this.squareList){
		var s = this.squareList[square];
		this.squares++;
		this.units += s.units;
		this.rebels += s.rebels;
		this.farms += s.farms;
		this.cities += s.cities;
		
		if(functionalGraffities.indexOf(s.graffiti) != -1){
			this.graffiti[s.graffiti]++;
			
			if(s.graffiti == "longsheng"){
				this.incomeMultiplier += 0.05;
			}
			else if(s.graffiti == "castle"){
				this.incomeMultiplier += 0.02;
			}
		}
	}
	this.incomeMultiplier = (~~this.incomeMultiplier*100)/100;
	for(var square in this.squareList){
		var s = this.squareList[square];
		s.update(this.incomeMultiplier);
		this.income += s.income;
		this.unitProduction += s.unitProduction;
	}
}

var Square = function(name, id, u, f, c, r, gr, p, d){
	this.owner = name;
	this.id = id;
	this.units = u;
	this.farms = f;
	this.cities = c;
	this.rebels = r;
	this.graffiti = gr;
	this.perm = p;
	this.domain = d;
	
	this.income = 0;
	this.unitProduction = 0;

	return this;
}
Square.prototype.update = function(m){
	this.income = Number(this.farms*55*m*(100-this.rebels)/100);
	
	this.unitProduction = (Number(this.cities*(100-this.rebels)/100));
	if(this.graffiti == "sword"){
		this.unitProduction *= 5;
	}
}
var constructUI = function(){
	var filterUIRaw = '<div style="display:none" id="filterUI"> \n <div style="text-align:center;font-size:1.5em">Filter UI <span id="closeUI" style="float: right;font-size: 1em;cursor:pointer;">X</span></div>\n <hr> \n <div id="tabs">\n<span class="active" target="filterTab">Filtering</span>\n<span class="" target="commandTab">Commands</span>\n</div>\n <div class="collapsible collapsible-expanded tab" id="filterTab"> \n <div class="content"> \n <div id="filterParameters" style="width:50%;float:left;border-right:2px solid #999"> \n <div style="text-align:center;font-size:1.25em">Filter Parameters</div>\n <div class="key" id="keyOwner"> \n<span class="name">Owner: </span>\n <span class="comp"> \n <select style="width:50px"> \n <option value="=" selected="">=</option> \n <option value="!=">!=</option> \n </select> \n </span> \n<span class="value">\n<input name="owner" type="text">\n</span>\n </div>\n <div class="key" id="keyUnits"> \n<span class="name">Units:</span>\n <span class="comp"> \n <select style="width:50px"> \n <option value="<">&lt; </option> \n <option value="<=">&lt;=</option> \n <option value="=" selected="">=</option> \n <option value="!=">!=</option> \n <option value=">=">&gt;=</option> \n <option value=">">&gt; </option> \n </select> \n </span> \n<span class="value"><input name="units" type="number"></span>\n </div>\n <div class="key" id="keyRebels"> \n<span class="name">Rebels: </span>\n <span class="comp"> \n <select style="width:50px"> <option value="<">&lt; </option> <option value="<=">&lt;=</option> \n <option value="=" selected="">=</option> \n <option value="!=">!=</option> <option value=">=">&gt;=</option> \n <option value=">">&gt; </option> \n </select> \n </span> \n<span class="value"><input name="rebels" type="number"></span>\n </div>\n <div class="key" id="keyFarms"> \n<span class="name">Farms: </span>\n <span class="comp"> \n <select style="width:50px"> \n <option value="<">&lt; </option> \n <option value="<=">&lt;=</option> \n <option value="=" selected="">=</option> \n <option value="!=">!=</option> \n <option value=">=">&gt;=</option> \n <option value=">">&gt; </option> \n </select> \n </span> \n<span class="value">\n<input name="farms" type="number">\n</span>\n </div>\n <div class="key" id="keyCities"> \n<span class="name">Cities: </span>\n <span class="comp"> \n <select style="width:50px"> \n <option value="<">&lt; </option> \n <option value="<=">&lt;=</option> \n <option value="=" selected="">=</option> \n <option value="!=">!=</option> \n <option value=">=">&gt;=</option> \n <option value=">">&gt; </option> \n </select> \n </span> \n<span class="value"><input name="cities" type="number"></span>\n </div>\n <div class="key" id="keyID"> \n<span class="name">ID: </span>\n <span class="comp"> \n <select style="width:50px"> \n <option value="<">&lt; </option> \n <option value="<=">&lt;=</option> \n <option value="=" selected="">=</option> \n <option value="!=">!=</option> \n <option value=">=">&gt;=</option> \n <option value=">">&gt; </option> \n </select> \n </span> \n<span class="value"><input name="id" type="number"></span>\n </div>\n <div class="key" id="keyDomain"> \n<span class="name">Domain: </span>\n <span class="comp"> \n <select style="width:50px"> \n <option value="<">&lt; </option> \n <option value="<=">&lt;=</option> \n <option value="=" selected="">=</option> \n <option value="!=">!=</option> \n <option value=">=">&gt;=</option> \n <option value=">">&gt; </option> \n </select> \n </span> \n<span class="value"><input name="domain" type="number"></span>\n </div>\n <div class="key" id="keyGraffiti"> \n<span class="name">Graffiti: </span>\n <span class="comp"> \n <select style="width:50px"> \n <option value="=" selected="">=</option> \n <option value="!=">!=</option> \n </select> \n </span> \n <span style="width:30%;display:inline-block;text-align:center"> \n <select style="text-align:center;width:80px;font-size:.8em"> \n <option value="wall">wall</option> \n <option value="spire">spire</option> \n <option value="domlord">domlord</option> \n <option value="seer">seer</option> \n <option value="castle">castle</option> \n <option value="gnome">gnome</option> \n <option value="longsheng">longsheng</option> \n <option value="myst">myst</option> \n <option value="nospawn">nospawn</option> \n <option value="pil-a">pil-a</option> \n <option value="pil-n">pil-n</option> \n <option value="pil-s">pil-s</option> \n <option value="monk">monk</option> \n <option value="rebel">rebel</option> \n <option value="samurai">samurai</option> \n <option value="sea">sea</option> \n <option value="seer">seer</option> \n <option value="spawn">spawn</option> \n <option value="sword">sword</option> \n <option value="thug">thug</option> \n <option value="wildcard">wildcard</option> \n <option value="windmill">windmill</option> \n <option selected=""> </option> \n </select> \n </span> \n<span class="value" style="width:25.8%"><input name="graffiti" style="width:82.5px;font-size:.8em"></span>\n </div>\n <div class="key" id="keyPerm"> \n<span class="name">Permanence: </span>\n <span class="comp"> \n <select style="width:50px"> \n <option value="=" selected="">=</option> \n <option value="!=">!=</option> \n </select> </span> \n <span class="value"> \n <select style="width:50px"> \n <option value="" selected=""></option> \n <option value="true">true</option> \n <option value="false">false</option> \n </select> \n </span> \n </div>\n <div style="text-align:center">\n<button id="filterSquares" style="background:#999;color:white;border:1px outset #999">Filter Squares</button>\n</div>\n </div>\n <div id="filterOutputPane" style="width:calc(50% - 2px);float:left"> \n <div style="text-align:center;font-size:1.25em">Filter Output</div>\n <div id="filterOutput" style="overflow-y:scroll;overflow-wrap:normal;font-size:1em"></div>\n </div>\n </div>\n </div>\n <div class="collapsible collapsible-collapsed tab" id="commandTab"> \n <div class="content"> \n <div id="commandSelectionPane"> \n <div style="text-align:center;font-size:1.25em">Command Selection</div>\n <div id="commandOptions"> \n <div class="collapsible collapsible-collapsed" id="deploy"> \n<input type="radio" name="commandOptions" id="choiceDeploy" value="deploy"> <label for="choiceDeploy">Deploy</label>\n <ul class="content" id="deployOptions"> \n <li>\n<input type="radio" name="deployOptions" id="deployOption1" value="deployOption1">\n<label for="deployOption1">Deploy from [filtered squares] to\n<input type="number" value="" name="targetSquare"> so [units on filtered square]=\n<input type="number" value="" name="targetAmount">\n</label>\n</li>\n <li>\n<input type="radio" name="deployOptions" id="deployOption2" value="deployOption2">\n<label for="deployOption2">Deploy all units from [filtered squares] to\n<input type="number" value="" name="targetSquare">\n</label>\n</li>\n <li>\n<input type="radio" name="deployOptions" id="deployOption3" value="deployOption3">\n<label for="deployOption3">Deploy from\n<input type="number" value="" name="targetSquare"> to [filtered squares] so [units deployed from square]=\n<input type="number" value="" name="targetAmount">\n</label>\n</li>\n <li>\n<input type="radio" name="deployOptions" id="deployOption3" value="deployOption4">\n<label for="deployOption4">Deploy from\n<input type="number" value="" name="targetSquare"> to [filtered squares] so [units deployed on square]=\n<input type="number" value="" name="targetAmount">\n</label>\n</li>\n </ul> \n </div>\n <div class="collapsible collapsible-collapsed" id="exchange"> \n<input type="radio" name="commandOptions" id="choiceExchange" value="exchange"> <label for="choiceExchange">Exchange</label>\n <ul class="content" id="exchangeOptions"> \n <li>\n<input type="radio" name="exchangeOptions" id="exchangeOption1" value="exchangeOption1">\n<label for="exchangeOption1">Exchange\n<input type="number" value="" name="targetAmount"> units on [filtered squares]\n</label>\n</li>\n <li>\n<input type="radio" name="exchangeOptions" id="exchangeOption2" value="exchangeOption2">\n<label for="exchangeOption2">Exchange all units on [filtered squares] </label>\n</li>\n <li>\n<input type="radio" name="exchangeOptions" id="exchangeOption3" value="exchangeOption3">\n<label for="exchangeOption3">Exchange until [units] on [filtered squares]=\n<input type="number" value="" name="targetAmount">\n</label>\n</li>\n </ul> \n </div>\n <div class="collapsible collapsible-collapsed" id="graffiti"> \n<input type="radio" name="commandOptions" id="choiceGraffiti" value="graffiti"> <label for="choiceGraffiti">Graffiti</label>\n <ul class="content" id="graffitiOptions"> \n <li><input type="radio" name="graffitiOptions" id="graffitiOption1" value="graffitiOption1"><label for="graffitiOption1">Graffiti [filtered squares] with <input type="text" value=""></label></li>\n </ul> \n </div>\n <div class="collapsible collapsible-collapsed"id="razeF"> \n<input type="radio" name="commandOptions" id="choiceRazeFarms" value="razeFarms"> <label for="choiceRazeFarms">Raze Farms</label>\n <ul class="content" id="razeFarmsOptions"> \n <li>\n<input type="radio" name="razeFarmsOptions" id="razeFarmsOption1" value="razeFarmsOption1">\n<label for="razeFarmsOption1">raze f\n<input type="number" value="" name="targetAmount"> on [filtered squares]\n</label>\n</li>\n <li>\n<input type="radio" name="razeFarmsOptions" id="razeFarmsOption2" value="razeFarmsOption2"><label for="razeFarmsOption2">raze f all on [filtered squares]</label>\n</li>\n <li>\n<input type="radio" name="razeFarmsOptions" id="razeFarmsOption3" value="razeFarmsOption3">\n<label for="razeFarmsOption3">raze f until [farms] on [filtered squares]=\n<input type="number" value="" name="targetAmount">\n</label>\n</li>\n </ul> \n </div>\n <div class="collapsible collapsible-collapsed" id="razeC"> \n<input type="radio" name="commandOptions" id="choiceRazeCities" value="razeCities"> <label for="choiceRazeCities">Raze Cities</label>\n <ul class="content" id="razeFarmOptions"> \n <li>\n<input type="radio" name="razeCitiesOptions" id="razeCitiesOption1" value="razeCitiesOption1">\n<label for="razeCitiesOption1">raze c\n<input type="number" value="" name="targetAmount"> on [filtered squares]\n</label>\n</li>\n <li>\n<input type="radio" name="razeCitiesOptions" id="razeCitiesOption2" value="razeCitiesOption2">\n<label for="razeCitiesOption2">raze c all on [filtered squares]\n</label>\n</li>\n <li>\n<input type="radio" name="razeCitiesOptions" id="razeCitiesOption3" value="razeCitiesOption3">\n<label for="razeCitiesOption3">raze c until [cities] on [filtered squares]=\n<input type="number" value="" name="targetAmount">\n</label>\n</li>\n </ul> \n </div>\n <div class="collapsible collapsible-collapsed" id="rebels"> \n<input type="radio" name="commandOptions" id="choiceRebels" value="rebels"> <label for="choiceRebels">Rebels</label>\n <ul class="content" id="rebelOptions"> \n <li><input type="radio" name="rebelOptions" id="rebelOption1" value="rebelOption1"><label for="rebelOption1">r r [filtered squares]</label></li>\n <li><input type="radio" name="rebelOptions" id="rebelOption2" value="rebelOption2"><label for="rebelOption2">r i [filtered squares]</label></li>\n <li><input type="radio" name="rebelOptions" id="rebelOption3" value="rebelOptions3"><label for="rebelOptions3">r p <input type="number" value="" name="targetAmount"> [filtered squares]</label></li>\n <li><input type="radio" name="rebelOptions" id="rebelOption4" value="rebelOptions4"><label for="rebelOptions4">r p all [filtered squares]</label></li>\n </ul> \n </div>\n <div class="collapsible collapsible-collapsed"> \n<input type="radio" name="commandOptions" id="choiceAnnex" value="annex"> <label for="choiceAnnex">Annex</label>\n <ul class="content" id="annexOptions"> \n <li><input type="radio" name="annexOptions" id="annexOptions1" value="annexOptions1"><label for="annexOption1">annex [filtered squares]</label></li>\n </ul> \n </div>\n <div class="collapsible collapsible-collapsed" id="buildF"> \n<input type="radio" name="commandOptions" id="choiceFarms" value="farms"> <label for="choiceFarms">Build Farms</label>\n <ul class="content" id="farmOptions"> \n <li><input type="radio" name="farmOptions" id="farmOption1" value="farmOption1"><label for="farmOption1">f <input type="number" value="" name="targetAmount"> [filtered squares]</label></li><li><input type="radio" name="farmOptions" id="farmOption2" value="farmOption2"><label for="farmOption2">Build until f <input type="number" value="" name="targetAmount"> [filtered squares]</label></li>\n </ul> \n </div>\n <div class="collapsible collapsible-collapsed" id="buildC"> \n<input type="radio" name="commandOptions" id="choiceCities" value="citys"> <label for="choiceCities">Build Cities</label>\n <ul class="content" id="cityOptions"> \n <li><input type="radio" name="cityOptions" id="cityOption1" value="cityOption1"><label for="cityOption1">c <input type="number" value="" name="targetAmount"> [filtered squares]</label></li><li><input type="radio" name="cityOptions" id="cityOption2" value="cityOption2"><label for="cityOption2">Build until c <input type="number" value="" name="targetAmount"> [filtered squares]</label></li>\n </ul> \n </div>\n </div><div id="constructButtonF"><button id="constructButton">Construct Command</button></div>\n </div>\n <div id="constructedCommandPane"> \n <div style="text-align:center;font-size:1.25em">Constructed Command</div><div><textarea id="constructedCommand" name="constructedCommand" rows="10" cols="50"></textarea></div></div>\n </div>\n </div>\n</div>';
	
	
	//Create button to open ui
	links = document.querySelector("#links");
	var openUIButton = document.createElement("button");
	openUIButton.id = "openUIButton";
	openUIButton.textContent = "Open UI";
	openUIButton.onclick = function(){
		toggleUI();
	};
	
	links.appendChild(openUIButton);
	
	var filterUI = document.createElement("div");
	document.body.appendChild(filterUI);
	
	filterUI.innerHTML = filterUIRaw;
	var closeUIButton = document.querySelector("#closeUI");
	closeUIButton.onclick = function(){
		toggleUI();
	}
	var filterButton = filterUI.querySelector("#filterSquares");
	var filterOutput = filterUI.querySelector("#filterOutput");
	var nextButton = filterUI.querySelector("#nextButton");
	var constructButton = filterUI.querySelector("#constructButton");
	var commandTextArea = filterUI.querySelector("#constructedCommand");
	var results = [];
	
	//handle command construction
	constructButton.onclick = function(){
		var commandString = "";
		var selectedCommand = filterUI.querySelector("#commandOptions input:checked");
		var selectedOption = filterUI.querySelector("#commandOptions input:checked + label + ul li input:checked");
		var optionElements;
		var optionParameters = [];
		if(selectedCommand == undefined || selectedOption == undefined){
			console.log("No command selected!");
		}
		else{
			selectedCommand = selectedCommand.value;
			selectedOption = selectedOption.value;
			optionElements = filterUI.querySelectorAll("#commandOptions input:checked + label + ul li input:checked + label > input");
			for(var i=0;i<optionElements.length;i++){
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
	filterUI.querySelectorAll("#commandOptions > .collapsible").forEach(function(e){
		e.onclick = function(){
			document.querySelectorAll("#commandOptions > .collapsible").forEach(function(el){
				el.classList.remove("collapsible-expanded");
				el.classList.add("collapsible-collapsed");
			});
			this.classList.add("collapsible-expanded");
			this.querySelector("input").checked = true;
		}
	});
	//set up tabs
	filterUI.querySelectorAll("#tabs > span").forEach(function(e){
		e.onclick = function(){
			this.parentNode.querySelectorAll("span").forEach(function(el){
				el.classList.remove("active");
			});
			document.querySelectorAll("#filterUI > .tab").forEach(function(el){
				el.classList.remove("collapsible-expanded");
				el.classList.add("collapsible-collapsed");
			});
			this.classList.add("active");
			document.querySelector("#"+this.attributes.target.value).classList.add("collapsible-expanded");
		}
	});
	
	filterButton.onclick = function(){
		//Wipe filter output
		filterOutput.innerHTML = "";
		//construct parameter object
		var params = {};
		filterUI.querySelector("#filterParameters").querySelectorAll(".key").forEach(function(e){
			if(e.id !== "keyGraffiti"){
				if((e.querySelector("input") != null && e.querySelector("input").value != "") || (e.querySelectorAll("select").item(1) != null && e.querySelectorAll("select").item(1).value != "")){
					var keyName = e.id.slice(3).toLowerCase();;
					var comparison = e.querySelector("select").value;
					var value;
					if(e.querySelector("input")){
						value = e.querySelector("input").value;
					}
					else{
						value = e.querySelectorAll("select").item(1).value;
					}
					if(keyName == "owner"){
						value = value.toLowerCase();
					}
					params[keyName] = comparison + value;
				}
			}
			else{
				var value;
				if(e.querySelector("input").value != "" || e.querySelectorAll("select").item(1).value != ""){
					if(e.querySelector("input").value != ""){
						value = e.querySelector("input").value;
					}
					else{
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
		for(var i=0;i<filteredSquares.length;i++){
			var s = filteredSquares[i];
			var wrapper = document.createElement("div");
			wrapper.classList.add("collapsible");
			wrapper.classList.add("collapsible-collapsed");
			wrapper.innerHTML = '<div class="collapsible">' + s.id + '</div>';
			
			var content = document.createElement("ul");
			content.classList.add("content")
			content.innerHTML = '<li>Owner: ' + s.owner + '</li><li>Units: ' + s.units.toLocaleString() + '</li><li>Farms: ' + s.farms.toLocaleString() + '</li><li>Cities: ' + s.cities.toLocaleString() + '</li><li>Rebels: ' + s.rebels + '</li><li>Graffiti: ' + s.graffiti.toUpperCase() + '</li><li>Permanence: ' + s.perm + '</li><li>Domain: ' + s.domain + '</li><li>Estimated Income: '  + s.income.toLocaleString() + '</li><li>Estimated Unit Production: ' + s.unitProduction.toLocaleString() + '</li>'; 
			
			wrapper.onclick = function(){
				this.classList.toggle("collapsible-collapsed");
				this.classList.toggle("collapsible-expanded");
			}
			
			wrapper.appendChild(content);
			filterOutput.appendChild(wrapper);
		}
		
	}
}

var parseGrid = function(){
	document.querySelector('#masterTable').querySelectorAll("td").forEach(function(s){ 
		var player, perm;
		if(s.querySelector(".name") !== null){
			var name = s.querySelector(".name").title.toLowerCase().trim()||"thegridadmin";
			
			if(players[name]||false){
				player = players[name]
			}
			else{
				player = new Player(name)
				players[name] = player;
			}
			if(s.style.borderStyle.indexOf("double")!== -1){
				perm = true;
			}
			else{
				perm = false;
			}
			var id = Number(s.querySelector(".numberBox").textContent.trim())||0;
			var units = Number(s.querySelector(".units").textContent.trim().split(",").join(""))||0;
			var farms = Number(s.querySelectorAll(".structures span").item(0).textContent.trim())||0;
			var cities = Number(s.querySelectorAll(".structures span").item(1).textContent.trim())||0;
			var rebels = Number(s.querySelectorAll(".structures span").item(2).textContent.replace("R", "").trim())||0;
			var graffiti = s.querySelector(".countryName").textContent.toLowerCase().trim()||"";
			var domain = Math.ceil(id/42);
		}
		else{
			var name = "myst"
			
			if(players[name]||false){
				player = players[name]
			}
			else{
				player = new Player(name)
				players[name] = player;
			}
		}
		
		var square = new Square(name, id, units, farms, cities, rebels, graffiti, perm, domain);
		squares[id] = square;
		player.squareList[id] = square;
	});
};

var updateAllPlayers = function(){
	for(var player in players){
		var p = players[player];
		p.update();
	}
}

var run = function(){
	squares = {};
	players = {};
	
	parseGrid();
	updateAllPlayers();
	
	squaresArray = objectToArray(squares);

}

var display = function(){
	console.group();
	for(var player in players){
		var p = players[player];
		console.groupCollapsed(player);
			console.group("Basic Information");
				console.log("Units: " + p.units, "  	Farms: " + p.farms, "   	Cities: " + p.cities, "		Rebels: " + p.rebels, " 	Squares " + p.squares, " 	Income: " + p.income, " 	Unit Production: " + p.unitProduction);
				
				console.groupCollapsed("Graffiti");
					console.table(p.graffiti);
				console.groupEnd();
				
				console.groupCollapsed("Squares:");
					console.table(p.squareList);
				console.groupEnd();
			console.groupEnd();
		console.groupEnd();
	}
	console.groupEnd();
}
var filter = function(key, comp, value, square){
	if(comp === "=" && square[key] == value){
		return true;
	}
	else if(comp === "!=" && square[key] != value){
		return true;
	}
	else if(comp === "<=" && square[key] <= value){
		return true;
	}
	else if(comp === ">=" && square[key] >= value){
		return true;
	}
	else if(comp === "<" && square[key] < value){
		return true;
	}
	else if(comp === ">" && square[key] > value){
		return true;
	}
	else{
		return false;
	}
}
var filterSquares = function(sqs, parameters){
	var matches = sqs;
	var keys = Object.keys(parameters);
	//var filterKeys = ["owner", "units", "rebels", "farms", "cities", "id", "graffiti", "perm"];
	// {owner: "name", units: ">50", "farms: =50" }
	if(keys.length == 0){
		return;
	}
	for(var i=0;i<keys.length;i++){
		if(filterKeys.indexOf(keys[i].toLowerCase()) == -1){
			console.warn("Error: Invalid filter key!");
			return null;
		}
		var value = parameters[keys[i]];
		if(keys[i] != "owner" && keys[i] !== "graffiti" && keys[i] !== "perm" && 	value.match(/[a-df-z]/i) !== null && value.match(/[=<>]{0,2}[0-9e]+/i) !== null ){
			console.warn("Error: Invalid filter value!");
			return null;
		}
	}
	
	for(var parameter in parameters){
		var m = []
		var comp;
		var value = parameters[parameter];
		if(parameter === "owner"){
			comp = value.match(/[!=<>]{1,2}/)[0];
			if(comp != "=" && comp != "!="){
				console.warn("Error: Invalid comparison value!");
				return;
			}
			value = value.match(/[a-z]+/i)[0].toLowerCase();
		}
		else if(parameter === "graffiti"){
			comp = value.match(/[!=<>]{1,2}/)[0];
			value = value.match(/[a-z]+/i)[0].toLowerCase();
			//console.log(comp, value);
		}
		else if(parameter === "perm"){
			comp = value.match(/[!=<>]{1,2}/)[0];
			value = value.match(/[a-z]+/i)[0].toLowerCase();
			if(value == "true"){
				value = true;
			}
			else{
				value = false;
			}
		}
		else{
			comp = value.match(/[!=<>]{1,2}/)[0];
			value = value.match(/[0-9\.e]+/i)[0]
		}
		for(var i=0;i<matches.length;i++){
			//console.log(i);
			if(parameter === "perm"){
				console.log(parameter, comp, value);
			}
			var result = filter(parameter, comp, value, matches[i]);
			if(result){
				m.push(matches[i]);
			}
		}
		
		matches = m;
	}
	return matches;
}

var buildCommand = function(commandType, params){
	var commandString = "";
	console.log(commandType);
	console.log(params);
	console.log(filteredSquares);
	if(commandType == "deployOption1"){
		for(var i=0;i<filteredSquares.length;i++){
			var square = filteredSquares[i];
			var val = square.units-params[1].value;
			if(val>0){
				commandString += "d "  + (val) + " " + square.id + " " + params[0].value + ";";
			}
		}
	}
	else if(commandType == "deployOption2"){
		for(var i=0;i<filteredSquares.length;i++){
			var square = filteredSquares[i];
			var val = square.units-1;
			if(val>0){
				commandString += "d "  + (val) + " " + square.id + " " + params[0].value + ";";
			}
		}
	}
	else if(commandType == "deployOption3"){
		for(var i=0;i<filteredSquares.length;i++){
			var square = filteredSquares[i];
			var val = params[1].value;
			if(val>0){
				commandString += "d "  + (val) + " " +  params[0].value + " " + square.id + ";";
			}
		}
	}
	else if(commandType == "deployOption4"){
		for(var i=0;i<filteredSquares.length;i++){
			var square = filteredSquares[i];
			var val = params[1].value-square.units;
			if(val>0){
				commandString += "d "  + (val) + " " +  params[0].value + " " + square.id + ";";
			}
		}
	}
	else if(commandType == "exchangeOption1"){
		for(var i=0;i<filteredSquares.length;i++){
			var square = filteredSquares[i];
			var val = params[0].value
			if(val>0){
				commandString += "ex " + (val) + " " + square.id + ";";
			}
		}
	}
	else if(commandType == "exchangeOption2"){
		for(var i=0;i<filteredSquares.length;i++){
			var square = filteredSquares[i];
			var val = square.units-1;
			if(val>0){
				commandString += "ex " + (val) + " " + square.id + ";";
			}
		}
	}
	else if(commandType == "exchangeOption3"){
		for(var i=0;i<filteredSquares.length;i++){
			var square = filteredSquares[i];
			var val = square.units-params[0].value;
			if(val){
				commandString += "ex " + (val) + " " + square.id + ";";
			}
		}
	}
	else if(commandType == "graffitiOption1"){
		for(var i=0;i<filteredSquares.length;i++){
			var square = filteredSquares[i];
			commandString += "gr " +  square.id + " " + params[0].value + ";";
		}
	}
	else if(commandType == "razeFarmsOption1"){
		for(var i=0;i<filteredSquares.length;i++){
			var square = filteredSquares[i];
			var val = parms[0].value;
			if(val>0){
				commandString += "raze f " + square.id + " " + val + ";";
			}
		}
	}
	else if(commandType == "razeFarmsOption2"){
		for(var i=0;i<filteredSquares.length;i++){
			var square = filteredSquares[i];
			var val = square.farms;
			if(val>0){
				commandString += "raze f " + square.id + " " + val + ";";
			}
		}
	}
	else if(commandType == "razeFarmsOption3"){
		for(var i=0;i<filteredSquares.length;i++){
			var square = filteredSquares[i];
			var val = square.farms-params[0].value;
			if(val>0){
				commandString += "raze f " + square.id + " " + (val) + ";";
			}
		}
	}
	else if(commandType == "razeCitiesOption1"){
		for(var i=0;i<filteredSquares.length;i++){
			var square = filteredSquares[i];
			var val = parms[0].value;
			if(val>0){
				commandString += "raze c " + square.id + " " + val + ";";
			}
		}
	}
	else if(commandType == "razeCitiesOption2"){
		for(var i=0;i<filteredSquares.length;i++){
			var square = filteredSquares[i];
			var val = square.cities;
			if(val>0){
				commandString += "raze c " + square.id + " " + val + ";";
			}
		}
	}
	else if(commandType == "razeCitiesOption3"){
		for(var i=0;i<filteredSquares.length;i++){
			var square = filteredSquares[i];
			var val = square.cities-params[0].value;
			if(val>0){
				commandString += "raze c " + square.id + " " + (val) + ";";
			}
		}
	}
	else if(commandType == "rebelOptions3"){
		for(var i=0;i<filteredSquares.length;i++){
			var square = filteredSquares[i];
			var val = params[0].value;
			if(val>0){
				commandString += "r p " + val + " " + square.id + ";";
			}
		}
	}
	else if(commandType == "rebelOptions4"){
		for(var i=0;i<filteredSquares.length;i++){
			var square = filteredSquares[i];
			var val = square.rebels;
			if(val>0){
				commandString += "r p " + val + " " + square.id + ";";
			}
		}
	}
	else if(commandType == "annexOptions1"){
		for(var i=0;i<filteredSquares.length;i++){
			var square = filteredSquares[i];
			commandString += "an " + square.id + ";";
		}
	}
	else if(commandType == "farmOption1"){
		for(var i=0;i<filteredSquares.length;i++){
			var square = filteredSquares[i];
			commandString += "f " + params[0].value + " " + square.id + ";";
		}
	}
	else if(commandType == "farmOption2"){
		for(var i=0;i<filteredSquares.length;i++){
			var square = filteredSquares[i];
			commandString += "f " + (params[0].value-square.farms) + " " + square.id + ";";
		}
	}
	else if(commandType == "cityOption1"){
		for(var i=0;i<filteredSquares.length;i++){
			var square = filteredSquares[i];
			commandString += "c " + params[0].value + " " + square.id + ";";
		}
	}
	else if(commandType == "cityOption2"){
		for(var i=0;i<filteredSquares.length;i++){
			var square = filteredSquares[i];
			commandString += "c " + (params[0].value-square.farms) + " " + square.id + ";";
		}
	}
	return commandString;
}

var objectToArray = function(obj){
	var arr = [];
	for(var key in obj){
		arr.push(obj[key]);
	}
	return arr;
}
var addGlobalStyle = function(style){
	var styleElement = document.createElement("style");
	styleElement.innerHTML = style;
	document.head.appendChild(styleElement);
}
function toggleUI(){
	if(filterUI.style.display == "none"){
		filterUI.style.display = "block";
	}
	else{
		filterUI.style.display="none";
	}
}
	
run()
run();
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


var runTimer = setInterval(run, runInterval);
})()
