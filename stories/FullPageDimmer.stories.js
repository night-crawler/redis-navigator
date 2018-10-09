import { boolean, text, withKnobs } from '@storybook/addon-knobs';
import { setAddon, storiesOf } from '@storybook/react';
import React from 'react';
import JSXAddon from 'storybook-addon-jsx';
import { host } from 'storybook-host';

import { FullPageDimmer } from '~/features/Common/components';


setAddon(JSXAddon);

const stories = storiesOf('Common|FullPageDimmer', module);
stories.addDecorator(withKnobs);
stories.addDecorator(host({
  align: 'center middle',
  height: '90%',
  width: '90%',
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
