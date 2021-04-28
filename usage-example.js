var kxStore = require('./index.js');
var myStore = kxStore({counter: 0, deep: {arr: []} });

console.log(`counter is `, myStore.data.counter); //counter is 0
console.log(`myStore.data is `, myStore.data);

//change counter to 1
myStore.set('counter', 1);

console.log(`myStore.data is `, myStore.data);
//change counter to 2 
myStore.data.counter = 2;
console.log(`myStore.data is `, myStore.data);

//get counter data
var counter = myStore.get('counter');
console.log(`counter is `, counter);

//change deep.arr
myStore.data.deep.arr.push(0); //deep.arr[0] = 0;
console.log(`myStore.data is `, myStore.data);

myStore.set('deep.arr.0', 1); //deep.arr[0] = 1;
console.log(`myStore.data is `, myStore.data);

console.log('>> setup data change observer for `deep.oArr.*`')
var deep_oArr_all = myStore.observe('deep.oArr.*', function (event) {
  console.log(`event is`, event);
  console.log(`myStore data is`, this.data);
});

myStore.set('deep.oArr', []);
myStore.data.deep.oArr.push('Zeroth'); //triggers observe

myStore.set('deep.oArr.1', 'First'); //triggers observe

myStore.set('deep.oArr.2', 'Second'); //triggers observe

myStore.observeOff('deep.oArr.*', deep_oArr_all);

myStore.set('deep.oArr.3', 'Third'); //no more console.log from observer deep_oArr_all


myStore.observe('newBase', function (event) {
  console.log(`newBase observer`, event, this.data);
});

myStore.observe('newBase.*', function (event) {
  console.log(`newBase.* observer`, event, this.data);
});

myStore.set('newBase', 1); //triggers observer `newBase` only
myStore.set('newBase', 2); //triggers observer `newBase` only
myStore.set('newBase', {o:1});  //triggers observer `newBase` only
myStore.data.newBase.o = 2; //triggers observers `newBase` and `newBase.*`
delete myStore.data.newBase; //triggers observer `newBase` only
myStore.data.newBase = [1,2,3]; //triggers observer `newBase` only
myStore.set('newBase.0', 'Zero'); //triggers observers `newBase` and `newBase.*`


//with pubsub
myStore.on('myPubSub', function (data) {
  console.log(`myPubSub data params`, data);
});
function myPubSub2nd (data) {
  console.log(`myPubSub 2nd Listener params`, data);
}
var myPubSub2ndEv = myStore.on('myPubSub', myPubSub2nd);

myStore.fire('myPubSub', {hello: 'pubsub'});

myStore.once('onceOnly', function onceOnly (data) {
  console.log(`onceOnly data params`, data);
});
myStore.fire('onceOnly', {hello: 'onceOnly'});
myStore.fire('onceOnly', {hello: 'onceOnly will not trigger'});

myStore.fire('myPubSub', {hello: 'pubsub 2nd Call'});

//show all pubsub listener
console.log('all listener', myStore._ev.listeners('_ev.*'));

myStore.off('myPubSub', myPubSub2ndEv);
myStore.fire('myPubSub', {hello: 'myPubSub 2nd Listener should appear after this.'});




