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
            return this.swtHTML(lineNum, length);
        case "StoryWorldContradictions":
            return this.swcHTML(lineNum, length);
        case "SpeechActs":
            return this.saHTML(lineNum, length);
        case "SpeechActsPrecede":
            return this.sapHTML(lineNum, length);
        case "SpeechActsFollow":
            return this.safHTML(lineNum, length);
        case "StrictDependence":
            return this.sdHTML(lineNum, length);
    }

};

//return the html string for "StoryWorldContradictions"
//Includes a drop down of each transmission type,
//Then a drop down for the representations for that type
propertyTable.swcHTML = function(lineNum, length){
	var dropdownText = "<div class='dropdown' ><button type='button' class='btn btn-default dropdown-toggle' id='SWCDropDownButtonAt"+lineNum+"And"+length+"'  data-toggle='dropdown'>Select Transmission Type <span class='caret'></span></button> <ul class='dropdown-menu' role='menu' id='SWCDropDownAt"+lineNum+"And"+length+"' aria-labelledby='dropdownMenu1' >";
    dropdownText = dropdownText + " <li role='presentation'><a role='menuitem' tabindex='-1' style='cursor:default;'>Cultural Knowledgebase Predicates</a></li>";
    dropdownText = dropdownText + " <li role='presentation'><a role='menuitem' tabindex='-1' style='cursor:default;'>Network-value Predicates</a></li>";
    dropdownText = dropdownText + " <li role='presentation'><a role='menuitem' tabindex='-1' style='cursor:default;'>Relationship Predicates</a></li>";
    dropdownText = dropdownText + " <li role='presentation'><a role='menuitem' tabindex='-1' style='cursor:default;'>Status/Trait Predicates</a></li>";
    dropdownText = dropdownText + " <li role='presentation'><a role='menuitem' tabindex='-1' style='cursor:default;'>Social Facts Database Predicates</a></li> </ul> </div>";

    dropdownText = dropdownText + "<div class='dropdown' id='SWCDropDownContainerNested1At"+lineNum+"And"+length+"' style='padding:5px;'></div>";

    dropdownText += "<br><p><label for='amount'>Strength of Contradiction:</label><input type='text'id='SWCAmountAt"+lineNum+"And"+length+"' readonly style='border:0; color:#f6931f; font-weight:bold; width: 50px;'></p><div id='SWCslider-rangeAt"+lineNum+"And"+length+"'></div>";

    return dropdownText;
};

//return the html string for "StoryWorldTransmissions"
//Includes a drop down of each transmission type,
//Then a drop down for the representations for that type
propertyTable.swtHTML = function(lineNum, length){
    var dropdownText = "<div class='dropdown' ><button type='button' class='btn btn-default dropdown-toggle' id='SWTDropDownButtonAt"+lineNum+"And"+length+"'  data-toggle='dropdown'>Select Transmission Type <span class='caret'></span></button> <ul class='dropdown-menu' role='menu' id='SWTDropDownAt"+lineNum+"And"+length+"' aria-labelledby='dropdownMenu1' >";
    dropdownText = dropdownText + " <li role='presentation'><a role='menuitem' tabindex='-1' style='cursor:default;'>Cultural Knowledgebase Predicates</a></li>";
    dropdownText = dropdownText + " <li role='presentation'><a role='menuitem' tabindex='-1' style='cursor:default;'>Network-value Predicates</a></li>";
    dropdownText = dropdownText + " <li role='presentation'><a role='menuitem' tabindex='-1' style='cursor:default;'>Relationship Predicates</a></li>";
    dropdownText = dropdownText + " <li role='presentation'><a role='menuitem' tabindex='-1' style='cursor:default;'>Status/Trait Predicates</a></li>";
    dropdownText = dropdownText + " <li role='presentation'><a role='menuitem' tabindex='-1' style='cursor:default;'>Social Facts Database Predicates</a></li> </ul> </div>";

    dropdownText = dropdownText + "<div class='dropdown' id='SWTDropDownContainerNested1At"+lineNum+"And"+length+"' style='padding:5px;'></div>";

    dropdownText += "<br><p><label for='amount'>Strength of Transmission:</label><input type='text'id='SWTAmountAt"+lineNum+"And"+length+"' readonly style='border:0; color:#f6931f; font-weight:bold; width: 50px;'></p><div id='SWTslider-rangeAt"+lineNum+"And"+length+"'></div>";
    dropdownText += "<div id='SWTTypeOfStrength"+lineNum+"And"+length+"' style='margin-top: 10px;'>The transmission is of medium strength</div>";

    return dropdownText;
};

