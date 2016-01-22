module.exports = function($http) {
  let vm = this,
      mergeSortObjects = require('./../helpers/mergeSort');

  vm.chapters = [];

  $http.get("https://drdummy.firebaseio.com/chapters.json/")
    .then(function (response) {
      for (let i in response.data){
        vm.chapters.push({
          chapter:response.data[i].chapter,
          string:response.data[i].text
        });
      }
    }, function (error) {
      vm.errorMessage = "Failed to load data " + error;
    })
    .finally(function () {
      vm.isBusy = false;
    });
}