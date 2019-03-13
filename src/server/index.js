const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    path = require('path');

let mongodb = async () => {
    try {
        mongoose.set('useFindAnyModify',false);
        mongoose.set('useCreateIndex',true);
        await mongoose.connect(
            'mongodb://localhost:27017/anki',
            {
                useNewUrlParser: true
            }
        );
    } catch (err) {
        console.log(err);
        process.exit(-1);
    }

};

let setupServer = async app => {
    app.engine('pug',require('pug').__express);
    app.set('views',__dirname);
    app.use(express.static(path.join(__dirname,"../../public")));

    app.use(bodyParser.urlencoded( { extended: true }));
    app.use(bodyParser.json());

    await mongodb();

    // load models
    app.models = {
        Card : require('./models/card')
    };

    // require routes
    require('./routes')(app);

    app.get('*',(req,res) => {
        res.render("base.pug",{});
    });

    app.listen(8080,() => {
	console.log('listening on port 8080');  
    });
};

setupServer(app);