//return the html string for "StrictDependence"
//Includes a drop down of each line
propertyTable.sdHTML = function(lineNum, length){
    var lineNums = [];
    for(var j = 0; j < main.linesOfDialogue.length; j++){
        if(j===0) lineNums.push(1);
        if(j!==0) lineNums.push(lineNums[j-1] + 1);
    }
    var dropdownText =  "<div class='dropdown' ><button type='button' class='btn btn-default dropdown-toggle' id='SDDropDownButtonAt"+lineNum+"And"+length+"'  data-toggle='dropdown'>Select Line <span class='caret'></span></button> <ul class='dropdown-menu' style='white-space: normal;' role='menu' id='SDDropDownAt"+lineNum+"And"+length+"' aria-labelledby='dropdownMenu1' >";
    for(var i = 0; i < main.linesOfDialogue.length; i++){
        var line =  main.linesOfDialogue[i];
        if(line.text !== "" && line.speaker === "") dropdownText = dropdownText + " <li role='presentation'><a role='menuitem' style='white-space: normal; width: 300px; cursor:default;' tabindex='-1' >"+lineNums[i]+".This line has no speaker</a></li>";
        else if(line.text === "" && line.speaker !== "") dropdownText = dropdownText + " <li role='presentation'><a role='menuitem' style='white-space: normal; width: 300px; cursor:default;' tabindex='-1' >"+lineNums[i]+".This line has no dialogue</a></li>";
        else if(line.text === "" && line.speaker === "") dropdownText = dropdownText + " <li role='presentation'><a role='menuitem' style='white-space: normal; width: 300px; cursor:default;' tabindex='-1' >"+lineNums[i]+".This line neither has a speaker nor dialogue</a></li>";
        else dropdownText = dropdownText + " <li role='presentation'><a role='menuitem' style='white-space: normal; width: 300px; cursor:default;' tabindex='-1' >"+lineNums[i]+".<b style='font-size:15px;'>"+line.speaker+"</b>:"+line.text+"</a></li>";
    }
    dropdownText = dropdownText + "</ul> </div>";

    return dropdownText;
};

//return the html string for "SpeechActsFollow"
//Includes a drop down speech acts with descriptions
propertyTable.safHTML = function(lineNum, length){
  var dropdownText =  "<div class='dropdown' ><button type='button' class='btn btn-default dropdown-toggle' id='SAFDropDownButtonAt"+lineNum+"And"+length+"'  data-toggle='dropdown'>Select Speech Act <span class='caret'></span></button> <ul class='dropdown-menu' style='white-space: normal;' role='menu' id='SAFDropDownAt"+lineNum+"And"+length+"' aria-labelledby='dropdownMenu1' >";
  for(var i = 0; i < speechActs.length; i++){
      var speechAct = speechActs[i];
      dropdownText = dropdownText + " <li role='presentation'><a role='menuitem' style='white-space: normal; width: 300px; cursor:default;' tabindex='-1' ><b style='font-size:15px;'>"+speechAct.name+"</b> <br>"+speechAct.description+"</a></li>";
  }
  dropdownText = dropdownText + "</ul> </div>";
  dropdownText = dropdownText + "<p style='padding:10px;' id='SAFTextAt"+lineNum+"And"+length+"'></p>";

  dropdownText += "<br><p><label for='amount'>Likelihood of this speech act following: </label><input type='text'id='SAFAmountAt"+lineNum+"And"+length+"' readonly style='border:0; color:#f6931f; font-weight:bold; width: 50px;'></p><div id='SAFslider-rangeAt"+lineNum+"And"+length+"'></div>";

  return dropdownText;

};

