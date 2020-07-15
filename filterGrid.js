//b w e;spire 63;f 899 63;gr 63 LONGSHENG;gr 63 LONGSHENG;gr 63 LONGSHENG;gr 63 LONGSHENG;gr 63 LONGSHENG;perm 63;2

var safe = false;
str =  "lo 50 l;2;har;dis;dis;dis;dis;dis;dis;dis;dis;dis;dis;dis;dis";

function two(){
    document.querySelector("#terminal").value = '2';
    document.querySelector("#terminalButton").click()
}

function safeDeposit(){
    var time = ~~document.querySelector("#clock").textContent;
    if(safe && (time <= 20)){
        two();
    }
    var delay = gaussian(4000, 1500);
    setTimeout(safeDeposit, delay);
}

function auto(){
    document.querySelector("#terminal").value = str;
    document.querySelector("#terminalButton").click()
}

function gaussian(mean, dev){
    var y2;
    var last = false;

        var y1;
        if(last) {
           y1 = y2;
           last = false;
        }
        else {
            var x1, x2, w;
            do {
                 x1 = 2.0 * Math.random() - 1.0;
                 x2 = 2.0 * Math.random() - 1.0;
                 w  = x1 * x1 + x2 * x2;              
            } while( w >= 1.0);
            w = Math.sqrt((-2.0 * Math.log(w))/w);
            y1 = x1 * w;
            y2 = x2 * w;
            last = true;

       var val = mean + dev * y1;
       if(val > 0)
           return val;
       return -val;
   }
}

var interval;
var loop = function(){
    clearInterval(interval);
    var delay = gaussian((360*1000), (60*1000) );
    console.log(delay);
    interval = setTimeout(function(){
        auto();
        loop();
    }, delay);
}

safeDeposit();
//loop();


var button = document.createElement("button");
button.textContent = "Two!";
button.onclick = two;
document.querySelector("#links").appendChild(button);

var button = document.createElement("button");
button.textContent = "Tog!";
button.onclick = function(){
    safe = !safe;
};
document.querySelector("#links").appendChild(button);


button = document.createElement("button");
button.textContent = "Auto!"
button.onclick = auto;
document.querySelector("#links").appendChild(button);

button = document.createElement("button");
button.textContent = "Loop!"
button.onclick = function(){
    if(isNaN(interval)){
        loop();
    }
};
document.querySelector("#links").appendChild(button);

button = document.createElement("button");
button.textContent = "Stop!"
button.onclick = function(){
    clearInterval(interval);
    interval = undefined;
};
document.querySelector("#links").appendChild(button);
