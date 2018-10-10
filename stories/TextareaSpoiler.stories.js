import { text, boolean } from '@storybook/addon-knobs';
import { setAddon, storiesOf } from '@storybook/react';
import React from 'react';
import JSXAddon from 'storybook-addon-jsx';

import { TextareaSpoiler } from '~/features/Common/components';

setAddon(JSXAddon);

const stories = storiesOf('Common|TextareaSpoiler', module);

stories.addWithJSX(
  'default', 
  () => <TextareaSpoiler 
    show={ boolean('show', false) } 
    result={ text('result', 'sample result value') } 
  />
);
