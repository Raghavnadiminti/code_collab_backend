const express = require('express');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const { Editors, Users } = require('./model');
const router = express.Router();


router.get('/checkrooms', async (req, res) => {
    try {
        const { room_name, roomCode } = req.query;
        let room = await Editors.findOne({ room_name, roomCode });

        if (room) {
            res.send(room);
        } else {
            res.send(false);
        }
    } catch (err) {
        res.status(500).send('Server error');
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.query;
        let user = await Users.findOne({ username });

        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            res.send(isMatch ? true : false);
        } else {
            res.send(false);
        }
    } catch (err) {
        res.status(500).send('Server error');
    }
});


router.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.query;
        let existingUser = await Users.findOne({ username });

        if (existingUser) {
            res.send(false);
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const newUser = new Users({ username, password: hashedPassword });

            await newUser.save();
            res.send(true);
        }
    } catch (err) {
        res.status(500).send('Server error');
    }
});


router.post('/createroom', async (req, res) => {
    try {
        const { roomname, passCode, lang, username } = req.body;
        let existingRoom = await Editors.findOne({ room_name: roomname });

        if (existingRoom) {
            res.send(false);
        } else {
            const newRoom = new Editors({ room_name: roomname, members: [], language: lang, roomCode: passCode, host: username });
            await newRoom.save();
            res.send(true);
        }
    } catch (err) {
        res.status(500).send('Server error');
    }
});

router.post('/code_run', async (req, res) => {
    try {
        const { code, lang, input } = req.body; 
        const langMap = {
            python: 'python3',
            javascript: 'js',
            cpp: 'cpp',
            typescript: 'typescript',
            java: 'java',
        };

        const language = langMap[lang];
        if (!language) {
            return res.json({ output: 'Language not supported' });
        }

       
        const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
            language: language,
            version: '*',
            files: [{ name: 'main', content: code }],
            stdin: input || '' 
        });

        res.json({ output: response.data.run.output });
    } catch (error) {
        res.json({ output: 'Error executing code' });
    }
});

module.exports = router;
