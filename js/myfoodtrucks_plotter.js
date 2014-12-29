$(function() {
  
  google.maps.visualRefresh = true;
  var mapOptions = {
    center: new google.maps.LatLng(37.7833,-122.4167),// SF location
    zoom: 12,
    streetViewControl: false,
  };

  // create and add google map to DOM
  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
 
  var foodtruckslist = [];
  var container = document.createElement('div');
  container.id = "mycontainer";

  var layout = document.getElementById('sidebar-list');
  var input = (document.getElementById('truckSearch'));
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);//push controls for google maps-like feel
  var searchBox = new google.maps.places.SearchBox(input);//create search box
  google.maps.event.addListener(searchBox, 'places_changed', function() {//Listen for selection from suggestions
      	var places = searchBox.getPlaces();
      	var bounds = new google.maps.LatLngBounds();
    		for (var i = 0; i<places.length; i++) {
            //for each place create marker
      			var image = 'http://www.google.com/intl/en_us/mapfiles/ms/micons/blue-dot.png';
      			var marker = new google.maps.Marker({
        			map: map,
    					icon: image,
        			title: places[i].name,
        			position: places[i].geometry.location
      			});
			      google.maps.event.addListener(marker, 'click', function() {
                //add listener to create info window
	    	        infowindow.close();
			          infowindow.setContent(places[i].name);
		            infowindow.open(map, marker);
			      });
      			bounds.extend(places[i].geometry.location);
    		}
    		map.fitBounds(bounds);
			  map.setZoom(14);
  });
  google.maps.event.addListener(map, 'bounds_changed', function() {
      //this is to order by relevancy (distance)
    	var bounds = map.getBounds();
    	searchBox.setBounds(bounds);
  });	

  foodtrucks = $.getJSON(
    "http://data.sfgov.org/resource/rqzj-sfat.json", {
      $where: "status='APPROVED' AND latitude IS NOT NULL AND longitude IS NOT NULL",
      $select: "objectid,applicant,facilitytype,address,fooditems,location,schedule"
    },
    function(data) {
      clusterer(data);
  });

  // loops through each food truck, adds it to the DOM in the form of a marker, and assigns it an event listener for clicking
  function clusterer(foodtrucks) {
    var marker;
    var marker_array = [];
    var lat;
    var lng;
    var latLng;
    foodtruckslist=[];
    var myfooditems=[];
    for (var i = 0; i < foodtrucks.length; i++) {
      lat = foodtrucks[i].location.latitude;
      lng = foodtrucks[i].location.longitude;
      latLng = new google.maps.LatLng(lat, lng);
      marker = new google.maps.Marker({
        'objectid': foodtrucks[i].objectid,
        'address': foodtrucks[i].address,
        'position': latLng,
        'applicant': foodtrucks[i].applicant,
        'facilitytype': foodtrucks[i].facilitytype,
        'fooditems': foodtrucks[i].fooditems,
        'icon': 'img/marker_1.png',

      });
      var sidebarContentString = 
          '<div class="row foodtruck-details" id="objectid'+ foodtrucks[i].objectid +'">' +
              '<div class="foodtruck-info" >'+ foodtrucks[i].applicant +'</div>' +
              '<div class="foodtruck-info"><span style="color:#6699FF; font-weight:bold;">TYPE: </span>' + foodtrucks[i].facilitytype +'</div>' +
              '<div class="foodtruck-info"><span style="color:#6699FF; font-weight:bold;">FOOD: </span>'+ foodtrucks[i].fooditems +'</div>' +
              '<div class="foodtruck-info"><span style="color:#6699FF; font-weight:bold;">ADDRESS: </span><div>'+ foodtrucks[i].address +'</div></div>' +
          '</div>';
      foodtruckslist.push(sidebarContentString);
      //console.log("inside for loop where i="+i+"and foodtruckslist length"+foodtruckslist.length);
        
      //store fooditems in a map
      //console.log("FoodItems"+foodtrucks[i].fooditems);
      var items = foodtrucks[i].fooditems.split(':');
      for (var fi=0;fi<items.length;fi++) {
        //console.log("item is "+fi)
        if (myfooditems.indexOf(items[fi]) < 0) {
          myfooditems.push(items[fi]);
        }
      }
      console.log("Items"+items.length+items);
      // When click on the marker, the information window will open.
      google.maps.event.addListener(marker, 'click', function() {
        console.log(this.fooditems);
        this.fooditems = this.fooditems.replace(/:/g, ",").split(',').splice(0,12).join(',');

        // info window
        var infowindow = new google.maps.InfoWindow({
          content: contentString
        });

        var contentString = 
          '<div class="info-wrapper" id="objectid'+ this.objectid +'">' +
            '<div class="foodtruck-info">' +
              '<div class="foodtruck-applicant" >'+ this.applicant +'</div>' +
              '<div class="foodtruck-details"><span style="color:#6699FF; font-weight:bold;">TYPE: </span>' + this.facilitytype +'</div>' +
              '<div class="foodtruck-details"><span style="color:#6699FF; font-weight:bold;">FOOD: </span></br>'+ this.fooditems +'</div>' +
              '<div class="foodtruck-details"><span style="color:#6699FF; font-weight:bold;">ADDRESS: </span></br><div>'+ this.address +'</div></div>' +
            '</div>' +
          '</div>';
        infowindow.setContent(contentString);
        infowindow.open(map, this);
      }); //addlinstener close
    
      marker_array.push(marker);
    }//end of for loop
    console.log("Printing foodItems"+myfooditems.length+myfooditems);
    // make clusters
    var markerCluster = new MarkerClusterer(map, marker_array, {
      minimumClusterSize: 2,
      averageCenter: true,
    });

    // get total number of food trucks
    var getTotalTrucks = function(total) {
      $('#foodtrucks-number').text(total);
    };
    getTotalTrucks(foodtrucks.length);
    console.log("calling refreshSidePanel with foodtruckslist length"+foodtruckslist.length);
    refreshSidePanel(0);
  }; //end of function

  function refreshSidePanel(pageNo) {
    var html = '<div>';
    var result = '<div class="foodtruck-details id=netResults">' + foodtruckslist.length + 'Results </div>'
    html += result;
    //1page has 4 items
    console.log("inside refreshSidePanel with foodtruckslist length"+foodtruckslist.length);
    var index=pageNo*3;
    for (var ft = index; ft<index+3; ft++) {
    html+=foodtruckslist[ft];
    }
    html+= '</div>';
    layout.innerHTML = html;
  }

  /* pagination plugin */
    $('#pagination').twbsPagination({
        totalPages: 53,
        visiblePages: 4,
        first: "",
        last: "",
        onPageClick: function (event, page) {
            refreshSidePanel(page);
        }
    });
  });
