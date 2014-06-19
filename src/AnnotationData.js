function Property(){
    this.length = 0;
}

function AnnotationData(lineNum){
    this.lineNumber = lineNum.toString();

}

AnnotationData.prototype.addProperty = function(id){
    this[id] = new Property();
};

AnnotationData.prototype.removeProperty = function(id){
    this[id] = null;
};

AnnotationData.prototype.update = function(){

  //Pull annotation data in here

};