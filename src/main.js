function Main(){

    //class which does a lot of the overall logic, keeps track of all lines of dialogue

	//place initialization code here

	this.currentLineNumber = 0;

	this.linesOfDialogue = [];
	this.addLine();

	//Object for exporting xml
	this.export={};

}

//updates all of the lines of dialogue every 100 ms
Main.prototype.update = function(){
	for(var lineNum = 0; lineNum < this.linesOfDialogue.length; lineNum++){
        var line = this.linesOfDialogue[lineNum];
        line.update();
	}
};

//Adds a new line of dialogue
Main.prototype.addLine = function(){
    this.currentLineNumber++;
    var newLine = new LineOfDialogue(this.currentLineNumber);
    this.linesOfDialogue.push(newLine);
    
    
    //Set Speaker and interlocutor automatically, based on last line
	if( this.linesOfDialogue.indexOf(newLine) > 0 ){
		var lastLineIndex = this.linesOfDialogue.indexOf(newLine) - 1;
		
		if(this.linesOfDialogue[lastLineIndex].speaker === "Initiator" ){
			$("#SpeakerDropDownButton"+newLine.lineNumber).text("Responder");
			$("#SpeakerDropDownButton"+newLine.lineNumber).val("Responder");
			$("#InterlocutorDropDownButton"+newLine.lineNumber).text("Initiator");
			$("#InterlocutorDropDownButton"+newLine.lineNumber).val("Initiator");
			
		} else if(this.linesOfDialogue[lastLineIndex].speaker === "Responder" ){
			$("#SpeakerDropDownButton"+newLine.lineNumber).text("Initiator");
			$("#SpeakerDropDownButton"+newLine.lineNumber).val("Initiator");
			$("#InterlocutorDropDownButton"+newLine.lineNumber).text("Responder");
			$("#InterlocutorDropDownButton"+newLine.lineNumber).val("Responder");
		}
	}
};


//used to find a particular line by number
Main.prototype.findLine = function(lineNum){
    for(var i = 0; i < this.linesOfDialogue.length; i++){
        if(this.linesOfDialogue[i].lineNumber == lineNum) return this.linesOfDialogue[i];
    }
};

