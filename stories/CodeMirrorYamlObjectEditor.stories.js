import { action } from '@storybook/addon-actions';
import { object, withKnobs, number, boolean } from '@storybook/addon-knobs';
import { setAddon, storiesOf } from '@storybook/react';
import React from 'react';
import JSXAddon from 'storybook-addon-jsx';
import { host } from 'storybook-host';

import { CodeMirrorYamlObjectEditor } from '~/features/Common/components';


setAddon(JSXAddon);

const stories = storiesOf('Common|CodeMirrorYamlObjectEditor', module);
stories.addDecorator(withKnobs);
stories.addDecorator(host({
  align: 'center middle',
  height: '90%',
  width: '90%',
}));


stories.addWithJSX(
  'default', () =>
    <CodeMirrorYamlObjectEditor
      params={ object('params', { sample: 1 }) }
      onChange={ action('onChange') }
      onError={ action('onError') }
      flowLevel={ number(
        'flowLevel', 
        1, 
        { range: true, min: 1, max: 5, step: 1, }
      ) }
      constantHeight={ number('constantHeight', undefined) }
      showInlineError={ boolean('showInlineError', false) }
    />
);
