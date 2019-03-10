const Twitter = require('twitter');

module.exports = (app, io) => {
    let socketConn;
    let twitterStream;

    let twitter = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    });

    app.locals.searchString = 'javascript';
    app.locals.showTweets = true;
    app.locals.showRetweets = false;

    /**
     * Resumes twitter stream.
     */
    const stream = () => {
        console.log('Streaming the tweets for \"' + app.locals.searchString + '\"');
        twitter.stream('statuses/filter', { track: app.locals.searchString }, (stream) => {
            stream.on('data', (tweet) => {
                sendMessage(tweet);
            });

            stream.on('error', (error) => {
                //console.log("HATA VAR HOCEAM");
                //console.log(error);
            });

            twitterStream = stream;
        });
    };

    // EMITTER
    const sendMessage = (msg) => {

        if (itIsARetweet(msg.text) && !app.locals.showRetweets) {
            return;
        }

        if (!itIsARetweet(msg.text) && !app.locals.showTweets) {
            return;
        }
        console.log(msg.text);
        console.log(app.locals.searchString);
        socketConn.emit("tweets", msg);
    };

    const itIsARetweet = (messageText) => {
        return messageText.startsWith('RT @');
    };

    // CONNECT
    io.on("connection", socket => {
        socketConn = socket;
        stream();
        socket.on("connection", () => console.log("Client connected"));
        socket.on("disconnect", () => console.log("Client disconnected"));
    });

    // SET SHOW TWEETS
    app.post('/setShowTweets', (req, res) => {

        switch(req.body.option) {
            case "showTweets":
                app.locals.showTweets = req.body.value;
                break;
            case "showRetweets":
                app.locals.showRetweets = req.body.value;
                break;
        }

        console.log("showTweets:", app.locals.showTweets);
        console.log("showRetweets:", app.locals.showRetweets);
        twitterStream.destroy();
        res.send("stream stopped successfully");
        setTimeout(function(){ stream(); }, 300);
    });

    // EDIT SEARCH WORD
    app.post('/setSearchString', (req, res) => {
        app.locals.searchString = req.body.str;
        console.log("Search string edited to =>", app.locals.searchString);
        twitterStream.destroy();
        setTimeout(function(){
            console.log("Daha yeni geldi");
            stream();
        },
        2000);
    });
};