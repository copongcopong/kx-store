var test = require('tape');
var kxStore = require('../index.js');


test('test data update', function (t) {
    t.plan(6);
    var idata = {foo: 1};
    var store = kxStore(idata);
    var init = JSON.stringify(idata);
    t.equal(store.data.foo, 1, "store.data.foo should be equal to init " + init);
    t.equal(store.get('foo'), 1, "store.get('foo') should be equal to init " + init);
    store.data.bar = [1, 2];
    store.data.foo = 2;
    var d = JSON.stringify(store.data);
    
    t.notEqual(store.data.foo, idata.foo, "store.data.foo = 2; idata should remain the same and will not mutate.");
    t.equal(store.data.bar[0], 1, "store.data.bar[0] should match " + d);
    delete store.data.bar[1];
    
    t.equal(store.data.bar.length, 1, "After deletion store.data.bar[1], length = 1");
    t.equal(typeof store.data.bar[1], 'undefined', "After deletion store.data.bar[1] it should be undefined");
    
});

test('test .set and .get', function (t) {
    t.plan(2);
    var store = kxStore({});
    store.set('foo', true);
    t.equal(store.data.foo, true, "store.set('foo', true) should be the same as store.data.foo = true; ");
    t.equal(store.get('foo'), true, "store.set('foo', true) should be the same store.get('foo') ");
});

test('test .observe simple', function (t) {
    t.plan(4);
    var store = kxStore({foo: 1});
    store.observe('foo', function(ev){
      t.pass("This observer 'foo' function should run when store.data.foo is changed");
      t.equal(this.get('foo'), 2, "@this.get('foo') should be the same as store.data.foo");
      t.equal(this.data.foo, 2, "@this.data.foo should be the same as store.data.foo");
      t.equal(ev.value, 2, "ev.value params should be the same as store.data.foo");
      t.end();
    });
    store.data.foo = 2;
});

test('test .observe array', function (t) {
    t.plan(12);
    var store = kxStore({});
    
    store.observe('arr', function(ev){
      //console.log(ev);
      //console.log(this._ev.listeners('_data.arr.*').length);
      //if(ev.path == 'arr') {
        t.pass("This observer 'arr' function should run when store.data.arr is changed");
        t.ok(Array.isArray(this.get('arr')), "@this.get('arr') should be an array");
        t.equal(this.data.arr.length, 0, "@this.data.arr.length should be 0");
        //} else {
        
      //}
      
    });
    
    store.observe('arr.0', function(ev){
      
      //console.log(ev);
      if(ev.path == 'arr.0') {
        t.pass("-This observer 'arr' function should run when store.data.arr.0 is changed");
        t.equal(this.data.arr.length, 1, "@this.data.arr.length should be 1");
        t.equal(this.data.arr[0], 100, "@this.data.arr[0] should be 100");
        t.equal(this.get('arr[0]'), 100, "@this.get('arr[0]') should be 100");
         
      }
    });
    
    store.observe('arr.1', function(ev){
      //console.log(ev);
      if(ev.path == 'arr.1') {
        t.pass("-This observer 'arr' function should run when store.data.arr.1 is changed");
        t.equal(this.data.arr.length, 2, "@this.data.arr.length should be 2");
        t.equal(this.data.arr[1], 200, "@this.data.arr[1] should be 200");
        t.equal(this.get('arr[1]'), 200, "@this.get('arr[1]') should be 200");
        t.end();  
      }
    });
    
    t.equal(typeof store.data.arr, "undefined", "store.data.arr not yet defined");
    
    store.set('arr', []);
    store.set('arr.0', 100);
    store.data.arr.push(200);
    //store.set('arr.1', 1000);
});

test('test .observe object', function (t) {
    t.plan(4);
    var store = kxStore({});
    
    ctr = 0;
    store.observe('obj', function(ev){
      //console.log(ev);
      //console.log(this._ev.listeners('_data.arr.*').length);
      //if(ev.path == 'arr') {
        t.pass("This observer 'obj' function should run when store.data.obj is changed");
        
        if(ctr == 3) t.end();
       
        ctr++;
      
    });
    
    store.observe('obj.*', function(ev){
      //console.log(ev);
      //console.log(this._ev.listeners('_data.arr.*').length);
      //if(ev.path == 'arr') {
        t.pass("This observer 'obj' function should run when store.data.obj is changed");
        
        if(ctr == 3) t.end();
       
        ctr++;
      
    });

    
    t.equal(typeof store.data.obj, "undefined", "store.data.obj not yet defined");
    
    store.set('obj', {});
    store.set('obj.key1', 1);
    store.set('obj.key2', 2);
    //store.set('arr.1', 1000);
});

test('test .observe object level 0', function (t) {
    t.plan(2);
    var store = kxStore({});
    
    store.observe('obj', function(ev){
        t.pass("This observer 'obj' function should run when store.data.obj is changed");
        t.equal('obj', ev.path);
        t.end();
    });
    
    store.set('obj', {key0:1});
    //store.set('arr.1', 1000);
});

