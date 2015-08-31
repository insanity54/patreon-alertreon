# patreon-alertreon
patreon twitch.tv / OBS alerts



## todo: 

  [x] get bootstrap rendered on page
  [ ] backbonify the input box
  
  
  
  
  
## code notes

think of the app as different people.

*people*

    * dispatch guy
    * api guy
    * crawler guy
    * database guy
  
  
*process*

    * api guy gets requests from user
    * api adds crawler task to crawler queue list
    * crawler gets a request id number from db guy and will get back to api guy
    * api guy tells crawler to crawl a user's page
    *  
    
actually...

everything just goes thru redis. redis is the queue. the differnt modules will subscribe to redis and get updated when the GUI does something to add a k/v into redis


    

#### redis scheme:

  * patreon:__alertreontest:patronsCurrent         test data
  * patreon:__alertreontest:patronsAllTime         test data
  * patreon:<creatorName>:patronsAllTime           set of patrons who have ever pleged to creatorName
  * patreon:<creatorName>:patronsCurrent           set of patrons pledged to creatorName
  * alertreon:<aletreonUserId>:patreonUserid       links alertreon user to patreon creator
  * 


