var mysql = require('mysql');

var savedPool = null;

function runQuery(queryToExec, callback) {
    if (!savedPool) {
        savedPool = mysql.createPool({
            connectionLimit: 10,
            host: 'localhost',
            user: 'root',
            password: 'AmitSingh123@',
            database: 'UserDb'
        });

        module.exports.savedPool = savedPool;

        savedPool.getConnection(function (err, connection) {
            if (err)
                callback(err, null);

            connection.query(queryToExec, function (error, results, fields) {
                connection.release();
                if (error)
                    callback(error, null);
                callback(null, results);
            });
        });
    } else {
        savedPool.getConnection(function (err, connection) {
            if (err)
                callback(err, null);

            connection.query(queryToExec, function (error, results, fields) {
                connection.release();
                if (error)
                    callback(error, null);
                callback(null, results);
            });
        });
    }
}

module.exports = { savedPool, runQuery, mysql };