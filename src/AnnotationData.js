//Class for holding the annotation data of a line
function AnnotationData(lineNum){
    this.lineNum = lineNum.toString();

}

//add the property of the type passed in
AnnotationData.prototype.addProperty = function(id){
    this[id] = new Property(this.lineNum);
};

//remove the property of the type passed in
AnnotationData.prototype.removeProperty = function(id){
    this[id] = null;
};

//runs every time the parent "update" is called,
//should run a seperate function for each property type
AnnotationData.prototype.update = function(){

  //If there's an object labelled "SocialExchangeIdentities", update it
  if(this["SocialExchangeIdentities"] != null){
      this["SocialExchangeIdentities"].seiUpdate();
  }
  //If there's an object labelled "SocialExchangeOutcomes", update it
  if(this["SocialExchangeOutcomes"] != null){
      this["SocialExchangeOutcomes"].seoUpdate();
  }
  //If there's an object labelled "SpeechActs", update it
  if(this["SpeechActs"] != null){
      this["SpeechActs"].saUpdate();
  }

  //If there's an object labelled "SpeechActsPrecede", update it
  if(this["SpeechActsPrecede"] != null){
      this["SpeechActsPrecede"].sapUpdate();
  }

  //If there's an object labelled "SpeechActsPrecede", update it
  if(this["SpeechActsFollow"] != null){
      this["SpeechActsFollow"].safUpdate();
  }

  //If there's an object labelled "StrictDependence", update it
  if(this["StrictDependence"] != null){
      this["StrictDependence"].sdUpdate();
  }

  //If there's an object labelled "StoryWorldTransmissions", update it
  if(this["StoryWorldTransmissions"] != null){
      this["StoryWorldTransmissions"].swtUpdate();
  }

  //If there's an object labelled "StoryWorlContradictions", update it
  if(this["StoryWorldContradictions"] != null){
      this["StoryWorldContradictions"].swcUpdate();
  }

};




/*
*
* Property is a subclass of AnnotationData
*
*/


//Class that holds the info of the property that is being looked for
function Property(lineNum){
    //Length of the listgroup, how many elements are in this listGroup for this
    //property at this particular line
    this.length = 0;

    //line Number
    this.lineNum = lineNum;

    //Value of the property, this is type specific. It will hold
    //different types of info depending on the property type
    this.val = {};
}


//Updates the property value for "SocialExchangeIdentities"
Property.prototype.seiUpdate = function(){
    //Iterate through each listgroup item
    for(var i=1; i<this.length+1; i++){

        //Get the jquery object
        var property = $("#SEIDropDownButtonAt" + this.lineNum + "And" + i);

        //If the property doesn't contain the default, it exists, and the text isn't
        //equal to its last value, set the value to the property text
        if(property.text().search("Select Exchange Type") == -1 && property.length && property.text() !== this.val){
            this.val = property.text();
        }
    }

    //this.val data structure:
    //class val (string)
};

//Updates the property value for "SocialExchangeOutcomes"
Property.prototype.seoUpdate = function(){
	//Iterate through each listgroup item
	for(var i = 1; i < this.length+1; i++){

		//Get the jquery objects
		var property = $("#SEODropDownButtonAt" + this.lineNum + "And" + i);
		var text = $("#SEOTextAt" + this.lineNum + "And" + i);

		//assign the outcome value
		if(property.text().search("Select Exchange Outcome") == -1 && property.length && property.text() !== this.val.outcome){
            this.val.outcome = property.text();
        }

		//assign the intent values
		if(text.text().search("Select exchange identity and outcome to generate intent") == -1 && text.length && text.html() !== this.val.intent){
			var intent = text.html();

			var valArray = intent.match(/>(\w)* </gi);

			var val;
			for(var j=0; j < valArray.length; j++){
				val = valArray[j];
				val = val.replace(">", "");
				val = val.replace("<", "");
				val = val.replace(" ", "");
				valArray[j] = val;
			}

			this.val.subject = valArray[0];
			this.val.verb = valArray[1];
			this.val.object = valArray[2];

		}

	}

	//this.val data structure:
    //class val:
	//	string outcome //(accept/reject)
	//	string subject //(intent subject)
	//	string verb //(intent verb)
	//	string object //(intent object)
};

