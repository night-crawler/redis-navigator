import createHistory from 'history/createBrowserHistory';
import React from 'react';
import ReactDOM from 'react-dom';
import { addLocaleData } from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';
import ruLocaleData from 'react-intl/locale-data/ru';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';

import 'semantic-ui-css/semantic.min.css';
import { extractLanguageCode } from 'utils';
import InternationalizationProvider, { switchLocale, updateIntl } from 'features/Internationalization';
import DefaultLayout from 'features/DefaultLayout';

import configureStore from './configureStore';
import initialState from './initialState';
import enMessages from './translations/en.yml';
import ruMessages from './translations/ru.yml';

const history = createHistory();
const store = configureStore(initialState, history);
const MOUNT_NODE = document.getElementById('root');


const render = () => {
    // console.log(enLocaleData);
    addLocaleData(enLocaleData);
    addLocaleData(ruLocaleData);

    store.dispatch(updateIntl({
        locale: 'en',
        messages: enMessages,
    }));
    store.dispatch(updateIntl({
        locale: 'ru',
        messages: ruMessages,
    }));
    store.dispatch(switchLocale(extractLanguageCode(window.navigator.language)));

    ReactDOM.render(
        <Provider store={ store }>
            <InternationalizationProvider>
                <ConnectedRouter history={ history }>
                    <DefaultLayout endpointsUrl='/endpoints' baseUrl='http://127.0.0.1:8000' />
                </ConnectedRouter>
            </InternationalizationProvider>
        </Provider>,
        MOUNT_NODE
    );
};

render();
