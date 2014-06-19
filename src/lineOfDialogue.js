function LineOfDialogue(lineNum){

    //Class to represent each line of dialogue

    this.lineNumber = lineNum.toString();

    this.speaker = "";

    this.text = "";

    this.annotationData = new AnnotationData(lineNum);


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
        textForDropdown = textForDropdown + " <li role='presentation'><a role='menuitem' tabindex='-1' style='cursor:default;' color='"+propertyType.color+"'  id='"+propertyType.id+"Prop"+this.lineNumber+"'><h4>"+propertyType.name+"</h4> -- "+propertyType.description+"</a></li>";

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
                $("#PropertiesDropDown" + lineNum).hide();
            }

            //add the property to annotationData
            main.findLine(lineNum).annotationData.addProperty(id);

            //Add the list-group for the property
            $("#Properties"+lineNum).append("<ul class='list-group' id='"+id+"ListGroup"+lineNum+"'><li class='list-group-item' style='color:white; background-color: "+color+"; border-color: "+color+";'><h4 class='list-group-item-heading' style='color:white'>"+name+"<button type='button' id='"+id+"ListGroupClose"+lineNum+"' class='close' aria-hidden='true'>&times;</button></h4>"+desc+"</li><a  class='list-group-item' id='"+id+"PlusButton"+lineNum+"'>+</a></ul>");
            //Add a 'click' listener for the plus button in that list group
            //Logic for different formats is in the propertyTable object (defined in PropertyTable.js)
            $("#"+id+"ListGroup"+lineNum).on('click', 'a', function(){

                if(this.id.search("PlusButton") != -1){
                    //retrieve id and lineNum
                    var id = this.id.replace("PlusButton", "");
                    id = id.replace(/(\d+)/g, "");
                    var lineNum = this.id.replace(/([A-Z]+)/g, "");
                    lineNum = lineNum.replace(/([a-z]+)/g, "");

                    //add 1 to the length in annotationData
                    main.findLine(lineNum).annotationData[id].length++;
                    //get the length
                    var listGroupLength = main.findLine(lineNum).annotationData[id].length.toString();

                    //Define the html code to be added, including a new plus button
                    var breadOne = "<li class='list-group-item' id='"+id+"ItemAt"+lineNum+"And"+listGroupLength+"'>  <div class='row'> <div class='col-md-10'>";
                    var insides = propertyTable.addHTML(id, lineNum, listGroupLength);
                    var breadTwo = "</div> <div class='col-md-1'> <button type='button' id='"+id+"ItemCloseAt"+lineNum+"And"+listGroupLength+"' class='close' aria-hidden='true'>&times;</button></div></div> </li>";

                    //Some properties can't have more than 1 members,
                    //this exception doesn't add a plus button if it's that kind of property
                    if(id != "SocialExchangeIdentities"){
                        breadTwo = breadTwo + " <a  class='list-group-item' id='"+id+"PlusButton"+lineNum+"'>+</a> ";
                    }

                    //append the code
                    $("#"+id+"ListGroup"+lineNum).append(breadOne + insides + breadTwo);

                    //remove the old plus button
                    var plusButton = $("#"+id+"PlusButton"+lineNum);
                    plusButton.remove();

                    //Set listeners for that particular property id
                    propertyTable.setListeners(id, lineNum, listGroupLength);

                    //Set one more listener for the close button of the list group item that was just created
                    //#nestedListeners2014
                    $("#"+id+"ItemCloseAt"+lineNum+"And"+listGroupLength).on('click', function(){
                        //get id, lineNum, and length
                        var props = this.id.split("ItemCloseAt");
                        var nums = props[1].split("And");
                        var id = props[0];
                        var lineNum = nums[0];
                        var length = nums[1];

                        //The flip side to removing the plus button,
                        //Add it if the property would be empty otherwise
                        if($("#"+id+"ListGroup"+lineNum).children().length == 2){
                            $("#"+id+"ListGroup"+lineNum).append(" <a  class='list-group-item' id='"+id+"PlusButton"+lineNum+"'>+</a> ");
                        }

                        //Remove the list item
                        $("#"+id+"ItemAt"+lineNum+"And"+length).remove();

                    });

                }


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

                //remove the property from annotationData
                main.findLine(lineNum).annotationData.removeProperty(id);

                //remove the entire listgroup
                $("#"+id+"ListGroup"+lineNum).remove();

                //If the dropdown is hidden, unhide it
                $("#PropertiesDropDown" + lineNum).show();

                //add the correct property back into the dropdown
                $("#PropertiesDropDownInner"+lineNum).append(" <li role='presentation'><a role='menuitem' tabindex='-1' color='"+propertyType.color+"'  id='"+propertyType.id+"Prop"+lineNum+"'><h4>"+propertyType.name+"</h4> -- "+propertyType.description+"</a></li>");
            });
            }
        });

    //


};

//updates the line's properties every 100 ms, pulls data into the structure
LineOfDialogue.prototype.update = function(){
    //if speaker drop down isn't "select speaker", set the speaker to the speaker drop down
    if($("#SpeakerDropDownButton"+this.lineNumber).html().search("Select") == -1) this.speaker=$("#SpeakerDropDownButton"+this.lineNumber).html();

    //if the textarea isn't "Enter Dialogue here", set the text to the html
    if($("#TextArea"+this.lineNumber).val().search("Enter Dialogue here") == -1) this.text=$("#TextArea"+this.lineNumber).val();

    //Also pull data into the annotationData object with its own update method
    this.annotationData.update();

};