//Updates the property value for "SpeechActs"
Property.prototype.saUpdate = function(){

    //First initialize this.val as an array
    if(!this.val.length) this.val = [];

    //Iterate through each listgroup item
    for(var i = 1; i < this.length+1; i++){

        //Get the jquery object
        var act = $("#SADropDownButtonAt" + this.lineNum + "And" + i);

        //(do some upkeep on the array)
        if(i > this.val.length) this.val.push({});

        //assign the act value
        if(act.text().search("Select Speech Act") == -1 && act.length && act.text() !== this.val[i]){
            this.val[i-1] = act.text();
        }
        if(!act.length) this.val[i-1] = "";


    }

    //this.val data structureL:
    //[
    //string speechAct1,
    //string speechAct2,
    //...
    //
    //]
};

//Updates the property value for "SpeechActsPrecede"
Property.prototype.sapUpdate = function(){

    //First initialize this.val as an array
    if(!this.val.length) this.val = [];

    //Iterate through each listgroup item
    for(var i = 1; i < this.length+1; i++){

        //Get the jquery object
        var act = $("#SAPDropDownButtonAt" + this.lineNum + "And" + i);

        //(do some upkeep on the array)
        if(i > this.val.length) this.val.push({});

        //assign the act value
        if(act.text().search("Select Speech Act") == -1 && act.length && act.text() !== this.val[i-1]){
            this.val[i-1] = {"name": act.text(),
                             "slider": $("#SAPslider-rangeAt" + this.lineNum + "And" + i).slider("value"),
                             "direction": $("#SAPSpeakerDropDownButtonAt" + this.lineNum + "And" + i).text() };
        }
        if(!act.length) this.val[i-1] = {};


    }

    //this.val data structure:
    //[
    //{ string speechAct, int sliderStrength, string direction},
    //{ string speechAct, int sliderStrength, string direction},
    //...
    //
    //]
};

//Updates the property value for "SpeechActsFollow"
Property.prototype.safUpdate = function(){

    //First initialize this.val as an array
    if(!this.val.length) this.val = [];

    //Iterate through each listgroup item
    for(var i = 1; i < this.length+1; i++){

        //Get the jquery object
        var act = $("#SAFDropDownButtonAt" + this.lineNum + "And" + i);

        //(do some upkeep on the array)
        if(i > this.val.length) this.val.push({});

        //assign the act value
        if(act.text().search("Select Speech Act") == -1 && act.length && act.text() !== this.val[i-1]){
            this.val[i-1] = {"name": act.text(),
                             "slider": $("#SAFslider-rangeAt" + this.lineNum + "And" + i).slider("value"),
                             "direction": $("#SAFSpeakerDropDownButtonAt" + this.lineNum + "And" + i).text()} ;
        }
        if(!act.length) this.val[i-1] = {};


    }

    //this.val data structure:
    //[
    //{ string speechAct, int sliderStrength, string direction},
    //{ string speechAct, int sliderStrength, string direction},
    //...
    //
    //]
};

