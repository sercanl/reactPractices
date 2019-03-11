import React from 'react';
import { shallow, mount } from 'enzyme';
import TweetBox from "../components/TweetBox";

let i = 1;
let sampleTweetData = {
    user: {
        name: "CydoniaRoman",
        screen_name: "CydoniaRoman",
        profile_image_url: "https://pbs.twimg.com/profile_images/412964614721118208/6FpB0wx6_bigger.jpeg"
    },
    text: "This is a test tweet",
    created_at: "Mon Mar 11 12:03:46 +0000 2019"
};

it('renders tweetbox without crashing', () => {
    shallow(<TweetBox  key={i} data={sampleTweetData} />);
});

it('simulates click event on a.userAnchor', () =>{
    let wrapper = mount(<TweetBox key={i} data={sampleTweetData}/>);
    wrapper.find('a.userAnchor').first().simulate('click');
});