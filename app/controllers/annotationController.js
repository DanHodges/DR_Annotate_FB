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
  vm.content = "Selection";
  vm.category = "Category";
  vm.id = "";
  vm.data = "";

  $q.all([chapterGET, annotationGET]).then(function(response){
    for (let i in response[0].data){
      if(response[0].data[i].chapter == $routeParams.chapter){
        chapterString = response[0].data[i].text;
      }
    }
    // I am setting the randomly generated firebase key to be an object property on each annotation
    // I will use that key property to be the dom #ID
    for (let i in response[1].data) {
      if(!response[1].data[i].key){response[1].data[i].key = i};
      annotations.push(response[1].data[i]);
    }
    annotations = mergeSortObjects(annotations);
    $scope.domString = makeDomString(chapterString, annotations);
    cleanDomString = $scope.domString.slice();
  });  

  vm.click = function (arg) { 
    if (arg.path[0].className.includes("MAYBE")){
      vm.id = arg.path[0].id;
      console.log(arg.path[0]);
      console.log(vm.id);
      vm.newAnnotationContent = document.getElementById(arg.path[0].id).innerText.trim(); 
      console.log(vm.newAnnotationContent);
    } else {
      vm.category = arg.path[0].className.replace('ng-scope','').trim();
      vm.content = document.getElementById(arg.path[0].id).innerText;
      vm.selection = document.getElementById(arg.path[0].id).innerText;
      vm.id = arg.path[0].id;
    }
  }

  vm.addAnnotation = function(){
    vm.category = vm.category.replace('ng-scope','').trim();
    if(vm.category === ('Category' || 'MAYBE' || '')){window.alert("Please Select a Category"); return null;}
    let ref = new Firebase("https://drdummy.firebaseio.com/annotations/");
    let newAnnotation = {
      bookTitle: "Alice in Wonderland",
      chapterNumber: $routeParams.chapter,
      category: vm.category,
      content: vm.newAnnotationContent,
      start : parseInt(vm.id),
      end: parseInt(vm.id) + vm.newAnnotationContent.length -1
    }; 
    var refId = ref.push(newAnnotation);
    var key = refId.key();
    console.log(key);
    newAnnotation.key = key;
    annotations.push(newAnnotation);
    annotations = mergeSortObjects(annotations);
    $scope.domString = makeDomString(chapterString, annotations);
    cleanDomString = $scope.domString.slice();
    vm.newAnnotation = '';
    vm.content = "Selection";
    vm.category = "Category";
    vm.id = "";
  }

  vm.update = function () {
    document.getElementById(vm.id).className = vm.category;
    let ref = new Firebase("https://drdummy.firebaseio.com/annotations/"+ vm.id +"/category");
    //ref.set(vm.category);
    vm.content = "Selection";
    vm.category = "Category";
    vm.id = "";    
  }

  vm.remove = function () {
    let ref = new Firebase("https://drdummy.firebaseio.com/annotations/"+ vm.id);
    for (var i of annotations){
      // == instead of === to account for strings and such
      if(i.key == vm.id) {
        let index = annotations.indexOf(i);
        console.log('index ', index);
        annotations.splice(index, 1);
      }
    }
    annotations = mergeSortObjects(annotations);
    $scope.domString = makeDomString(chapterString, annotations);
    cleanDomString = makeDomString(chapterString, annotations);
    vm.content = "Selection";
    vm.category = "Category";
    vm.id = "";    
  }

  vm.viewjson = function () {
    console.log("Annotations :", annotations);
  }

  vm.clear = function () {
    $scope.domString  = cleanDomString.slice();
    vm.newAnnotation = '';
    vm.content = "Selection";
    vm.category = "Category";
    vm.id = "";    
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
    newString += `<span id= ${indexes[0]} class=MAYBE ng-click= vm.click($event)> ${vm.newAnnotation} </span>`;
    for(let i = 1; i < indexes.length; i++){
      newString += string.slice(indexes[i - 1] + stringLenth, indexes[i]);
      newString += `<span id= ${indexes[i]} class=MAYBE ng-click=vm.click($event)> ${vm.newAnnotation} </span>`;
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