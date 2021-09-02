var ObjectObservable = require('object-observable');
var EventEmitter2 = require('eventemitter2').EventEmitter2;

var get = require('lodash.get');
var set = require('lodash.set');
var evPre = {ev: '_ev.', data: '_data.'};

function emitUpdate(emitter, ev, evOld) {
  var emit = true;
  if(ev.key === 'length') {
    if(ev.path.lastIndexOf('.length') === (ev.path.length - 7)) {
      emit = false;
    }
  }
  
  if(evOld !== undefined) {
    if(evOld == ev) {
      //console.log("old ev, same with new");
      emit = false;
    }
    
    if(evOld.path === ev.path && ev.value === ev.old) {
      //console.log("same path, same value");
      emit = false;
    }
  }
  
  
  
  if(emit) {
    evPath = ev.path;
    evPath = evPre.data + evPath;
    emitter.emit(evPath, ev);
  }
}

function kxStore(data) {
  var emitter = new EventEmitter2({
    wildcard: true,
    verbose: true,
    removeListener: true
  });
  
  var oData;
  if(data === undefined) data = {};
  
  if(ObjectObservable.isObservable(data)) {
    oData = data;
  } else {
    oData = ObjectObservable.create(data, {clone: true});
  }
  
  /*
  var olistener = ObjectObservable.observe(oData, function(updates) {
    var oldEv;
    for(var i=0; i < updates.length; i++) {
      emitUpdate(updates[i], oldEv);
      oldEv = updates[i];
    }
    
  });
  */
  
  var oldEv;
  var olistener = ObjectObservable.observeInmediate(oData, function(ev) {
      emitUpdate(emitter, ev, oldEv);
      oldEv = ev;
  });
  
  var root = {
    data: oData,
    get: (path, cb) => {
      var d = get(oData, path);
      if(cb != undefined) cb.call(root, d);
      return d;
    },
    set: (path, val, cb) => {
      var d = set(oData, path, val);
      if(cb != undefined) cb.call(root, d);
      return d;
    },
    
    observe: (path, cb) => {
      var cbb = cb.bind(root);
      //emitter.on(root._evPre.data + path, (ev) => cb.call(root, ev));
      emitter.on(root._evPre.data + path, cbb);
      return cbb;
    },
    observeOff: (k, cbb) => {
      if (!cbb) cbb = function(){};
      emitter.removeListener(root._evPre.data + k, cbb);
    },
    observeOffAll: (k) => {
      emitter.removeAllListeners(root._evPre.data + k);
    },
    observeOnce: (path, cb) => {
      emitter.once(root._evPre.data + path, (ev) => cb.call(root, ev));
    },
    on: (k, cb) => {
      var cbb = cb.bind(root);
      emitter.on(root._evPre.ev + k, cbb);
      return cbb;
    },
    once: (k, cb) => {
      emitter.once(root._evPre.ev + k, (ev) => cb.call(root, ev))
    },
    fire: (k, ev) => {
      emitter.emit(root._evPre.ev + k, ev);
    },
    off: (k, cbb) => {
      if (!cbb) cbb = function(){};
      emitter.removeListener(root._evPre.ev + k, cbb);
    },
    offAll: (k) => {
      emitter.removeAllListeners(root._evPre.ev + k);
    },
    _ev: emitter,
    _evPre: evPre,
    _oO: ObjectObservable
  };
  
  return root;
  
}

module.exports = kxStore;