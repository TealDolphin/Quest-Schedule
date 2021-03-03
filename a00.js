var rooms = [["Room 1",""],["Room 2:", "Computer Lab"],["Room 3:","Music Room"],["Room 4",""],["Room 5",""],["Room 6",""],["Room 7:","Nursery"],["Room 8",""],["Youth Room:","(Dance)"],["Elsewhere",""]];
var types = {
    "art":"Fuchsia",
    "private":"LightSteelBlue",
    "group":"YellowGreen",
    "coral":"Thistle",
    "elementary":"Red",
    "middle":"Orange",
    "other":"Grey",
    "Dr":"Yellow",
    "default":"LightBlue"
    };

// basic structure
var svgTxt = d3.select("#vis1").append("svg");
svgTxt.attr("height", 1200).attr("width", 1550).attr("id","roomsNtimes");

/* area is 1260px + 100px border on top and 50px bottom for height
 * that means each room has 130px class width plus 5px padding each side giving 10px between adjacent classes
 * height is mapped with class times which I will look at later   ==================TODO==================
*/


// quantized scale for room no.
var room = d3.scaleQuantize().domain([1,10]).range([135,270,405,540,675,810,945,1080,1215,1350]);
// scale for class start time
var time = d3.scaleLinear().domain([8,18.5]).range([100,1150]);
var howLong = d3.scaleLinear().domain([0,1]).range([0,100])

// setup variables
var day = ["monday","tuesday","wednesday","thursday"];
var dayShort = ["mon","tue","wed","thu"];
var age = 7;
var currentDay = 0;


// room lables
for(i in rooms){
    svgTxt.append("text").text(rooms[i][0]).attr("x",200+(i*135)).attr("y",30).attr("style","text-anchor:middle;");
    svgTxt.append("text").text(rooms[i][1]).attr("x",200+(i*135)).attr("y",50).attr("style","text-anchor:middle;");
}

// time of day labels and lines
for(i=8;i<=18.5;i++){
    let t = i;
    if(t > 12){t = t -12;}
    svgTxt.append("text").text(t+":00").attr("x",50).attr("y",time(i)).attr("style","text-anchor:middle;");
    svgTxt.append("line").attr("x1",80).attr("y1",time(i)).attr("x2",1550).attr("y2",time(i)).attr("style","stroke: rgb(40,40,60); stroke-width:3px;");
    svgTxt.append("text").text(t+":30").attr("x",50).attr("y",time(i+.5)).attr("style","text-anchor:middle;");
    svgTxt.append("line").attr("x1",80).attr("y1",time(i+.5)).attr("x2",1550).attr("y2",time(i+.5)).attr("style","stroke: rgb(40,40,60); stroke-width:3px;");
}

var svg = svgTxt.append("svg");
svg.attr("height", 1200).attr("width", 1550).attr("id","schedule");//.attr("style","background-color: teal;");


// break the classes apart into usable data structures by day
var day0 = [];
var day1 = [];
var day2 = [];
var day3 = [];
for(i in classes){
    switch(classes[i].DAY.toLowerCase()){
        case("monday"):
            day0.push(classes[i]); break;
        case("tuesday"):
            day1.push(classes[i]); break;
        case("wednesday"):
            day2.push(classes[i]); break;
        case("thursday"):
            day3.push(classes[i]); break;
    }
}

// convert from a time such as 1:30 into a usable number like 13.5
function timeToNum(str){
    var index = str.indexOf(":");
    var whole = 0;
    if(index == -1){
        whole = Number(str);
    }else{
        whole = Number(str.slice(0,index)) + (Number(str.slice(index+1,index+3))/60.0);
    }
    if(whole < 7.5){return whole + 12;}else{return whole;}
}

// sets the appropiate z-index values of the tabs 
// very speciffic to the current setup of the number of tabs but it should work for inputs of 0-3;
function tabbing(i){
    currentDay = i;
    d3.select("#tabs").selectAll("button").data(buttonList)
    .attr("style","background-color:transparent;background-repeat:no-repeat;border:none;overflow:hidden;outline:none;width:200px;height:100px;font-size:2em;");
    d3.select("#"+dayShort[i]).attr("style","background-color:#1780b5;background-repeat:no-repeat;border:none;overflow:hidden;outline:none;width:200px;height:100px;font-size:2em;");
}

