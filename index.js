'use strict';

/* global console, require */
const Immutable = require('immutable');
const faker = require('faker');
const benchmark = require('benchmark');
const suite = new benchmark.Suite;

const size = 1000000;
const half = size/2;

let list = Immutable.List();
let i = null;

for (i = 0; i < half - 1; i++) {
  list = pushValueToList(list, faker.name.findName());
}

list = pushValueToList(list, 'SearchTarget');

for (i = half; i < size; i++) {
  list = pushValueToList(list, faker.name.findName());
}

console.log('list size:', list.size);
console.log('item at middle position in list:', list.get(half - 1) );
// console.log('list:', list);

runBenchmark();

function pushValueToList(list, value) {
  return list.push(value);
}

function searchForWith_filter() {
  list.filter(obj => obj === 'SearchTarget');
}

function searchForWith_some() {
  list.some(obj => obj === 'SearchTarget');
}

function runBenchmark() {
  suite.
    add('SearchForWith#Immutable.List.filter', function() {
      searchForWith_filter();
    })
    .add('SearchForWith#Immutable.List.some', function() {
      searchForWith_some();
    })
    .on('cycle', function(event) {
      console.log(String(event.target));
    })
    .on('complete', function() {
      console.log(suite['0'].name + ': Elapsed time: ', suite['0'].times.elapsed);
      console.log(suite['1'].name + ': Elapsed time: ', suite['1'].times.elapsed);
      console.log('### Result: Fastest is ' + this.filter('fastest').map('name'));
    })
    // run async
    .run({'async': true});
}