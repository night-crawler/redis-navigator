import createHistory from 'history/createBrowserHistory';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import 'semantic-ui-css/semantic.min.css';
import DefaultLayout from '../src/features/DefaultLayout';
import configureStore from './configureStore';
import initialState from './initialState';


const history = createHistory();
const store = configureStore(initialState, history);
const MOUNT_NODE = document.getElementById('root');

const render = () => {
    ReactDOM.render(
        <Provider store={ store }>
            <ConnectedRouter history={ history }>
                <DefaultLayout
                    endpointsUrl='/endpoints'
                    baseUrl='http://127.0.0.1:8000'
                />

            </ConnectedRouter>
        </Provider>,
        MOUNT_NODE
    );
};

render();
