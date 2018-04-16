import { withInfo } from '@storybook/addon-info';
import { boolean, text, withKnobs } from '@storybook/addon-knobs/react';
import { setAddon, storiesOf } from '@storybook/react';
import React from 'react';
import JSXAddon from 'storybook-addon-jsx';
import { host } from 'storybook-host';

import { FullPageDimmer } from 'features/Common/components';


setAddon(JSXAddon);

// TODO: fix broken flex layout
const stories = storiesOf('Common|FullPageDimmer', module);
stories.addDecorator((story, context) => withInfo('common info')(story)(context));
stories.addDecorator(withKnobs);
stories.addDecorator(host({
    align: 'center bottom',
    height: '80%',
    width: '80%',
}));


stories.addWithJSX(
    'with default text', () =>
        <FullPageDimmer
            inverted={ boolean('Inverted', false) }
            message={ text('Message', undefined) }
        />
);


stories.addWithJSX(
    'inverted', () =>
        <FullPageDimmer inverted={ false } />
);


stories.addWithJSX(
    'with `message`',
    () => <FullPageDimmer message='Custom message' />
);