// update classes including their text
function updateClasses(){
    //Removes text from screen
    svg.selectAll("text").data([]).exit().remove();
    
    let toUpdate = day0;
    switch(currentDay){
        case(1):
            toUpdate = day1; break;
        case(2):
            toUpdate = day2; break;
        case(3):
            toUpdate = day3; break;
        case(0):
            toUpdate = day0;
        }
    // handles enters, exits and updates for the classes
    let rects = svg.selectAll("rect").data(toUpdate);
    rects.exit().remove();
    rects.enter().append("rect").merge(rects)
        .attr("x", (d) => room(d.ROOM))
        .attr("y", (d) => time(timeToNum(d.START_TIME)))
        .attr("width", 130)
        .attr("height", (d) => howLong(timeToNum(d.END_TIME)-timeToNum(d.START_TIME)))
        .attr("style","outline-style:solid;outline-width:1px;")
        .attr("fill",function(d){
            let colour = fillColor(d,types[d.TYPE]);
            // calls the text generator for this class
            fillText(d,colour);
            return colour;
        });
}

// the stupid way i'm filtering for age.
function fillColor(d, color){
    if(filter){
        if((d.MIN_AGE > age || age > d.MAX_AGE) && d.MAX_AGE != -1){
            return "transparent";
        }
    }
    return color;
}

// generate/update the text features of the various classes
function fillText(d, colour){
    if(colour !="transparent"){
        let overflow = 0;
        // class name
        if(d.NAME.length > 19){
            if(d.NAME.length < 40){
                overflow = 10;
                // if the name of the class is too long then split it in half and put the two halves up on two lines.
                let broken = d.NAME.split(" ");
                svg.append("text")
                    .text(broken.slice(0, broken.length/2).join(" "))
                    .attr("style","text-anchor:middle;")
                    .attr("x",room(d.ROOM)+65)
                    .attr("y",(time(timeToNum(d.START_TIME))+(howLong(timeToNum(d.END_TIME)-timeToNum(d.START_TIME)))/2.)-30);
                svg.append("text")
                    .text(broken.slice(broken.length/2, broken.length).join(" "))
                    .attr("style","text-anchor:middle;")
                    .attr("x",room(d.ROOM)+65)
                    .attr("y",(time(timeToNum(d.START_TIME))+(howLong(timeToNum(d.END_TIME)-timeToNum(d.START_TIME)))/2.)-24+overflow);
            }else{
                overflow = 18;
                // if the name of the class is too long then split it in half and put the two halves up on two lines.
                let broken = d.NAME.split(" ");
                svg.append("text")
                    .text(broken.slice(0, broken.length/3).join(" "))
                    .attr("style","text-anchor:middle;")
                    .attr("x",room(d.ROOM)+65)
                    .attr("y",(time(timeToNum(d.START_TIME))+(howLong(timeToNum(d.END_TIME)-timeToNum(d.START_TIME)))/2.)-36);
                svg.append("text")
                    .text(broken.slice(broken.length/3, 2*broken.length/3).join(" "))
                    .attr("style","text-anchor:middle;")
                    .attr("x",room(d.ROOM)+65)
                    .attr("y",(time(timeToNum(d.START_TIME))+(howLong(timeToNum(d.END_TIME)-timeToNum(d.START_TIME)))/2.)-21);
                svg.append("text")
                    .text(broken.slice(2*broken.length/3, broken.length).join(" "))
                    .attr("style","text-anchor:middle;")
                    .attr("x",room(d.ROOM)+65)
                    .attr("y",(time(timeToNum(d.START_TIME))+(howLong(timeToNum(d.END_TIME)-timeToNum(d.START_TIME)))/2.)-6);
            }
        }else{
            svg.append("text")
                .text(d.NAME)
                .attr("style","text-anchor:middle;")
                .attr("x",room(d.ROOM)+65)
                .attr("y",(time(timeToNum(d.START_TIME))+(howLong(timeToNum(d.END_TIME)-timeToNum(d.START_TIME)))/2.)-24);
        }
        // ages allowed
        if(d.MAX_AGE == -1){
            svg.append("text")
                .text("(By approval only.)")
                .attr("style","text-anchor:middle;")
                .attr("x",room(d.ROOM)+65)
                .attr("y",(time(timeToNum(d.START_TIME))+(howLong(timeToNum(d.END_TIME)-timeToNum(d.START_TIME)))/2.)-8+overflow);
        }else if(d.MAX_AGE >= 19){
            svg.append("text")
                .text("(ages " + d.MIN_AGE + "+)")
                .attr("style","text-anchor:middle;")
                .attr("x",room(d.ROOM)+65)
                .attr("y",(time(timeToNum(d.START_TIME))+(howLong(timeToNum(d.END_TIME)-timeToNum(d.START_TIME)))/2.)-8+overflow);
        }else{
            svg.append("text")
                .text("(ages " + d.MIN_AGE + "-" + d.MAX_AGE + ")")
                .attr("style","text-anchor:middle;")
                .attr("x",room(d.ROOM)+65)
                .attr("y",(time(timeToNum(d.START_TIME))+(howLong(timeToNum(d.END_TIME)-timeToNum(d.START_TIME)))/2.)-8+overflow);
        }
        // teacher's name
        svg.append("text")
            .text(d.TEACHER)
            .attr("style","text-anchor:middle;")
            .attr("x",room(d.ROOM)+65)
            .attr("y",(time(timeToNum(d.START_TIME))+(howLong(timeToNum(d.END_TIME)-timeToNum(d.START_TIME)))/2.)+8+overflow);
        // time the class is
        let m = "am";
        if(timeToNum(d.END_TIME) >= 12){m = "pm"}
        svg.append("text")
            .text(d.START_TIME + "-" + d.END_TIME + m)
            .attr("style","text-anchor:middle;")
            .attr("x",room(d.ROOM)+65)
            .attr("y",(time(timeToNum(d.START_TIME))+(howLong(timeToNum(d.END_TIME)-timeToNum(d.START_TIME)))/2.)+24+overflow);
    }
}

