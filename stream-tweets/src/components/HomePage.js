import React from 'react';
import socketIOClient from "socket.io-client";
import TweetBox from './TweetBox';
import loadingLogo from '../loadingIcon.svg';

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            searchString: "javascript",
            showTweets: true,
            showRetweets: false,
        };

        this.handleTextEditing = this.handleTextEditing.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleResume = this.handleResume.bind(this);
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
        fetch("/setShowTweets",
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    option: name,
                    value: e.target.checked
                })
            });
    }

    handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.setState({ items: [] });
            this.handleResume();
        }
    }

    handleResume() {
        let str = this.state.searchString;
        console.log("RESUME BASILDI", str);
        fetch("/setSearchString",
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ str })
            });
    }

    componentDidMount() {
        const socket = socketIOClient('http://localhost:3000/');
        socket.on('connect', () => {
            console.log("Socket Connected");
            socket.on("tweets", data => {
                console.log("hocam", data);
                let newList = [data].concat(this.state.items.slice(0, 4));
                console.log("NE MANA", newList);
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
                           value={this.state.searchString}
                           onChange={this.handleTextEditing}
                           onKeyPress={this.handleKeyPress}
                    />
                    <br />
                    <label className="showTweets">
                        <input type="checkbox"
                               name="showTweets"
                               checked={this.state.showTweets}
                               onChange={this.handleOptionChange}
                        />
                        Show Tweets
                    </label>
                    <label className="showRetweets">
                        <input type="checkbox"
                               name="showRetweets"
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