test('test .observe object level 1', function (t) {
    t.plan(2);
    var store = kxStore({});
    
    ctr = 0;
    store.observe('obj.*', function(ev){
        t.pass("This observer 'obj' function should run when store.data.obj is changed " + ev.path);
        t.equal('obj.x', ev.path);
        t.end();
        ctr++;
    });
    
    store.set('obj.x.y.z', 100);
    //store.set('arr.1', 1000);
});

test('test .observe object level 2', function (t) {
    t.plan(10);
    var store = kxStore({});
    ctr = 0;
    
    store.observe('obj.**', function(ev){
        t.pass("This observer 'obj' function should run when store.data.obj is changed " + ev.path);
        if(ctr == 0) t.equal('obj', ev.path);
        if(ctr == 1) t.equal('obj.x', ev.path);
        if(ctr == 2) t.equal('obj.x.y', ev.path);
        if(ctr == 3) t.equal('obj.x.y.z', ev.path);
        if(ctr == 4) t.equal('obj.x.y.z.a', ev.path);
        
        if(ctr == 5) t.end();
        ctr++;
    });
    
    store.set('obj.x.y.z.a', 100);
    //store.set('arr.1', 1000);
});

test('test .observe object exact and wildcard level 5 deep', function (t) {
    t.plan(4);
    var store = kxStore({});
    
    
    store.observe('obj.x.y.z.a', function(ev){
        t.pass("This observer 'obj' function should run when store.data.obj is changed " + ev.path);
        t.equal('obj.x.y.z.a', ev.path);
        
        
    });
    
    store.observe('obj.*.*.*.a', function(ev){
        t.pass("This observer 'obj' function should run when store.data.obj is changed " + ev.path + " and observe via 'obj.*.*.*.a'");
        t.equal('obj.x.y.z.a', ev.path);
        
        
        
    });
    
    store.set('obj.x.y.z.a', 100);
    //store.set('arr.1', 1000);
});


test('test .observeOnce', function (t) {
    t.plan(7);
    var store = kxStore({xfoo: 1});
    
    store.observeOnce('xfoo', function(ev){
      t.pass("This observer 'xfoo' function should run only once when store.data.foo is changed multiple times");
      t.equal(this.get('xfoo'), 2);
      t.equal(this.data.xfoo, 2);
      t.equal(ev.value, 2);
      
      t.notEqual(this.get('xfoo'), 3);
      t.notEqual(this.data.xfoo, 3);
      t.notEqual(ev.value, 3);
      
      t.end();
    });
    store.data.xfoo = 2;
    store.data.xfoo = 3;
    store.data.xfoo = 3;
    store.data.xfoo = 3;
});


test('test .on & .fire', function (t) {
    t.plan(4);
    var store = kxStore({foo: 1});
    store.on('testEvent', function(pass){
      t.pass("This pubsub 'testEvent' should run 2 times ")
      t.equal(pass.one, 1);
      if(pass.last) t.end();
    });
    
    store.fire('testEvent', {one: 1});
    store.fire('testEvent', {one: 1, last: 1});
});

test('test .once & .fire', function (t) {
    t.plan(2);
    var store = kxStore({foo: 1});
    store.once('testEvent2', function(pass){
      t.pass("This pubsub 'testEvent2' should run only once ")
      t.notEqual(pass.one, 2);
      t.end();
    });
    
    store.fire('testEvent2', {one: 1});
    store.fire('testEvent2', {one: 2});
    store.fire('testEvent2', {one: 2});
});

test('test .offAll: removeAllListeners', function (t) {
    t.plan(2);
    var store = kxStore({foo: 1});
    
    
    var func = function(pass){
      var i = pass.i;
      if(i == 3) {
        t.fail("should not run!");
        t.end();
      } else {
        t.pass("After 2 run, nothing should follow.");
      }
      
    };
    
    var func2 = function(pass) {
      if(pass.i == 3) {
        t.fail("should not run!");
        t.end();
      }  
    };
    
    store.on('testEvent3', func);
    store.on('testEvent3', func2);
    
    store.fire('testEvent3', {i: 1});
    store.fire('testEvent3', {i: 2});
    store.offAll('testEvent3');
    //store._ev.removeListener('ev.testEvent3', func);
    
    //var l = store._ev.listeners('ev.testEvent3');
    //console.log('listener ' + l.length);
    store.fire('testEvent3', {i: 3});
    store.fire('testEvent3', {i: 4});
    store.fire('testEvent3', {i: 5});
});

test('test .off: removeListener', function (t) {
    t.plan(2);
    var store = kxStore({foo: 1});
    
    
    var func = function(pass){
      var i = pass.i;
      if(i == 3) {
        t.fail("should not run!");
        t.end();
      } else {
        t.pass("Should be called 2 times only.");
      }
      
    };
    
    var pointer = store.on('testEvent3', func);
    
    store.fire('testEvent3', {i: 1});
    store.fire('testEvent3', {i: 2});
    store.off('testEvent3', pointer);

    store.fire('testEvent3', {i: 3});
    store.fire('testEvent3', {i: 4});
    store.fire('testEvent3', {i: 5});
});
