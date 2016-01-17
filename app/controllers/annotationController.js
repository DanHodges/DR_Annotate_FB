module.exports = function($routeParams, $http, $sce, $scope) {
  var mergeSortObjects = require('./../helpers/mergeSort');
  var makeDomString = require('./../helpers/makeDomString');
  var vm = this;
  var annotations = [];
  var chapterString = "";
  vm.newAnnotation = '';
  vm.newAnnotationContent = '';
  vm.selectedNewAnnotation = '';
  var cleanDomString = '';
  $scope.domString = '';
  vm.content = "selection";
  vm.category = "category";
  vm.id = "";
  vm.data = "";
  console.log("hello annotationController");

  $http.get("https://drdummy.firebaseio.com/chapters.json/")
    .then(function(response) {
      console.log('response :', response);
      for (var i in response.data){
        if(response.data[i].chapter == $routeParams.chapter){
          chapterString = response.data[i].text;
          console.log("chapterString :", chapterString.slice(0, 10));
        }}
    }, function (error) {
      vm.errorMessage = "Failed to load data " + error;
      console.log("first error");
    })
    .finally(function () {
        $http.get("https://drdummy.firebaseio.com/annotations.json/")
          .then(function (response) {
            console.log("annotations response :", response);
            for (var i in response.data) {
              if(!response.data[i].key){response.data[i].key = i};
              annotations.push(response.data[i]);
            }
            annotations = mergeSortObjects(annotations);
            $scope.domString = makeDomString(chapterString, annotations);
            cleanDomString = $scope.domString.slice();
          }, function (error) {
            vm.errorMessage = "Failed to load data " + error;
          });
    });


  vm.click = function (arg) {
    vm.category = arg.path[0].className.replace('ng-scope','').trim();
    vm.content = document.getElementById(arg.path[0].id).innerText;
    vm.id = arg.path[0].id;
  }
  vm.clicktwo = function (arg) {
    console.log("arg" );
    vm.id = arg.path[0].id;
    vm.newAnnotationContent = document.getElementById(arg.path[0].id).innerText;
    console.log(vm.newAnnotationContent);
  }    

  vm.addAnnotation = function(){
    var ref = new Firebase("https://drdummy.firebaseio.com/annotations/");
    if(vm.category == "category"){window.alert("Please Select a Category"); return null;}
    ref.push({
      category: vm.category,
      content: vm.newAnnotationContent,
      start : parseInt(vm.id),
      end: parseInt(vm.id) + vm.newAnnotationContent.length -1
    });
    console.log({
      category: vm.category,
      content: vm.newAnnotationContent,
      start : parseInt(vm.id),
      end: parseInt(vm.id) + vm.newAnnotationContent.length -1
    });
  }

  vm.update = function () {
    document.getElementById(vm.id).className = vm.category;
    var ref = new Firebase("https://drdummy.firebaseio.com/annotations/"+ vm.id +"/category");
    ref.set(vm.category);
    //console.log("update", vm.id, vm.category);
  }

  vm.remove = function () {
    var ref = new Firebase("https://drdummy.firebaseio.com/annotations/"+ vm.id);
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
    console.log(vm.newAnnotation);
  };    

  vm.findAnnotation = function () {
    console.log("findAnnotation");
    if(vm.newAnnotation.length < 3){console.log("null");return null};
    var string = document.getElementById('allText').innerText;
    var indexes = getAllIndexes(string, vm.newAnnotation);
    var stringLenth = vm.newAnnotation.length;
    //new string we will save to dom
    var newString = '';
    //get string up to first index
    newString += string.slice(0, indexes[0]);
    newString += '<span id="' + indexes[0] + '"' +' class=' + "'" + "MAYBE" + "' " 
    + 'ng-click=' +'"' + 'vm.clicktwo($event)' + '"'
    +'>' + vm.newAnnotation  + '</span>';
    for(var i = 1; i < indexes.length; i++){
      newString += string.slice(indexes[i - 1] + stringLenth, indexes[i]);
      newString += '<span id="' + indexes[i] + '" ' + ' class=' + "'" + "MAYBE" + "' " 
      + 'ng-click=' +'"' + 'vm.clicktwo($event)' + '"' + '>' 
      + vm.newAnnotation  + '</span>';
    }
    newString += string.slice(indexes[indexes.length - 1]);
    console.log("newString :", newString);
    $scope.domString = newString.slice();
  }

  function getAllIndexes(string, val) {
    var indexes = [], i;
    indexes.push(string.indexOf(val));
    while(true){
      var index = string.indexOf(val, indexes[indexes.length - 1] + 1);
      if (index > -1){
        indexes.push(index);
      }
      else {
        console.log(indexes);
        return indexes;
      }
    }
  }
} //editChapterController CLOSE