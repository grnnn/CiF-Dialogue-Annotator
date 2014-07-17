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
    this.linesOfDialogue.push(new LineOfDialogue(this.currentLineNumber));
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
        lineObj.transmissions = "";
        if(line.annotationData["StoryWorldTransmissions"] != null){
            for(var t = 0; t < line.annotationData["StoryWorldTransmissions"].val.length; t++){
                var transmission = line.annotationData["StoryWorldTransmissions"].val[t];
                if(transmission === "") continue;
                if(t > 0) lineObj.transmissions = lineObj.transmissions + ", " + transmission;
                if(t === 0) lineObj.transmissions = transmission;
            }

        }

        //speech act precede
        lineObj.speech_act_strictly_depended_on = "";
        if(line.annotationData["SpeechActsPrecede"] != null){
            for(var sap = 0; sap < line.annotationData["SpeechActsPrecede"].val.length; sap++){
                var speechAct = line.annotationData["SpeechActsPrecede"].val[sap];
                if(speechAct === "") continue;
                if(sap > 0) lineObj.speech_act_strictly_depended_on = lineObj.speech_act_strictly_depended_on + ", " + speechAct;
                if(sap === 0) lineObj.speech_act_strictly_depended_on = speechAct;
            }

        }

        lineObj.lines_strictly_depended_on = "";

        //Likeliness of success
        lineObj.likeliness_of_success_range = line.rangeVal1.toString() + " - " + line.rangeVal2.toString();
        lineObj.range_of_next_success = line.nextRange;


        lines.line.push(lineObj);
    }

    //Set strict dependence and social exchange
    for(var j = 0; j < lines.line.length; j++){
        var line = lines.line[j];


        //strict dependence
        line.lines_strictly_depended_on = "";
        if(this.linesOfDialogue[j].annotationData["StrictDependence"] != null){
            for(var sd = 0; sd < this.linesOfDialogue[j].annotationData["StrictDependence"].val.length; sd++){
                var dependence = this.linesOfDialogue[j].annotationData["StrictDependence"].val[sd];
                if(dependence === -1) continue;
                var index = this.linesOfDialogue.indexOf(this.findLine(dependence));
                var dependence = lines.line[index].id;

                if(sd > 0) line.lines_strictly_depended_on = line.lines_strictly_depended_on + ", " + dependence;
                if(sd === 0) line.lines_strictly_depended_on = dependence;
            }
        }

        //Social Exchange
        if(line.exchange_identity_communicated !== ""){
            this.export.instantiation.social_exchange = line.exchange_identity_communicated;
            break;
        }
        else if(j === lines.line.length - 1){
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

        //TextArea
        $("#TextArea" + lineObj.lineNumber).val(line.body);

        //Range
        $( "#slider-rangeAt" + lineObj.lineNumber ).slider( "values", 0, line.likeliness_of_success_range.split(" - ")[0]);
        $( "#slider-rangeAt" + lineObj.lineNumber ).slider( "values", 1, line.likeliness_of_success_range.split(" - ")[1]);
        //Assuming that this works...test later

        //Next range
        $("#RangeDropDown"+lineObj.lineNumber).val(line.range_of_next_success.substring(0,1));
        $("#RangeDropDown"+lineObj.lineNumber).text(line.range_of_next_success.substring(0,1));
        $("#NextRange"+lineObj.lineNumber).val(line.range_of_next_success.substr(2));
        //Also assuming that this works, text later

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
            for(var seoLength = 0; seoLength < identities.length; seoLength++){
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
            }
        }

        //Speech Acts that can Precede
        if(typeof line.speech_act_strictly_depended_on !== "object"){
            var actsPrecede = line.speech_acts_strictly_depended_on.split(", ");
            $("#SpeechActsPrecedeProp" + lineObj.lineNumber).trigger("click");
            for(var sapLength = 0; sapLength < actsPrecede.length; sapLength++){
                $("#SpeechActsPrecedePlusButton" + lineObj.lineNumber).trigger("click");
                $("#SAPDropDownButtonAt" + lineObj.lineNumber + "And" + (saLength+1)).val(actsPrecede[sapLength]);
                $("#SAPDropDownButtonAt" + lineObj.lineNumber + "And" + (saLength+1)).text(actsPrecede[sapLength]);
            }
        }

        //if(typeof line.transmissions === "object") console.log(j + " is empty");


    }

};
