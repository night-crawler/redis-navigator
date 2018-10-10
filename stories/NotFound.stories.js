import { text } from '@storybook/addon-knobs';
import { setAddon, storiesOf } from '@storybook/react';
import React from 'react';
import JSXAddon from 'storybook-addon-jsx';

import { NotFound } from '~/features/Common/components';

setAddon(JSXAddon);

const stories = storiesOf('Common|NotFound', module);

stories.addWithJSX(
  'default', 
  () => <NotFound />
);

stories.addWithJSX(
  'custom message', 
  () => <NotFound message={ text('message', 'sample text') } />
);
