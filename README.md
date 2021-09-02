Kx Store
===

Event-emitted Observable Store. Works like RactiveJS without the DOM/template feature.

# Installation

```
$> npm i kx-store
```

# Usage
```
var kxStore = require('kx-store');
var myStore = kxStore({counter: 0, deep: {arr: []} });

console.log(`counter is `, myStore.data.counter); //counter is 0

//change counter to 1
myStore.set('counter', 1);

//change counter to 2 
myStore.data.counter = 2;

//get counter data
var counter = myStore.get('counter');

//change deep.arr
myStore.data.deep.arr.push(0); //deep.arr[0] = 0;
myStore.set('deep.arr.0', 1); //deep.arr[0] = 1;

//#EVENTS

//listen to data changes
myStore.observe('deep.oArr.*', function (event) {
  console.log(`event is`, event);
  console.log(`myStore data is`, this.data);
});

myStore.set('deep.oArr', []);
myStore.data.deep.oArr.push('Zeroth'); //triggers observe 'deep.oArr.*'

//sample console log from observe 'deep.oArr.*'
//---
event is {
  type: 'set',
  target: [ 'Zeroth' ],
  key: '0',
  value: 'Zeroth',
  old: undefined,
  path: 'deep.oArr.0'
}
myStore data is { counter: 2, deep: { arr: [ 1 ], oArr: [ 'Zeroth' ] } }
//---

myStore.set('deep.oArr.1', 'First'); //triggers observe 'deep.oArr.*'


//simple pubsub
myStore.on('myPubSub', function (data) {
  console.log(`myPubSub data params`, data);
});

myStore.fire('myPubSub', {hello: 'pubsub'}); // console.log = myPubSub data params { hello: 'pubsub' }

```