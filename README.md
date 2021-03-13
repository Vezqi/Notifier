# Notifier

Receive a message on Discord whenever a new episode of an anime airs/has released.

# To-do

- Give the user a list of all airing shows from database, that way they can directly copy it and not have to work about any typos in the title. Alternatively, we could use a levenshtein distance function and compare the show the user wants to subscribe to and the name of the show in our database, and then if it's above a certain threshold we can 'subscribe them'.

- Support for animepahe, crunchyroll, funimation, and other sites.

- Subscription implementation. Async issues put this to a temporary halt.

- Message embeds instead of plain boring text messages.

- Add filters for feed channels. 

- Sync watchlists

- Organize internal classes. I.e - request object will has subclasses to organize requests, per website.

- Add command aliases

- Cache randbooru requests

# Known issues

- None as far as I'm aware :)

# Other

If you have any questions about this at all, or would like to contribute, feel free to open an issue or DM me on [Twitter](https://twitter.com/Vezqi)! :)