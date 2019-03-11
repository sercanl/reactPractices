import React from 'react';
import { shallow, mount } from 'enzyme';
import HomePage from "../components/HomePage";

it('renders without crashing', () => {
    shallow(<HomePage />);
});

it('simulates paused streaming', () =>{
    let wrapper = mount(<HomePage />);
    wrapper.setState({showTweets: false});
    wrapper.setState({showRetweets: false});

    const pauseText = wrapper.find('div.streamSection').text();
    expect(pauseText).toEqual('PAUSED');
});