chrome.topSites.get(function(data){
  var top = document.getElementById("top");
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
  var historyE = document.getElementById("history");
  for (var i in items){
    var item=items[i];
    if(item.title==""){
      continue;
    }
    var elem = l({
      url:item.url,
      title:item.title,
    });
    historyE.appendChild(elem);
  }
});

chrome.storage.local.get("stack", function(data){
  var stack = data.stack;
  var stackE = document.getElementById("stack");
  for (var i in stack){
    var item=stack[i];
    var elem = l({
      url:item.url,
      title:item.title,
    });
    elem.item = item;
    //var deleteButton = b();
    var deleteButton = e({
      tag:"button",
      class: "hidden button",
      action: function(e){
        var url = e.currentTarget.item.url;
        var element = e.currentTarget.item.elem;
        document.getElementById("stack").removeChild(element);
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
  }
});

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