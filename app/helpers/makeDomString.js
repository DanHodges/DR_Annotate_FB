function makeDomString (inputString, array) {
  if(array.length < 1){ return inputString; }
  var outputString = '', length = array.length;
  if(array[0].start != 0){
    outputString+=
    inputString.substring(0, array[0].start);
  }
  for (var i = 0; i < length; i++) {
    var iPlus = i + 1, nonAnnotationStart = parseInt(array[i].end) + 1;

    if (i < length - 1) { var nonAnnotationEnd = parseInt(array[iPlus].start);  }
    outputString +=
    `<span id=${array[i].key} class=${array[i].category} start= ${array[i].start} end= ${array[i].end} ng-click=vm.click($event)>${array[i].content}</span>`;
    if (nonAnnotationStart < nonAnnotationEnd) {
      outputString += inputString.substring(nonAnnotationStart, nonAnnotationEnd); 
    }
    //need to move this outside the for loop
    if(i === length - 1 && array[i].end < inputString.length){
      outputString+= inputString.substring(nonAnnotationStart, inputString.length)
    }
  }
  return outputString;
}
module.exports = makeDomString;