//Bound to Export button:
//Organize data into export object,
//Export to xml string,
//write to xml file,
//download the file, and delete file locally
Main.prototype.exportButton = function(){
    console.log("Exporting...");
    this.export.instantiation = {};
    //console.log( json2xml(this.export, ""));
    this.export.instantiation.social_exchange = "";
    if($("#nameOfInstantiation").val() === "Enter Name of Instantiation here"){
        alert("Name the instantiation and try exporting again.")
        return;
    }
    this.export.instantiation.name = $("#nameOfInstantiation").val();
    this.export.instantiation.lines_of_dialogue = {};
    var lines = this.export.instantiation.lines_of_dialogue;

    lines.line = [];

    for(var i = 0; i < this.linesOfDialogue.length; i++){
        var line = this.linesOfDialogue[i];
        var lineObj = {};

        lineObj.id = ($("#nameOfInstantiation").val() + (i+1).toString() + (new Date()).getTime()).replace(/ /g, "_");

        if(i !== 0) {
            lineObj.preceded_by = lines.line[i-1].id;
            lines.line[i-1].succeded_by = lineObj.id;
        }
        else lineObj.preceded_by = "";

        lineObj.succeded_by = "";

        lineObj.speaker = line.speaker;

        lineObj.interlocutor = line.interlocutor;

        lineObj.body = line.text;

        //Speech Acts
        lineObj.speech_acts = "";
        if(line.annotationData["SpeechActs"] != null){
            for(var sa = 0; sa < line.annotationData["SpeechActs"].val.length; sa++){
                var speechAct = line.annotationData["SpeechActs"].val[sa];
                if(speechAct === "") continue;
                if(sa > 0) lineObj.speech_acts = lineObj.speech_acts + ", " + speechAct;
                if(sa === 0) lineObj.speech_acts = speechAct;
            }

        }

        //Exchange Identity
        lineObj.exchange_identity_communicated = "";
        if(line.annotationData["SocialExchangeIdentities"] != null){
            if(typeof line.annotationData["SocialExchangeIdentities"].val === "string")
                lineObj.exchange_identity_communicated = line.annotationData["SocialExchangeIdentities"].val;
        }

        //Echange Outcome
        lineObj.exchange_outcome_communicated = "";
        if(line.annotationData["SocialExchangeOutcomes"] != null){
            if(typeof line.annotationData["SocialExchangeOutcomes"].val.outcome === "string")
                lineObj.exchange_outcome_communicated = line.annotationData["SocialExchangeOutcomes"].val.outcome;
        }

        //Transmissions
        lineObj.transmissions = {};
        lineObj.transmissions.transmission = [];
        if(line.annotationData["StoryWorldTransmissions"] != null){
            for(var t = 0; t < line.annotationData["StoryWorldTransmissions"].val.length; t++){
                var tClass = line.annotationData["StoryWorldTransmissions"].val[t].class;
                var tType = line.annotationData["StoryWorldTransmissions"].val[t].type;
                var tFirst = line.annotationData["StoryWorldTransmissions"].val[t].first;
                var tSecond = line.annotationData["StoryWorldTransmissions"].val[t].second;
                var slider = line.annotationData["StoryWorldTransmissions"].val[t].slider;
                if(tType === "") continue;
                lineObj.transmissions.transmission.push({"type":tClass, "name": tType, "first": tFirst, "second": tSecond,"slider": slider});
            }

        }

        //Contradictions
        lineObj.contradictions = {};
        lineObj.contradictions.contradiction = [];
        if(line.annotationData["StoryWorldContradictions"] != null){
            for(var c = 0; c < line.annotationData["StoryWorldContradictions"].val.length; c++){
                var cClass = line.annotationData["StoryWorldContradictions"].val[c].class;
                var cType = line.annotationData["StoryWorldContradictions"].val[c].type;
                var cFirst = line.annotationData["StoryWorldContradictions"].val[c].first;
                var cSecond = line.annotationData["StoryWorldContradictions"].val[c].second;
                if(cType === "") continue;
                lineObj.contradictions.contradiction.push({"type":cClass, "name": cType, "first": cFirst, "second": cSecond});
            }

        }

        //speech act precede
        lineObj.speech_acts_that_can_precede = {};
        lineObj.speech_acts_that_can_precede.speech_act = [];
        if(line.annotationData["SpeechActsPrecede"] != null){
            for(var sap = 0; sap < line.annotationData["SpeechActsPrecede"].val.length; sap++){
                var speechAct = line.annotationData["SpeechActsPrecede"].val[sap].name;
                var sapSlider = line.annotationData["SpeechActsPrecede"].val[sap].slider;
                var sapDirection = line.annotationData["SpeechActsPrecede"].val[sap].direction;
                if(speechAct === "") continue;
                lineObj.speech_acts_that_can_precede.speech_act.push({"name": speechAct, "slider": sapSlider, "direction": sapDirection});
            }

        }

        //speech act follow
        lineObj.speech_acts_that_can_follow = {};
        lineObj.speech_acts_that_can_follow.speech_act = [];
        if(line.annotationData["SpeechActsFollow"] != null){
            for(var saf = 0; saf < line.annotationData["SpeechActsFollow"].val.length; saf++){
                var speechAct = line.annotationData["SpeechActsFollow"].val[saf].name;
                var safSlider = line.annotationData["SpeechActsFollow"].val[saf].slider;
                var safDirection = line.annotationData["SpeechActsFollow"].cal[saf].direction;
                if(speechAct === "") continue;
                lineObj.speech_acts_that_can_follow.speech_act.push({"name": speechAct, "slider": safSlider, "direction": safDirection});
            }

        }

        //Likeliness of success
        lineObj.likeliness_of_success_range = line.rangeVal1.toString() + " - " + line.rangeVal2.toString();
        lineObj.range_of_next_success = line.nextRange;

        lineObj.lines_strictly_depended_on = {};


        lines.line.push(lineObj);
    }

    //Set strict dependence and social exchange
    var identityCommunicated = false;
    for(var j = 0; j < lines.line.length; j++){
        var line = lines.line[j];

        //strict dependence
        line.lines_strictly_depended_on.line = [];
        if(this.linesOfDialogue[j].annotationData["StrictDependence"] != null){
            for(var sd = 0; sd < this.linesOfDialogue[j].annotationData["StrictDependence"].val.length; sd++){
                var dependence = this.linesOfDialogue[j].annotationData["StrictDependence"].val[sd].lineNumber;
                var directPrecedence = this.linesOfDialogue[j].annotationData["StrictDependence"].val[sd].directPrecedence;
                if(dependence === -1) continue;
                var index = this.linesOfDialogue.indexOf(this.findLine(dependence));
                var dependence = lines.line[index].id;

                line.lines_strictly_depended_on.line.push({"dependence": dependence, "directPrecedence": directPrecedence});
            }
        }

        //Social Exchange
        if(line.exchange_identity_communicated !== ""){
            this.export.instantiation.social_exchange = line.exchange_identity_communicated;
            identityCommunicated = true;
        }
        else if(j === lines.line.length - 1 && !identityCommunicated){
            alert("No Social Exchange is selected. Select an exchange and try again");
            return;
        }
    }


    var xmlText = "<?xml version='1.0' encoding='UTF-8'?> \n" + json2xml(this.export, "\n");

    var blob = new Blob([xmlText], {type: "text/plain;charset=utf-8"});

    saveAs(blob, this.export.instantiation.name.replace(/ /g, "_") + ".xml");
};

