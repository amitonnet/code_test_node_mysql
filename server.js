const http = require("http");
const bodyParser = require('body-parser');
const express = require("express");
const objExpress = express();

var mysqlDb = require('./mysqlDb');

objExpress.use(bodyParser.json());
objExpress.use(bodyParser.urlencoded({ extended: false }));

let objQuery = {
    getUsers: 'SELECT * FROM users',
    getUserById: 'SELECT * FROM users WHERE id_user={userId}',
    saveUser: "INSERT INTO Users (first_name, last_name, address) VALUES ('{firstName}', '{lastName}', '{userAddress}')"
}

let validateToken = (req, res, next) => {
    let authToken = req.headers['x-access-token'] || req.headers['authorization'];

    if (authToken.startsWith('Bearer '))
        authToken = authToken.slice(7, authToken.length);

    if (authToken !== "testtoken")
        res.json({ "response": "Not valid token" });
    next();
};

objExpress.get('/', (req, res) => {
    res.send('Service is running...');
});

objExpress.post('/create_user', validateToken, (req, res) => {
    try {
        var body = req.body;

        let sqlQuery = objQuery.saveUser.replace(/{firstName}/g, body.firstName)
            .replace(/{lastName}/g, body.lastName)
            .replace(/{userAddress}/g, body.userAddress);

        mysqlDb.runQuery(sqlQuery, (err, data) => {
            if (err) {
                res.json({ "response": "Db error: " + err });
            }
            res.json({
                'success': 'User created successfully'
            });
        });
    } catch (e) {
        res.json({ "response": "error: " + e });
    }
});

objExpress.get('/get_users', validateToken, (req, res) => {
    try {
        mysqlDb.runQuery(objQuery.getUsers, (err, data) => {
            if (err) {
                res.json({ "response": "Db error: " + err });
            }
            res.json(data);
        });
    } catch (e) {
        res.json({ "response": "error: " + e });
    }
});

objExpress.get('/get_user/:userId', validateToken, (req, res) => {
    try {
        let userId = req.params.userId;

        if (!userId || isNaN(userId) || userId <= 0)
            res.json({ "response": "User id not correct/provided" });

        let sqlQuery = objQuery.getUserById.replace(/{userId}/g, userId);
        mysqlDb.runQuery(sqlQuery, (err, data) => {
            if (err) {
                res.json({ "response": "Db error: " + err });
            }
            res.json(data);
        });
    } catch (e) {
        res.json({ "response": "error: " + e });
    }
});

http.createServer(objExpress).listen(1000, () => {
    console.log("Listening on http://localhost:1000");
});