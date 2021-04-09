var rooms = [["Room 1",""],["Room 2:", "Computer Lab"],["Music Room"],["Room 4",""],["Room 5",""],["Room 6",""],["Room 7:","Nursery"],["Room 8",""],["Youth Room:","(Dance)"],["Elsewhere",""]];
var types = {
    "art":"Fuchsia",
    "private":"LightSteelBlue",
    "dance":"YellowGreen",
    "music":"DodgerBlue",
    "elementary":"Red",
    "middle":"Orange",
    "other":"Grey",
    "preschool":"Pink",
    "hs":"Yellow",
    "default":"LightBlue",
    "":"LightBlue",
    "reserved":"black"
    };
// basic structure
var svgTxt = d3.select("#vis1").append("svg");
svgTxt.attr("height", 1300).attr("width", 1550).attr("id","roomsNtimes");
// quantized scale for room no.
var room = d3.scaleQuantize().domain([1,10]).range([135,270,405,540,675,810,945,1080,1215,1350]);
// time scale
var time = d3.scaleLinear().domain([8,13]).range([100,600]);
var howLong = d3.scaleLinear().domain([0,1]).range([0,100])
    
// setup variables
var age = 7;

// room lables
for(i in rooms){
    svgTxt.append("text").text(rooms[i][0]).attr("x",200+(i*135)).attr("y",30).attr("style","text-anchor:middle;");
    svgTxt.append("text").text(rooms[i][1]).attr("x",200+(i*135)).attr("y",50).attr("style","text-anchor:middle;");}
// time of day labels and lines
for(i=8;i<=13;i++){
    let t = i;
    if(t > 12){t = t -12;}
    svgTxt.append("text").text(t+":00").attr("x",50).attr("y",time(i)).attr("style","text-anchor:middle;");
    svgTxt.append("line").attr("x1",80).attr("y1",time(i)).attr("x2",1550).attr("y2",time(i)).attr("style","stroke: rgb(40,40,60); stroke-width:3px;");
    if(i != 13){
        svgTxt.append("text").text(t+":30").attr("x",50).attr("y",time(i+.5)).attr("style","text-anchor:middle;");
        svgTxt.append("line").attr("x1",80).attr("y1",time(i+.5)).attr("x2",1550).attr("y2",time(i+.5)).attr("style","stroke: rgb(40,40,60); stroke-width:3px;");}}

var svg = svgTxt.append("svg");
svg.attr("height", 1200).attr("width", 1550).attr("id","schedule");

// convert from a time such as 1:30 into a usable number like 13.5
function timeToNum(str){
    var index = str.indexOf(":");
    var whole = 0;
    if(index == -1){
        whole = Number(str);}else{
        whole = Number(str.slice(0,index)) + (Number(str.slice(index+1,index+3))/60.0);}
    if(whole < 3){return whole + 12;}else{return whole;}}

// update classes including their text
function updateClasses(){
    //Removes text from screen
    svg.selectAll("text").data([]).exit().remove();
    // handles enters, exits and updates for the classes
    let rects = svg.selectAll("rect").data(classes);
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
            return colour;});}

// the stupid way i'm filtering for age.
function fillColor(d, color){
    if(filter){if((d.MIN_AGE > age || age > d.MAX_AGE) && d.MAX_AGE != -1){return "transparent";}}
    return color;}
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
                    .attr("y",(time(timeToNum(d.START_TIME))+(howLong(timeToNum(d.END_TIME)-timeToNum(d.START_TIME)))/2.)-6);}
        }else{
            svg.append("text")
                .text(d.NAME)
                .attr("style","text-anchor:middle;")
                .attr("x",room(d.ROOM)+65)
                .attr("y",(time(timeToNum(d.START_TIME))+(howLong(timeToNum(d.END_TIME)-timeToNum(d.START_TIME)))/2.)-24);}
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
var filtering = document.getElementById("filtering");
// checkbox for age filter
filtering.innerHTML = "<div style=\"float:left\"><input id=\"filter\" type=\"checkbox\"><label for=\"filter\" style=\"font-size:1.3em;\">&ensp;Filter by Age&ensp;</label></div>";
// place age slider in the page
filtering.innerHTML += "<div style=\"float:left\"><input type=\"range\" min=\"3\" max=\"19\" value=\""+age+"\" class=\"slider\" id=\"myRange\"></div>&emsp;<div style=\"float:left\"><input type=\"number\" style=\"font-size:1.3em;width:50px\" id=\"age\" value=\""+age+"\" min=\"3\" max=\"19\"></div>";
var ageView = document.getElementById("age");
// Event Listener for filtering.
var filter = false;
document.getElementById("filter").addEventListener("change", (event) => {
    if(event.currentTarget.checked){filter = true;
    }else{filter = false;}
    updateClasses();})
var myRange = document.getElementById("myRange");
// event listener for age change
myRange.addEventListener("input", (event) => {
    if(Number(myRange.value) >= Number(ageView.min) && Number(myRange.value) <= Number(ageView.max)){
        age = myRange.value;
        ageView.value = myRange.value;
        updateClasses();}})

ageView.addEventListener("change", (event)=> {
    if(Number(ageView.value) >= Number(myRange.min) && Number(ageView.value) <= Number(myRange.max)){
        age = ageView.value;
        myRange.value = ageView.value;
        updateClasses();}})
// do the thing
updateClasses();