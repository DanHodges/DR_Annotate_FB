function mergeSortObjects(array) {

  var mergeSort = function(items){
    if (items.length < 2) { return items; }
    var middle = Math.floor(items.length / 2),
      left    = items.slice(0, middle),
      right   = items.slice(middle);
    return merge(mergeSort(left), mergeSort(right));
  }

  var merge = function(left, right){
    var result  = [],
      il      = 0,
      ir      = 0;
    while (il < left.length && ir < right.length){
      if (parseInt(left[il].start) < parseInt(right[ir].start)){
          result.push(left[il++]);
      } else {
          result.push(right[ir++]);
      }
    }
    return result.concat(left.slice(il)).concat(right.slice(ir));
  }

  return mergeSort(array)
}
module.exports = mergeSortObjects;