//return the html string for "SpeechActsPrecede"
//Includes a drop down speech acts with descriptions
propertyTable.sapHTML = function(lineNum, length){
    var dropdownText =  "<div class='dropdown' ><button type='button' class='btn btn-default dropdown-toggle' id='SAPDropDownButtonAt"+lineNum+"And"+length+"'  data-toggle='dropdown'>Select Speech Act <span class='caret'></span></button> <ul class='dropdown-menu' style='white-space: normal;' role='menu' id='SAPDropDownAt"+lineNum+"And"+length+"' aria-labelledby='dropdownMenu1' >";
    for(var i = 0; i < speechActs.length; i++){
        var speechAct = speechActs[i];
        dropdownText = dropdownText + " <li role='presentation'><a role='menuitem' style='white-space: normal; width: 300px; cursor:default;' tabindex='-1' ><b style='font-size:15px;'>"+speechAct.name+"</b> <br>"+speechAct.description+"</a></li>";
    }
    dropdownText = dropdownText + "</ul> </div>";
    dropdownText = dropdownText + "<p style='padding:10px;' id='SAPTextAt"+lineNum+"And"+length+"'></p>";

    dropdownText += "<br><p><label for='amount'>Likelihood of this speech act preceding: </label><input type='text'id='SAPAmountAt"+lineNum+"And"+length+"' readonly style='border:0; color:#f6931f; font-weight:bold; width: 25px;'></p><div id='SAPslider-rangeAt"+lineNum+"And"+length+"'></div>";


    return dropdownText;

};

//return the html string for "SpeechActs"
//Includes a drop down speech acts with descriptions
propertyTable.saHTML = function(lineNum, length){
	var dropdownText =  "<div class='dropdown' ><button type='button' class='btn btn-default dropdown-toggle' id='SADropDownButtonAt"+lineNum+"And"+length+"'  data-toggle='dropdown'>Select Speech Act <span class='caret'></span></button> <ul class='dropdown-menu' style='white-space: normal;' role='menu' id='SADropDownAt"+lineNum+"And"+length+"' aria-labelledby='dropdownMenu1' >";
	for(var i = 0; i < speechActs.length; i++){
		var speechAct = speechActs[i];
		dropdownText = dropdownText + " <li role='presentation'><a role='menuitem' style='white-space: normal; width: 300px; cursor:default;' tabindex='-1' ><b style='font-size:15px;'>"+speechAct.name+"</b> <br>"+speechAct.description+"</a></li>";
	}
	dropdownText = dropdownText + "</ul> </div>";
	dropdownText = dropdownText + "<p style='padding:10px;' id='SATextAt"+lineNum+"And"+length+"'></p>";

	return dropdownText;

};

//return the html string for "SocialExchangeOutcomes"
//Includes a drop down of just 'accept' and 'reject'
propertyTable.seoHTML = function(lineNum, length){
    var dropdownText = "<div class='dropdown' ><button type='button' class='btn btn-default dropdown-toggle' id='SEODropDownButtonAt"+lineNum+"And"+length+"'  data-toggle='dropdown'>Select Exchange Outcome <span class='caret'></span></button> <ul class='dropdown-menu' role='menu' id='SEODropDownAt"+lineNum+"And"+length+"' aria-labelledby='dropdownMenu1' >";
    dropdownText = dropdownText + " <li role='presentation'><a role='menuitem' tabindex='-1' style='cursor:default;'>Accept</a></li>";
    dropdownText = dropdownText + " <li role='presentation'><a role='menuitem' tabindex='-1' style='cursor:default;'>Reject</a></li> </ul> </div>";

    dropdownText = dropdownText + "<p style='padding:10px;' id='SEOTextAt"+lineNum+"And"+length+"'>Select exchange identity and outcome to generate intent</p>";

    return dropdownText;
};


