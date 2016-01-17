module.exports = function($routeParams, $http, $sce, $scope, $q) {
  $scope.domString = '';

  let vm = this,
      mergeSortObjects = require('./../helpers/mergeSort'), 
      makeDomString = require('./../helpers/makeDomString'),
      chapterGET = $http({method: 'GET', url: 'https://drdummy.firebaseio.com/chapters.json/', cache: 'true'}),
      annotationGET = $http({method: 'GET', url: 'https://drdummy.firebaseio.com/annotations.json/', cache: 'true'}),

      annotations = [],
      chapterString = "",
      cleanDomString = '';
     
  vm.newAnnotation = '';
  vm.newAnnotationContent = '';
  vm.selectedNewAnnotation = '';
  vm.content = "selection";
  vm.category = "category";
  vm.id = "";
  vm.data = "";

  $q.all([chapterGET, annotationGET]).then(function(response){
    for (let i in response[0].data){
      if(response[0].data[i].chapter == $routeParams.chapter){
        chapterString = response[0].data[i].text;
      }
    }
    for (let i in response[1].data) {
      if(!response[1].data[i].key){response[1].data[i].key = i};
      annotations.push(response[1].data[i]);
    }
    annotations = mergeSortObjects(annotations);
    $scope.domString = makeDomString(chapterString, annotations);
    cleanDomString = $scope.domString.slice();
  });  

  vm.click = function (arg) {
    vm.category = arg.path[0].className.replace('ng-scope','').trim();
    vm.content = document.getElementById(arg.path[0].id).innerText;
    vm.id = arg.path[0].id;
  }

  vm.clicktwo = function (arg) {
    vm.id = arg.path[0].id;
    vm.newAnnotationContent = document.getElementById(arg.path[0].id).innerText;
  }    

  vm.addAnnotation = function(){
    let ref = new Firebase("https://drdummy.firebaseio.com/annotations/");
    if(vm.category == "category"){window.alert("Please Select a Category"); return null;}
    ref.push({
      category: vm.category,
      content: vm.newAnnotationContent,
      start : parseInt(vm.id),
      end: parseInt(vm.id) + vm.newAnnotationContent.length -1
    });
  }

  vm.update = function () {
    document.getElementById(vm.id).className = vm.category;
    let ref = new Firebase("https://drdummy.firebaseio.com/annotations/"+ vm.id +"/category");
    ref.set(vm.category);
  }

  vm.remove = function () {
    let ref = new Firebase("https://drdummy.firebaseio.com/annotations/"+ vm.id);
    ref.set(null);
    document.getElementById(vm.id).className = null;
  }

  vm.viewjson = function () {
    console.log("Annotations :", annotations);
  }

  vm.clear = function () {
    $scope.domString  = cleanDomString.slice();
    vm.newAnnotation = '';
  }

  document.ondblclick = function () {
    vm.newAnnotation = (document.selection && document.selection.createRange().text) ||
      (window.getSelection && window.getSelection().toString());
    vm.findAnnotation();
    $scope.$apply();
  };    

  vm.findAnnotation = function () {
    if(vm.newAnnotation.length < 3){return null};
    let string = document.getElementById('allText').innerText;
    let indexes = getAllIndexes(string, vm.newAnnotation);
    let stringLenth = vm.newAnnotation.length;
    //new string we will save to dom
    let newString = '';
    //get string up to first index
    newString += string.slice(0, indexes[0]);
    newString += `<span id= ${indexes[0]} class=MAYBE ng-click= vm.clicktwo($event)> ${vm.newAnnotation} </span>`;
    for(let i = 1; i < indexes.length; i++){
      newString += string.slice(indexes[i - 1] + stringLenth, indexes[i]);
      newString += `<span id= ${indexes[i]} class=MAYBE ng-click=vm.clicktwo($event)> ${vm.newAnnotation} </span>`;
    }
    newString += string.slice(indexes[indexes.length - 1]);
    $scope.domString = newString.slice();
  }

  function getAllIndexes(string, val) {
    let indexes = [], i;
    indexes.push(string.indexOf(val));
    while(true){
      let index = string.indexOf(val, indexes[indexes.length - 1] + 1);
      if (index > -1){ indexes.push(index); }
      else { return indexes; }
    }
  }
}