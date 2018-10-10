import { action } from '@storybook/addon-actions';
import { object, number, boolean } from '@storybook/addon-knobs';
import { setAddon, storiesOf } from '@storybook/react';
import React from 'react';
import JSXAddon from 'storybook-addon-jsx';

import { CodeMirrorYamlObjectEditor } from '~/features/Common/components';


setAddon(JSXAddon);

const stories = storiesOf('Common|CodeMirrorYamlObjectEditor', module);

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
