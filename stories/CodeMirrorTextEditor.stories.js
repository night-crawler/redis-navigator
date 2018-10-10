import { action } from '@storybook/addon-actions';
import { text, withKnobs } from '@storybook/addon-knobs';
import { setAddon, storiesOf } from '@storybook/react';
import React from 'react';
import JSXAddon from 'storybook-addon-jsx';
import { host } from 'storybook-host';

import { CodeMirrorTextEditor } from '~/features/Common/components';


setAddon(JSXAddon);

const stories = storiesOf('Common|CodeMirrorTextEditor', module);
stories.addDecorator(withKnobs);
stories.addDecorator(host({
  align: 'center middle',
  height: '90%',
  width: '90%',
}));


stories.addWithJSX(
  'default', () =>
    <CodeMirrorTextEditor
      text={ text('text', 'some text') }
      onChange={ action('onChange') }
    />
);