//Bound to import Button
//get xml
//parse into javascript object
//Build up properties and lines
Main.prototype.importButton = function(numFiles, label, firstFile){
    if(numFiles !== 1){
        alert("Please load only 1 file and try again.");
        return;
    }

    console.log("loading: " + label);

    var that = this;
    if(firstFile){
        var r = new FileReader();
        r.onload = function(e){
            var contents = e.target.result;
            that.successfulImport(contents);
        };
        r.readAsText(firstFile);
    } else {
        alert("File loading failed. Please try again.");
        return;
    }
};

Main.prototype.successfulImport = function(contents){
    var importObj = xml2json.parser(contents);

    console.log(importObj);

    //Begin the actual importing
    $("#LinesContainer").empty();
    for(var a = this.linesOfDialogue.length - 1; a !== -1; a--){
        this.linesOfDialogue.splice(a, 1);
    }

    $("#nameOfInstantiation").val(importObj.instantiation.name);
    $("#nameOfInstantiation").text(importObj.instantiation.name);

    for(var i = 0; i < importObj.instantiation.lines_of_dialogue.line.length; i++){
        this.addLine();
    }

    var lines = importObj.instantiation.lines_of_dialogue.line;

    for(var j = 0; j < lines.length; j++){
        var line = lines[j];
        var lineObj = this.linesOfDialogue[j];

        //Speaker
        $("#SpeakerDropDownButton" + lineObj.lineNumber).val(line.speaker);
        $("#SpeakerDropDownButton" + lineObj.lineNumber).text(line.speaker);

        //Interlocutor
        $("#InterlocutorDropDownButton" + lineObj.lineNumber).val(line.interlocutor);
        $("#InterlocutorDropDownButton" + lineObj.lineNumber).text(line.interlocutor);

        //TextArea
        $("#TextArea" + lineObj.lineNumber).val(line.body);

        //Range
        $( "#slider-rangeAt" + lineObj.lineNumber ).slider( "values", 0, line.likeliness_of_success_range.split(" - ")[0]);
        $( "#slider-rangeAt" + lineObj.lineNumber ).slider( "values", 1, line.likeliness_of_success_range.split(" - ")[1]);
        $("#amountAt" + lineObj.lineNumber ).val(line.likeliness_of_success_range);

        //Next range
        $("#RangeDropDownButton"+lineObj.lineNumber).val(line.range_of_next_success.substring(0,2));
        $("#RangeDropDownButton"+lineObj.lineNumber).text(line.range_of_next_success.substring(0,2));
        $("#NextRange"+lineObj.lineNumber).val(line.range_of_next_success.substr(2));

        //And now, time for something completely different
        //Properties

        //Exchange Identity
        if(typeof line.exchange_identity_communicated !== "object"){
            var identities = line.exchange_identity_communicated.split(", ");
            $("#SocialExchangeIdentitiesProp" + lineObj.lineNumber).trigger("click");
            for(var seiLength = 0; seiLength < identities.length; seiLength++){
                $("#SocialExchangeIdentitiesPlusButton" + lineObj.lineNumber).trigger("click");
                $("#SEIDropDownButtonAt" + lineObj.lineNumber + "And" + (seiLength+1)).val(identities[seiLength]);
                $("#SEIDropDownButtonAt" + lineObj.lineNumber + "And" + (seiLength+1)).text(identities[seiLength]);
            }
        }

        //Exchange Outcome
        if(typeof line.exchange_outcome_communicated !== "object"){
            var outcomes = line.exchange_outcome_communicated.split(", ");
            $("#SocialExchangeOutcomesProp" + lineObj.lineNumber).trigger("click");
            for(var seoLength = 0; seoLength < outcomes.length; seoLength++){
                $("#SocialExchangeOutcomesPlusButton" + lineObj.lineNumber).trigger("click");
                $("#SEODropDownButtonAt" + lineObj.lineNumber + "And" + (seoLength+1)).val(outcomes[seoLength]);
                $("#SEODropDownButtonAt" + lineObj.lineNumber + "And" + (seoLength+1)).text(outcomes[seoLength]);
            }
        }

        //Speech Acts
        if(typeof line.speech_acts !== "object"){
            var acts = line.speech_acts.split(", ");
            $("#SpeechActsProp" + lineObj.lineNumber).trigger("click");
            for(var saLength = 0; saLength < acts.length; saLength++){
                $("#SpeechActsPlusButton" + lineObj.lineNumber).trigger("click");
                $("#SADropDownButtonAt" + lineObj.lineNumber + "And" + (saLength+1)).val(acts[saLength]);
                $("#SADropDownButtonAt" + lineObj.lineNumber + "And" + (saLength+1)).text(acts[saLength]);
                $("#SATextAt" + lineObj.lineNumber + "And" + (saLength+1)).val( findSpeechActDescription(acts[saLength]) );
                $("#SATextAt" + lineObj.lineNumber + "And" + (saLength+1)).text( findSpeechActDescription(acts[saLength]) );
            }
        }

        //Speech Acts that can Precede
        if(line.speech_acts_that_can_precede.speech_act !== undefined){
            if( line.speech_acts_that_can_precede.speech_act.length !== undefined || line.speech_acts_that_can_precede.speech_act.slider >= 0 ){
                var actsPrecede = line.speech_acts_that_can_precede.speech_act;
                if(line.speech_acts_that_can_precede.speech_act.slider >= 0) actsPrecede = [actsPrecede];
                $("#SpeechActsPrecedeProp" + lineObj.lineNumber).trigger("click");
                for(var sapLength = 0; sapLength < actsPrecede.length; sapLength++){
                    $("#SpeechActsPrecedePlusButton" + lineObj.lineNumber).trigger("click");
                    $("#SAPDropDownButtonAt" + lineObj.lineNumber + "And" + (sapLength+1)).val(actsPrecede[sapLength].name);
                    $("#SAPDropDownButtonAt" + lineObj.lineNumber + "And" + (sapLength+1)).text(actsPrecede[sapLength].name);
                    $("#SAPTextAt" + lineObj.lineNumber + "And" + (sapLength+1)).val( findSpeechActDescription(actsPrecede[sapLength].name) );
                    $("#SAPTextAt" + lineObj.lineNumber + "And" + (sapLength+1)).text( findSpeechActDescription(actsPrecede[sapLength].name) );

                    $("#SAPslider-rangeAt" + lineObj.lineNumber + "And" + (sapLength+1)).slider("value", actsPrecede[sapLength].slider);

                    $("#SAPAmountAt"+lineObj.lineNumber+"And"+(sapLength+1)).val(actsPrecede[sapLength].slider);

                    $("#SAPSpeakerDropDownButtonAt" + lineObj.lineNumber + "And" + (sapLength+1)).val(actsPrecede[sapLength].direction);
                    $("#SAPSpeakerDropDownButtonAt" + lineObj.lineNumber + "And" + (sapLength+1)).text(actsPrecede[sapLength].direction);
                }
            }
        }

        //Speech Acts that can Follow
        if(line.speech_acts_that_can_follow.speech_act !== undefined){
            if( line.speech_acts_that_can_follow.speech_act.length !== undefined || line.speech_acts_that_can_follow.speech_act.slider >= 0){
                var actsFollow = line.speech_acts_that_can_follow.speech_act;
                if(line.speech_acts_that_can_follow.speech_act.slider >= 0) actsFollow = [actsFollow];
                $("#SpeechActsFollowProp" + lineObj.lineNumber).trigger("click");
                for(var safLength = 0; safLength < actsFollow.length; safLength++){
                    $("#SpeechActsFollowPlusButton" + lineObj.lineNumber).trigger("click");
                    $("#SAFDropDownButtonAt" + lineObj.lineNumber + "And" + (safLength+1)).val(actsFollow[safLength].name);
                    $("#SAFDropDownButtonAt" + lineObj.lineNumber + "And" + (safLength+1)).text(actsFollow[safLength].name);
                    $("#SAFTextAt" + lineObj.lineNumber + "And" + (safLength+1)).val( findSpeechActDescription(actsFollow[safLength].name) );
                    $("#SAFTextAt" + lineObj.lineNumber + "And" + (safLength+1)).text( findSpeechActDescription(actsFollow[safLength].name) );

                    $("#SAFslider-rangeAt" + lineObj.lineNumber + "And" + (safLength+1)).slider("value", actsFollow[safLength].slider);

                    $("#SAFAmountAt"+lineObj.lineNumber+"And"+(safLength+1)).val(actsFollow[safLength].slider);

                    $("#SAFSpeakerDropDownButtonAt" + lineObj.lineNumber + "And" + (safLength+1)).val(actsFollow[safLength].direction);
                    $("#SAFSpeakerDropDownButtonAt" + lineObj.lineNumber + "And" + (safLength+1)).text(actsFollow[safLength].direction);
                }
            }
        }

        //Strict Dependence
        if(line.lines_strictly_depended_on.line !== undefined){
            var dependencies = line.lines_strictly_depended_on.line;
            $("#StrictDependenceProp" + lineObj.lineNumber).trigger("click");
            if(dependencies.dependence !== undefined) dependencies = [dependencies];
            for(var dLength = 0; dLength < dependencies.length; dLength++){
                $("#StrictDependencePlusButton" + lineObj.lineNumber).trigger("click");

                var lineNum = 0;
                for(var l = 0; l < lines.length; l++){
                    if(dependencies[dLength].dependence === lines[l].id){
                        lineNum = l;
                        break;
                    }
                    if(l === lines.length - 1){
                        alert("Dependencies don't work. Report this bug.");
                    }
                }

                $("#SDDropDownButtonAt" + lineObj.lineNumber + "And" + (dLength+1)).val((lineNum+1) + ".<b>" + lines[lineNum].speaker + "</b>:"+ lines[lineNum].body);
                $("#SDDropDownButtonAt" + lineObj.lineNumber + "And" + (dLength+1)).html((lineNum+1) + ".<b>" + lines[lineNum].speaker + "</b>:"+ lines[lineNum].body);
            }
        }

        //Story World Transmissions
        if(line.transmissions.transmission !== undefined){
            if( line.transmissions.transmission.length !== undefined || line.transmissions.transmission.slider >= 0){
                var myTransmissions = line.transmissions.transmission;
                if(line.transmissions.transmission.slider >= 0) myTransmissions = [myTransmissions];
                $("#StoryWorldTransmissionsProp" + lineObj.lineNumber).trigger("click");
                for(var swtLength = 0; swtLength < myTransmissions.length; swtLength++){
                    $("#StoryWorldTransmissionsPlusButton" + lineObj.lineNumber).trigger("click");

                    //class
                    $("#SWTDropDownAt"+lineObj.lineNumber+"And"+(swtLength+1)).find("li a:equals('"+myTransmissions[swtLength].type+"')").trigger("click");

                    //type
                    $("#SWTDropDownNested1At" + lineObj.lineNumber + "And" + (swtLength+1)).find("li a:equals('"+myTransmissions[swtLength].name+"')").trigger("click");

                    //first
                    $("#SWTDropDownNested3At" + lineObj.lineNumber + "And" + (swtLength+1)).find("li a:equals('"+myTransmissions[swtLength].first+"')").trigger("click");

                    //second
                    $("#SWTDropDownNested4At" + lineObj.lineNumber + "And" + (swtLength+1)).find("li a:equals('"+myTransmissions[swtLength].second+"')").trigger("click");

                    //slider
                    $("#SWTslider-rangeAt" + lineObj.lineNumber + "And" + (swtLength+1)).slider("value", myTransmissions[swtLength].slider);
                    $("#SWTAmountAt"+lineObj.lineNumber+"And"+(swtLength+1)).val(myTransmissions[swtLength].slider);

                    if(myTransmissions[swtLength].slider <= 30){
                        $("#SWTTypeOfStrength"+lineObj.lineNumber+"And"+(swtLength+1)).text("This transmission is only a dependency");
                    } else if(myTransmissions[swtLength].slider > 30 && myTransmissions[swtLength].slider < 70){
                        $("#SWTTypeOfStrength"+lineObj.lineNumber+"And"+(swtLength+1)).text("This transmission is of medium strength");
                    } else if(myTransmissions[swtLength].slider >= 70 ){
                        $("#SWTTypeOfStrength"+lineObj.lineNumber+"And"+(swtLength+1)).text("This transmission is a proper transmission");
                    }


                }
            }
        }

        //Story World Contradictions
        if(line.contradictions.contradiction !== undefined){
            if(line.contradictions.contradiction.length !== undefined || line.contradictions.contradiction.name !== undefined){
                var myContradictions = line.contradictions.contradiction;
                if(line.contradictions.contradiction.name !== undefined) myContradictions = [myContradictions];
                $("#StoryWorldContradictionsProp" + lineObj.lineNumber).trigger("click");
                for(var swcLength = 0; swcLength < myContradictions.length; swcLength++){
                    $("#StoryWorldContradictionsPlusButton" + lineObj.lineNumber).trigger("click");

                    //class
                    $("#SWCDropDownAt"+lineObj.lineNumber+"And"+(swcLength+1)).find("li a:equals('"+myContradictions[swcLength].type+"')").trigger("click");

                    //type
                    $("#SWCDropDownNested1At"+lineObj.lineNumber+"And"+(swcLength+1)).find("li a:equals('"+myContradictions[swcLength].name+"')").trigger("click");

                    //first
                    $("#SWCDropDownNested3At"+lineObj.lineNumber+"And"+(swcLength+1)).find("li a:equals('"+myContradictions[swcLength].first+"')").trigger("click");

                    //second
                    $("#SWCDropDownNested4At"+lineObj.lineNumber+"And"+(swcLength+1)).find("li a:equals('"+myContradictions[swcLength].second+"')").trigger("click");

                    //Cleanup and disable auto-filled elements
                    //Possibly account for auto-filled elements in the future?
                    $("#StoryWorldContradictionsItemAt"+lineObj.lineNumber+"And"+(swcLength+1)).removeAttr("auto");
                }
                //More cleanup stuff, get rid of all empty SWC Items
                var contradictionListItems = $("#StoryWorldContradictionsListGroup" + lineObj.lineNumber).find("li.clearfix");
                for(var swcLen = 0; swcLen < contradictionListItems.length; swcLen++){
                	var item = contradictionListItems[swcLen];
                	if($("#SWCDropDownButtonAt"+lineObj.lineNumber+"And"+(swcLen+1)).text().search("Select Transmission Type") === 0 ){
                		item.remove();
                	}
                }
            }
        }


    }

};

