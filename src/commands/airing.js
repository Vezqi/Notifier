module.exports = {
    name: 'airing',
    description: 'Sends a list of currently airing shows.',
    args: true,
    needsArgs: true,
    run: ({ database, message, args }) => {

        let shows = await database.listAiring();

    }
}