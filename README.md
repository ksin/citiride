citiride
========

*Find the best route to pick up your CitiBike and get to your destination.*

This app combines constantly-updated CitiBike station map information with Google Directions to map an entire ride with the best walking route and the best biking route for you.

### Purpose

Mobile first. We aim to make this useful to anyone in the city who doesn't want to download some apps onto their phone just to get from one place to another. They should be able to easily this kind of information with their phone's built-in browser. 

If at least one person found this app useful and not as annoying as downloading some apps onto their phone to ride a CitiBike, then citiride has achieved its purpose.

###How it works

The user enters a starting point address and a destination address in the home page and receives a map with four points. 

  A. The starting point. 
  
  B. The nearest dock with at least two available bikes. 
  
  C. The dock nearest to your destination with at least two open docks. 
  
  D. The destination.
  
The path from a -> b is the fastest walking path according to Google Directions.
The path from b -> c is the fastest biking path.
The path from c -> d is also the fastest walking path.

### What's happening under the hood

The main API used in this app is Google Directions. We wrap the API with the [google-directions-ruby](https://github.com/joshcrews/google-directions-ruby) gem.

CitiBike has real time biking and docking information in JSON format.  

Before sending a request to Google Directions, we find the closest city bike station to our starting point with at least two available bikes. We also find the closest city bike station to our destination with at least two available docks. This is calculated with the [geodistance](https://github.com/kristianmandrup/geo-distance) gem, using longitude and latitude points acquired from the CitiBike JSON object.

### Contributors

Started by: Raghav Malik, Dinesh Rai, Mario Marroquin, Ken Sin

Current maintainer: Ken Sin

### How to contribute

1. Raise an issue.
2. Fork the repository.
3. Clone the forked repository into your local environment.
4. Create a separate branch for the feature you want to add/fix.
5. When you are done working on the feature, push the changes to that branch and make a pull request.

Trello board of tasks that need to be done:
https://trello.com/b/76XY3rLi/citiride
