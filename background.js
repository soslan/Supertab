// chrome.tabs.onCreated.addListener(function(tab){
//   console.log(tab);
//   chrome.browserAction.show(tab.id);
// });

chrome.tabs.query({}, function(results){
  for(var i in results){
    var tab = results[i];
    refreshIcon(tab);
    //chrome.browserAction.show(tab.id);
  }
});

chrome.tabs.onUpdated.addListener(function(tabId, changes, tab){
  //console.log(tab);
  console.log(changes);
  if(changes.status == "loading"){
    //chrome.browserAction.show(tab.id);
    console.log(tab);
    refreshIcon(tab);
    
  }
});

chrome.tabs.onActivated.addListener(function(info){
  chrome.tabs.get(info.tabId, function(tab){
    refreshIcon(tab);
  })
});

chrome.storage.sync.get("bookmarks_root", function(data){
  if(data["bookmarks_root"] === undefined){
    chrome.bookmarks.create({
      "title":"SuperTab"
    }, function(root){
      console.log("Created root bookmark folder.");
      chrome.storage.sync.set({
        "bookmarks_root": root.id
      }, function(){

      });
    });
  }
});
//clearStack();
chrome.storage.local.get("stack", function(data){
  if(data["stack"] === undefined){
    chrome.storage.local.set({
      "stack": {}
    });
  }
});

chrome.browserAction.onClicked.addListener(function(tab){
  chrome.storage.local.get("stack", function(data){
    console.log("GOT STACK", data);
    if(data["stack"][tab.url] === undefined){
      data["stack"][tab.url] = {
        "added": Date.now(),
        title: tab.title,
        url: tab.url,
      };
      console.log(tab.url+" is not in the stack");
    }
    else{
      console.log(tab.url+" is in the stack");
      delete data["stack"][tab.url];
    }
    chrome.storage.local.set({
      "stack":data["stack"]
    },function(){
      refreshIcon(tab);
    });
  });
});

chrome.storage.onChanged.addListener(function(changes, area){
  if(typeof changes["stack"] === "object"){
    chrome.tabs.query({active:true}, function(tabs){
      console.log("CURRENT TAB IS ", tabs);
      refreshIcon(tabs[0]);
    });
    chrome.tabs.query({}, function(results){
      for(var i in results){
        var tab = results[i];
        refreshIcon(tab);
        //chrome.browserAction.show(tab.id);
      }
    });
  }
});

function refreshIcon(tab){
  //chrome.browserAction.show(tab.id);
  getStackItem(tab.url, function(item){
    console.log("REFRESHING icon", item);
    if (item === undefined){
      chrome.browserAction.setIcon({
        "tabId":tab.id,
        "path": {
          "19": "radio_disabled_19x19.png",
          "38": "radio_disabled_38x38.png"
        }
      });
    }
    else{
      chrome.browserAction.setIcon({
        "tabId":tab.id,
        "path": {
          "19": "radio_enabled_19x19.png",
          "38": "radio_enabled_38x38.png"
        }
      });
    }
    
  })
}

function getStackItem(url, callback){
  chrome.storage.local.get("stack", function(data){
    console.log("GOT ITEM", data);
    callback(data["stack"][url]);
  });
}

function clearStack(){
  chrome.storage.local.remove("stack");
}

//clearStack();


// chrome.tabs.onActivated.addListener(function(tab){
//   console.log(tab);
//   chrome.browserAction.show(tab.tabId);
// });