function findSpeechActDescription(actName){
    for(var i = 0; i < speechActs.length; i++){
        var act = speechActs[i];

        if(act.name === actName){
            return act.description;
        }
    }
    alert("This is a bug related to finding the right speech act. Please report this.");
}

function findSpeechAct(actName){
    for(var i = 0; i < speechActs.length; i++){
        var act = speechActs[i];

        if(act.name === actName){
            return act;
        }
    }
    alert(actName+" is not a speech act. This is a bug related to finding the right speech act. Please report this.");
}

function findTransmissionType(typeName){
    for(var i=0; i < transmissions.length; i++){
        var transmissionType = transmissions[i];

        if(transmissionType.class === typeName){
            return transmissionType;
        }
    }
    alert(typeName+" is not a transmission type. This is a bug related to finding the right transmission type. Please report this.");
}

function findTransmission(typeName, transmissionName){
    var transmissionType = findTransmissionType(typeName);
    for(var i = 0; i < transmissionType.types.length; i++){
        var transmission = transmissionType.types[i];
        if(transmission.operator === transmissionName){
            return transmission;
        }
    }
    alert(transmissionName+" is not a transmission name. This is a bug related to finding the right transmission name. Please report this.");
}

//Add pseudo function to replace 'contains' selector
//Usage, $('li:equals("Blah")') --> will find all 'li' divs with the innerHTML as exactly "Blah"
$.expr[':'].equals = $.expr.createPseudo(function(arg) {
    return function( elem ) {
        return $(elem).text().match("^" + arg + "$");
    };
});