//Some need to change or add later, like database link
const express = require('express');
const mongoose = require('mongoose');
const session = require('cookie-session');
const app = express();

const uri = 'link';

mongoose.connect(uri)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

const userSchema = require('./models/User');
const promptSchema = require('./models/Prompt');

const User = mongoose.model('User', userSchema);
const Prompt = mongoose.model('Prompt', promptSchema);

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static('public'));

const SECRETKEY = 'Propmt blog System';
app.use(session({
    name: 'session_key',
    keys: [SECRETKEY]
}));

function requireLogin(req, res, next) {
    if (!req.session.authenticated) {
        res.redirect('/login');
    } else {
        next();
    }
}

app.get('/', function(req, res) {
    if (!req.session.authenticated) {
        res.redirect('/login');
    } else {
        res.redirect('/prompts');
    }
});

app.get('/login', function(req, res) {
    res.status(200).render('login', {});
});

app.post('/login', async function(req, res) {
    const user = await User.findOne({
        username: req.body.username
    });

    if (user && user.password == req.body.password) {
        req.session.authenticated = true;
        req.session.username = req.body.username;
        res.redirect('/prompts');
    } else {
        res.redirect('/login');
    }
});

app.get('/logout', function(req, res) {
    req.session = null;
    res.redirect('/login');
});

app.get('/prompts', requireLogin, async function(req, res) {

        try {
            const prompts = await Prompt.find();
            res.status(200).render('prompts',
                {
                    prompts: prompts,
                    username: req.session.username
                }
            );

        } catch (err) {
            console.log(err);
            res.status(500).send( 'Failed to load');
        }
    }
);

app.get('/prompts/create', requireLogin, function(req, res) {
        res.status(200).render(
            'create',
            {}
        );

    }
);

app.post('/prompts/create',
    requireLogin,
    async function(req, res) {
        try {
            const newPrompt = new Prompt({
                    title: req.body.title,
                    content: req.body.content,
                    category: req.body.category
                });

            await newPrompt.save();
            res.redirect('/prompts');

        } catch (err) {
            console.log(err);
            res.status(500).send('Failed to create prompt');

        }

    }
);


app.get('/prompts/update/:id', requireLogin, async function(req, res) {
        try {
            const prompt = await Prompt.findById(
                    req.params.id
                );

            res.status(200).render('update',
                {
                    prompt: prompt
                }
            );

        } catch (err) {
            console.log(err);
            res.status(500).send('Failed to load');
        }
    }
);

app.post('/prompts/update/:id', requireLogin, async function(req, res) {
        try {
            await Prompt.findByIdAndUpdate(req.params.id,
                {
                    title: req.body.title,
                    content: req.body.content,
		    category: req.body.category
                }
            );

            res.redirect('/prompts');

        } catch (err) {
            console.log(err);
            res.status(500).send('Failed to update prompt');

        }

    }
);

app.post('/prompts/delete/:id', requireLogin, async function(req, res) {

        try {
            await Prompt.findByIdAndDelete(req.params.id);
            res.redirect('/prompts');

        } catch (err) {
            console.log(err);
            res.status(500).send('error');

        }

    }
);

app.listen(process.env.PORT || 8099);
console.log('started');
