function LineOfDialogue(lineNum){

    //Class to represent each line of dialogue

    this.lineNumber = lineNum.toString();

    this.speaker = "";

    this.text = "";


    //Initialize Base HTML
    this.baseStructureConfigure();

    //Initialize Annotation Properties
    this.propertyDropdownConfigure();


}

//Append base structure
LineOfDialogue.prototype.baseStructureConfigure = function(){
    //Superlong append that I wish I could make tidier
    $('#LinesContainer').append("<div class='row' id='Line"+this.lineNumber+"'><div class='col-md-2' ><div class='dropdown'><button type='button' class='btn btn-default dropdown-toggle'  id='SpeakerDropDownButton"+this.lineNumber+"' data-toggle='dropdown'>Select Speaker <span class='caret'></span></button><ul class='dropdown-menu' role='menu' aria-labelledby='dropdownMenu1' id='SpeakerDropDown"+this.lineNumber+"'><li role='presentation'><a role='menuitem' tabindex='-1' >Initiator</a></li><li role='presentation'><a role='menuitem' tabindex='-1' >Responder</a></li><li role='presentation'><a role='menuitem' tabindex='-1' >Outsider</a></li></ul></div></div><div class='col-md-5' ><textarea rows='5' cols='72' style='resize:vertical' id='TextArea"+this.lineNumber+"'>Enter Dialogue here</textarea></div><div class='col-md-4' id='Properties"+this.lineNumber+"' ></div><div class='col-md-1' ><div style='padding:40px'><button class='btn btn-danger'  id='RemoveLineButton"+this.lineNumber+"'>&times;</button></div> </div></div><div id='Divider"+this.lineNumber+"' class='page-header'></div>");

    //'click' listener for the Speaker dropdowns
    $("#SpeakerDropDown"+this.lineNumber).on('click', 'li a', function(){
        //get the line number
        var lineNum =  $(this).parent().parent().attr("id").replace("SpeakerDropDown", "");


        //Set the text in the Dropdown button to the selected text
        $("#SpeakerDropDownButton"+lineNum).text($(this).text());
        $("#SpeakerDropDownButton"+lineNum).val($(this).text());
    });

    $("#RemoveLineButton"+this.lineNumber).on('click', function(){
        var lineNum = this.id.replace("RemoveLineButton","");

        $("#Line" + lineNum).remove();
        $("#Divider" + lineNum).remove();
    });

}

//Append the properties, and the listeners for those properties
LineOfDialogue.prototype.propertyDropdownConfigure = function(){
    //Set all of the text for the property dropdown menu, loop through each type of property to get it
    var textForDropdown = "<div class='dropdown' id='PropertiesDropDown"+this.lineNumber+"' style='padding:15px'><button type='button' class='btn btn-default dropdown-toggle'   data-toggle='dropdown'>+ Add Type of Annotation <span class='caret'></span></button> <ul class='dropdown-menu' role='menu' id='PropertiesDropDownInner"+this.lineNumber+"' aria-labelledby='dropdownMenu1' >";
    for(var i = 0; i < propertyTypes.length; i++){
        var propertyType = propertyTypes[i];
        textForDropdown = textForDropdown + " <li role='presentation'><a role='menuitem' tabindex='-1' color='"+propertyType.color+"'  id='"+propertyType.id+"Prop"+this.lineNumber+"'><h4>"+propertyType.name+"</h4> -- "+propertyType.description+"</a></li>";

    }
    //append that text to the Property tag
    $("#Properties" + this.lineNumber).append(textForDropdown + "</ul> </div>");


    //For each label, set a 'click' listener
    //for(var i = 0; i < propertyTypes.length; i++){
        //Listener definition
        $( '#PropertiesDropDown'+this.lineNumber ).on('click','a', function(){

            if(this.id.search("Prop") != -1){
            //Pull the id, color, name, and lineNum out of the html element
            var id = this.id.replace("Prop", "");
            id = id.replace(/(\d+)/g, "");
            var lineNum = this.id.replace(/([A-Z]+)/g, "");
            lineNum = lineNum.replace(/([a-z]+)/g, "");
            var name = $(this).text().split("--")[0];
            var desc = $(this).text().split("--")[1]
            var color = $(this).attr("color");

            //Remove the button that adds that type of property
            $(this).remove();
            //if the list is empty, delete the button
            if($("#PropertiesDropDown" + lineNum).has("a").length == 0){
                $("#PropertiesDropDown" + lineNum).remove();
            }

            //Add the list-group for the property
            $("#Properties"+lineNum).append("<ul class='list-group' id='"+id+"ListGroup"+lineNum+"'><li class='list-group-item' style='color:white; background-color: "+color+"; border-color: "+color+";'><h4 class='list-group-item-heading' style='color:white'>"+name+"<button type='button' id='"+id+"ListGroupClose"+lineNum+"' class='close' aria-hidden='true'>&times;</button></h4>"+desc+"</li><a  class='list-group-item' id='"+id+"PlusButton"+lineNum+"'>+</a></ul>");
            //Add a 'click' listener for the plus button in that list group
            //Logic for different formats is in the propertyTable Hash Table (defined in index)
            $("#"+id+"ListGroup"+lineNum).on('click', 'a', function(){

                //retrieve id and lineNum
                var id = this.id.replace("PlusButton", "");
                id = id.replace(/(\d+)/g, "");
                var lineNum = this.id.replace(/([A-Z]+)/g, "");
                lineNum = lineNum.replace(/([a-z]+)/g, "");

                //Define the html code to be added, including a new plus button
                var breadOne = "<li class='list-group-item'> <button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button> ";
                var insides = propertyTable[id];
                var breadTwo = " </li> <a  class='list-group-item' id='"+id+"PlusButton"+lineNum+"'>+</a> ";

                //append the code
                $("#"+id+"ListGroup"+lineNum).append(breadOne + insides + breadTwo);

                //remove the old plus button
                var plusButton = $("#"+id+"PlusButton"+lineNum);
                plusButton.remove();
            });


            //Add a listener for closing a listgroup with the little x in the upper-right corner
            $("#"+id+"ListGroupClose"+lineNum).on('click', function(){

                //retrieve id and lineNum
                var id = this.id.replace("ListGroupClose", "");
                id = id.replace(/(\d+)/g, "");
                var lineNum = this.id.replace(/([A-Z]+)/g, "");
                lineNum = lineNum.replace(/([a-z]+)/g, "");

                //find the propertyType which corresponds to the id
                for(var i=0; i < propertyTypes.length; i++){
                    if(propertyTypes[i].id == id){
                        var propertyType = propertyTypes[i];
                        break;
                    }
                }

                //remove the entire listgroup
                $("#"+id+"ListGroup"+lineNum).remove();

                //add the correct property back into the dropdown
                $("#PropertiesDropDownInner"+lineNum).append(" <li role='presentation'><a role='menuitem' tabindex='-1' color='"+propertyType.color+"'  id='"+propertyType.id+"Prop"+lineNum+"'><h4>"+propertyType.name+"</h4> -- "+propertyType.description+"</a></li>");
            });
            }
        });

    //


};

//updates the lines properties every 100 ms
LineOfDialogue.prototype.update = function(){


};