//return the html string for "SocialExchangeIdentities"
//includes a drop down of different exchanges, stored in "games"
propertyTable.seiHTML = function(lineNum, length){
    var dropdownText = "<div class='dropdown'><button type='button' class='btn btn-default dropdown-toggle' id='SEIDropDownButtonAt"+lineNum+"And"+length+"'  data-toggle='dropdown'>Select Exchange Type <span class='caret'></span></button> <ul class='dropdown-menu'  role='menu' id='SEIDropDownAt"+lineNum+"And"+length+"' aria-labelledby='dropdownMenu1' >";
    for(var i = 0; i < games.length; i++){
        var game = games[i];
        dropdownText = dropdownText + " <li role='presentation'><a role='menuitem' tabindex='-1'  style='cursor:default;'>"+game.identity+"</a></li>";
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
        case "SpeechActsPrecede":
            return this.sapListeners(lineNum, length);
        case "SpeechActsFollow":
            return this.safListeners(lineNum, length);
        case "StrictDependence":
            return this.sdListeners(lineNum, length);
        case "StoryWorldTransmissions":
            return this.swtListeners(lineNum, length);
        case "StoryWorldContradictions":
        	return this.swcListeners(lineNum, length);
    }

};

//Nested Dropdown listeners for StoryWorldContradictions
propertyTable.swcListeners = function(lineNum, length){
    //Set up slider for the strength of transmission
    $(function() {
        $( "#SWCslider-rangeAt" + lineNum + "And" + length ).slider({
            min: 0,
            max: 100,
            value: 50,
            slide: function( event, ui ) {
                $( "#SWCAmountAt"+lineNum+"And"+length ).val( ui.value );
            }
        });
        $( "#SWCAmountAt"+lineNum+"And"+length ).val( $( "#SWCslider-rangeAt" + lineNum + "And" + length ).slider("value") );
    });

    $("#SWCDropDownAt" + lineNum + "And"+ length).on('click', 'li a', function(){
        //get the line number and length
        var nums =  $(this).parent().parent().attr("id").replace("SWCDropDownAt", "");
        var nums = nums.split("And");
        var lineNum = nums[0];
        var length = nums[1];

        //Set the text in the dropdown button to the selected type
        $("#SWCDropDownButtonAt"+lineNum+"And"+length).val($(this).text());
        $("#SWCDropDownButtonAt"+lineNum+"And"+length).text($(this).text());

        //Get the proper object for the first nested dropdown
        myTransmissions = {};
        switch($(this).text()) {
            case "Cultural Knowledgebase Predicates":
                myTransmissions = transmissions.CKB;
                break;
            case "Network-value Predicates":
                myTransmissions = transmissions.NET;
                break;
            case "Relationship Predicates":
                myTransmissions = transmissions.REL;
                break;
            case "Status/Trait Predicates":
                myTransmissions = transmissions.ST;
                break;
            case "Social Facts Database Predicates":
                myTransmissions = transmissions.SFDB;
                break;
        }

        //Then obtain the div for the next dropdown, and push out the old container elements
        var nestedDrop = $("#SWCDropDownContainerNested1At"+lineNum+"And"+length);
        nestedDrop.empty();

        //Build up the dropdown string
        var dropdownText =  "<button type='button' class='btn btn-default dropdown-toggle' id='SWCDropDownButtonNested1At"+lineNum+"And"+length+"'  data-toggle='dropdown'>Select Transmission <span class='caret'></span></button> <ul class='dropdown-menu' style='white-space: normal;' role='menu' id='SWCDropDownNested1At"+lineNum+"And"+length+"' aria-labelledby='dropdownMenu1' >";
        for(var i = 0; i < myTransmissions.length; i++){
            var transmission = myTransmissions[i];
            dropdownText = dropdownText + " <li role='presentation'><a role='menuitem' style='white-space: normal; width: 300px; cursor:default;' tabindex='-1' >"+transmission.representation+"</a></li>";
        }
        dropdownText = dropdownText + "</ul>";

        //Append it to the container
        nestedDrop.append(dropdownText);


        //Next set up a listener for the next menu
        $("#SWCDropDownNested1At" + lineNum + "And"+ length).on('click', 'li a', function(){
            //get the line number and length
            var nums =  $(this).parent().parent().attr("id").replace("SWCDropDownNested1At", "");
            var nums = nums.split("And");
            var lineNum = nums[0];
            var length = nums[1];

            //Set the text in the Dropdown button to the selected text
            $("#SWCDropDownButtonNested1At"+lineNum+"And"+length).val($(this).text());
            $("#SWCDropDownButtonNested1At"+lineNum+"And"+length).text($(this).text());
        });


    });

};

