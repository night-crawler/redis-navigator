import 'semantic-ui-css/semantic.min.css';

import createHistory from 'history/createBrowserHistory';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import configureStore from './configureStore';
import initialState from './initialState';

import DefaultLayout from '../lib/containers/DefaultLayout';


const history = createHistory();
const store = configureStore(initialState, history);
const MOUNT_NODE = document.getElementById('root');

const render = () => {
    ReactDOM.render(
        <Provider store={ store }>
            <ConnectedRouter history={ history }>
                <DefaultLayout
                    rpcEndpoint='http://127.0.0.1:8000/rpc'
                    statusUrl='http://127.0.0.1:8000/rpc/status'
                />

            </ConnectedRouter>
        </Provider>,
        MOUNT_NODE
    );
};

render();
