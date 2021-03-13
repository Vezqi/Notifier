require('dotenv').config()
const sqlImport = require('sqlite3').verbose(),
      sql = new sqlImport.Database(process.env.database),
      moment = require('moment'),
      utils = require('../utils');

const dataTables = ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// CREATE TABLE IF NOT EXISTS Airing (UserID TEXT, Title TEXT)
// INSERT OR IGNORE INTO Airing(UserID, Title) VALUES (?, ?)
// DELETE FROM AIRING WHERE lower(Title) = ? AND UserID = ?

let initializers = [
    `CREATE TABLE IF NOT EXISTS "Other" (
        "index"	INTEGER,
        "site"	TEXT,
        "guid"	TEXT,
        PRIMARY KEY("index")
    );`,
    `CREATE TABLE IF NOT EXISTS "Nyaa" (
        "title"	TEXT,
        "url"	TEXT,
        "date"	TEXT,
        "seeders"	INTEGER,
        "leechers"	INTEGER,
        "downloads"	INTEGER,
        "hash"	TEXT,
        "category"	TEXT,
        "size"	TEXT,
        "comments"	INTEGER,
        "trusted"	TEXT,
        "remake"	TEXT,
        "guid"	TEXT
    );`,
    `CREATE TABLE IF NOT EXISTS "All" (
            "index"	INTEGER,
            "name"	TEXT,
            "time"	TEXT,
            "day"	TEXT,
            PRIMARY KEY("index")
        );`,
    `CREATE TABLE IF NOT EXISTS "Monday" (
            "index"	INTEGER,
            "name"	TEXT,
            "time"	TEXT,
            PRIMARY KEY("index")
        );`,
    `CREATE TABLE IF NOT EXISTS "Tuesday" (
            "index"	INTEGER,
            "name"	TEXT,
            "time"	TEXT,
            PRIMARY KEY("index")
        );`,
    `CREATE TABLE IF NOT EXISTS "Wednesday" (
            "index"	INTEGER,
            "name"	TEXT,
            "time"	TEXT,
            PRIMARY KEY("index")
        );`,
    `CREATE TABLE IF NOT EXISTS "Thursday" (
            "index"	INTEGER,
            "name"	TEXT,
            "time"	TEXT,
            PRIMARY KEY("index")
        );`,
    `CREATE TABLE IF NOT EXISTS"Friday" (
            "index"	INTEGER,
            "name"	TEXT,
            "time"	TEXT,
            PRIMARY KEY("index")
        );`,
    `CREATE TABLE IF NOT EXISTS "Saturday" (
            "index"	INTEGER,
            "name"	TEXT,
            "time"	TEXT,
            PRIMARY KEY("index")
        );`,
    `CREATE TABLE IF NOT EXISTS "Sunday" (
            "index"	INTEGER,
            "name"	TEXT,
            "time"	TEXT,
            PRIMARY KEY("index")
        );`,
    `CREATE TABLE IF NOT EXISTS "DanbooruCache" (
            "html"	TEXT
        );`
];

