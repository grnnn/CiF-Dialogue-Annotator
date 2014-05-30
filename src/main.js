function Main(){

	//place initialization code here
	//and here

	this.currentLineNumber = 0;

	this.linesOfDialogue = [];
	this.linesOfDialogue.push(new LineOfDialogue(1));

}

Main.prototype.update = function(){
	for(var lineNum = 0; lineNum < this.linesOfDialogue.length; lineNum++){
        var line = this.linesOfDialogue[lineNum];
        line.update();
	}
};

Main.prototype.addLine = function(){
    this.currentLineNumber++;
    this.linesOfDialogue.push(new LineOfDialogue(this.currentLineNumber));
};




/*
Event listeners and html/jquery code goes here
*/
$(function(){

    $(".dropdown-menu").on('click', 'li a', function(){
      $(".btn:first-child").text($(this).text());
      $(".btn:first-child").val($(this).text());
   });

});

$(function(){
    $(".list-group").on('click', 'a', function(){
        var div = $(".list-group:parent");
        var div2 =  $("a");
        var partOne = "<li class='list-group-item'> <button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button> ";
        var insides = "Blue blue blue";
        var partTwo = " </li> <a href='#' class='list-group-item'>+</a>";
        div2.remove();
        div.append(partOne + insides + partTwo);
    });



});