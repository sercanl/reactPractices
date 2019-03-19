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
    const tweetLimit = 8;
    app.locals.searchString = '';
    app.locals.showTweets = null;
    app.locals.showRetweets = null;
    app.locals.EmittedTweetsNumber = 0;

    setInterval(function() {
        app.locals.EmittedTweetsNumber = 0;
    }, 7000);

    const stream = () => {

        if (app.locals.searchString.length === 0) {
            console.log("EMPTY SEARCH STRING");
            return;
        }

        if (app.locals.showTweets === null) {
            console.log("WAIT WAIT WAIT WAIT WAIT WAIT WAIT");
            return;
        }

        console.log('Streaming the tweets for \"' + app.locals.searchString + '\"');
        twitter.stream('statuses/filter', { track: app.locals.searchString }, (stream) => {
            stream.on('data', (tweet) => {
                app.locals.EmittedTweetsNumber = app.locals.EmittedTweetsNumber + 1;
                console.log("TWEET NUMBER", app.locals.EmittedTweetsNumber);
                sendMessage(tweet);
            });

            stream.on('error', (error) => {
                console.log(error);
            });

            twitterStream = stream;
        });
    };

    // EMITTER
    const sendMessage = (msg) => {

        if (app.locals.EmittedTweetsNumber > tweetLimit) {
            return;
        }

        if (itIsARetweet(msg.text) && !app.locals.showRetweets) {
            return;
        }

        if (!itIsARetweet(msg.text) && !app.locals.showTweets) {
            return;
        }
        console.log(msg.text);
        socketConn.emit("tweets", msg);
    };

    const itIsARetweet = (messageText) => {
        return messageText.startsWith('RT @');
    };

    // CONNECT
    io.on("connection", socket => {
        socketConn = socket;
        socket.on("connection", () => console.log("Client connected"));
        socket.on("disconnect", () => console.log("Client disconnected"));
    });

    // SET FILTER
    app.post('/setFilter', (req) => {

        app.locals.searchString = req.body._searchString;
        app.locals.showTweets = req.body._showTweets;
        app.locals.showRetweets = req.body._showRetweets;

        console.log("Search string edited to =>", app.locals.searchString);
        console.log("showTweets:", app.locals.showTweets);
        console.log("showRetweets:", app.locals.showRetweets);
        if (twitterStream) {
            twitterStream.destroy();
        }
        stream();
    });
};