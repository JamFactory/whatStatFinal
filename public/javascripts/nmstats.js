/* Landing Page Click Event */
var user_id;
var game_id; //unique game id  set in get_Game_ID function
var sport;
var homeTeam ="Home";
var awayTeam = "Away";
var selectedTeam;
var minsPerhalf;
var numberPlayers =[];          //number of players that satrt for both teams
var homeSubs =["16","17","18","19","20","21","22"];
var awaySubs=["16","17","18","19","20","21","22"];
var sub;   // used to hold teh number of the player going on
var homeYellowCards =[];       // holds players that are on yellow card for home team
var awayYellowCards =[];       // holds players that are on yellow card for home team
var homeRedCards =[];        // holds players that are on red card for home team
var awayRedCards =[];        // holds players that are on red card for home team
var numStatCollectors;
var statCollectorId = 0;   // id of this user. unique to this game. This statCollector should only see players selected in his collectorsPlayersArray
var numStatCollectorsArray =[];  //array to hold each statCollector
var collectorsPlayersArray =[]; // array to hold the playerNumbers for each Statcollector
var numStatCollectorIndex = 0;  // index to be used in function to iterate through stat collectors
var numSelectPlayers = 15;  // number to be available ein drop down for player numbes
var minsPerSection = ["30 x 2","35 x 2","40 x 2","45 x 2","Other"];
var rugby =['Tackle','Pass','Ruck','Maul','Kick','Missed Tackle','Bad Desision','Line Break','Off Load'];
var rugbyTeamEvents=['Score','Scrum','Line Out','Sub','Penalty','Card'];
var gaelicfootball=['Soulder','Hand Pass','Kick Pass','High Catch'];
var selectedSport =[];
var sports = ['Rugby','Gaelic Football', 'Hurling', 'Hockey'];
var maxStats=15;
var removeStats=[];             // array used to be populated by events we are removing from the default stats array.
var statCollectors =5;          //  max number f stats collectos. Used to populate Stats Collector SELECT (DropDown)
var selectedStatCollector =1;   //min value of stats collectors (people collecting stats for this game)
var colors =['red','black','blue','green']; // for badges
var statEvent;     // the user selecetd stat event
var playerNumber; //the player number of the seleceted stat.
var running=1;   // Used in StopWatch function
var fieldPosition= [];
var currentParentPage;
var master = true;   // varaible to differentiate between master and invited users
var modalHomeAwaytOptions =[];               // Used for populating buttons in modal dialog Each Option must have a Hoe or Away result
var modalMultiOptions = [];                 // Can have multiple results eg. Front middle back or Pick, Kick, Pass
var tryConverted;
var penaltyOptions =["Tap and Go","Kick at Goal","Kick to Touch","Scrum"];
var penaltyOutcomeOptions=[];
var penaltyType;  // eg. Kick at goal. tap n go etc.
var prefix;    //set to "hm" for home or "aw" for away. Used as prefix in dynaic id for cells on stats tables
var individualStatsTables =[];       //ID's of tables to be made withthe createStatsTable() function.
var headToHeadStatsTables =[];
var headToHead =[];  // used for ddreateing stat tables will get homoeTeam nd awayTeam
var scrumLinoutTableHeaders = ["Own Lineouts Won","Own Lineouts Lost","Own Scrums Won","Own Scrums Lost"]
//**********************
var height = $( window ).height();          //to set height and widthof screens depending on screen size
var width = $(window).width();


//********Team Events
var putInBy;                        //used for scrum and lineout eg. homeTeam
var wonBy;                          //used for scrum and lineout eg. awayTeam
var teamEventOutcome;               //used for scrum and lineout eg. 8Pick, Off the top, etc.
var pitchzone;


/*$( window ).load(function(){
 var height = $( window ).height();
 var width = $(window).width();

 $('.pitchImage').height(height);
 $('.pitchImage').width(width);
 $('#zoneHolder').height(height);
 $('#zoneHolder').width(width);

 });*/

/* vars for clock */
var mins = 00;
var secs = 00;
var appendSecs = document.getElementById("secs");
var appendMins = document.getElementById("mins");
var eventTime;
var Interval;

$('#gameStartBtn').click(function(event){
    $('#login').hide();
    $('#setup, #setupA').show();
    set_master_user_id();   // placed here by NM 8/3/17 to tray and make user ID avaailble in nmStats. prob should be done in back end through routes
});

$("#landingPage").click(function(event)
{
    var hId = "landingPage" // event.target.id;     			// id of cliked div to be hidden
    var sId = ['login'];    				// array of ID's to be shown
    hideDiv(hId);
    showDiv(sId);
});


//************************************************************************************************************************
// NM 25/11/16 quick Start Button on Login page to set up all default values for 'Rugby'
// ********************THIS IS JUST FOR TESTING - TO LOGIN FASTER *******************************************************

$('#quickStart').click(function(){

    // array to send to showDiv function. Only single element here but can be multiple.

    sport ="rugby";   // make lower case and remove whitespace e.g. Gaelic Footbal becomes gaelicfootball
    homeTeam = "DLSP"
    awayTeam = "Mary's"
    minsPerhalf =40;
    numberPlayersInput = 15;
    numStatCollectors=1;

    for(var i=1;i<=numberPlayersInput;i++){     // Convert number input into an array of player numbers e.g 3  -> [1,2,3]

        numberPlayers.push(i.toString())
    }

    /*		for(var t=1;t<=numStatCollectors;t++){      // Convert number input into an array of player numbers e.g 3  -> [1,2,3]
     collectorsPlayersArray.push([]);			// add an array for each statCollector. This will be used to push the player nums to later eg 1=[4,7,2,3]
     numStatCollectorsArray.push(t.toString())
     }*/

    collectorsPlayersArray[0]=['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15'];

    var originalArray = eval(sport);        // as sport is a string we want selected sport to be set to the arrray variable of the same name e.g. =rugby[]   not = "rugby"
    for(var r=0;r<originalArray.length;r++){
        selectedSport.push(originalArray[r]);
    }


    $('.homeTeamText').text(homeTeam);   // set the names of the teams to these divs
    $('.awayTeamText').text(awayTeam);

    makeStatsButtons(numberPlayers,"playerButtons")
    makeStatsButtons(selectedSport,"statEvents");
    makeStatsButtons(collectorsPlayersArray[statCollectorId],"statNumbers");          //Hard coded. TODO mak 'statCollector' dynamic. numStatCollectorsArray[i] this is to get only those players for this user
    makeStatsButtons(rugbyTeamEvents,"teamEvents","teamButton")       //TODO make this Dynamic not just for rugby

    var statTablePlayer = [1];   // TODO pass this in from teh front end to get justone players stats
    individualStatsTables =["homeTeamOverviewTable","awayTeamOverviewTable","singlePlayerTable"];
    headToHeadStatsTables=["homeAwayTotalsTable","homeAwayScrumLineoutsTable"];
    headToHead =[homeTeam,awayTeam];



    //  We need to make table before we start collecting stats so stats have somewhere to go --- charts are derived from html table data not objects
    createStatsTable(individualStatsTables[0],"hm","Player",collectorsPlayersArray[0],selectedSport,"homeTeamOverviewTableHolder");	// function to make table on stats page  For Whole Team
    createStatsTable(individualStatsTables[1],"aw","Player",collectorsPlayersArray[0],selectedSport,"awayTeamOverviewTableHolder");    // from away team
    createStatsTable(individualStatsTables[2],"hm","Player",statTablePlayer,selectedSport,"singlePlayerTableHolder");

    createStatsTable(headToHeadStatsTables[0],"","",headToHead,selectedSport,"homeAwayTotalsTableHolder");
    createStatsTable(headToHeadStatsTables[1],"","",headToHead,scrumLinoutTableHeaders,"homeAwayScrumLineoutsTableHolder");

    // tableID   prefix, firstColum, Columns,  rows,	div its appended to
    //createStatsTable("teamOverview",prefix,"Stat",statTablePlayer,selectedSport,"statsHolder");	// function to make table on stats page For ONE pERSON

    hideDiv("login");
    $('#gameStart').show();
    get_game_id();

});


