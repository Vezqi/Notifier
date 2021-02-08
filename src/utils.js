const moment = require('moment');
const dataTables = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

module.exports = {
    getCurrentTimeFormatted: async() => {
        let current = new Date();
        return moment(current, 'HH:mm:ss').format('HH:mm');
    },

    getCurrentDay: async() => {
        return dataTables[new Date().getDay()];
    },

    sqlEscape: async(str) => {
        return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, (char) => {
            switch (char) {
                case "\0":
                    return "\\0";
                case "\x08":
                    return "\\b";
                case "\x09":
                    return "\\t";
                case "\x1a":
                    return "\\z";
                case "\n":
                    return "\\n";
                case "\r":
                    return "\\r";
                case "\"":
                case "'":
                case "\\":
                case "%":
                    return "\\" + char;
                default:
                    return char;
            }
        });
    }

}