//Updates the property value for "StrictDependence"
//Also, updates the dropdown to reflect line properties
Property.prototype.sdUpdate = function(){

    //First initialize this.val as an array
    if(!this.val.length) this.val = [];

     for(var k = 1; k < this.length+1; k++){
        //next pull all of the lineNumber pointers into an array at this.val
        var buttonText = $("#SDDropDownButtonAt"+this.lineNum+"And"+k).text();
        //array upkeep
        if( k > this.val.length) this.val.push({});
        //If the line content matches the value, get the line Number
        var trigger = true;
        for(var u = 0; u<main.linesOfDialogue.length; u++){
            var line =  main.linesOfDialogue[u];

            var fromTheLine = (main.linesOfDialogue.indexOf(line)+1).toString() + "." + line.speaker + ":" + line.text;
            if(fromTheLine === buttonText){
                this.val[k-1].lineNumber = line.lineNumber;
                if( main.linesOfDialogue.indexOf( main.findLine(this.val[k-1].lineNumber) ) === main.linesOfDialogue.indexOf( main.findLine(this.lineNum) ) - 1 ){
                    this.val[k-1].directPrecedence = true;
                } else {
                    this.val[k-1].directPrecedence = false;
                }
                trigger = false;
                break;
            }
        }

        //If Button hasn't been clicked on, even once, we don't update the text
        if(buttonText.search("Select Line") !== -1) trigger = false;

        //If we are unable to find a value that matches, then we change the button
        //content to reflect changes
        if(trigger){
            var daLine = -1;
            for(var i=0; i < main.linesOfDialogue.length; i++){
                if(main.linesOfDialogue[i].lineNumber === this.val[k-1]) daLine = main.linesOfDialogue[i];
            }

            if(this.val[k-1] !== -1 && daLine !== -1){
                $("#SDDropDownButtonAt"+this.lineNum+"And"+this.length).html((main.linesOfDialogue.indexOf(daLine)+1).toString()+".<b style='font-size:15px;'>"+daLine.speaker+"</b>:"+daLine.text);
            } else {
                $("#SDDropDownButtonAt"+this.lineNum+"And"+this.length).html("Reselect Line <span class='caret'></span>");
            }
        }
    }

    //this.val data structure:
    //[
    //{int lineNumber, bool directPrecedence},
    //{int lineNumber, bool directPrecedence}
    //...
    //
    //]


};


//Updates the property value for "StoryWorldTransmissions"
Property.prototype.swtUpdate = function(){
    //First initialize this.val as an array
    if(!this.val.length) this.val = [];

    //Iterate through each listgroup item
    for(var i = 1; i < this.length+1; i++){

    	//Get the class
    	var cls = $("#SWTDropDownButtonAt" + this.lineNum + "And" + i);

        //Get the type
        var type = $("#SWTDropDownButtonNested1At" + this.lineNum + "And" + i);

        //Get the first
        var first = $("#SWTDropDownButtonNested3At" + this.lineNum + "And" + i);

        //Get the second
        var second = $("#SWTDropDownButtonNested4At" + this.lineNum + "And" + i);

        //(do some upkeep on the array)
        if(i > this.val.length) this.val.push({});

        //assign the transmission value
        if(type.text().search("Select Transmission") == -1 && type.length && type.text() !== this.val[i-1]){
            this.val[i-1] = {
            		"class":cls.text(),
            		"type": type.text(),
            		"first": first.text(),
            		"second": second.text(),
            		"slider":$("#SWTslider-rangeAt" + this.lineNum + "And" + i).slider("value")
            		};
        }
        if(!type.length) this.val[i-1] = {};


    }

    //this.val data structure:
    //[
    //{string class, string type, string first, string second, int sliderValue},
    //{string class, string type, string first, string second, int sliderValue},
    //...
    //
    //]
};

//Updates the property value for "StoryWorldContradictions"
Property.prototype.swcUpdate = function(){
    //First initialize this.val as an array
    if(!this.val.length) this.val = [];

    //Iterate through each listgroup item
    for(var i = 1; i < this.length+1; i++){

    	//Get the class
    	var cls = $("#SWCDropDownButtonAt" + this.lineNum + "And" + i);

        //Get the type
        var type = $("#SWCDropDownButtonNested1At" + this.lineNum + "And" + i);

        //Get the first
        var first = $("#SWCDropDownButtonNested3At" + this.lineNum + "And" + i);

        //Get the second
        var second = $("#SWCDropDownButtonNested4At" + this.lineNum + "And" + i);

        //(do some upkeep on the array)
        if(i > this.val.length) this.val.push({});

        //assign the transmission value
        if(type.text().search("Select Transmission") == -1 && type.length && type.text() !== this.val[i-1]){
            this.val[i-1] = {
            		"class":cls.text(),
            		"type": type.text(),
            		"first": first.text(),
            		"second": second.text()
            		};
        }
        if(!type.length) this.val[i-1] = {};


    }

    //this.val data structure:
    //[
    //{string class, string type, string first, string second},
    //{string class, string type, string first, string second},
    //...
    //
    //]
};