import { text, object } from '@storybook/addon-knobs';
import { setAddon, storiesOf } from '@storybook/react';
import React from 'react';
import JSXAddon from 'storybook-addon-jsx';

import { DefinitionsCard } from '~/features/Dashboard/components/DefinitionsCard';


setAddon(JSXAddon);

const stories = storiesOf('Dashboard|DefinitionsCard', module);


stories.addWithJSX(
  'default', () =>
    <DefinitionsCard
      header={ text('header', 'Sample header') }
      description={ text('description', 'Sample description') }
      definitions={ object('definitions', {
        a: 1,
        b: 2,
        'sample': 'sample'
      }) }
    />
);