//Nested Dropdown listeners, woot woot!
propertyTable.swtListeners = function(lineNum, length){
    //Set up slider for the strength of transmission
    $(function() {
        $( "#SWTslider-rangeAt" + lineNum + "And" + length ).slider({
            min: 0,
            max: 100,
            value: 50,
            slide: function( event, ui ) {
                $( "#SWTAmountAt"+lineNum+"And"+length ).val( ui.value );
                //Change meaning based on value of slider
                if(ui.value <= 30){
                    $("#SWTTypeOfStrength"+lineNum+"And"+length).text("This transmission is only a dependency");
                } else if(ui.value > 30 && ui.value < 70){
                    $("#SWTTypeOfStrength"+lineNum+"And"+length).text("This transmission is of medium strength");
                } else if(ui.value >= 70 ){
                    $("#SWTTypeOfStrength"+lineNum+"And"+length).text("This transmission is a proper transmission");
                }
            }
        });
        $( "#SWTAmountAt"+lineNum+"And"+length ).val( $( "#SWTslider-rangeAt" + lineNum + "And" + length ).slider("value") );
    });

    //Set up ticks on slider
    var $slider =  $("#SWTslider-rangeAt" + lineNum + "And" + length);
    var max =  $slider.slider("option", "max");
    var spacing =  100 / (max -1);
    $slider.find('.ui-slider-tick-mark').remove();
    $('<span class="ui-slider-tick-mark"></span>').css('left', (spacing * 30) +  '%').appendTo($slider);
    $('<span class="ui-slider-tick-mark"></span>').css('left', (spacing * 70) +  '%').appendTo($slider);

    //Change meaning based on value of slider
    if($slider.slider("value") <= 30){
        $("#SWTTypeOfStrength"+lineNum+"And"+length).text("This transmission is only a dependency");
    } else if($slider.slider("value") > 30 && $slider.slider("value") < 70){
        $("#SWTTypeOfStrength"+lineNum+"And"+length).text("This transmission is of medium strength");
    } else if($slider.slider("value") >= 70 ){
        $("#SWTTypeOfStrength"+lineNum+"And"+length).text("This transmission is a proper transmission");
    }


    $("#SWTDropDownAt" + lineNum + "And"+ length).on('click', 'li a', function(){
        //get the line number and length
        var nums =  $(this).parent().parent().attr("id").replace("SWTDropDownAt", "");
        var nums = nums.split("And");
        var lineNum = nums[0];
        var length = nums[1];

        //Set the text in the dropdown button to the selected type
        $("#SWTDropDownButtonAt"+lineNum+"And"+length).val($(this).text());
        $("#SWTDropDownButtonAt"+lineNum+"And"+length).text($(this).text());

        //Get the proper object for the first nested dropdown
        myTransmissions = {};
        switch($(this).text()) {
            case "Cultural Knowledgebase Predicates":
                myTransmissions = transmissions.CKB;
                break;
            case "Network-value Predicates":
                myTransmissions = transmissions.NET;
                break;
            case "Relationship Predicates":
                myTransmissions = transmissions.REL;
                break;
            case "Status/Trait Predicates":
                myTransmissions = transmissions.ST;
                break;
            case "Social Facts Database Predicates":
                myTransmissions = transmissions.SFDB;
                break;
        }

        //Then obtain the div for the next dropdown, and push out the old container elements
        var nestedDrop = $("#SWTDropDownContainerNested1At"+lineNum+"And"+length);
        nestedDrop.empty();

        //Build up the dropdown string
        var dropdownText =  "<button type='button' class='btn btn-default dropdown-toggle' id='SWTDropDownButtonNested1At"+lineNum+"And"+length+"'  data-toggle='dropdown'>Select Transmission <span class='caret'></span></button> <ul class='dropdown-menu' style='white-space: normal;' role='menu' id='SWTDropDownNested1At"+lineNum+"And"+length+"' aria-labelledby='dropdownMenu1' >";
        for(var i = 0; i < myTransmissions.length; i++){
            var transmission = myTransmissions[i];
            dropdownText = dropdownText + " <li role='presentation'><a role='menuitem' style='white-space: normal; width: 300px; cursor:default;' tabindex='-1' >"+transmission.representation+"</a></li>";
        }
        dropdownText = dropdownText + "</ul>";

        //Append it to the container
        nestedDrop.append(dropdownText);


        //Next set up a listener for the next menu
        $("#SWTDropDownNested1At" + lineNum + "And"+ length).on('click', 'li a', function(){
            //get the line number and length
            var nums =  $(this).parent().parent().attr("id").replace("SWTDropDownNested1At", "");
            var nums = nums.split("And");
            var lineNum = nums[0];
            var length = nums[1];

            //Set the text in the Dropdown button to the selected text
            $("#SWTDropDownButtonNested1At"+lineNum+"And"+length).val($(this).text());
            $("#SWTDropDownButtonNested1At"+lineNum+"And"+length).text($(this).text());
        });


    });

};