// buttons
var buttonList = [
    {
        id: "mon",
        text: "Monday",
        click: function() { 
            tabbing(0); 
            updateClasses();
        }
    },
    {
        id: "tue",
        text: "Tuesday",
        click: function() { 
            tabbing(1); 
            updateClasses();
        }
    },
    {
        id: "wed",
        text: "Wednesday",
        click: function() { 
            tabbing(2); 
            updateClasses();
        }
    },
    {
        id: "thu",
        text: "Thursday",
        click: function() { 
            tabbing(3); 
            updateClasses();
        }
    }
];

// placing the buttons and handleing the onClick events
d3.select("#tabs")
    .selectAll("button")
    .data(buttonList)
    .enter()
    .append("button")
    .attr("id", function(d) { return d.id; })
    .text(function(d) { return d.text; })
    .on("click", function(event, d) {
        return d.click();
    });
tabbing(0);
    
var filtering = document.getElementById("filtering");
// checkbox for age filter
filtering.innerHTML += "<input id=\"filter\" type=\"checkbox\"><label for=\"filter\" style=\"font-size:1.3em;\">&ensp;Filter by Age&ensp;</label>";
// place age slider in the page
filtering.innerHTML += "<input type=\"range\" min=\"3\" max=\"19\" value=\"7\" class=\"slider\" id=\"myRange\"><label for=\"myRange\" style=\"font-size:1.3em;\" id=\"age\"></label>";
var ageView = document.getElementById("age");
ageView.innerHTML = "&ensp;" + String(age);
// Event Listener for filtering.
var filter = false;
document.getElementById("filter").addEventListener("change", (event) => {
    if(event.currentTarget.checked){filter = true;
    }else{filter = false;}
    updateClasses();
})
var myRange = document.getElementById("myRange");
// event listener for age change
myRange.addEventListener("click", (event) => {
    age = myRange.value;
    ageView.innerHTML = "&ensp;" + myRange.value;
    updateClasses();
})

// do the thing
updateClasses();
/*
// axies
svg.append("g").call(d3.axisBottom().scale(cxScale)).attr("transform","translate(0,465)").attr("id","axisBottom");
svg.append("g").call(d3.axisLeft().scale(cyScale)).attr("transform","translate(35,0)").attr("id","axisLeft");
*/
