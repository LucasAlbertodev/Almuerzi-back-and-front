 almuerzi.app-
Back and Front using javascript and html

Simple CRUD, authorization, authentication, JSON, setting users (admin, users)

javascript backend and html to render GUI

Production deploy: serverless-58ojaxfpb-lucasalbertodev.vercel.app
 
 
 
 Render :
In the main.js we are rendering our page, then manipulating the dom and also sending our order through "click" and "onsubmit" events. - The first thing we do is call fetch by passing our server url (by default fetch has the METHOD of GET), this what it will do is bring us what we have loaded in our database, (the elements listed) - While we wait for our request we must have "disabled" our submit button as well as a loading text on the page - Once the request arrives (.then(data=> {"I pass whatever I want to execute"}) - you will enable the button and replace the text loading with what comes in from fetch - What comes from fetch comes as a Json (which I must indicate in the first.then)(.then(response=> response. Json()) - To this json I must extract the id and name, give it html structure, insert it to the dom
- In the click event I must extract its id by sending it to an element - In the onsubmit event I must access that id and instertar it to a variable, and then pass it from that variable to another which I am going to put in an object which will be the order to be sent and will contain the meal_id and the user_id to which the order belongs
