import { configure, mount, render, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import 'raf/polyfill';
import React from 'react';

global.React = React;

global.shallow = shallow;
global.render = render;
global.mount = mount;

window.requestAnimationFrame = function (callback) {
    setTimeout(callback, 0);
    return 0;
};

console.error = message => {
    throw new Error(message);
};

configure({ adapter: new Adapter() });
