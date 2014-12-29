foodtruckLocator
================

The website shows all the approved foodtrucks of SanFrancisco.

The data is used from the public website [SF data](http://www.datasf.org/).[FoodTruck] (https://data.sfgov.org/Economy-and-Community/Mobile-Food-Facility-Permit/rqzj-sfat?)

Tech Stack:
Front-End: HTML5, JavaScript, CSS
BackEnd: Python (server.py)
External Libraries Used: google maps api v3, twitter bootstrap

Code written by me:
html:
index.html
css:
styles.css
js:
myfoodtrucks_plotter.js

Code not written by me:
marker_clusterer.js (google maps api library)
server.py (dummy python server)

What is covered:
1. List all foodtrucks of SanFrancisco on the map using google maps api
2. Use google maps api3 clusterer to form clusters of foodtrucks 
          (https://code.google.com/p/google-maps-utility-library-v3/source/checkout)
3. List the information using infoWindow on clicking a particular foodtruck.
4. SideBar lists all the foodtrucks information

What is currently not implemented:
Functional:
1. Detect user current location
2. Sort the foodtrucks closest to the user location and based on foodtruck availability
3. Filter the foodtrucks based on cuisine.

Time Spent on the Project:
I spent about 7hours on this project over this weekend.

Original Idea:
I picked up this project with the intention of learning some interesting front end technologies like node.js or play.
However, due to want of time, i decided to first get a working implementation using basic html/js 
and then port the code to use a framework.





