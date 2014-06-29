var mesonet = {
  map:{},
  sidebar:{},
  init:function(){
    /* Basemap Layers */
    var mapquestOSM = L.tileLayer("http://{s}.tiles.mapbox.com/v3/am3081.h0po4e8k/{z}/{x}/{y}.png");

    var mbTerrainSat = L.tileLayer("https://{s}.tiles.mapbox.com/v3/matt.hd0b27jd/{z}/{x}/{y}.png");

    var mbTerrainReg = L.tileLayer("https://{s}.tiles.mapbox.com/v3/aj.um7z9lus/{z}/{x}/{y}.png");
  
    var mapquestOAM = L.tileLayer("http://{s}.tiles.mapbox.com/v3/am3081.h0pml9h7/{z}/{x}/{y}.png", {
      maxZoom: 19,
    });
    var mapquestHYB = L.layerGroup([L.tileLayer("http://{s}.tiles.mapbox.com/v3/am3081.h0pml9h7/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }), L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/hyb/{z}/{x}/{y}.png", {
      maxZoom: 19,
      subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"],
    })]);
    /*Leaflet Tile Overlay Layers*/
   
    mesonet.map = L.map("map", {
          center: [39.8282,-98.5795],
          zoom: 5,
      layers: [mbTerrainReg]
    });

    var baseLayers = {
      "Street Map": mapquestOSM,
      "Aerial Imagery": mapquestOAM,
      "Imagery with Streets": mapquestHYB,
      "Aerial Imagery with Terrain" : mbTerrainSat,
      "Terrain Contours": mbTerrainReg,

    };
   
    var layerControl = L.control.layers(baseLayers, {}, {
      collapsed: true
    }).addTo(mesonet.map);

    L.control.scale().addTo(mesonet.map);
    /*load and differentiate leaflet-tile layers for use with sidebar layer control*/
   
    /*Necessary for Loading Sidebar Properly*/
    var sidebarLoaded = false; 
    $("#layers").click(function(){
      if(!sidebarLoaded){
        mesonet.sidebar = L.control.sidebar('sidebar', { position: 'left'});
        mesonet.map.addControl(mesonet.sidebar);
        sidebarLoaded = true;
        mesonet.sidebar.show();
      }else{
        mesonet.sidebar.toggle();
      }
    });


    
    /* Functionality for Zoom to Extent*/
  $( "#zoom" ).click(function(map) {
      mesonet.map.setView([42.76314586689494,-74.7509765625], 7);
  });

 
  

    popup.init();
    /* Placeholder hack for IE */
    if (navigator.appName == "Microsoft Internet Explorer") {
      $("input").each(function () {
        if ($(this).val() === "" && $(this).attr("placeholder") !== "") {
          $(this).val($(this).attr("placeholder"));
          $(this).focus(function () {
            if ($(this).val() === $(this).attr("placeholder")) $(this).val("");
          });
          $(this).blur(function () {
            if ($(this).val() === "") $(this).val($(this).attr("placeholder"));
          });
        }
      });
    }
  }
}


//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
var popup = {

    init : function() {

    // position popup
    //windowW = $(window).width();
    $("#map").on("mousemove", function(e) {
      
      var x = e.pageX + 20;
      var y = e.pageY;
      var windowH = $(window).height();
      if (y > (windowH - 100)) {
        y = e.pageY - 100;
      } else {
        y = e.pageY - 20;
      }

      $("#info").css({
        "left": x,
        "top": y
      });
    });

  }

};