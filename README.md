# Notifier

Receive a message on Discord whenever a new show is is airing.

# To-do

- Give the user a list of all airing shows from database, that way they can directly copy it and not have to work about any typos in the title. Alternatively, we could use a levenshtein distance function and compare the show the user wants to subscribe to and the name of the show in our database, and then if it's above a certain threshold we can 'subscribe them'.

- Support for animepahe, crunchyroll, funimation, and other sites.

- Subscription implementation. Async issues put this to a temporary halt.

- Message embeds instead of plain 'ole text messages.

# Known issues

- checkForNewEpisodes.js reports new episodes 8-ish hours early? Has to do with the timestamp of the VPS/the timestamp on the website we're pulling data from.

# Other

If you have any questions about this at all, or would like to contribute, feel free to open an issue or DM me on [Twitter](https://twitter.com/Vezqi)! :)