//**********************************************************************************
// NM 28/09/16 accepts string (div), shows  div passed in.

function hideDiv(id){     				 //accepts id then hides this div.
    var id = id;
    document.getElementById(id).style.display="none";
}





//**********************************************************************************
// NM 28/09/16 accepts an array (of divs), shows each div passed in.


function showDiv(id){
    var id = id;
    for(var i=0;i<id.length;i++){
        document.getElementById(id[i]).style.display="block";
    }
}

//**********************************************************************************



//***********************************************************************************
//  NM 28/09/16 Reusable function to populate a dropdown with values from an array.

// element_Id, array, string
function populateDropDown(select,array, firstOption){        	// apppend these options to the dropdown menu TODO get this from DB
    var array = array;
    var select = select;
    var firstOption =firstOption;
    var html="";

    html +='<option selected label ="'+firstOption+'" valyue ="'+firstOption+'">'+firstOption+'</option>';
    for(var i=0;i<array.length;i++){
        html+='<option label="'+array[i]+'" value="'+array[i]+'">'+array[i]+'</option>';
    }
    $("#"+select).html(html);
}

//***********************************************************************************



$("#gameStartBtn").click(function(event){
    event.preventDefault();        									  //put Ajax POST code here

    // pass in array to be shown
    populateDropDown("sportSelect",sports,"Select a Sport");
    populateDropDown("minsPerHalf",minsPerSection,"Minutes per Section");
    var statCollectorsArray =[];					      // function to populate dropdown from DB (using static array at the moment)
    for(var i=1;i<=statCollectors;i++){                  // Convert number input into an array of player numbers e.g 3  -> [1,2,3]

        statCollectorsArray.push(i);
    }

    populateDropDown("numStatCollectors",statCollectorsArray, "Select Number of Stats Collectors");

    var playerDDNumbers =[];					      // function to populate dropdown from DB (using static array at the moment)
    for(var i=1;i<=numSelectPlayers;i++){                  // Convert number input into an array of player numbers e.g 3  -> [1,2,3]

        playerDDNumbers.push(i);
    }

    populateDropDown("numberPlayers",playerDDNumbers,"Select Number of Players");

    var sId = ["setup","setupA"];          									 // put page into an array (single element in this case)
    hideDiv("login");		  									    // pass in div ID to be hidden
    showDiv(sId);

});





$("#setupSubmitBtn").click(function(e){                                          // on submitting from from setup page

    e.preventDefault();
    var sId = ["setupB"];                                               // array to send to showDiv function. Only single element here but can be multiple.

    sport = $("#sportSelect").val().toLowerCase().replace(/ /g,'');   // make lower case and remove whitespace e.g. Gaelic Footbal becomes gaelicfootball

    if($("#homeTeamInput").val()!=""){                          // Use the default value set in the homeTeam VAR above unless user populates this field
        homeTeam = $("#homeTeamInput").val();
    }

    if($("#awayTeamInput").val()!=""){                          // Use the default value set in the awayTeam VAR above unless user populates this field
        awayTeam = $("#awayTeamInput").val();
    }

    minsPerhalf = $("#minsPerHalf").val();
    numberPlayersInput = $("#numberPlayers").val();
    numStatCollectors=$("#numStatCollectors").val();

    for(var i=1;i<=numberPlayersInput;i++){     // Convert number input into an array of player numbers e.g 3  -> [1,2,3]

        numberPlayers.push(i.toString())
    }

    for(var i=1;i<=numStatCollectors;i++){      // Convert number input into an array of player numbers e.g 3  -> [1,2,3]
        collectorsPlayersArray.push([]);			// add an array for each statCollector. This will be used to push the player nums to later eg 1=[4,7,2,3]
        numStatCollectorsArray.push(i.toString())
    }


    hideDiv("setupA");
    showDiv(sId);


    var originalArray = eval(sport);        // as sport is a string we want selected sport to be set to the arrray variable of the same name e.g. =rugby[]   not = "rugby"

    for(var i=0;i<originalArray.length;i++){

        selectedSport.push(originalArray[i]);
    }


    makeStatsButtons(selectedSport,"gameStats");    //Pass in sport and Div buttons to be rendered. 'Sport' comes from form, event arrays stored globally e.g. rugby = [...]

    $('.homeTeamText').text(homeTeam);
    $('.awayTeamText').text(awayTeam);


    /*TODO Ajax call to DB */


});


//***********************************************************************************************************
// function to render buttons to a div. Accepts an array and div as inputs NM 28/09/16

function makeStatsButtons(array, div,style){        /* style is a css class */
    var html="";      // clear all content first before rebuilding.
    var div = div;
    for(var i=0;i<array.length;i++){

        if(array[i].length>9){                // adding an extra class of nmWrap so buttons with two words use up two lines
            html+=('<div class="btn btn-default nmBtn ' +style+' nmWrap"  id="'+div+array[i].toLowerCase().replace(/ /g,'')+'">'+array[i]+'</br><span></span></div>');    //build up html
        }
        else{
            html+=('<div class="btn btn-default nmBtn ' +style+'"  id="'+div+array[i].toLowerCase().replace(/ /g,'')+'">'+array[i]+'</br><span></span></div>');    //gives each button an id of div+index[is]
        }
    }

    $("#"+div).html(html);
}


//************************************************************************************************************
//*********NM 30/09/16  Makes extra stat button from user input **********************************************

$("#addStats").submit(function(e){

    e.preventDefault();
    var newStat = $("#addStatsInput").val();
    if(selectedSport.length<maxStats){

        selectedSport.push(newStat);                // add new element from user input into array
        $("#addStatsInput").val('');      // empty input box
        makeStatsButtons(selectedSport,"gameStats");
    }
    else
    {
        alert("Max number of stats is "+ maxStats +" Delete stats by selecting and pressing REMOVE");
    }
});


//************************************************************************************************************


$("#gameStats").mousedown(function(event){

    toggleGlyphs(event,"glyphicon glyphicon-remove-sign pull-right");       //reusable function that will add glyphs to spans and remove them on subsequent clicks.

});


//**********************************************************************

$("#removeStats").click(function(event){

    var indices =[];  // array to accumulated index
    for(var i=0;i<selectedSport.length;i++) {


        if ($("#gameStats" + selectedSport[i].toLowerCase().replace(/ /g, '') + " span").hasClass("glyphicon-remove-sign")) {       //identify the divs whose spans have the remove class

           // var index = selectedSport.indexOf(selectedSport[i]);       // search through array and remove this element

            indices.push(selectedSport[i]);     // get new arry of items to be removed
        }
    }

        for(var t=0;t<indices.length;t++) {

            var index = selectedSport.indexOf(indices[t]);         //get the index of the item to be removed, updated each iteration
            if (index !== -1) {
                selectedSport.splice(index, 1);       // <-- Not supported in <IE9    remove item from original array
            }
        }

    makeStatsButtons(selectedSport,"gameStats");     //re write the buttons based on the now reduced array



});



$("#refreshStats").click(function(){

    selectedSport =[];
    var originalArray = eval(sport);        // as sport is a string we want selected sport to be set to the arrray variable of the same name e.g. =rugby[]   not = "rugby"

    for(var i=0;i<originalArray.length;i++){

        selectedSport.push(originalArray[i]);
    }                 // as sport is a string we want selected sport to be set to the arrray variable of the same name e.g. =rugby[]   not = "rugby"

    makeStatsButtons(selectedSport,"gameStats","nmBtn");


});


