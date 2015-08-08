# patreon-alertreon
patreon twitch.tv / OBS alerts



# todo: 

  [x] get bootstrap rendered on page
  [ ] backbonify the input box
  
  
  
  
  
# code notes

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
    

