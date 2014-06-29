app.controller('sidebarCtrl', function sidebarCtrl($scope, sailsSocket, $http){

  $scope.Layers = [
      {
        name:'ATR Stations',
        layers:[
          {name:'All TMAS Stations',selector:'tmas_all', loaded:false, visible:false, type:'d3',style:{cursor:'pointer',stroke:'black','stroke-width':'0px',fill:'#ff0'},mouseover:{info:[{name:"Station ID: ",prop:"station_id"},{name:"Functional Class Code: ",prop:"func_class_code"},{name:"Method of Classification: ",prop:"method_of_vehicle_class"},{name:"Method of Truck Weighing: ",prop:"method_of_truck_weighing"},{name:"Type of Sensor: ",prop:"type_of_sensor"}],style:{cursor:'pointer',stroke:'black', stroke:'red','stroke-width':'2px'}}},
          {name:'TMAS Class Stations',selector:'tmas_c', loaded:false, visible:false, type:'d3',style:{cursor:'pointer',stroke:'black','stroke-width':'0px',fill:'#0027FF'},mouseover:{info:[{name:"Station ID: ",prop:"station_id"},{name:"Functional Class Code: ",prop:"func_class_code"},{name:"Method of Classification: ",prop:"method_of_vehicle_class"},{name:"Method of Truck Weighing: ",prop:"method_of_truck_weighing"},{name:"Type of Sensor: ",prop:"type_of_sensor"}],style:{cursor:'pointer',stroke:'black', stroke:'red','stroke-width':'2px'}}},
          {name:'TMAS WIM Stations',selector:'tmas_w', loaded:false, visible:false, type:'d3',style:{cursor:'pointer',stroke:'black','stroke-width':'0px',fill:'purple'},mouseover:{info:[{name:"Station ID: ",prop:"station_id"},{name:"Functional Class Code: ",prop:"func_class_code"},{name:"Method of Classification: ",prop:"method_of_vehicle_class"},{name:"Method of Truck Weighing: ",prop:"method_of_truck_weighing"},{name:"Type of Sensor: ",prop:"type_of_sensor"}],style:{cursor:'pointer',stroke:'black', stroke:'red','stroke-width':'2px'}}},
          {name:'TMAS Volume Stations',selector:'tmas_v', loaded:false, visible:false, type:'d3',style:{cursor:'pointer',stroke:'black','stroke-width':'0px',fill:'#00FF0E'},mouseover:{info:[{name:"Station ID: ",prop:"station_id"},{name:"Functional Class Code: ",prop:"func_class_code"},{name:"Method of Classification: ",prop:"method_of_vehicle_class"},{name:"Method of Truck Weighing: ",prop:"method_of_truck_weighing"},{name:"Type of Sensor: ",prop:"type_of_sensor"}],style:{cursor:'pointer',stroke:'black', stroke:'red','stroke-width':'2px'}}},
          {name:'NTAD Stations',selector:'ntad_all', loaded:false, visible:false, type:'d3',style:{cursor:'pointer',stroke:'black','stroke-width':'0px',fill:'red'},mouseover:{info:[{name:"Station ID: ",prop:"station_id"},{name:"Year Established: ",prop:"year_estab"},{name:"Purpose: ",prop:"primary_pu"}],style:{cursor:'pointer',stroke:'black', stroke:'red','stroke-width':'2px'}}}
   ]       
      }
   
  ];

  
  $scope.oneAtATime = true;
  
  $scope.layerClick=function(layer){
    var typeSelect = "#";
    if(layer.type == 'leaflet'){typeSelect = '';}
        
      if(!layer.loaded){
      $http.post('/geodata/getLayer', {selector:layer.selector}).success(function(geoData){
        var options = {layerId:layer.selector};
        if(typeof layer.mouseover != 'undefined'){
          options.mouseover = layer.mouseover;

        }
        if(typeof layer.style != 'undefined'){
          options.style = layer.style;
        }
        if(typeof layer.choropleth != 'undefined'){
          var data = [],min,max;
          if (geoData.type == "Topology") {
            geoData = root.topojson.feature(geoData, geoData.objects.features);
          }
          geoData.features.forEach(function(feature){
            data.push(feature.properties[layer.choropleth.key]*1);
          })
          min=d3.min(data);
          max=d3.max(data);
          console.log(data,min,max);
          var legend_domain = d3.scale.quantile()
            .domain([min,max/5])
            .range(layer.choropleth.range);

          var color = d3.scale.threshold()
            .domain(legend_domain.quantiles())
            .range(layer.choropleth.range.reverse());

          options.choropleth = {scale:color,key:layer.choropleth.key};
          leafletLegend(color,layer);
        }
     
      
       mesonet.map.addLayer(new L.GeoJSON.d3(geoData,options));
      
        if(typeof layer.style != 'undefined'){
          for(key in layer.style){
            $('#'+ layer.selector+' path').css(key,layer.style[key]);
          }
        }
      
        layer.loaded=true;
        layer.visible=true;
        if(typeof layer.choropleth == 'undefined'){
        $('#legend-list').append('<li id="'+layer.selector+'_legend"><svg width="20" height="20"><circle cx="10" cy="10" r="7" fill="'+layer.style.fill+'" class="'+layer.selector+'""></circle><</svg><span>'+layer.name+'</span></li>');
        }
      });
  
    }else if(layer.visible){
      $(typeSelect+ layer.selector).fadeOut(600);
      $('#'+ layer.selector+'_legend').hide();
      layer.visible=false;
    }else {
      $(typeSelect+ layer.selector).fadeIn(600);
      $('#'+ layer.selector+'_legend').show();
      rainfallLegend(layer);
      layer.visible=true;
    }    
  }

  leafletLegend = function(scale,layer){
    var legendText ='<span id="'+layer.selector+'_legend"><li>'+layer.name+'</li>';
    var prev = 0;
    var numbers = ["zero","one","two","three","four","five","six","seven","eight","nine"];
   // console.log(scale.domain());
    scale.domain().forEach(function(d,i){
      
      if(i === 0){
        legendText += '<li><svg width="20" height="20"><rect width="300" height="100" fill="'+layer.choropleth.range[i]+'"></rect></svg><span>&lt;= '+number_format(scale.domain()[i].toFixed(0))+' </span></li>';
      }
      else{
        legendText += '<li><svg width="20" height="20"><rect width="300" height="100" fill="'+layer.choropleth.range[i]+'"></rect></svg><span> '+number_format(scale.domain()[i-1].toFixed(0))+' - '+number_format(scale.domain()[i].toFixed(0))+'</span></span></li>';
      }
    });
    
    legendText += '<li><svg width="20" height="20"><rect width="300" height="100" fill="'+layer.choropleth.range[scale.domain().length]+'"></rect></svg><span>&gt; '+number_format(scale.domain()[scale.domain().length-1].toFixed(0))+'</span></li>';
      
    legendText +="</span>";
   
    $('#legend-list').append(legendText);
    
  }

  rainfallLegend=function(layer){
    var legendText ='<span id="'+layer.selector+'_legend"><li>'+layer.name+'</li>';
    var rainfall_legend = [{'value':84962.7,'color':'rgba(26,150,65,255)'},{'value':99541.8,'color':'rgba(166,217,106,255)'},{'value':114121,'color':'rgba(255,255,192,255)'},{'value':128700,'color':'rgba(253,174,97,255)'},{'value':143279,'color':'rgba(215,25,28,255)'}];
    if(layer.selector == 'rainfall'){
      $('#rainfall_legend').remove();
      rainfall_legend.forEach(function(d,i){
        if(i === 0){
          legendText += '<li><svg width="20" height="20"><rect width="300" height="100" fill="'+d.color+'"></rect></svg><span>&lt;= '+(rainfall_legend[i].value * 0.000393701).toFixed(2)+'\" </span></li>';
        }
        else{
          legendText += '<li><svg width="20" height="20"><rect width="300" height="100" fill="'+d.color+'"></rect></svg><span> '+(rainfall_legend[i-1].value * 0.000393701).toFixed(2)+'\" - '+(rainfall_legend[i].value * 0.000393701).toFixed(2)+'\"</span></span></li>';
        }
      });
      $("#legend-list").append(legendText);
    }   
  }
  
  
  $scope.hideLayers=function(Layers){
  
    currentLayer = $scope.Layers;
    currentLayer.forEach(function(currentLayer){
      currentLayer.layers.forEach(function(layer){
        var typeSelect = "#";
        if(layer.type == 'leaflet'){typeSelect = '';}
        if(layer.visible){
          $(typeSelect+ layer.selector).fadeOut(600);
          $('#'+ layer.selector+'_legend').fadeOut(600);
          layer.visible=false;
        }
      });
    });
   // mesonet.sidebar.toggle();
  
  }

  $scope.isVisible = function(layer){
    if(layer.visible){
      return "active";
    
    }
    return "";
  }  

})

//------------------------------------------------------------------------------------------------------------
// Helper Functions
//--------------------------------------------------------------------------------------------------------------
function number_format(x){
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