const database = {
    name: 'database',

    init: async () => {
        initializers.forEach((statement) => {
            sql.run(statement, (err, rows) => {
                if (err) {
                    console.error(`Error initializing table: ${err}`);
                }
            });
        })
    },

    refreshShows: async (shows) => {
        sql.serialize(() => {
            dataTables.forEach((table) => {
                sql.run(`DELETE FROM "${table}"`, (err, rows) => {
                    if (err) {
                        console.error(`Error deleting table data: ${err}`);
                    }
                });
            });

            sql.run('BEGIN TRANSACTION');

            for (var show of shows) {
                let name = show.showName,
                    time = show.releaseTime,
                    weekday = show.dayOfWeek;

                sql.run(`INSERT INTO ${weekday}(name, time) VALUES(?, ?)`, [name, time], (err, rows) => {
                    if (err) {
                        console.error(`Error refreshing shows: ${err}`);
                    }
                });

                sql.run(`INSERT INTO 'All' (name, time, day) VALUES(?, ?, ?)`, [name, time, weekday], (err, rows) => {
                    if (err) {
                        console.error(`Error inserting data: ${err}`);
                    }
                });
            }

            sql.run('COMMIT');

        });
    },

    checkForNewEpisodes: () => {
        return new Promise((res, rej) => {
            sql.all(`SELECT * FROM 'All'`, async (err, rows) => {
                if (err) {
                    rej(`Error checking database for new episodes: ${err}`);
                } else {
                    let currentDay = await utils.getCurrentDay();
                    let currentTime = await utils.getCurrentTimeFormatted();
                    let allShows = rows.filter((show) => show.day === currentDay && show.time === currentTime);
                    res(allShows);
                }
            });
        });

    },

    sub: (userId, show) => {
        // Maybe add a check to see if the show is airing? If it isn't, say that the show might not be airing
        return new Promise((res, rej) => {
            sql.run(`INSERT OR IGNORE INTO Airing(UserID, Title) VALUES (?, ?)`, [userId, utils.sqlEscape(show)], (err, rows) => {
                if (err) {
                    rej(`An error occured while subscribing to that show: ${err}`);
                } else {
                    res(rows);
                }
            });
        });
    },

    // this doesn't work for some reason. pls fix
    listSubscriptions: (userId) => {
        return new Promise((res, rej) => {
            sql.all(`SELECT * FROM Users WHERE UserID = ?`, [userId], (err, rows) => {
                if (err) {
                    rej(`An error occured while listing subscription: ${err}`);
                } else {
                    res(rows);
                }
            });
        });
    },

    unsub: async (userid, show) => {

    },

    listCurrent: async () => {

    },

    refreshNyaa: async (data) => {
        sql.serialize(() => {
            sql.run(`DELETE FROM "Nyaa"`, (err, rows) => {
                if (err) {
                    console.error(`Error deleting table data: ${err}`);
                }
            });

            sql.run('BEGIN TRANSACTION');

            data.forEach((item) => {
                let splitGuid = item.guid.$t.split('/');
                let guid = splitGuid[splitGuid.length - 1];

                sql.run(`INSERT INTO Nyaa(title, url, date, seeders, leechers, downloads, hash, category, size, comments, trusted, remake, guid) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
                    utils.sqlEscape(item.title),
                    utils.sqlEscape(item.guid.$t),
                    utils.sqlEscape(item.pubDate),
                    utils.sqlEscape(item['nyaa:seeders']),
                    utils.sqlEscape(item['nyaa:leechers']),
                    utils.sqlEscape(item['nyaa:downloads']),
                    utils.sqlEscape(item['nyaa:infoHash']),
                    utils.sqlEscape(item['nyaa:category']),
                    utils.sqlEscape(item['nyaa:size']),
                    utils.sqlEscape(item['nyaa:comments']),
                    utils.sqlEscape(item['nyaa:trusted']),
                    utils.sqlEscape(item['nyaa:remake']),
                    utils.sqlEscape(guid)
                ], (err, rows) => {
                    if (err) {
                        console.error(`Error refreshing shows: ${err}`);
                    }
                });
            });

            sql.run('COMMIT');
        });
    },

    getMostRecentNyaaGuidFromDatabase: () => {
        return new Promise((res, rej) => {
            sql.all(`SELECT guid FROM 'Other' WHERE site = 'nyaa'`, (err, rows) => {
                if (err) {
                    res(`Failed to obtain guid from database: ${err}`);
                } else {
                    res(rows[0].guid);
                }
            })
        })
    },

    setMostRecentNyaaGuid: (newGuid) => {
        return new Promise((res, rej) => {
            sql.run(`UPDATE Other SET guid = ? WHERE site = ?`, [newGuid, 'nyaa'], (err, rows) => {
                if (err) {
                    rej(`An error occurred when updating Nyaa's guid database record: ${err}`);
                } else {
                    res(rows);
                }
            })
        });
    },

    getNyaaShowById: (id) => {
        return new Promise((res, rej) => {
            sql.all(`SELECT * FROM 'Nyaa' WHERE guid = ?`, [id], (err, rows) => {
                if (err) {
                    rej(`An error occurred when querying that nyaa guid: ${err}`);
                } else {
                    res(rows[0]);
                }
            });
        });
    },

    checkForNewNyaaLinks: () => {
        return new Promise((res, rej) => {
            sql.all(`SELECT * FROM 'Nyaa'`, async (err, rows) => {
                if (err) {
                    rej(`Error checking database for new Nyaa links: ${err}`);
                } else {
                    let mostRecentNotifiedGuid = await database.getMostRecentNyaaGuidFromDatabase();
                    let parsedGuid = parseInt(mostRecentNotifiedGuid);
                    let nyaaLinks = rows.filter((row) => (row.guid > parsedGuid));
                    // Previously checked to see if nyaaLinks had 1 or more values, and then resolved if so.
                    res(nyaaLinks);
                }
            });
        });
    },

    setDanbooruCache: (data) => {
        return new Promise((res, rej) => {
            sql.run(`INSERT INTO DanbooruCache(html) VALUES (?)`, [data], (err, rows) => {
                if(err) {
                    rej(`Error cache Danbooru request: ${err}`);
                } else {
                    res(rows);
                }
            });
        });
    }

}

module.exports = database;