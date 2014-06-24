//Object that handles putting html elements onto the page for each property and setting their listeners,
//It doesn't need to be generalizable, so I'm using a different syntax for it
var propertyTable = {};


//call the proper function (depending on id), to retrieve the proper html
//string, so that it may be appended in lineOfDialogue
propertyTable.addHTML = function(id, lineNum, length){
    switch(id){
        case "SocialExchangeOutcomes":
            return "Green green green";
        case "SocialExchangeIdentities":
            return this.seiHTML(lineNum, length);
        case "StoryWorldTransmissions":
            return "Navy navy navy";
        case "StoryWorldContradictions":
            return "Brown brown brown";
        case "SpeechActs":
            return "Red red red";
        case "SpeechActsPrecede":
            return "Pink pink pink";
        case "SpeechActsFollow":
            return "Yellow yellow yellow";
        case "StrictDependence":
            return "Purple purple purple";
    }

};


//return the html string for "SocialExchangeIdentities"
//includes a drop down of different exchanges, stored in "games"
propertyTable.seiHTML = function(lineNum, length){
    var dropdownText = "<div class='dropdown' ><button type='button' class='btn btn-default dropdown-toggle' id='SEIDropDownButtonAt"+lineNum+"And"+length+"'  data-toggle='dropdown'>Select Exchange type <span class='caret'></span></button> <ul class='dropdown-menu' role='menu' id='SEIDropDownAt"+lineNum+"And"+length+"' aria-labelledby='dropdownMenu1' >";
    for(var i = 0; i < games.length; i++){
        var game = games[i];
        dropdownText = dropdownText + " <li role='presentation'><a role='menuitem' tabindex='-1' style='cursor:default;'>"+game.identity+"</a></li>";
    }
    return dropdownText + "</ul> </div>";
};


//call the proper function (depending on id), to set the proper listener(s),
//as the html code has already been set in lineOfDialogue
propertyTable.setListeners = function(id, lineNum, length){
    switch(id){
        case "SocialExchangeIdentities":
            return this.seiListeners(lineNum, length);
    }

};

//Set up the proper dropdown listener, as well as synchronize the drop downs
//so that they all have the same results
propertyTable.seiListeners = function(lineNum, length){

    //Search each line for the SEIDropDown, and
    //set the new button text to the exchange
    var propertyArray = [];
    for(var i = 0; i < main.linesOfDialogue.length; i++){
        var line = main.linesOfDialogue[i];
        if(line.annotationData["SocialExchangeIdentities"] != null){
            for(var j=1; j<line.annotationData["SocialExchangeIdentities"].length+1; j++){
                var property = $("#SEIDropDownButtonAt" + (i+1) + "And" + j);
                if(property.text().search("Select Exchange type") == -1 && property.length){
                    propertyArray.push(property);

                }
            }
        }
    }
    if(propertyArray.length > 0){
        $("#SEIDropDownButtonAt"+lineNum+"And"+length).text(propertyArray[0].text());
        $("#SEIDropDownButtonAt"+lineNum+"And"+length).val(propertyArray[0].text());
    }


    //'click' listener for the sei drop down
    $("#SEIDropDownAt" + lineNum + "And"+ length).on('click', 'li a', function(){
        //get the line number and length
        var nums =  $(this).parent().parent().attr("id").replace("SEIDropDownAt", "");
        var nums = nums.split("And");
        var lineNum = nums[0];
        var length = nums[1];

        //Set the text in the Dropdown button to the selected text
        $("#SEIDropDownButtonAt"+lineNum+"And"+length).text($(this).text());
        $("#SEIDropDownButtonAt"+lineNum+"And"+length).val($(this).text());

        //Search each line for the SEIDropDown, and
        //set each line to the game that was selected
        var propertyArray = [];
        for(var i = 0; i < main.linesOfDialogue.length; i++){
            var line = main.linesOfDialogue[i];
            if(line.annotationData["SocialExchangeIdentities"] != null){
                for(var j=1; j<line.annotationData["SocialExchangeIdentities"].length+1; j++){
                    var property = $("#SEIDropDownButtonAt" + (i+1) + "And" + j);
                    if(property.length){
                        propertyArray.push(property);
                    }
                }
            }
        }
        for(var f=0; f < propertyArray.length; f++){
            propertyArray[f].text($(this).text());
            propertyArray[f].val($(this).text());
        }

    });

};