$("#submitStats").click(function(){

    var sId = ["setupC"];
    hideDiv("setupB");
    showDiv(sId);


    $('#statCollectorSpan').text(numStatCollectorsArray[0]);
    $('#statCollectorSpan').css('background',colors[0]);

    makeStatsButtons(numberPlayers,"playerButtons")

});


//***********************************************************************************************************
//reusable function that will add glyphs to spans and remove them on subsequent clicks.


function toggleGlyphs(event, classList){        							//reusable function that will add glyphs to spans and remove them on subsequent clicks.

    var selectedEvent = event.target;

    if($(selectedEvent).is("div")){

        if ($(selectedEvent).children("span").hasClass(classList)) {
            $(selectedEvent).children("span").removeClass(classList); }       // add selected tick to button, disable span so extra tick doe snot trigger
        else {
            $(selectedEvent).children("span").addClass(classList);}

    }
    else if($(selectedEvent).is("span")){

        if ($(selectedEvent).hasClass(classList)) {
            $(selectedEvent).removeClass(classList); }     // add selected tick to button, disable span so extra tick doe snot trigger
        else  {
            $(selectedEvent).addClass(classList);
        }

    }
}

//***************************************************************************************************************
$("#playerButtons").mousedown(function(event){
    var selectedEvent = event.target;

    var classList="badge pull-right";


    if($(selectedEvent).is("div")){

        if ($(selectedEvent).children("span").hasClass(classList)) {
            $(selectedEvent).children("span").removeClass(classList);
            $(selectedEvent).children("span").text("");
        }      		 // add selected tick to button, disable span so extra tick doe snot trigger
        else {
            $(selectedEvent).children("span").addClass(classList);
            $(selectedEvent).children("span").text(selectedStatCollector)}	     // from statCollectorWell function to apply number to basdge in span.
        $(selectedEvent).children("span").css("background",colors[numStatCollectorIndex])

    }
    else if($(selectedEvent).is("span")){

        if ($(selectedEvent).hasClass(classList)) {
            $(selectedEvent).removeClass(classList)
            $(selectedEvent).text("");
        }     // add selected tick to button, disable span so extra tick doe snot trigger
        else  {
            $(selectedEvent).addClass(classList);
            $(selectedEvent).text(selectedStatCollector)
            $(selectedEvent).css("background",colors[numStatCollectorIndex])
        }
    }
});

//**************************************************************************************************************************

$("#statCollectorWell").click(function(event){

    numStatCollectorIndex = (numStatCollectorIndex+1 ) % numStatCollectorsArray.length ;  // loops back to start of array when reaches last element
    $('#statCollectorSpan').html(numStatCollectorsArray[numStatCollectorIndex]);
    selectedStatCollector = numStatCollectorsArray[numStatCollectorIndex];                // set current statCollector e.g. 1, 2 , 3, 4 etc and pass up to PlayerButtons Function  for applying number basge to span

    $('#statCollectorSpan').css('background',colors[numStatCollectorIndex]);
});


//************************************************************************************************************************************************
//*********************************Function to put the players into seperate arrays based on who is collecting their stats*************************
$("#collectorStats").click(function(){

    var  cm,nm, mm;
    var html="";

    for(var t=0;t<numStatCollectorsArray.length;t++){
        collectorsPlayersArray[t]=[];

    }

    for(var i=0;i<numberPlayers.length;i++){							// use childenodes[0] to only get player number i.e. not text of the span/ justtext of the div.

        cm = document.getElementById("playerButtons"+numberPlayers[i]).childNodes[0].nodeValue; // gett the text of the span i.e. what stat collector is assigned to that player (in the badge)
        nm = $("#playerButtons"+numberPlayers[i]).children("span").text();        // number in the span e.g. '4' = stat Collector number
        mm =parseInt(nm)-1;                                                     //reduce it by 1 to get the index e.g stst colector '4' is index 3

        collectorsPlayersArray[mm].push(cm);  // add the player numbers to the appropriate array.

    }

    for(var i=0;i<numStatCollectorsArray.length;i++){
        if(collectorsPlayersArray[i].length>0){
            html += '<li class="list-group-item" >Stat Collector '+numStatCollectorsArray[i] +': Players '+collectorsPlayersArray[i]+'</li>';
        }
        else
            html += '<li class="list-group-item" >Stat Collector '+numStatCollectorsArray[i] +': No Players Assigned </li>';
    }

    $('#modalContent').html(html);

});

//*************************************************************************************************************************************************
//****************************Function to rearrange PlayerNUmberButtons  to group them my Stat Collector*****************************************
$('#arrangeButtons').click(function(){

    $('#playerButtons').empty();
    var html="";
    for(var i=0;i<numStatCollectorsArray.length;i++){

        html+= '<div class="collectorWraper">';

        for(var r=0;r<collectorsPlayersArray[i].length;r++){

            html+=('<div class="btn btn-default nmBtn">'+collectorsPlayersArray[i][r]+'<span class ="badge pull-right" style="background:'+colors[i]+'">'+numStatCollectorsArray[i]+'</span></div>');

        }

        html+='</div>';

    }

    $('#playerButtons').html(html);

});
//*****************************************************************************************************************************
//*****************************************MyModal 'Next' Click Function  NM 21/10/16*********************************************

$('#modalNext').click(function(){

    var sId = ['inviteUsers'];
    var html="";
    hideDiv("setupC");
    hideDiv("setup");
    showDiv(sId);


    for(var i=0;i<numStatCollectorsArray.length;i++){
        if(collectorsPlayersArray[i].length > 0){
            html+=' <div class="form-group">'
                +' <label class="control-label col-sm-3 col-xs-3 requiredField" for="email">Collector<span class="badge pull-right" style="background:'+colors[i]+'">'+numStatCollectorsArray[i]+'</span> </label>'
                +'<div class="col-sm-9 col-xs-9"><input class="form-control" id="email" name="email" type="text" placeholder="email"/> </div>'
                +'</div>'
        }
    }
    $('#collectorEmailInputs').html(html);

});

//***************************************************************************************************************************
//*********************************Invite Email Click Function - Start Page --NM 21/10/16************************************
$('#inviteEmailBtn').click(function(){

    makeStatsButtons(selectedSport,"statEvents");
    makeStatsButtons(collectorsPlayersArray[statCollectorId],"statNumbers");          //Hard coded. TODO mak 'statCollector' dynamic. numStatCollectorsArray[i] this is to get only those players for this user
    makeStatsButtons(rugbyTeamEvents,"teamEvents","teamButton")       //TODO make this Dynamic not just for rugby

    var statTablePlayer = [1];   // TODO pass this in from teh front end to get justone players stats
    individualStatsTables =["homeTeamOverviewTable","awayTeamOverviewTable","singlePlayerTable"];
    headToHeadStatsTables=["homeAwayTotalsTable","homeAwayScrumLineoutsTable"];
    headToHead =[homeTeam,awayTeam];

    //  We need to make table before we start collecting stats so stats have somewhere to go --- charts are derived from html table data not objects
    createStatsTable(individualStatsTables[0],"hm","Player",collectorsPlayersArray[statCollectorId],selectedSport,"homeTeamOverviewTableHolder");	// function to make table on stats page  For Whole Team
    createStatsTable(individualStatsTables[1],"aw","Player",collectorsPlayersArray[statCollectorId],selectedSport,"awayTeamOverviewTableHolder");    // from away team
    createStatsTable(individualStatsTables[2],"hm","Player",statTablePlayer,selectedSport,"singlePlayerTableHolder");

    createStatsTable(headToHeadStatsTables[0],"","",headToHead,selectedSport,"homeAwayTotalsTableHolder");
    createStatsTable(headToHeadStatsTables[1],"","",headToHead,scrumLinoutTableHeaders,"homeAwayScrumLineoutsTableHolder");



    $('#gameStart').show();
    $('#profile_holder').hide();  // hide the profile image for now TODO put logout somewhere else
    $('#inviteUsers').hide();
     get_game_id();      // placed here by NM 8/3/17 .. function te make / getid of new game. Not sure if this is the best place

});

