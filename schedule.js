//
// schedule.js
//
// This file holds all current classes to be visualized by holding all
// the info about said classes.

var rooms = [["Room 1",""],["Room 2:", "Computer Lab"],["Room 3:","Music Room"],["Room 4",""],["Room 5",""],["Room 6",""],["Room 7:","Nursery"],["Room 8",""],["Youth Room:","(Dance)"]];
var types = {
    "art":"Fuchsia",
    "private":"LightSteelBlue",
    "group":"YellowGreen",
    "coral":"Thistle",
    "elementary":"Red",
    "middle":"Orange",
    "other":"Grey",
    "Dr":"Yellow"
    };

var classes = [
 {NAME:"ARTcetera",DAY:"monday", START_TIME:"9", END_TIME:"9:50", TEACHER:"Boone", ROOM:1,TYPE:"art",MIN_AGE:8,MAX_AGE:9},
 {NAME:"ARTcetera",DAY:"monday", START_TIME:"10", END_TIME:"10:50", TEACHER:"Boone", ROOM:1,TYPE:"art",MIN_AGE:5,MAX_AGE:7},
 {NAME:"Private Violin",DAY:"monday", START_TIME:"8:45", END_TIME:"10:15", TEACHER:"D. Rife", ROOM:2,TYPE:"private",MIN_AGE:3,MAX_AGE:19},
 {NAME:"Contemporary Acoustic Guitar 1",DAY:"monday", START_TIME:"8:30", END_TIME:"9:20", TEACHER:"L. Dirks", ROOM:3,TYPE:"group",MIN_AGE:10,MAX_AGE:19},
 {NAME:"Med Bio",DAY:"monday", START_TIME:"8:30", END_TIME:"11", TEACHER:"Dr. Thai", ROOM:4,TYPE:"Dr",MIN_AGE:14,MAX_AGE:18},
 {NAME:"Med Bio",DAY:"monday", START_TIME:"12:30", END_TIME:"3", TEACHER:"Dr. Thai", ROOM:4,TYPE:"Dr",MIN_AGE:14,MAX_AGE:18},
 {NAME:"Odyssey of the Mind",DAY:"tuesday", START_TIME:"1", END_TIME:"2:20", TEACHER:"Dirks", ROOM:1,TYPE:"middle",MIN_AGE:12,MAX_AGE:14},
 {NAME:"Private Guitar",DAY:"tuesday", START_TIME:"12:15", END_TIME:"1", TEACHER:"L. Dirks", ROOM:1,TYPE:"private",MIN_AGE:3,MAX_AGE:19},
 {NAME:"Jr. Electrifying Physics and Edible Engineering",DAY:"tuesday", START_TIME:"8:30", END_TIME:"9:30", TEACHER:"Giordano", ROOM:6,TYPE:"elementary",MIN_AGE:7,MAX_AGE:8},
 {NAME:"Advanced Jr. Electrifying Physics and Edible Engineering",DAY:"tuesday", START_TIME:"1:30", END_TIME:"3", TEACHER:"Giordano", ROOM:6,TYPE:"elementary",MIN_AGE:9,MAX_AGE:12},
 {NAME:"Engineering, Architecture, and Generating Electricity",DAY:"tuesday", START_TIME:"11:30", END_TIME:"1", TEACHER:"Giordano", ROOM:6,TYPE:"middle",MIN_AGE:12,MAX_AGE:16},
 {NAME:"Private Violin",DAY:"tuesday", START_TIME:"11:15", END_TIME:"12:00", TEACHER:"D. Rife", ROOM:2,TYPE:"private",MIN_AGE:3,MAX_AGE:19}
];