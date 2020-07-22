//Override built in psybin function
function Sq(){}
function initTouchSq(){}
function paintSqs(){}
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
                    readData = read.data;	
                    //updateSquareObjs(readData);
					parseGrid();
                    for (var i = 0; i < dataLength; i++) {
                        id = read.data[i].td;
						var square = squares[id];
                        tdId = "td" + id;
                        if (document.getElementById("name" + id) !== null) {
                            tmpname = document.getElementById("name" + id).title.toLowerCase();
                        } else {
                            tmpname = "myst";
                        }
                        // if the square id is OK, update the square attributes
                        if (document.getElementById(tdId) != null && tmpname !== "myst") {
							var td = document.getElementById(tdId);
							if(square.graffiti == undefined){
								square.graffiti = document.getElementById("cn" + id).textContent;
							}
							var str = "";
							str += '<span class="numberBox" style="color:silver;" id="numberBox' + id + '">' + id + '</span><div class="name" title="" style="color:' + square.color + ';" id="name' + id + '">' + square.alias + '</div><div class="units" style="color:silver;" id="u' + id + '">' + square.units + '</div><div class="structures">';
							if(square,farms != undefined && square.farms > 0){
								str += '<span style="color:silver;" id="f' + id + '">F' + square.farms + ' </span>';
							}
							else{
								str += '<span style="color:silver;" id="f' + id + '"> </span>'
							}
							if(square,cities!= undefined && square.cities > 0){
								str += '<span style="color:silver;" id="c' + id + '">C' + square.cities + ' </span>';
							}
							else{
								str += '<span style="color:silver;" id="c' + id + '"> </span>';
							}
							if(square.rebels!= undefined && square.rebels > 0){
								str += '<span style="color:red;" id="r' + id + '">R' + square.rebels + ' </span></div>';
							}
							else{
								str += '<span style="color:red;" id="r' + id + '"></span> </div>';
							}
							if(square.graffiti != undefined){
								str += '<div class="countryName" style="color:#' + square.color + ';" id="cn' + id + '">' + square.graffiti + ' </div>';
							}
							else{
								str += '<div class="countryName" style="color:#' + square.color + ';" id="cn' + id + '"> </div>';
							}
							td.innerHTML = str;
							td.style.borderColor = square.borderColor;
							td.style.color = square.color;
							
						} else if (tmpname == "myst" && document.getElementById(tdId) != null) {
							var sq = document.getElementById(tdId);
							sq.innerHTML = '<span class="numberBox" style="color:silver;" id="numberBox' + id + '">' + id + '</span><span class="serf" title="" style="color:#;" id="se' + id + '"></span><div class="name" title="" style="color:#;">?</div><div class="units" style="color:silver;" id="u' + id + '">?</div><div class="structures"><span style="color:silver;display:none;" id="f' + id + '">?</span><span style="color:silver;display:none;" id="' + id + '">?</span><span style="color:red;display:none;" id="r' + id + '">?</span></div><div class="countryName" style="color:#;" id="cn' + id + '">MYST</div>';
							sq.style.visibility = "";
						}
                        }

                        // recursive function call to continually read in messages
                        //window.clearTimeout(timeout);
                        //timeout = window.setTimeout(function(){readUpdatedSquares(milliseconds)}, milliseconds);

                        US.readOnce = true;

                        xmlhttp = null;
                    }
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


    var Square = function(name, id, units, farms, cities, rebels, graffiti, perm, domain, borderColor, color, alias) {
        this.owner = name;
        this.id = id;
        this.units = units;
        this.farms = farms;
        this.cities = cities;
        this.rebels = rebels;
        this.graffiti = graffiti;
        this.perm = perm;
        this.domain = domain;
        this.borderColor = '#' + borderColor;
        this.color = '#' + color;
        this.alias = alias;

        this.income = 0;
        this.unitProduction = 0;

        return this;
    }

    var squareObjs = {};
    var updateSquareObjs = function(data) {
        for (var i=0;i<data.length;i++) {
			var square = data[i];
            var id = square.td;
            var perm = square.p == 1;
            squareObjs[id] = new Square(square.nt, id, square.u, square.f, square.c, square.r, square.cn, perm, Math.ceil(id / 42), square.bc, square.co, square.na);
        }
    }
	origreadUpdatedSquares(10000);
	document.body.querySelector("span").style.display = "none";
	chainTimer = 500;
