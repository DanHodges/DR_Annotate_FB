module.exports = function($http) {
    var mergeSortObjects = require('./../helpers/mergeSort');
  var vm = this;
  vm.chapters = [];
  console.log('mergeSortObjects in select', mergeSortObjects);
  console.log("hello, world")
  $http.get("https://drtest.firebaseio.com/chapters.json/")
    .then(function (response) {
      for (var i in response.data){
        vm.chapters.push({
          chapter:response.data[i].chapter,
          string:response.data[i].text
        });
      }
      console.log("response :", response.data);
      console.log("vm.chapters :", vm.chapters);
    }, function (error) {
      vm.errorMessage = "Failed to load data " + error;
    })
    .finally(function () {
      vm.isBusy = false;
    });
}