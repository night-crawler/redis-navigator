import { withConsole } from '@storybook/addon-console';
import { setDefaults as setInfoDefaults } from '@storybook/addon-info';
import { setOptions } from '@storybook/addon-options';
import { addDecorator, configure } from '@storybook/react';

import { addLocaleData } from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';
import deLocaleData from 'react-intl/locale-data/ru';
import 'semantic-ui-css/semantic.min.css';
import { setIntlConfig, withIntl } from 'storybook-addon-intl';
import enMessages from '../src/translations/en.yml';
import ruMessages from '../src/translations/ru.yml';


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

setInfoDefaults({
    header: false,
    inline: false,
    styles: {
        children: {
            position: 'inherit',
            zIndex: 0,
        },
    }
});

setOptions({
    hierarchySeparator: /\/|\./,
    hierarchyRootSeparator: /\|/,
});

addDecorator(withIntl);
addDecorator((storyFn, context) => withConsole()(storyFn)(context));

const req = require.context('../stories', true, /.stories.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
