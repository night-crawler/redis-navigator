import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
import { text, withKnobs } from '@storybook/addon-knobs/react';
import { setAddon, storiesOf } from '@storybook/react';
import React from 'react';
import JSXAddon from 'storybook-addon-jsx';
import { host } from 'storybook-host';

import { CodeMirrorTextEditor } from '~/features/Common/components';


setAddon(JSXAddon);

// TODO: fix broken flex layout
const stories = storiesOf('Common|CodeMirrorTextEditor', module);
stories.addDecorator((story, context) => withInfo('common info')(story)(context));
stories.addDecorator(withKnobs);
stories.addDecorator(host({
  align: 'center bottom',
  height: '80%',
  width: '80%',
}));


stories.addWithJSX(
  'default', () =>
    <CodeMirrorTextEditor
      text={ text('text', 'some text') }
      onChange={ action('onChange') }
    />
);
