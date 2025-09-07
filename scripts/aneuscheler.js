var  navItems =
[
  [
  	{
      "url": "theriver.shtml",
      "text": "THE RIVER"
    },
    {
      "url": "object.shtml",
      "text": "OBJECT"
    },
    {
      "url": "sleep.shtml",
      "text": "SLEEP"
    },
    {
      "url": "corngrowing.shtml",
      "text": "CORN GROWING"
    }
  ],
  [
    {
      "url": "mound.shtml",
      "text": "MOUND."
    },
     {
      "url": "prancer.shtml",
      "text": "PRANCER"
    },
	{
      "url": "cooked.shtml",
      "text": "COOKED"
    },
    {
      "url": "young.shtml",
      "text": "YOUNG"
    },
    {
      "url": "waterflowingunderground.shtml",
      "text": "WATER FLOWING"
    },
    {
      "url": "innerlife.shtml",
      "text": "INNERLIFE"
    },
    {
      "url": "bettesgroup.shtml",
      "text": "BETTES GROUP"
    },
    {
      "url": "ladyofthenight.shtml",
      "text": "LADY OF THE NIGHT"
    },
    {
      "url": "chaise.shtml",
      "text": "CHAISE"
    }
  ],
  [ 
    {
      "url": "horrormovie.shtml",
      "text": "HORROR MOVIE"
    }, 
    {
      "url": "wipp.shtml",
      "text": "WIPP"
    }, 
    {
      "url": "miragers.shtml",
      "text": "MIRAGERS"
    },      
    {
      "url": "flag.shtml",
      "text": "FLAG"
    },
    {
      "url": "wtf.shtml",
      "text": "WEIRD TRANCE FORCE"
    },
    {
      "url": "http://www.destroyerofpoetry.info",
      "text": "DESTROYER OF POETRY"
    },
    {
      "url": "myf.shtml",
      "text": "MELLOW YELLOW FEVER"
    }
  ]
]

function getState() {
  return JSON.parse(Cookies.get("state") || "{}");
}

function setState(state) {
  Cookies.set("state", JSON.stringify(state));
}

function getLinksState() {
  return getState()["links"];
}

function hasStarted() {
  return getState()["started"];
}

function revealMoreLinksInBucket(links, bucketIdx) {
  $.each(navItems[bucketIdx], function(idx, navItem) {
    url = navItem["url"]
    if (!(url in links)) {
      links[url] = false;
      return false;
    }
  });
  return links;
}

$('body').on('click', '#navi a', function(event) {
  targetNode = $(event.target)
  clickedUrl = targetNode.attr("href")
  clickedBucketIdx = targetNode.attr("data-bucket-idx")
  console.log("link clicked: " + clickedUrl + " with data-bucket-idx of: " + clickedBucketIdx);
  state = getState()
  if (!state["started"]) {
    event.preventDefault();
    state["started"] = true;
    state["links"] = {};
    setState(state);
    location.reload();
  } else {
    links = state["links"]
    if (!links[clickedUrl]) {
      links[clickedUrl] = true
      state["links"] = revealMoreLinksInBucket(links, clickedBucketIdx);
      setState(state);
    }
  }
});

function navItemToDomNode(navItem, idx) {
  node = $("#navi .link").first().clone();
  node.children("a").first().text(navItem.text).attr("href", navItem.url).attr("data-bucket-idx", idx);
  return node;
}

function addNavItemToMenu(navItem, idx) {
  $("#navi small").append(navItemToDomNode(navItem, idx));
}

function buildLinks() {
  linksState = getLinksState();
  $.each(navItems, function(idx, bucket) {
    if (bucket.length > 0) {
      addNavItemToMenu(bucket[0], idx);
    }
    if (bucket.length > 1) {
      bucket.slice(1).forEach(function(link) {
        if (link["url"] in linksState) {
          addNavItemToMenu(link, idx);
        }
      })
    }
  })
}

function buildAllLinks() {
  $.each(navItems, function(bucketIdx, bucket) {
    $.each(bucket, function(idx, navItem) {
      addNavItemToMenu(navItem, bucketIdx);
    });
  });
}

function buildNavMenu() {
  state = getState();
  if (state["bypassed"]) {
    buildAllLinks();
  } else if (state["started"]) {
    buildLinks();
  }
}