//******************************************************************************************************************************************************
//**************************************** CLICK EVENT To set STAT and Player Number selected by user  NM 30/10/16**************************************



$('#statEvents').on('click', ".btn", function(event) {       // since these buttons are made dynamically we have to register the handler like this
    event.preventDefault();
    statEvent = event.target.firstChild.nodeValue;							// get text of selected stat e.g. 'Missed Tackle';  TODO make this look at the value or ID
    eventTime  = (appendMins.innerHTML +':'+ appendSecs.innerHTML);

    $('#statEventsHolder').css('display',"none");
    checkForCards();                  // function to itterate through red / yellow card arrays to make certain numbers disaabled.
    $('#statNumbers').show();

});


$('#statNumbers').on('click', ".btn", function(event) {

    playerNumber = event.target.firstChild.nodeValue;          // get text i.e. number of first node of selected eleement e.g.   '14'
    $('#statNumbers').hide();

    if(statEvent =='Card'||statEvent =='Score'||statEvent =='Card'||statEvent =='Sub' ){

        $('#'+statEvent).show();	 //eg. #Card or #Sub
        $('#scoreButtonHolder').show();

        if(statEvent =='Sub'){
            subScreen();				//Function to add correct subs to bench
        }
    }
    else{

        updateStatTable();

        $('#statEventsHolder').show();
        statSummary();  					// function to dispaly last enetred stat on screen	TODO make this add row to vidiprinter
        add_player_event();

          // CALL To Ajax Function
    }
});

//******************************************************statSummary *************************************************************************************
//*****************************************************Function to display the last entered stat momentarily on screen **********************************

function statSummary(){

    if(selectedTeam == homeTeam){
        $('#statsSumtextHolder').removeClass('pull-right').addClass('pull-left').css('color','red');
    }
    else{
        $('#statsSumtextHolder').removeClass('pull-left').addClass('pull-right').css('color','blue');
    }

    var html = "";
    html+= '<p> <span>'+eventTime+'</span>'+' '+'Team:'+' '+selectedTeam+',   Player: '+playerNumber+ ': '+statEvent+'</p>';

    $('#statsSumtextHolder').html(html);

}



//*****************************************************************************************************************************
//*****************************************Stop Watch / Clock function NM  28/10/16******************************************

$('#clockButton').click(function(event){
    /* if clock is not running*/


    if( running == 1){
        /* start clock logic here   */
        clearInterval(Interval);
        Interval = setInterval(startTimer, 1000);
        $('#clockOnOff').text("Clock On");
        $('#clockOnOff').css('color','blue');


        running=2;
    }
    else
    {
        /*stop logic here */
        clearInterval(Interval);
        $('#clockOnOff').text("Clock Off");
        $('#clockOnOff').css('color','red');


        running=1;
    }

});

function startTimer () {
    secs++;

    if(secs < 10){
        appendSecs.innerHTML = "0" + secs;
    }

    if (secs >= 10){
        appendSecs.innerHTML = secs;
    }

    if (secs > 59) {
        mins++;
        appendMins.innerHTML = "0" + mins;
        secs = 0;
        appendSecs.innerHTML = "0" + 0;
    }

    if (mins > 9){
        appendMins.innerHTML = mins;
    }

}

//**********************************************************************************************************************************
//**************************************************************Function to set Etam and make opposite team logo frosty *************
$('#homeTeamLogo').click(function(){
    $('#awayTeamLogo').css('opacity','0.4')
    $('#homeTeamLogo').css('opacity','1')
    selectedTeam=homeTeam;
    prefix="hm";					//used as prefix in dynamic id of cells on tats page to differentaiate home and away e.f. hmMiseedTackle4
    checkForCards();


});

$('#awayTeamLogo').click(function(){
    $('#homeTeamLogo').css('opacity','0.4')
    $('#awayTeamLogo').css('opacity','1')
    selectedTeam=awayTeam;
    prefix="aw";					//used as prefix in dynamic id of cells on tats page to differentaiate home and away e.f. hmMiseedTackle4
    checkForCards();
});
//*********************************************************************************************************************************

//****************************************************** TEAM Events Click  nm 07/11/16 ******************************************************

$('#teamEvents').click(function(event){     // DO AN IF STATEMNET FOR EACH OPTION EG SCRUM, LINEOUT etx


    statEvent = event.target.firstChild.nodeValue;
    eventTime  = (appendMins.innerHTML +':'+ appendSecs.innerHTML);
    var targetDivId = statEvent.replace(/ /g,'');          // divs were manually set up with ID's with no white space
    currentParentPage = targetDivId;

    var sId;

    if (targetDivId=="Scrum" || targetDivId=="Penalty" || targetDivId=="LineOut" ) {

        sId = [targetDivId,'zoneHolder'];
        hideDiv("gameStart");
        showDiv(sId);

    }

    else {     // for Sub / Score /Card

        $('#statEventsHolder').hide();
        $('#statNumbers').show();

    }

});





// *********************************************************************************************************************************************************************
// *********************************************** Scrum /Lineout / COnversion Page Next Function *********************************************************************
$('#modalPitchNext').click(function(){


    hideDiv(currentParentPage);
    hideDiv("zoneHolder");
    eventTime  = (appendMins.innerHTML +':'+ appendSecs.innerHTML);
    var html = "";

    if (currentParentPage =='Scrum' || currentParentPage =='LineOut'){				//if its a lineout or scrum

        html+= '<p>'+ currentParentPage+'.  Put In By:'+putInBy+',  Won By:'+wonBy+ ', Outcome:'+ teamEventOutcome +'<span>, '+eventTime+'</span></p>';


        updateStatTable();

    }
    else if(currentParentPage =='Conversion'){               // if its a conversion

        html+= '<p> Try '+selectedTeam+': Converted By Player'+playerNumber+'<span>, '+eventTime+'</span></p>';
        $('#Score').hide();

    }
    else if(currentParentPage =='Penalty'){               // if its a conversion

        html+= '<p> Try '+selectedTeam+': Penalty Kick Scored by'+playerNumber+'<span>, '+eventTime+'</span></p>';
    }


    $('#statEventsHolder').show();
    $('#gameStart').show();

    // TODO add ajax record aevent + vidprinter here using html from above

});


//*********************************************************************************************************************************************************
// NOT USED
$('#throwinHolder').bind('mousemove', function(event){
    $( "#coords" ).text( "pageX: " + event.pageX + ", pageY: " + event.pageY );

    fieldPosition =[event.pageX,event.pageY];
});

//****************************************************************************************************************
//************* Adds Blue circle on Pitch / Creates and Opens Scrum/ Lineout Options Dialog HTML ******************************************************


var classname1 = document.getElementsByClassName("pitchZone");

Array.from(classname1).forEach(function(element) {
    element.addEventListener('click', mapEvent);               //add click event for the pitchzone class (did this way when pitchzone was being added dynamically)
});



