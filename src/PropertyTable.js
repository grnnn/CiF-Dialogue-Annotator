//Object that handles putting html elements onto the page for each property and setting their listeners
var propertyTable = {};

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

propertyTable.seiHTML = function(lineNum, length){
    var dropdownText = "<div class='dropdown' ><button type='button' class='btn btn-default dropdown-toggle' id='SEIDropDownButtonAt"+lineNum+"And"+length+"'  data-toggle='dropdown'>Select Exchange type <span class='caret'></span></button> <ul class='dropdown-menu' role='menu' id='SEIDropDownAt"+lineNum+"And"+length+"' aria-labelledby='dropdownMenu1' >";
    for(var i = 0; i < games.length; i++){
        var game = games[i];
        dropdownText = dropdownText + " <li role='presentation'><a role='menuitem' tabindex='-1' style='cursor:default;'>"+game.identity+"</a></li>";
    }
    return dropdownText + "</ul> </div>";
};



propertyTable.setListeners = function(id, lineNum, length){
    switch(id){
        case "SocialExchangeIdentities":
            return this.seiListeners(lineNum, length);
    }

};

propertyTable.seiListeners = function(lineNum, length){
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
    });

};