import React from 'react';
import '../stylesheets/TweetBox.scss';

class TweetBox extends React.Component {
    render() {
        let data = this.props.data;

        return (
            <div className="tweetWrapper">
                <div className="content">
                    <div className="profilePicture">
                        <img className="avatar" src={data.user.profile_image_url} alt={data.user.name} />
                    </div>
                    <div className="tweetInfo">
                        <div className="header">
                            <a href={`https://twitter.com/${data.user.screen_name}`} className="userAnchor" target="_blank" rel="noopener noreferrer">
                                <span className="fullName">{data.user.name}</span>
                                <span className="screenName">{`@${data.user.screen_name}`}</span>
                            </a>
                            <span className="screenName">{new Date(data.created_at).toLocaleTimeString()}</span>
                        </div>
                        <div className="tweet">
                            <p className="tweet-text">
                                {data.text}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default TweetBox;