function Model(args){
  args = args || {};
  this.valueCore;
  this.changeListeners = [];
  this.filters = [];
  this.setValue(args.value);
}

Model.prototype.setValue = function(value){
  //this.valueCore = value;
  var newValue=value, oldValue=this.valueCore, tempValue;
  for (var i in this.filters){
    try{
      tempValue = this.filters[i](newValue);
    }
    catch(error){
      return;
    }
    if(tempValue !== undefined){
      newValue = tempValue;
    }
  }
  if(this.valueCore === newValue){
    return newValue;
  }
  this.valueCore = newValue;
  for(var i in this.changeListeners){
    this.changeListeners[i]({
      after: newValue,
      before: oldValue,
    });
  }
  return newValue;
}

Model.prototype.onChange = function(handler){
  if(typeof handler === "function"){
    this.changeListeners.push(handler);
  }
}

Model.prototype.filter = function(filter){
  if(typeof filter === "function"){
    this.filters.push(filter);
  }
}

Model.prototype.upstreamChromeExtensionStorage = function(key){
  var self = this;
  chrome.storage.onChanged.addListener(function(changes, area){
    if(typeof changes[key] === "object"){
      console.log("Storage changed... ", changes);
      self.value = changes[key]["newValue"];
    }
  });
  self.onChange(function(changes){
    console.log("Model changed... ", changes);
    var args = {};
    args[key] = changes.after;
    chrome.storage.local.set(args);
  });
  chrome.storage.local.get(key, function(data){
    console.log("Initializing... ", data);
    self.value = data[key];
  });
}

Model.prototype.switchClassName = function(elem, ifTrue, ifFalse){
  this.onChange(function(delta){
    if(delta.after){
      elem.classList.add(ifTrue);
      elem.classList.remove(ifFalse);
    }
    else{
      elem.classList.add(ifFalse);
      elem.classList.remove(ifTrue);
    }
  });
}

Model.prototype.getValue = function(){
  return this.valueCore;
}

Object.defineProperty(Model.prototype, "value", {
  get: function(){
    return this.getValue();
  },
  set: function(value){
    return this.setValue(value);
  }
});

chrome.topSites.get(function(data){
  var top = document.querySelector("#top .list");
  for (var i in data){
    var s = data[i];
    var item = l({
      url:s.url,
      title:s.title
    });


    top.appendChild(item);
    //item.innerHTML = s.url;
  }
});

chrome.history.search({
  text:'',
  maxResults:20,
}, function(items){
  var historyE = document.querySelector("#history .list");
  for (var i in items){
    var item=items[i];
    if(item.title==""){
      //continue;
    }
    var elem = l({
      url:item.url,
      title:item.title || item.url,
    });
    historyE.appendChild(elem);
  }
});

function buildToReadList(data){
  var stack = data.stack;
  var stackE = document.querySelector("#toread .list");
  stackE.innerHTML = "";
  var list = [];
  for (var i in stack){
    list.push(stack[i]);
  }
  list.sort(function(a, b){
    return b.added - a.added;
  });
  for (var i in list){
    var item=list[i];
    var elem = l({
      url:item.url,
      title:item.title,
    });
    elem.item = item;
    //var deleteButton = b();
    var deleteButton = e({
      tag:"div",
      class: "hidden button",
      action: function(e){
        var url = e.currentTarget.item.url;
        var element = e.currentTarget.item.elem;
        document.querySelector("#toread .list").removeChild(element);
        chrome.storage.local.get("stack", function(data){
          delete data["stack"][url];
          chrome.storage.local.set(data);
        });
        e.stopPropagation();
        e.preventDefault();
      },
      content:e({
        tag:"img",
        attributes:{src:"remove_19x19.png"}
      }),
    });
    deleteButton.item = {
      url: item.url,
      elem: elem,
    };
    elem.appendChild(deleteButton);
    stackE.appendChild(elem);
  }}

chrome.storage.onChanged.addListener(function(changes, area){
  if(typeof changes["stack"] === "object"){
    //console.log(changes);
    buildToReadList({
      "stack": changes["stack"]["newValue"]
    });
  }
});

chrome.storage.local.get("stack", function(data){
  buildToReadList(data);
});

var sections = document.querySelectorAll("#main > .section");
var sectionControl = document.getElementById("section-control");
for (var i=0; i< sections.length; i++){
  console.log(sections[i]);
  var section = sections[i];
  var model = new Model();
  model.filter(function(val){
    return Boolean(val);
  });
  model.upstreamChromeExtensionStorage(section.id);
  
  var title = section.querySelector(".title").innerHTML;
  var elem = e({
    tag: "div",
    class: "section-control-button",
    content: title,
    action: function(e){
      var model = e.currentTarget.model;
      model.value = !model.value;
    },
  });
  elem.model = model;
  model.switchClassName(elem, "active");
  model.switchClassName(section, "active");
  sectionControl.appendChild(elem);
}

function b(args){
  var button = e({
    tag:"button",
    class: "button",
    action: function(){
      alert("BBB");
    }
  });
  return button;
}


function l( args ) {
  var item = e({
    tag:"a",
    attributes:{
      href:args.url,
      title: args.title + "\n" + args.url,
    },
    class:"item"
  });

  var icon = e({
    tag:'img',
    class:"supertab-icon",
    parent:item,
  });
  icon.src = "chrome://favicon/"+args.url;

  var label = e({
    tag:'span',
    parent:item,
    class: "title",
    content:args.title,
  });

  label.appendChild(e({
    tag: 'span',
    class: 'meta',
    content: " - " + args.url,
  }));

  return item;
}


function e( args ) {
  args = args || {};

  var element = document.createElement( args.tag || "div" );
  if ( typeof args.class === "string" ) {
    args.class.split( " " ).forEach(function( className ) {
      element.classList.add( className );
    });
  }

  if ( typeof args.content === "string" || typeof args.content === "number" ) {
    element.innerHTML = args.content;
  } else if ( args.content instanceof Node ) {
    element.appendChild( args.content );
  }

  if ( args.parent instanceof HTMLElement ) {
    args.parent.appendChild( element );
  }

  if ( typeof args.attributes === "object" ) {
    for ( var key in args.attributes ) {
      element.setAttribute( key, args.attributes[ key ] );
    }
  }

  if ( typeof args.style === "object" ) {
    for ( var i in args.style ) {
      element.style[ i ] = args.style[ i ];
    }
  }

  if ( typeof args.action === "function" ) {
    // TODO: Touch events
    element.addEventListener( "click", args.action );
  }

  return element;
};
