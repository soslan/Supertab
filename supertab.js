chrome.topSites.get(function(data){
  var top = document.getElementById("top");
  for (var i in data){
    var s = data[i];
    var item = document.createElement("li");

    var icon = e({
      tag:'img',
      class:"spertab-icon",
      parent:item,
    });
    icon.src = "chrome://favicon/"+s.url;

    var link = e({
      tag:"a",
      attributes:{
        href:s.url,
      },
      parent:item,
    });

    var label = e({
      tag:'span',
      parent:link,
      content:s.title,
    });


    top.appendChild(item);
    //item.innerHTML = s.url;
  }
});

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