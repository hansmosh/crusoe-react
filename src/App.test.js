import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount } from 'enzyme';
import App from './App';
import LoginController from './LoginController';
import FavoritesSelector from './FavoritesSelector';

it('should render Login when not logged in', () => {
    const wrapper = shallow(<App/>);
    expect(wrapper.containsAllMatchingElements([
      <LoginController />,
      <FavoritesSelector />,
    ])).toEqual(true);
});
