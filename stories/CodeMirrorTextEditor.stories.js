import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';
import { setAddon, storiesOf } from '@storybook/react';
import React from 'react';
import JSXAddon from 'storybook-addon-jsx';

import { CodeMirrorTextEditor } from '~/features/Common/components';


setAddon(JSXAddon);

const stories = storiesOf('Common|CodeMirrorTextEditor', module);


stories.addWithJSX(
  'default', () =>
    <CodeMirrorTextEditor
      text={ text('text', 'some text') }
      onChange={ action('onChange') }
    />
);
