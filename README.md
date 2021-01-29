# Notifier

Receive a message on Discord whenever a new show is released

Work in progress, running into some issues when awaiting `database.listSubscriptions()` after awaiting `database.checkNew()`.

# To-do

(This is related to that work in progress comment ^^) Every minute, check to see if there are any new episodes. If there is, search database to see if a show has a similar name/equal name to the show that has a new episode. If it does, then ping the user.

Alternatively, give the user a list of all airing shows from database, that way they can directly copy it and not have to work about any typos in the title. Alternatively, we could use a levenshtein distance function and compare the show the user is subscribed to and the name of the show in our database.

Someday this will be less vague, let me know on [Twitter](https://twitter.com/Vezqi) if you want to collaborate. ^^