function mapEvent(event){

    if(currentParentPage =="Scrum" || currentParentPage =="LineOut" ){

        var html ="";
        if(document.getElementById(this.id).style.background !="blue"){

            document.getElementById(this.id).style.background="blue";
            document.getElementById(this.id).title=this.id+" "+eventTime+" "+selectedTeam+" Put In";  //TODO make text dynamix = to summaryTextholder.text
            pitchzone=(this.id);
        }
        else{
            document.getElementById(this.id).style.background="";
        }

        $('#modalPitchHeader').text(currentParentPage);    // sets "Scrum". "Line Out" etc as header text.
        //Change the options depending on the Event
        if(currentParentPage=="Scrum"){
            modalHomeAwaytOptions =['Put In By','Won By'];                     //Each Option must have a Hoe or Away result
            modalMultiOptions = ['8 Pick','Pass','Box Kick','Foul']            // Can have multiple results eg. Front middle back or Pick, Kick, Pass
        }
        else if(currentParentPage=="LineOut"){
            modalHomeAwaytOptions =['Thrown In By','Caught By'];               //Each Option must have a Hoe or Away result
            modalMultiOptions = ['Front','Middle','Back','Foul']            // Can have multiple results eg. Front middle back or Pick, Kick, Pass
        }


        html +='<ul class ="list-group">';


        for(var i=0;i<modalHomeAwaytOptions.length;i++){
            html += '<li class="list-group-item" ><div class="modalListTitle">'+modalHomeAwaytOptions[i]+'</div><div class="optionButtonHolder btn-group" role="group" id="'+modalHomeAwaytOptions[i].replace(/ /g,'')+'"><button type="button" value="homeTeam" class="hwButton btn btn-success home">'+homeTeam+'</br><span></span></button><button type="button" value="awayTeam" class="hwButton btn btn-warning away">'+awayTeam+'</br><span></span></button></div></li>';
        }

        html += '</ul><div class="outcomeOptionsHolder">'

        for(var t=0;t<modalMultiOptions.length;t++){       //add a button for each elelement inthe arrray all having a different color
            html += '<button type="button" class="btn outcomeButton" style="background:'+colors[t]+'">'+modalMultiOptions[t]+'<span></span></button>';
        }

        html += '</div>';

        $('#modalPitchContent').html(html);
        $('#modalPitch').modal('show');
        $('#modalPitchNext').show();      			// show the 'next' button that may have been hidden from a previous penalty

        toggleGlyphs("optionButtonHolder","glyphicon glyphicon-remove-sign pull-right");

    }

    else  if (currentParentPage =="Conversion")  { 					// if it is a conversion

        var html ="";
        if(document.getElementById(this.id).style.background !="blue"){        // if its not already blue / ticked

            document.getElementById(this.id).style.background="blue";
            document.getElementById(this.id).title=this.id+" "+eventTime+" "+selectedTeam+": Try Converted by Player "+playerNumber;  //TODO make text dynamix = to summaryTextholder.text
        }
        else{
            document.getElementById(this.id).style.background="";
        }


        $('#modalPitchHeader').text(currentParentPage);    // sets "Scrum". "Line Out" etc as header text.
        html +='<ul class ="list-group">'
            +'<li class="list-group-item">'
            +'<div id="conversionStatus" class="optionButtonHolder btn-group" role="group"><button type="button" value="converted" class="hwButton btn btn-success conversionButtons home">Converted</br><span></span></button><button type="button" value="missed" class="hwButton btn btn-danger conversionButtons away">Missed</br><span></span></button></div></li>'
            +'</ul>';

        $('#modalPitchContent').html(html);
        $('#modalPitch').modal('show');

    }




    else  if (currentParentPage =="Penalty")  { 					// if it is a Penalty kick at goal

        var html ="";
        if(document.getElementById(this.id).style.background !="blue"){        // if its not already blue / ticked

            document.getElementById(this.id).style.background="blue";
            document.getElementById(this.id).title=this.id+" "+eventTime+" "+selectedTeam+": Penalty "+playerNumber;  //TODO make text dynamix = to summaryTextholder.text
        }
        else{
            document.getElementById(this.id).style.background="";
        }


        $('#modalPitchHeader').text(currentParentPage);    // sets "Scrum". "Line Out" etc as header text.




        html +='<ul class ="list-group">'
            +'<li class="list-group-item">'
            +'<div class="penaltyOptionsHolder">';

        for(var t=0;t<penaltyOptions.length;t++){
            html += '<button type="button" class="btn penaltyOptions" style="background:'+colors[t]+'">'+penaltyOptions[t]+'<span></span></button>';
        }

        html += '</div>'
            +'<li class="list-group-item">'
            +'<div id="penaltyKickStatus" class="optionButtonHolder btn-group" role="group"><button type="button" value="'+penaltyOutcomeOptions[0]+'" class="hwButton btn btn-success conversionButtons home">'+penaltyOutcomeOptions[0]+'</br><span></span></button><button type="button" value="'+penaltyOutcomeOptions[1]+'" class="hwButton btn btn-danger conversionButtons away">'+penaltyOutcomeOptions[1]+'</br><span></span></button></div></li>'
            +'</ul>';

        $('#modalPitchContent').html(html);
        $('#modalPitch').modal('show');


        //   toggleGlyphs("optionButtonHolder","glyphicon glyphicon-remove-sign pull-right");      Probably can be removed NM 29/11/16

    }


    else  if (currentParentPage =="DropGoal")  { 					// if it is a conversion

        var html ="";
        if(document.getElementById(this.id).style.background !="blue"){        // if its not already blue / ticked

            document.getElementById(this.id).style.background="blue";
            document.getElementById(this.id).title=this.id+" "+eventTime+" "+selectedTeam+": Drop Goal by Player "+playerNumber;  //TODO make text dynamix = to summaryTextholder.text
        }
        else{
            document.getElementById(this.id).style.background="";
        }
        $('#DropGoal').hide();
        $('#zoneHolder').hide();
        $('#gameStart').show();
        $('#statEventsHolder').show();

    }

}; // end mapEvent function

//**************************************************************************************************************************

//************************************************LINEOUT AND SCRUM OPTIONS ********************************************************************
$('#modalPitchContent').on('mousedown', "#PutInBy, #ThrownInBy", function(event) {
    var selectedEvent = event.target;
    putInBy = eval(selectedEvent.value);
    selectedTeam = putInBy;
});


$('#modalPitchContent').on('mousedown', "#WonBy,#CaughtBy", function(event) {
    var selectedEvent = event.target;
    wonBy = eval(selectedEvent.value);
});

$('#modalPitchContent').on('mousedown', ".outcomeButton", function(event) {
    var selectedEvent = event.target;
    teamEventOutcome = $(selectedEvent).text();    //for scrum and line out 'off the top' no 8 pick etc
    add_team_event();
});


//************************************************** MODAL FOR CONVERSION PAGE *****************************************************************************
$('#modalPitchContent').on('mousedown', "#conversionStatus", function(event) {       // for the modal from  the Conversion page

    var selectedEvent = event.target;
    // either converted or missed
    if(selectedEvent.value =="converted") {    // if try is converted

                if (selectedTeam == homeTeam) {														// if try is converted and team is home add 2 points
                    var currentScore = parseInt($('#homeTeamScore').text());
                    var newScore = (currentScore + 2);
                    $('#homeTeamScore').text(newScore);
                }
                else {

                    var currentScore = parseInt($('#awayTeamScore').text());						// if try is converted and team is away add 2 points
                    var newScore = (currentScore + 2);
                    $('#awayTeamScore').text(newScore);
                }
    } else {
        statEvent = "missed conversion";    //regardles of the team if it is missed change the event to Missed Conversion

    };

    $('#zoneHolder').hide();
    $('#'+currentParentPage).hide();
    $('#modalPitch').modal('hide');
    $('#statEventsHolder').show();
    $('#gameStart').show();

    tryConverted = selectedEvent.value;    // tryConverted = eval(selectedEvent.value);    //either 'missed' or 'converted' //TODO ajax call to add conversion
    add_player_event();  //add to DB
});
//************************************************** MODAL FOR Penalty kick PAGE *****************************************************************************
$('#modalPitchContent').on('mousedown', "#penaltyKickStatus", function(event) {      // we do not want to use the next button when a Kick at Goal has been se;ected. As soonas option is selected the next page shows. // for the modal from  the Conversion page

    var selectedEvent = event.target;         // either converted or missed

    if (selectedEvent.value == "Scored") {    // if try is converted
        statEvent = "penalty kick scored";
        if (selectedTeam == homeTeam) {														// if penalty is converted and team is home add 2 points
            var currentScore = parseInt($('#homeTeamScore').text());
            var newScore = (currentScore + 3);
            $('#homeTeamScore').text(newScore);
        }
        else {
            var currentScore = parseInt($('#awayTeamScore').text());						// if penalty is converted and team is away add 2 points
            var newScore = (currentScore + 3);
            $('#awayTeamScore').text(newScore);
        }
    } else {
        statEvent = "penalty kick missed";
    }

    $('#zoneHolder').hide();
    $('#'+currentParentPage).hide();
    $('#modalPitch').modal('hide');
    $('#statEventsHolder').show();
    $('#gameStart').show();

    add_player_event();//TODO add points to DB not just event

});


