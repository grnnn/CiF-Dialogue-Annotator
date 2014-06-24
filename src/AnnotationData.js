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
};

//Updates the property value for "SocialExchangeOutcomes"
Property.prototype.seoUpdate = function(){
	//Iterate through each listgroup item
	for(var i = 1; i < this.length+1; i++){
		
		//Get the jquery object
		var property = $("#SEODropDownButtonAt" + this.lineNum + "And" + i);
		var text = $("#SEOTextAt" + this.lineNum + "And" + i);
		
		if(property.text().search("Select Exchange Outcome") == -1 && property.length && property.text() !== this.val.outcome){
            this.val.outcome = property.text();
        }
		if(text.text().search("Select exchange identity and outcome to generate intent") == -1 && text.length && text.html() !== this.val.intent){
			this.val.intent = text.html();
			console.log(this.val.intent);
			
			var valArray = this.val.intent.match(/>(\w)* </gi);
			console.log(valArray);
			
		}
		
	}
};
