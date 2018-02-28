import 'semantic-ui-css/semantic.min.css';

import createHistory from 'history/createBrowserHistory';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import configureStore from './configureStore';
import initialState from './initialState';
// import { createRedisRpcCreator } from '../lib/actions/redisRpc';
import DefaultLayout from '../lib/containers/DefaultLayout';


const history = createHistory();
const store = configureStore(initialState, history);
// const redisRpcCreator = createRedisRpcCreator(store.dispatch);
const MOUNT_NODE = document.getElementById('root');

const render = () => {
    ReactDOM.render(
        <Provider store={ store }>
            <ConnectedRouter history={ history }>
                <DefaultLayout
                    rpcEndpointUrl='http://127.0.0.1:8000/rpc'
                    statusUrl='http://127.0.0.1:8000/rpc/status'
                    inspectionsUrl='http://127.0.0.1:8000/rpc/inspect'
                    // redisRpcCreator={ redisRpcCreator }
                />

            </ConnectedRouter>
        </Provider>,
        MOUNT_NODE
    );
};

render();
