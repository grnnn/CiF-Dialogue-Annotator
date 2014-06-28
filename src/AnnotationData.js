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

  if(this["SpeechActsPrecede"] != null){
      this["SpeechActsPrecede"].sapUpdate();
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