(function(){ 
	var chainDelay = 250;
    document.head.innerHTML += '<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>'
    //Override built in psybin function
    window.Sq = function() {}
    window.initTouchSq = function() {}
    window.paintSqs = function() {}
    window.origreadUpdatedSquares = function() {}
    window.readFile = function() {}
    //fixes start here
    function getDataAndUpdate() {
        //Handle Squares
        $.ajax({
            url: "/games/the-grid-2/grid/updatedSquares.php",
            success: updateSquares,
            dataType: "json"
        });

        //Update Chat
        $.ajax({
            url: "/games/the-grid-2/grid/txt/chat.txt",
            success: updateChat,
            dataType: "text"
        });
    }

    function updateSquares(response) {
        var data = response.data;
        updateSquaresObj(data);
        for (var i = 0; i < data.length; i++) {
            var id = data[i].td;
            var square = squares[id];
            if (square.graffiti == undefined) {
                square.graffiti = document.getElementById("cn" + id).textContent;
            }
            var tdId = "td" + id;
            if (document.getElementById(tdId) != null && square.graffiti != "MSYT") {
                var td = document.getElementById(tdId);

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
        }
    }

    function updateChat(response) {
        var element = document.getElementById("incoming");
        if ($('#incoming').children().length > 3) {
            //Don't try this if the chat log is empty
            var previousLastMessage = $('#incoming').children().eq(-2).html();
            $('#incoming').html(response);
            var newLastMessage = $('#incoming').children().eq(-2).html();
            if (newLastMessage != previousLastMessage) {
                //if a new message is last, scroll to the bottom
                element.scrollTop = element.scrollHeight;
            }
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
})();