//****************************************************** Makes Missed /Scored buttone appear depending on Penalty Option **********************************************
$('#modalPitchContent').on('mousedown',".penaltyOptions", function(event) {       // for the modal from  the Conversion page
    var selectedEvent = event.target;
    penaltyType = $(selectedEvent).text();    //for scrum and line out 'off the top' no 8 pick etc

    if(penaltyType !="Scrum"){     // if its a kick at goal, tap n go.or kick to touch ---

        $('#modalPitch').modal('hide');   		// hide the curren modal
        $('#zoneHolder').hide();
        $('#Penalty').hide();
        $("#Score").show();
        $('#scoreButtonHolder').hide();      //dont show TRY and DropGoal Buttons
        $("#kickButtonHolder").show();

        makeStatsButtons(collectorsPlayersArray[statCollectorId],"kickButtonHolder");
        $("#kickButtonHolder" ).prepend( '<h3>Select Penalty Taker</h3>' );
        $("#kickButtonHolder").show();
        statEvent ="penalty";
    }
    else {

        $('#modalPitchHeader').text("Scrum");    // sets "Scrum". "Line Out" etc as header text.
        //Change the options depending on the Event
        var html;

        modalHomeAwaytOptions =['Put In By','Won By'];                     //Each Option must have a Hoe or Away result
        modalMultiOptions = ['8 Pick','Pass','Box Kick','Foul']
        html +='<ul class ="list-group">';


        for(var i=0;i<modalHomeAwaytOptions.length;i++){
            html += '<li class="list-group-item" ><div class="modalListTitle">'+modalHomeAwaytOptions[i]+'</div><div class="optionButtonHolder btn-group" role="group" id="'+modalHomeAwaytOptions[i].replace(/ /g,'')+'"><button type="button" value="homeTeam" class="hwButton btn btn-success home">'+homeTeam+'</br><span></span></button><button type="button" value="awayTeam" class="hwButton btn btn-warning away">'+awayTeam+'</br><span></span></button></div></li>';
        }

        html += '</ul><div class="outcomeOptionsHolder">'

        for(var t=0;t<modalMultiOptions.length;t++){
            html += '<button type="button" class="btn outcomeButton" style="background:'+colors[t]+'">'+modalMultiOptions[t]+'<span></span></button>';
        }

        html += '</div>';

        $('#modalPitchContent').html(html);

        // dont show next button if its a kick at goal
        $("#modalPitchNext").show();
        $("#penaltyKickStatus").hide();
    }
});


//****************************************************** ADDS the ticks to the options buttons in Modal after pitch screens**********************************************
$('#modalPitchContent').on('mousedown',".optionButtonHolder .btn,.outcomeButton,.penaltyOptions", function(event) {
    var classList = "glyphicon glyphicon-ok";
    var selectedEvent = event.target;
    if ($(selectedEvent).children("span").hasClass(classList)) {
        $(selectedEvent).children("span").removeClass(classList);
    }
    else{
        $(selectedEvent).children("span").addClass(classList);
        $(selectedEvent).siblings().children("span").removeClass(classList);
    }
});


//***************************************************************************************************************//
//********************************************* SIN BIN AND RED CARD LOGIC *************************************//

$('.card').mousedown(function(event){
    var selectedCard = event.target.id;

    if ($('#'+selectedCard).hasClass('fullScreen')){         //If I have already clicked the card and setthe hight / width as below ....
        $('#'+selectedCard).css('height',"");				// reset height / width
        $('#'+selectedCard).css('width',"");
        $('#'+selectedCard).removeClass('fullScreen');		// remove class added at first click
        $('#'+selectedCard).children("span").html("");
        $('#'+selectedCard).siblings('.card').show();		// show the div that was heiiden by first click, ready for next time
        $('#'+currentParentPage).hide();
        $('#gameStart').show();
        $('#statEventsHolder').show();
    } else {


        var html="";

        $('#gameStart').hide();
        $('#'+selectedCard).siblings('.card').hide();

        //Hide the card that was not selected (either red or yellow)

        $('#'+selectedCard).css('height',height);			    // set width 1+ height to full screen ( for ref to display to player e.g)
        $('#'+selectedCard).css('width',width);

        html +='<span>'+playerNumber+'</span>';
        $('#'+selectedCard).children("span").html(html);      // Add the number of the player to the card
        $('#'+selectedCard).addClass('fullScreen');		  // Add this class for font sizez etc.

        var binEndTime =(parseInt(appendMins.innerHTML)+10);      //add ten minutes to current time to set BIn End Time

        if (selectedCard=="yellowCard"){                      // if its a yellow card then...

            if(selectedTeam ==homeTeam){                   // if it is a yellow card for the Home Team then....
                $('#homeTeamCardHolder').append('<div title="End: '+binEndTime+':'+appendSecs.innerHTML+'" class="yellow teamCard" id="homeYellow'+playerNumber+'">'+playerNumber+'</div>');   // add the bin glyph
                homeYellowCards.push(playerNumber);    // add this player to the yellowCard array for home team
            }
            else{
                $('#awayTeamCardHolder').append('<div title="End: '+binEndTime+':'+appendSecs.innerHTML+'" class="yellow teamCard" id="awayYellow'+playerNumber+'">'+playerNumber+'</div>');   //If ists a yellow card for the Away Team
                awayYellowCards.push(playerNumber);         // add this player to the yellowCard array for away team
            }
        }
        else{
            if(selectedCard=="redCard"){                    // if it is a red card for the Home Team then....

                if(selectedTeam ==homeTeam){               // if it is a red card for the Home Team then....
                    $('#homeTeamCardHolder').append('<div title="'+eventTime+'" class="red teamCard" id="homeRed'+playerNumber+'">'+playerNumber+'</div>');   // add the bin glyph
                    homeRedCards.push(playerNumber);    // add this player to the red Card array for home team
                }
                else{
                    $('#awayTeamCardHolder').append('<div title="'+eventTime+'" class="red teamCard" id="awayRed'+playerNumber+'">'+playerNumber+'</div>');   //If ists a yellow card for the Away Team
                    awayRedCards.push(playerNumber);    // add this player to the red Card array for home team
                }

            }

        }


    }
});

//***********************************************Yellow / Red  Card on home  Screen Click NM 25/11/16********************************************


$('.teamCardHolder').on('mousedown', ".teamCard", function(event) {

    alert(this.title);

});

//**************************************************** Diable Player Buttons Function NM 25/11/16 ******************************************
//**********************Disables and adds colour to Player Buttons based on having a card or not and what team is Selected*****



