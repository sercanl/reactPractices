import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import socketIOClient from "socket.io-client";
import CardComponent from './CardComponent';


class TweetList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            searchString: "javaScript",
            showTweets: true,
            showRetweets: false,
        };

        this.handleTextEditing = this.handleTextEditing.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleResume = this.handleResume.bind(this);
        this.handlePause = this.handlePause.bind(this);
    }

    handleTextEditing(e) {
        this.setState({ searchString: e.target.value });
    }

    handleOptionChange(e) {
        const name = e.target.name;
        this.setState({
            [name]: e.target.checked
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

    handlePause() {
        fetch("/pause",
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                }
            })
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
        //let items = this.state.items;
        return (
            <div className="row">
                <div>
                    <input type="text"
                           name="searchString"
                           value={this.state.searchString}
                           onChange={this.handleTextEditing}
                           onKeyPress={this.handleKeyPress}
                    />
                    <br />
                    <label>
                        <input type="checkbox"
                               name="showTweets"
                               checked={this.state.showTweets}
                               onChange={this.handleOptionChange}
                        />
                        Show Tweets
                    </label>
                    <label>
                        <input type="checkbox"
                               name="showRetweets"
                               checked={this.state.showRetweets}
                               onChange={this.handleOptionChange}
                        />
                        Show Retweets
                    </label>
                </div>
            </div>
        );
    }
}

export default TweetList;