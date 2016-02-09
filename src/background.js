chrome.tabs.query({}, function(results){
  for(var i in results){
    var tab = results[i];
    refreshIcon(tab);
  }
});

chrome.tabs.onUpdated.addListener(function(tabId, changes, tab){
  if(changes.status == "loading"){
    refreshIcon(tab);
  }
});

chrome.tabs.onActivated.addListener(function(info){
  chrome.tabs.get(info.tabId, function(tab){
    refreshIcon(tab);
  })
});

chrome.storage.sync.get("stack", function(data){
  if(data["stack"] === undefined){
    chrome.storage.sync.set({
      "stack": {}
    });
  }
});

chrome.browserAction.onClicked.addListener(function(tab){
  chrome.storage.sync.get("stack", function(data){
    if(data["stack"][tab.url] === undefined){
      data["stack"][tab.url] = {
        added: Date.now(),
        title: tab.title,
        url: tab.url,
      };
    }
    else{
      delete data["stack"][tab.url];
    }
    chrome.storage.sync.set({
      "stack":data["stack"]
    },function(){
      refreshIcon(tab);
    });
  });
});

chrome.storage.onChanged.addListener(function(changes, area){
  if(typeof changes["stack"] === "object"){
    chrome.tabs.query({active:true}, function(tabs){
      refreshIcon(tabs[0]);
    });
    chrome.tabs.query({}, function(results){
      for(var i in results){
        var tab = results[i];
        refreshIcon(tab);
      }
    });
  }
});

function refreshIcon(tab){
  getStackItem(tab.url, function(item){
    if (item === undefined){
      chrome.browserAction.setIcon({
        "tabId":tab.id,
        "path": {
          "19": "img/radio_disabled_19x19.png",
          "38": "img/radio_disabled_38x38.png"
        }
      });
    }
    else{
      chrome.browserAction.setIcon({
        "tabId":tab.id,
        "path": {
          "19": "img/radio_enabled_19x19.png",
          "38": "img/radio_enabled_38x38.png"
        }
      });
    }
    
  })
}

function getStackItem(url, callback){
  chrome.storage.sync.get("stack", function(data){
    if ( data['stack'] == null ){
      callback(undefined);
    }
    else{
      callback(data["stack"][url]);
    }
  });
}

function clearStack(){
  chrome.storage.sync.remove("stack");
}
