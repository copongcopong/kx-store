var kxStore = require('./index.js');

var dd = kxStore({foo: 1});

//dd.ev.on('*', (p) => console.log(p));
dd.observe('bar.*', function(ev) {
  console.log("\n===== observing bar.* ====");
  console.log("event is", ev);
  console.log("data is", this.data);
  
  console.log("=== end ===\n");
  
});
var yeahFunc = function (ev) { 
  console.log('YEAH!!! ' + JSON.stringify(ev));
};

var yeahFunc2 = function(){
  console.log("YEAH2");
};
dd.on('yeah', yeahFunc);
dd.on('yeah', yeahFunc2);

dd._ev.on('_ev.heary', function hr(){})

setTimeout(() => {
  console.log(`run>> dd.data.bar = []`);
  dd.data.bar = [];
  console.log(`run>> dd.data.bar.push('q')`);
  dd.data.bar.push('q');
  console.log(`run>> dd.data.bar.push('a')`);
  dd.data.bar.push('a');
  console.log(`run>> dd.data.bar.push({one: 1})`);
  dd.data.bar.push({one: 1});
  console.log(`run>> dd.data.bar[0] = 'q'`);
  dd.data.bar[0] = 'q';
  console.log(`run>> dd.data.bar[1] = 'q'`);
  dd.data.bar[1] = 'q';
  console.log(`run>> dd.data.bar[1] = 'q'`);
  dd.data.bar[1] = 'q';

  dd.set('bar.3', 'e', (v) => {console.log("set `bar.3` to `e`\n"); console.log(`data value is`, v);});
  dd.get('bar.2', (v) => {console.log("get"); console.log(v);});
  console.log(dd.data);
}, 200);

setTimeout(() => {
  
  dd.observe("myvar", function(ev){
    console.log("\nmyvar listener " + JSON.stringify({old: ev.old, curr: ev.value, p: ev.path}));
  });

  dd.observe("myvar.**", function(ev){
    console.log("\nmyvar-ALL listener " + JSON.stringify({old: ev.old, curr: ev.value, p: ev.path}));
  });

  dd.observe("myvar.seven", function(ev){
    console.log("\nmyvar.seven listener " + JSON.stringify({old: ev.old, curr: ev.value, p: ev.path}));
  });

  dd.observe("myvar.otso", function(ev){
    console.log("\nmyvar.otso listener " + JSON.stringify({old: ev.old, curr: ev.value, p: ev.path}));
  });
  dd.observe("myvar.otso.*", function(ev){
    console.log("\nmyvar.otso.* listener " + JSON.stringify({old: ev.old, curr: ev.value, p: ev.path}));
  });
  
  dd.observe("myvar.otso.**", function(ev){
    console.log("\nmyvar.otso.** listener " + JSON.stringify({old: ev.old, curr: ev.value, p: ev.path}));
  });
   
  dd.data.myvar = 100;
  
  console.log(dd.data);
  console.log("\n>> oO.isObservable " + dd._oO.isObservable(dd.data));
  dd.data.myvar = 200;
  dd.data.myvar = [];
  dd.data.myvar = [1,2,3];
  dd.data.myvar[1] = 7;
  dd.data.myvar = {seven: 7};
  dd.data.myvar.seven = '7th'; 
  
  dd.data.myvar.seven = '007th'; 
  
  dd.set('myvar.otso', {});
  dd.set('myvar.otso', {walo: 8});
  dd.set('myvar.otso.walo', "8th");
  dd.set('myvar.otso.walo.waloo', "8th");
  dd.set('myvar.otso.walo.waloo.walooo', "08th");
  dd.set('myvar.otso.walo.waloo.walooo.xwaloox', "08th");
  dd.set('myvar.otso.walo.waloo.walooo.xwaloox.arr[0]', 8);
  
  dd.fire('yeah', {yeah: 1});
  dd.fire('yeah', {yeah: 2});
  dd._ev.removeListener('_ev.yeah', yeahFunc);
  console.log(dd._ev.listeners('_ev.yeah').length);
  dd.fire('yeah', {yeah: 3});
  dd.fire('yeah', {yeah: 3});
  
  function ssh() {
      console.log("SSh");
    };
    
  var shiba = dd.on('ss', ssh);
  
  dd.fire("ss");
  dd.fire("ss");
  
  console.log("\n ==== ALL _ev!!!");
  
  console.log(dd._ev.listeners('_ev.*'));

  console.log("\n ==== ====");
  
  dd.off("ssh", ssh);
  
  
  dd.fire("ss");
  
  setTimeout(() => {
    dd.off("ss", shiba);
    dd.fire("ss");
    dd.fire("ss");
    dd.fire("ss");
    dd.fire("ss");
    dd.fire("ss");
    dd.fire("ss");
  }, 400);
}, 400);
