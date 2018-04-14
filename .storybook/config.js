// 4.0.1.alpha
// import { configure as configureViewport } from '@storybook/addon-viewport';
import { addDecorator, configure } from '@storybook/react';
// Load the locale data for all your defined locales
import { addLocaleData } from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';
import deLocaleData from 'react-intl/locale-data/ru';
import 'semantic-ui-css/semantic.min.css';
import { setIntlConfig, withIntl } from 'storybook-addon-intl';
import enMessages from '../app/translations/en.yml';
import ruMessages from '../app/translations/ru.yml';
import { withConsole } from '@storybook/addon-console';

addLocaleData(enLocaleData);
addLocaleData(deLocaleData);


const messages = {
    en: enMessages,
    ru: ruMessages,
};

const getMessages = locale => messages[ locale ];

setIntlConfig({
    locales: [ 'en', 'ru' ],
    defaultLocale: 'en',
    getMessages,
});

addDecorator(withIntl);
addDecorator((storyFn, context) => withConsole()(storyFn)(context));

function loadStories() {
    require('../stories/FullPageDimmerStory');
    // You can require as many stories as you need.
}

configure(loadStories, module);
