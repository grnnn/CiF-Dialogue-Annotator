//Object that handles putting html elements onto the page for each property and setting their listeners,
//It doesn't need to be generalizable, so I'm using a different syntax for it
var propertyTable = {};


//call the proper function (depending on id), to retrieve the proper html
//string, so that it may be appended in lineOfDialogue
propertyTable.addHTML = function(id, lineNum, length){
    switch(id){
        case "SocialExchangeOutcomes":
            return this.seoHTML(lineNum, length);
        case "SocialExchangeIdentities":
            return this.seiHTML(lineNum, length);
        case "StoryWorldTransmissions":
            return "Navy navy navy";
        case "StoryWorldContradictions":
            return "Brown brown brown";
        case "SpeechActs":
            return this.saHTML(lineNum, length);
        case "SpeechActsPrecede":
            return "Pink pink pink";
        case "SpeechActsFollow":
            return "Yellow yellow yellow";
        case "StrictDependence":
            return "Purple purple purple";
    }

};

//return the html string for "SpeechActs"
//Includes a drop down speech acts with descriptions
propertyTable.saHTML = function(lineNum, length){
	var dropdownText =  "<div class='dropdown' ><button type='button' class='btn btn-default dropdown-toggle' id='SADropDownButtonAt"+lineNum+"And"+length+"'  data-toggle='dropdown'>Select Speech Act <span class='caret'></span></button> <ul class='dropdown-menu' role='menu' id='SADropDownAt"+lineNum+"And"+length+"' aria-labelledby='dropdownMenu1' >";
	for(var i = 0; i < speechActs.length; i++){
		var speechAct = speechActs[i];
		dropdownText = dropdownText + " <li role='presentation'><a role='menuitem' tabindex='-1' style='cursor:default;'><b style='font-size:15px;'>"+speechAct.name+"</b> <br>"+speechAct.description+"</a></li>";
	}
	dropdownText = dropdownText + "<p style='padding:10px;' id='SATextAt"+lineNum+"And"+length+"'></p>";

	return dropdownText;

};

//return the html string for "SocialExchangeOutcomes"
//Includes a drop down of just 'accept' and 'reject'
propertyTable.seoHTML = function(lineNum, length){
    var dropdownText = "<div class='dropdown' ><button type='button' class='btn btn-default dropdown-toggle' id='SEODropDownButtonAt"+lineNum+"And"+length+"'  data-toggle='dropdown'>Select Exchange Outcome <span class='caret'></span></button> <ul class='dropdown-menu' role='menu' id='SEODropDownAt"+lineNum+"And"+length+"' aria-labelledby='dropdownMenu1' >";
    dropdownText = dropdownText + " <li role='presentation'><a role='menuitem' tabindex='-1' style='cursor:default;'>Accept</a></li>";
    dropdownText = dropdownText + " <li role='presentation'><a role='menuitem' tabindex='-1' style='cursor:default;'>Reject</a></li> </ul> </div>";

    dropdownText = dropdownText + "<p style='padding:10px;' id='SEOTextAt"+lineNum+"And"+length+"'>Select exchange identity and outcome to generate intent</p>"

    return dropdownText;
};


//return the html string for "SocialExchangeIdentities"
//includes a drop down of different exchanges, stored in "games"
propertyTable.seiHTML = function(lineNum, length){
    var dropdownText = "<div class='dropdown' ><button type='button' class='btn btn-default dropdown-toggle' id='SEIDropDownButtonAt"+lineNum+"And"+length+"'  data-toggle='dropdown'>Select Exchange Type <span class='caret'></span></button> <ul class='dropdown-menu' role='menu' id='SEIDropDownAt"+lineNum+"And"+length+"' aria-labelledby='dropdownMenu1' >";
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
        case "SocialExchangeOutcomes":
            return this.seoListeners(lineNum, length);
        case "SpeechActs":
            return this.saListeners(lineNum, length);
    }

};

//Set up the proper dropdown listener
propertyTable.saListeners = function(lineNum, length){

};