function checkForCards(){

    var binStartTime="";
    var sentOfftime ="";
    var i;
    var r;
    var t;
    var q;

    $('#statNumbers').find("span").text("");
    $('#statNumbers').children('.btn').removeClass('disabled red yellow');    //clear previosuly set classes

    if (selectedTeam==homeTeam){

        for(i=0;i<homeYellowCards.length;i++){
            $('#statNumbers'+homeYellowCards[i]).addClass('disabled yellow');

            if(homeYellowCards.length >0){
                binStartTime = document.getElementById("homeYellow"+homeYellowCards[i]).title;    // get the title tex ttaht is stored on this div
                $('#statNumbers'+homeYellowCards[i]).children('span').text(" "+binStartTime);      //at the title text whicxh has the static bin start time to this button
            }
        }

        for(t=0;t<homeRedCards.length;t++){
            $('#statNumbers'+homeRedCards[t]).addClass('disabled red');

            if(homeRedCards.length >0){
                sentOffTime = document.getElementById("homeRed"+homeRedCards[t]).title;    // get the title tex ttaht is stored on this div
                $('#statNumbers'+homeRedCards[t]).children('span').text(" "+sentOffTime);      //at the title text whicxh has the static bin start time to this button
            }
        }

    }
    else if(selectedTeam==awayTeam){

        for( q=0;q<awayYellowCards.length;q++){
            $('#statNumbers'+awayYellowCards[q]).addClass('disabled yellow');

            if(awayYellowCards.length >0){
                binStartTime = document.getElementById("awayYellow"+awayYellowCards[q]).title;    // get the title tex ttaht is stored on this div
                $('#statNumbers'+awayYellowCards[q]).children('span').text(" "+binStartTime);      //at the title text whicxh has the static bin start time to this button
            }

        }

        for(r=0;r<awayRedCards.length;r++){
            $('#statNumbers'+awayRedCards[r]).addClass('disabled red');

            if(awayRedCards.length >0){
                sentOffTime = document.getElementById("awayRed"+awayRedCards[r]).title;    // get the title tex ttaht is stored on this div
                $('#statNumbers'+awayRedCards[r]).children('span').text(" "+sentOffTime);      //at the title text whicxh has the static bin start time to this button
            }
        }


    }


};

//********************************** Function for MAking Substitutions **************************************************************


function subScreen(){

    var subPlayerNumber = [playerNumber];					// addd the selected palyer to this array (so it can be passed into makeStatButtons Function)
    var substitutes = [];

    if (selectedTeam ==homeTeam){

        for (var i=0;i<homeSubs.length;i++){				//depending on the team add the set substitutes to the new substitues array to be used in makeStat buttons fuction
            substitutes.push(homeSubs[i])
        }
    }
    else if(selectedTeam ==awayTeam){

        for (var t=0;t<awaySubs.length;t++){
            substitutes.push(awaySubs[t])
        }
    }

    makeStatsButtons(subPlayerNumber,"playerGoingOff")
    makeStatsButtons(substitutes,"subsBench")

};



$('#subsBench').on('mousedown', ".btn", function(event) {

    sub = event.target.firstChild.nodeValue;   // number of sub e.g. 21
    var subPlayerNumber = [sub];					// function takes an array so this is necessary

    makeStatsButtons(subPlayerNumber,"playerGoingOn")
    $('#onOffArrowsHolder').show()
    $('#playerGoingOnHolder').show();
    $('#playerGoingOn').show();
    $('#subsButton').show();

});




$('#subsButton').mousedown(function(event){




    if (selectedTeam ==homeTeam){				// depending on the selected team put the player being taken off into the correct subs array (for roll on roll off situations)
        var SubIndex = homeSubs.indexOf(sub);
        homeSubs.push(playerNumber)
        homeSubs.splice(SubIndex,1)
    }
    else{
        var SubIndex = awaySubs.indexOf(sub);
        awaySubs.push(playerNumber)
        awaySubs.splice(SubIndex,1)
    }



    var index = collectorsPlayersArray[statCollectorId].indexOf(playerNumber);       // setthe index passing in player number of subbed off player

    collectorsPlayersArray[statCollectorId].splice(index, 1);       // <-- Not supported in <IE9 statCollectorId is set to 0 for the moment. This will  be different for each user linked to the same game in mulit player use


    collectorsPlayersArray[statCollectorId].splice(index,0,sub);					// add the sub to the collectorsPlayers array



    makeStatsButtons(collectorsPlayersArray[statCollectorId],"statNumbers");		// rebuild the buttons with the new array
    $('#Sub').hide();
    $('#statEventsHolder').show();
    $('#playerGoingOn').hide();
    $('#subsButton').hide();
    $('#onOffArrowsHolder').hide()
    alert('SUBSTITUTION: '+selectedTeam+': Player '+playerNumber+' replaced by Player '+sub);

});

//*************************************************************** SCORE FUNCTION *****************************************************************************************

$('#scoreButtonHolder .try').mousedown(function(){

    currentParentPage = "Conversion"; 					// this is used in the dynamic modal
    $('#scoreButtonHolder').hide();
    makeStatsButtons(collectorsPlayersArray[statCollectorId],"kickButtonHolder");
    $( "#kickButtonHolder" ).prepend( '<h3>Select Conversion Taker</h3>' );
    $('#kickButtonHolder').show();
    $('#scoreButtonHolder').hide();

    statEvent="try";


    if(selectedTeam ==homeTeam){
        var currentScore =parseInt($('#homeTeamScore').text());
        var newScore = (currentScore + 5);
        $('#homeTeamScore').text(newScore);
    }
    else {

        var currentScore =parseInt($('#awayTeamScore').text());
        var newScore = (currentScore + 5);
        $('#awayTeamScore').text(newScore);

    }

    add_player_event();      //TODO add socre points to DB
});


$('#scoreButtonHolder .dropgoal').mousedown(function(){

    currentParentPage = "DropGoal"; 					// this is used in the dynamic modal
    $('#scoreButtonHolder').hide();
    $('#gameStart').hide();

    statEvent="dropgoal";

    if(selectedTeam ==homeTeam){
        var currentScore =parseInt($('#homeTeamScore').text());
        var newScore = (currentScore + 3);
        $('#homeTeamScore').text(newScore);
    }
    else {      // if its away team

        var currentScore =parseInt($('#awayTeamScore').text());
        var newScore = (currentScore + 3);           // add 3 points to the score
        $('#awayTeamScore').text(newScore);

    }
    $('#scoreButtonHolder').hide();
    $('#DropGoal').show();
    $('#zoneHolder').show();

    add_player_event(); //TODO add socre points to DB

});



//********************************************************************* Kick function for Conversions and Penalties NM 29/11/16 ***************************************************************

$('#kickButtonHolder').on('mousedown', ".btn", function(event) {   // select the number of the kick taker


    playerNumber = event.target.firstChild.nodeValue;      // set the player number taking conversion  / penalty



    if (statEvent=="penalty") {       // if triggered from penalty modal

        var html="";
        if(penaltyType == penaltyOptions[1]){     // if penalty is a shot at goal...

            penaltyOutcomeOptions=["Scored","Missed"];      // set the text and values for the buttons on the modal
            $("#penaltyKickStatus").show();			// show the Missed / Scored Buttons
            $("#modalPitchNext").hide();
        }
        else if(penaltyType ==penaltyOptions[2]){    //if penalty is a  Kick to touch

            penaltyOutcomeOptions=["Touch Made","Touch Missed"];     // set the text and values for the buttons on the modal
            $("#penaltyKickStatus").show();			// show the Missed / Scored Buttons
            $("#modalPitchNext").hide();			// show the next button
        }
        else if(penaltyType ==penaltyOptions[0]){    //if penalty is a Tap n Go

            penaltyOutcomeOptions = ["Gain Line Passed","No Yards Gained"];     // set the text and values for the buttons on the modal
            $("#penaltyKickStatus").show();			// show the Missed / Scored Buttons
            $("#modalPitchNext").hide();			// show the next button
        }


        // Make two Buttons with values and Text appropriate to the penalty type.
        html += '<button type="button" value="'+penaltyOutcomeOptions[0]+'" class="hwButton btn btn-success conversionButtons home">'+penaltyOutcomeOptions[0]+'</br><span></span></button><button type="button" value="'+penaltyOutcomeOptions[1]+'" class="hwButton btn btn-danger conversionButtons away">'+penaltyOutcomeOptions[1]+'</br><span></span></button></div>';


        $('#penaltyKickStatus').html(html);

        $('#modalPitch').modal('show');				//show the modal again

    }
    else{     // if its a conversion

        statEvent="conversion";
        $('#zoneHolder').show();
        $('#Conversion').show();
        $('#gameStart').hide();
    }
    $("#Score").hide();
    $('#kickButtonHolder').hide();    // hide this div

});


