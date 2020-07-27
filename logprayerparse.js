var format = function(n){
	if(isNaN(n)){
		return 0;
	}
	return (Math.round(n*100)/100).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
var strArray = $("#gridNews").text().replaceAll("\n ", "").split("> ");
var startIndex = strarray.indexOf("CaliLove forms the holy religion, Succat. Blessed are they who forsake not the assembly therein!")
strArray = strarray.slice(startIndex,-1);
var players = {};
strArray.forEach(function(str){
	if(str.indexOf("has prayed fervently") != -1){
		var name = str.match(/(\w+) has prayed/)[1];
		var value = Number(str.replaceAll(",", "").match(/\$(\d+)/)[1]);
		if(players[name] == undefined){
			players[name] = 0;
		}
		else{
			players[name] += value;
		}
	}
});
for(player in players){
	console.log(player + " prayed for " + format(players[player]) +  " gold.");
}
