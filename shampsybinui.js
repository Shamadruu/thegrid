document.head.innerHTML += '<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>'
//Override built in psybin function
function Sq(){}
function initTouchSq(){}
function paintSqs(){}
function origreadUpdatedSquares(){};
//Override psybin ui with fixed function
function getDataAndUpdate() {
	$.ajax({
		url: "/games/the-grid-2/grid/updatedSquares.php",
		success: update,
		dataType: "json"
	});
}
function update(response){
	var data = response.data; 
	updateSquares(data);
	for (var i = 0; i < data.length; i++) {
		var id = data[i].td;
		var square = squares[id];
		if(square.graffiti == undefined){
			square.graffiti = document.getElementById("cn" + id).textContent;
		}
		var tdId = "td" + id;
		if (document.getElementById(tdId) != null && square.graffiti != "MSYT") {
			var td = document.getElementById(tdId);
			
			var str = "";
			str += '<span class="numberBox" style="color:silver;" id="numberBox' + id + '">' + id + '</span><div class="name" title="" style="color:' + square.color + ';" id="name' + id + '">' + square.alias + '</div><div class="units" style="color:silver;" id="u' + id + '">' + commafy(square.units) + '</div><div class="structures">';
			if(square.farms != undefined && square.farms > 0){
				str += '<span style="color:silver;" id="f' + id + '">F' + commafy(square.farms) + ' </span>';
			}
			else{
				str += '<span style="color:silver;" id="f' + id + '"> </span>'
			}
			if(square.cities != undefined && square.cities > 0){
				str += '<span style="color:silver;" id="c' + id + '">C' + commafy(square.cities) + ' </span>';
			}
			else{
				str += '<span style="color:silver;" id="c' + id + '"> </span>';
			}
			if(square.rebels != undefined && square.rebels > 0){
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
			sq.innerHTML = '<span class="numberBox" style="color:silver;" id="numberBox' + id + '">' + id + '</span><span class="serf" title="" style="color:#;" id="se' + id + '"></span><div class="name" title="" style="color:#;"></div><div class="units" style="color:silver;" id="u' + id + '">MYST</div><div class="structures"><span style="color:silver;display:none;" id="f' + id + '">?</span><span style="color:silver;display:none;" id="' + id + '"></span><span style="color:red;display:none;" id="r' + id + '">?</span></div><div class="countryName" style="color:#;" id="cn' + id + '">MYST</div>';
			sq.style.visibility = "";
			sq.style.borderColor = "#666";
		}
	}
}
function updateLoop(timeout){
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
var squares = {};
var updateSquares = function(data) {
	for (var i=0;i<data.length;i++) {
		var square = data[i];
		var id = square.td;
		var perm = square.p == 1;
		squares[id] = new Square(square.nt, id, square.u, square.f, square.c, square.r, square.cn, perm, Math.ceil(id / 42), square.bc, square.co, square.na);
	}
	squaresArray = objectToArray(squares);
}
var objectToArray = function(obj){
	var arr = [];
	for(var key in obj){
		arr.push(obj[key]);
	}
	return arr;
}
var updateDelay = 5000;
getDataAndUpdate();
updateLoop();
document.body.querySelector("span").style.display = "none";
chainTimer = 250;