//************************************************************** STATS Functions *********************************************************************************************
//****************************************************************************************************************************************************************************
$('#showStats').click(function(){

    $('#statEventsHolder').hide();
    $('#statNumbers').hide();
    $('#showStats').hide();
    allCharts();            // calls makeChart for all the charts
    $('#Stats').show();
    $('#statsBackBtn').show();

    //	$('table.highchart').highchartTable();      //render / create the chart highchart table chart


});

function allCharts(){
    makeChart("homeTeamOverviewChartHolder","homeTeamOverviewTable","column", homeTeam+" Team Overview");     // Div it gtes append to, name of dataTable id to get data from, text forgraph header and chart type
    makeChart("awayTeamOverviewChartHolder","awayTeamOverviewTable","column",awayTeam+" Team Overview");
    makeChart("singlePlayerChartHolder","singlePlayerTable","bar","Individual Stats for Player");
    makeChart("homeAwayTotalsChartHolder","homeAwayTotalsTable","column","TOTALS PER TEAM");
    makeChart("homeAwayScrumLineoutsChartHolder","homeAwayScrumLineoutsTable","column","SCRUMS  & LINEOUTS");

};

$("#statsBackBtn").click(function(){

    $('#statEventsHolder').show();
    $('#Stats').hide();
    $('#showStats').show();			//show this button
    $('#statsBackBtn').hide();     //hide this button

});



function createStatsTable(id,prefix,firstColumn,colums,rows,div){       // id is the id the table will have//prefix is to concat with id to differentiate between home and away
    //firstColum is for PLAYER
    //Div is name of existing DIV where it gets appended to

    var html ="";								// add hihghchartTable class and bootstarp table classes
    html='<table id="'+id+'" class="table table-striped .table-responsive">'   //highchart" data-graph-container-before="1" data-graph-type="column">
        +'<thead><tr><th>'+firstColumn+'</th>';

    for(var i=0;i<colums.length;i++){
        html += '<th>'+firstColumn+" "+colums[i]+'</th>';
    }

    html +='</tr></thead><tbody>'

    for(var t=0;t<rows.length;t++){
        html += '<tr><td>'+rows[t]+'</td>';

        for(var q=0;q<colums.length;q++){					//id here i steh table ID nned to make different cell ids per table per player/stat
            html += '<td title="'+colums[q]+rows[t]+'" id="'+(id+prefix+colums[q]+rows[t]).replace(/'/g,'').replace(/ /g,'')+'"></td>';    // ths id corresponds to the id used in updateStatsTable()
        }
        html += '</tr>';
    }

    html += '</tbody></table>';

    document.getElementById(div).innerHTML = html;

};





//****************** Increases the Stat count on the table for a given player / event **************************************************************************
function updateStatTable(){

    for(var i=0;i<individualStatsTables.length;i++){    // need to to this for ach table e.g.   id-="teamOverViewTablehm1Tackle"  and id="singlePlayerTablehm1Tackle"

        var cellRef = (individualStatsTables[i]+prefix+playerNumber+statEvent).replace(/ /g,'');   // this correspnds to IDs set in createStatsTable()
        var currentScore = $('#'+cellRef).text();

        if(currentScore == ""){
            currentScore =0;
        }

        currentScore++;
        $('#'+cellRef).text(currentScore);

    }



    for(var t=0;t<headToHeadStatsTables.length;t++){    // need to to this for ach table e.g.   id-="teamOverViewTablehm1Tackle"  and id="singlePlayerTablehm1Tackle"

        var team="";
        if(selectedTeam ==homeTeam){

            team = "Home";
        }
        else {
            team = "Away"
        }

        if(statEvent =='Scrum'){

            if(putInBy==wonBy){
                statEvent=scrumLinoutTableHeaders[2].replace(/ /g,'')     //Own Scrum Won
            } else {

                statEvent=scrumLinoutTableHeaders[3].replace(/ /g,'')		//Own Scrun Lost
            }



        }
        else if (statEvent =='Line Out'){

            if(putInBy==wonBy){
                statEvent=scrumLinoutTableHeaders[0].replace(/ /g,'')   //Own Lineout WOn
            } else{
                statEvent=scrumLinoutTableHeaders[1].replace(/ /g,'') 		//Own Lineout Lost
            }

        }


        var cellRef= (headToHeadStatsTables[t]+selectedTeam+statEvent).replace(/'/g,'').replace(/ /g,'') 	;   // this correspnds to IDs set in createStatsTable()
        var currentScore = $('#'+cellRef).text();

        if(currentScore == ""){
            currentScore =0;
        }

        currentScore++;
        $('#'+cellRef).text(currentScore);

    }







};


function makeChart(div,table_id,type,header_text){
    Highcharts.chart(div, {
        data: {
            table: table_id
        },
        chart: {
            type: type
        },
        title: {
            text: header_text
        },
        yAxis: {
            allowDecimals: false,
            title: {
                text: 'Units'
            }
        },
        tooltip: {
            formatter: function () {
                return '<b>' + this.series.name + '</b><br/>' +
                    this.point.y + ' ' + this.point.name.toLowerCase();
            }
        }
    });
}
//*******************************************************************************************************************************
//*****************************************************AJAX CALLS TO DB**********************************************************
//*******************************************************NM 8/12/16**************************************************************
        var statEventHolder = {};
        
        function add_player_event() {
           // alert("here")// adds single event, player number, team and time
            $.ajax({
                type: "POST",
                url: "/event",
                data: {
                    game_id: game_id,
                    playerNumber: playerNumber,
                    event: statEvent,                      //param(name) : localVariable(name)
                    eventTime: eventTime,
                    team: selectedTeam
                }
            });
        }



            function add_team_event() {                         // adds scrum / lineout etc
                $.ajax({
                    type: "POST",
                    url: "/event/teamEvent",
                    data: {
                        game_id: game_id,
                        putInBy: putInBy,
                        wonBy:wonBy,
                        teamEventOutcome: teamEventOutcome,
                        statEvent: statEvent,                      //param(name) : localVariable(name)
                        eventTime: eventTime,
                        pitchzone:pitchzone
                    }
                });
            }

//********************************************************************************************************************************
//***************************************************GET GAME ID******************************************************************
//*************************Function used at setup to get unique game ID from DB and use on all evemts for that game***************


                        function set_master_user_id() {             //gets the userid from mongo db vi passport  and passes it back to game table in sql below
                            $.ajax({                                //TODO should really be done in backend NM 8/3/17
                                type: "GET",
                                url: "/game/userid",
                                // data: user_id,
                                success: function (results) {
                                      //user_id = JSON.stringify(results);
                                    user_id = results;              //user_id variable declared at top.
                                }
                            });
                        }

                    function get_game_id(){                 //This setsup a  new game and returns its ID to be uses in all events for that game.
                        var date = (new Date()).toISOString().substring(0, 10);
                        $.ajax({
                            type: "POST",
                            url: "/game",
                            data: {
                                homeTeam: homeTeam,
                                awayTeam: awayTeam,
                                date:date,
                                userid:user_id
                                },
                            //contentType: "application/json",
                            cache: false,
                            success:function(results){
                                   //alert(results)
                                game_id = results;              // the Id of the just created game s returned NM
                            }

                        })

                    };

