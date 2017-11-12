# cs252-lab06
This is lab06 for CS252 (Group Project)

Project Members:

		Andrew Berendsen - aberends@purdue.edu

		Ramsey Ali - ali59@purdue.edu

		Kyle Bentain - kbentain@purdue.edu
  
  Project Name:
  
    -Priests vs Thiefs
  
  Project:
  
    -Game with online lobby system, players enter the lobby in groups of 4 or more
    -The game starts with each person (user) starting with 100 points
    -Each round, the players are given the choice to either "help" or "steal" 
    	-If all players "help" then the collective whole is awarded 10 points
    	-If a single player picks "steal" then they get 30 points
    	-If more than 2 players pick "steal" in the same round then they each get deducted 20 points
    -After 10 rounds each players final point value revealed is revealed to all users in the lobby
    -The user with the most points win
    -In the case of a tie, everyone loses (this is still to be determined)
  
  Technologies:
  
    -HTML5
    -NodeJS
    -AngularJS
    
Project Idea Credit:

    The project idea is owed to the "Prisoner Dilemma" and the various games built prior that work off the concept.
    
Install Instructions:

	1) Download Node.js (make sure npm is installed as well)
	2) npm install request
	3) node server.js
	4) Server is running on specified port #
	
Useful Links:
https://github.com/aerrity/socket-click-example - Real-time communication between users on webpage (see last example on page)
https://scotch.io/courses/build-a-nodejs-website - Need to re-do skeleton using these tutorials - well give us a better base