//Set up the proper dropdown listener of lines
propertyTable.sdListeners = function(lineNum, length){
    $("#SDDropDownAt" + lineNum + "And"+ length).on('click', 'li a', function(){
        //get the line number and length
        var nums =  $(this).parent().parent().attr("id").replace("SDDropDownAt", "");
        var nums = nums.split("And");
        var lineNum = nums[0];
        var length = nums[1];

        //Set the text in the Dropdown button to the html
        $("#SDDropDownButtonAt"+lineNum+"And"+length).val("");
        $("#SDDropDownButtonAt"+lineNum+"And"+length).text("");

        $("#SDDropDownButtonAt"+lineNum+"And"+length).append($(this).html());
    });

    $("#SDDropDownButtonAt"+lineNum+"And"+length).on('click', function(){
        //get the line number and length
        var nums =  $(this).attr("id").replace("SDDropDownButtonAt", "");
        var nums = nums.split("And");
        var lineNum = nums[0];
        var length = nums[1];

        //Re-get the dropdown html for the updated lines
        var dropdownText =  "";
        for(var i = 0; i < main.linesOfDialogue.length; i++){
            var line =  main.linesOfDialogue[i];
            if(line.text !== "" && line.speaker === "") dropdownText = dropdownText + " <li role='presentation'><a role='menuitem' style='white-space: normal; width: 300px; cursor:default;' tabindex='-1' >"+(main.linesOfDialogue.indexOf(line)+1).toString()+".This line has no speaker</a></li>";
            else if(line.text === "" && line.speaker !== "") dropdownText = dropdownText + " <li role='presentation'><a role='menuitem' style='white-space: normal; width: 300px; cursor:default;' tabindex='-1' >"+(main.linesOfDialogue.indexOf(line)+1).toString()+".This line has no dialogue</a></li>";
            else if(line.text === "" && line.speaker === "") dropdownText = dropdownText + " <li role='presentation'><a role='menuitem' style='white-space: normal; width: 300px; cursor:default;' tabindex='-1' >"+(main.linesOfDialogue.indexOf(line)+1).toString()+".This line neither has a speaker nor dialogue</a></li>";
            else dropdownText = dropdownText + " <li role='presentation'><a role='menuitem' style='white-space: normal; width: 300px; cursor:default;' tabindex='-1' >"+(main.linesOfDialogue.indexOf(line)+1).toString()+".<b style='font-size:15px;'>"+line.speaker+"</b>:"+line.text+"</a></li>";
        }

        //push in the new html
        $("#SDDropDownAt"+lineNum+"And"+length).empty();
        $("#SDDropDownAt"+lineNum+"And"+length).append(dropdownText);
    });

};

//Set up the proper dropdown listener of speech acts Precede
propertyTable.sapListeners = function(lineNum, length){

    //Set up slider for the likelihood of preceding
    $(function() {
        $( "#SAPslider-rangeAt" + lineNum + "And" + length ).slider({
            min: 0,
            max: 100,
            value: 50,
            slide: function( event, ui ) {
                $( "#SAPAmountAt"+lineNum+"And"+length ).val( ui.value );
            }
        });
        $( "#SAPAmountAt"+lineNum+"And"+length ).val( $( "#SAPslider-rangeAt" + lineNum + "And" + length ).slider("value") );
    });

    $("#SAPDropDownAt" + lineNum + "And"+ length).on('click', 'li a', function(){
        //get the line number and length
        var nums =  $(this).parent().parent().attr("id").replace("SAPDropDownAt", "");
        var nums = nums.split("And");
        var lineNum = nums[0];
        var length = nums[1];

        //pull out the name of the Speech Act
        var name = $(this).html().match(/>(\w| |-)*</g)[0];
        name = name.replace(">", "");
        name = name.replace("<", "");

        //Pull out the description of the speech act
        var desc = $(this).html().split("<br>")[1];

        //Set the text in the Dropdown button to the name
        $("#SAPDropDownButtonAt"+lineNum+"And"+length).text(name);
        $("#SAPDropDownButtonAt"+lineNum+"And"+length).val(name);

        //Set the description to the desc
        $("#SAPTextAt"+lineNum+"And"+length).text(desc);
    });
};

