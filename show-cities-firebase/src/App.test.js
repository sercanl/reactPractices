import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { shallow, mount } from 'enzyme';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('checks button names', () =>{
    let wrapper = mount(<App />);

    let buttonText = wrapper.find('button.deleteAllButton').text();
    expect(buttonText).toEqual('Delete all');

    buttonText = wrapper.find('div.formTable button.submitButton').text();
    expect(buttonText).toEqual('Submit');
});