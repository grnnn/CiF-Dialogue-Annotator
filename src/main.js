function Main(){

    //class which does a lot of the overall logic, keeps track of all lines of dialogue

	//place initialization code here
	//and here

	this.currentLineNumber = 0;

	this.linesOfDialogue = [];
	this.addLine();

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