//Set up the proper dropdown listener of speech acts Follow
propertyTable.safListeners = function(lineNum, length){

    //Set up slider for the likelihood of following
    $(function() {
        $( "#SAFslider-rangeAt" + lineNum + "And" + length ).slider({
            min: 0,
            max: 100,
            value: 50,
            slide: function( event, ui ) {
                $( "#SAFAmountAt"+lineNum+"And"+length ).val( ui.value );
            }
        });
        $( "#SAFAmountAt"+lineNum+"And"+length ).val( $( "#SAFslider-rangeAt" + lineNum + "And" + length ).slider("value") );
    });


    $("#SAFDropDownAt" + lineNum + "And"+ length).on('click', 'li a', function(){
        //get the line number and length
        var nums =  $(this).parent().parent().attr("id").replace("SAFDropDownAt", "");
        var nums = nums.split("And");
        var lineNum = nums[0];
        var length = nums[1];

        //pull out the name of the Speech Act
        var name = $(this).html().match(/>(\w| |-)*</g)[0];
        name = name.replace(">", "");
        name = name.replace("<", "");

        //Pull out the description of the speech act
        var desc = $(this).html().split("<br>")[1];

        //Set the text in the Dropdown button to the name
        $("#SAFDropDownButtonAt"+lineNum+"And"+length).text(name);
        $("#SAFDropDownButtonAt"+lineNum+"And"+length).val(name);

        //Set the description to the desc
        $("#SAFTextAt"+lineNum+"And"+length).text(desc);
    });
};

//Set up the proper dropdown listener of speech acts
propertyTable.saListeners = function(lineNum, length){
    $("#SADropDownAt" + lineNum + "And"+ length).on('click', 'li a', function(){
        //get the line number and length
        var nums =  $(this).parent().parent().attr("id").replace("SADropDownAt", "");
        var nums = nums.split("And");
        var lineNum = nums[0];
        var length = nums[1];

        //pull out the name of the Speech Act
        var name = $(this).html().match(/>(\w| |-)*</g)[0];
        name = name.replace(">", "");
        name = name.replace("<", "");

        //Pull out the description of the speech act
        var desc = $(this).html().split("<br>")[1];

        //Set the text in the Dropdown button to the name
        $("#SADropDownButtonAt"+lineNum+"And"+length).text(name);
        $("#SADropDownButtonAt"+lineNum+"And"+length).val(name);

        //Set the description to the desc
        $("#SATextAt"+lineNum+"And"+length).text(desc);
        
        //
        //Autofill code
        //
        
        //Get the proper speechAct data
        var speechAct = findSpeechAct(name);
        
        //Create the listgroups if they dont exist
        if(! $("#SpeechActsPrecedeListGroup"+lineNum).length ){
        	$("#SpeechActsPrecedeProp"+lineNum).trigger('click');
        }
        if(!  $("#SpeechActsFollowListGroup"+lineNum).length ){
        	$("#SpeechActsFollowProp"+lineNum).trigger('click');
        }
        
        //Get the two speech act autofill groups
        var actsThatPrecede = speechAct.canPrecede;
        var actsThatFollow = speechAct.canFollow;
        
        //find out how many items are in the listgroup
        console.log( $("#SpeechActsPrecedeListGroup"+lineNum).children.length );
        
        for(var i = 0; i < actsThatPrecede.length; i++){
        	var pAct = actsThatPrecede[i];
        	$("#SpeechActsPrecedePlusButton"+lineNum).trigger('click');
        	
        	
        	
        }
        
    });
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