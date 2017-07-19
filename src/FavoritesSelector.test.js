import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount } from 'enzyme';
import FavoritesSelector from './FavoritesSelector';

it('should initialize favorites list', () => {
    const wrapper = mount(<FavoritesSelector />);
    expect(wrapper.state('favorites')).toEqual([]);
});