//Set up the proper dropdown listener, as well as synchronize the drop downs
//so that they all have the same results
propertyTable.seoListeners = function(lineNum, length){

    //Search each line for the SEIDropDown, and
    //set the new button text to the exchange
    var propertyArray = [];
    for(var i = 0; i < main.linesOfDialogue.length; i++){
        var line = main.linesOfDialogue[i];
        if(line.annotationData["SocialExchangeOutcomes"] != null){
            for(var j=1; j<line.annotationData["SocialExchangeOutcomes"].length+1; j++){
                var property = $("#SEODropDownButtonAt" + (i+1) + "And" + j);
                if(property.text().search("Select Exchange Outcome") == -1 && property.length){
                    propertyArray.push(property);

                }
            }
        }
    }
    if(propertyArray.length > 0){
        $("#SEODropDownButtonAt"+lineNum+"And"+length).text(propertyArray[0].text());
        $("#SEODropDownButtonAt"+lineNum+"And"+length).val(propertyArray[0].text());
    }

    //Find the Social Exchange Identities lines and get the selected exchange value
    //The point is to get the correct intent displaying
    //First get the sei text elements
    var seiArray = [];
    for(var k = 0; k < main.linesOfDialogue.length; k++){
        var line = main.linesOfDialogue[k];
        if(line.annotationData["SocialExchangeIdentities"] != null){
            for(var g=1; g<line.annotationData["SocialExchangeIdentities"].length+1; g++){
                var seiProperty = $("#SEIDropDownButtonAt" + (k+1) + "And" + g);
                if(seiProperty.length){
                    seiArray.push(seiProperty);
                }
            }
        }
    }
    //Next find the game object for the selected string
    if(seiArray.length > 0){
    	var selectedExchange = seiArray[0].val();
	    var game;
	    for(var b=0; b < games.length; b++){
	        if(games[b].identity == selectedExchange){
	            game = games[b];
	        }
	    }
	    var bool = true;
	    if(propertyArray.length){
		    if(propertyArray[0].val() === "Accept"){
		        game = game.accept;
		    }
		    else if(propertyArray[0].val() === "Reject"){
		        game = game.reject;
		    }
		    else bool=false;
	    }
	    else bool=false;

		 //Finally, set the val to the new intent
	    if(bool){
	    	$("#SEOTextAt"+lineNum+"And"+length).html("Intent: <b style='color:red'>"+game.subject+" </b><b style='color:green'>"+game.verb+" </b><b style='color:blue'>"+game.object+" </b>");
	    }

    }


    //'click' listener for the sei drop down
    $("#SEODropDownAt" + lineNum + "And"+ length).on('click', 'li a', function(){
        //get the line number and length
        var nums =  $(this).parent().parent().attr("id").replace("SEODropDownAt", "");
        var nums = nums.split("And");
        var lineNum = nums[0];
        var length = nums[1];

        //Set the text in the Dropdown button to the selected text
        $("#SEODropDownButtonAt"+lineNum+"And"+length).text($(this).text());
        $("#SEODropDownButtonAt"+lineNum+"And"+length).val($(this).text());


        //Search each line for the SEIDropDown, and
        //set each line to the game that was selected
        var propertyArray = [];
        for(var i = 0; i < main.linesOfDialogue.length; i++){
            var line = main.linesOfDialogue[i];
            if(line.annotationData["SocialExchangeOutcomes"] != null){
                for(var j=1; j<line.annotationData["SocialExchangeOutcomes"].length+1; j++){
                    var property = $("#SEODropDownButtonAt" + (i+1) + "And" + j);
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

        //Find the Social Exchange Identities lines and get the selected exchange value
        //The point is to get the correct intent displaying
        //First get the sei text elements
        var seiArray = [];
        for(var k = 0; k < main.linesOfDialogue.length; k++){
            var line = main.linesOfDialogue[k];
            if(line.annotationData["SocialExchangeIdentities"] != null){
                for(var g=1; g<line.annotationData["SocialExchangeIdentities"].length+1; g++){
                    var seiProperty = $("#SEIDropDownButtonAt" + (k+1) + "And" + g);
                    if(seiProperty.length){
                        seiArray.push(seiProperty);
                    }
                }
            }
        }
        //Next find the game object for the selected string
        if(seiArray.length > 0) var selectedExchange = seiArray[0].val();
        else return;
        var matches = false;
        var game;
        for(var b=0; b < games.length; b++){
            if(games[b].identity == selectedExchange){
                game = games[b];
                matches = true;
            }
        }
        if(!matches) return;
        if($("#SEODropDownButtonAt" + lineNum + "And" + length).val() === "Accept"){
            game = game.accept;
        } else if($("#SEODropDownButtonAt" + lineNum + "And" + length).val() === "Reject"){
            game = game.reject;
        } else{
            return;
        }
        //Finally, set the val to the new intent
        for(var a = 0; a < propertyArray.length; a++){
            nums = propertyArray[a].attr("id").replace("SEODropDownButtonAt", "");
            nums = nums.split("And");
            lineNum = nums[0];
            length = nums[1];

            $("#SEOTextAt"+lineNum+"And"+length).html("Intent: <b style='color:red'>"+game.subject+" </b><b style='color:green'>"+game.verb+" </b><b style='color:blue'>"+game.object+" </b>");
        }

    });

}

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
                if(property.text().search("Select Exchange Type") == -1 && property.length){
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

        //Find the Social Exchange Outcome lines and change their intent to reflect the
        //game that was selected
        //We're doing this in this listener, because it will update the
        //Social Exchange Outcomes as needed
        //First get the seo text elements
        var seoArray = [];
        for(var k = 0; k < main.linesOfDialogue.length; k++){
            var line = main.linesOfDialogue[k];
            if(line.annotationData["SocialExchangeOutcomes"] != null){
                for(var g=1; g<line.annotationData["SocialExchangeOutcomes"].length+1; g++){
                    var seoProperty = $("#SEOTextAt" + (k+1) + "And" + g);
                    if(seoProperty.length){
                        seoArray.push(seoProperty);
                    }
                }
            }
        }
        //Next find the game object for the selected string
        var selectedExchange = $(this).text();
        var game;
        for(var b=0; b < games.length; b++){
            if(games[b].identity == selectedExchange){
                game = games[b];
            }
        }
        if(seoArray.length > 0)nums =  seoArray[0].attr("id").replace("SEOTextAt", "");
        else return;
        nums = nums.split("And");
        lineNum = nums[0];
        length = nums[1];
        if($("#SEODropDownButtonAt" + lineNum + "And" + length).val() === "Accept"){
            game = game.accept;
        } else if($("#SEODropDownButtonAt" + lineNum + "And" + length).val() === "Reject"){
            game = game.reject;
        } else{
            return;
        }
        //Finally, set the val to the new intent
        for(var a = 0; a < seoArray.length; a++){
            seoArray[a].html("Intent: <b style='color:red'>"+game.subject+" </b><b style='color:green'>"+game.verb+" </b><b style='color:blue'>"+game.object+" </b>");
        }

    });

    //Set a listener which cleans up on removal
    //When the dropdown is destroyed, and it is the last to be destroyed,
    //any intents should default back to "Select exchange identity and outcome to generate intent"
    $("#SEIDropDownAt" + lineNum + "And"+ length).on('remove', function(){
        //First find out if this one being closed is the last of its kind
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
        if(propertyArray.length === 0){
        	//Next, if it is the last of its kind, find all of the intents that
        	//are floating around
        	var seoArray = [];
            for(var k = 0; k < main.linesOfDialogue.length; k++){
                var line = main.linesOfDialogue[k];
                if(line.annotationData["SocialExchangeOutcomes"] != null){
                    for(var g=1; g<line.annotationData["SocialExchangeOutcomes"].length+1; g++){
                        var seoProperty = $("#SEOTextAt" + (k+1) + "And" + g);
                        if(seoProperty.length){
                            seoArray.push(seoProperty);
                        }
                    }
                }
            }
            if(seoArray.length > 0){
            	//change the value of those intents to "Select exchange identity and outcome to generate intent"
            	for(var a = 0; a < seoArray.length; a++){
                    seoArray[a].html("Select exchange identity and outcome to generate intent");
                }

            }

        }

    });

};