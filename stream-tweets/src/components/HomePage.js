import React from 'react';
import TweetBox from './TweetBox';
import loadingLogo from '../loadingIcon.svg';

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            searchString: "javascript",
            showTweets: true,
            showRetweets: true,
            tweetBufferLimit: 7
        };

        this.handleTextEditing = this.handleTextEditing.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    handleTextEditing(e) {
        this.setState({ searchString: e.target.value });
    }

    handleOptionChange(e) {
        const name = e.target.name;
        this.setState({
            [name]: e.target.checked,
            items: []
        });

        if (name === "showTweets") {
            this.setFilter(this.state.searchString, e.target.checked, this.state.showRetweets);
        }
        else if (name === "showRetweets") {
            this.setFilter(this.state.searchString, this.state.showTweets, e.target.checked);
        }
    }

    setFilter(searchStringVal, showTweetsVal, showRetweetsVal) {

        console.log("SearchString:", searchStringVal);
        console.log("Tweets:", showTweetsVal);
        console.log("Retweets:", showRetweetsVal);

        fetch("/setFilter",
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    _searchString: searchStringVal,
                    _showTweets: showTweetsVal,
                    _showRetweets: showRetweetsVal
                })
            });
    }

    handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.setState({ items: [] });
            this.setFilter(this.state.searchString, this.state.showTweets, this.state.showRetweets);
        }
    }

    componentDidMount() {
        let io = require('socket.io-client');
        //let socket = io.connect('http://192.168.0.104:3000/', {
        let socket = io.connect('http://localhost:3000/', {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax : 5000,
            reconnectionAttempts: 99999
        });
        socket.on('connect', () => {
            console.log("Socket Connected");
            this.setFilter(this.state.searchString, this.state.showTweets, this.state.showRetweets);
            socket.on("tweets", data => {
                //console.log("Raw Data", data);
                let newList = [data].concat(this.state.items.slice(0, this.state.tweetBufferLimit-1));
                //console.log("newList", newList);
                this.setState({ items: newList });
            });
        });

        socket.on('disconnect', () => {
            socket.off("tweets");
            socket.removeAllListeners("tweets");
            console.log("Socket Disconnected");
        });
    }

    render() {
        let items = this.state.items;

        let tweetBoxes = [];
        if (!this.state.showTweets && !this.state.showRetweets) {
            tweetBoxes = "PAUSED";
        }
        else if (!items || items.length === 0) {
            tweetBoxes = <img src={loadingLogo} className="loadingLogo" alt="Loading Tweets"/>;
        }
        else {
            for (let i = 0; i < items.length; i++) {
                tweetBoxes.push(<TweetBox key={i} data={items[i]} />);
            }
        }

        return (
            <div className="row">
                <div className="filterSection">
                    <input type="text"
                           name="searchString"
                           className="searchString"
                           autoComplete="off"
                           value={this.state.searchString}
                           onChange={this.handleTextEditing}
                           onKeyPress={this.handleKeyPress}
                    />
                    <br />
                    <label className="showTweets">
                        <input type="checkbox"
                               name="showTweets"
                               className="showTweetsCheckbox"
                               checked={this.state.showTweets}
                               onChange={this.handleOptionChange}
                        />
                        Show Tweets
                    </label>
                    <label className="showRetweets">
                        <input type="checkbox"
                               name="showRetweets"
                               className="showRetweetsCheckbox"
                               checked={this.state.showRetweets}
                               onChange={this.handleOptionChange}
                        />
                        Show Retweets
                    </label>
                </div>
                <div className="streamSection">
                    {tweetBoxes}
                </div>
            </div>
        );
    }
}

export default HomePage;