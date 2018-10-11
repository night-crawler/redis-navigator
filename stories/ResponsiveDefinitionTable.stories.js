import { text, object } from '@storybook/addon-knobs';
import { setAddon, storiesOf } from '@storybook/react';
import React from 'react';
import JSXAddon from 'storybook-addon-jsx';

import { ResponsiveDefinitionTable } from '~/features/Dashboard/components/ResponsiveDefinitionTable';


setAddon(JSXAddon);

const stories = storiesOf('Dashboard|ResponsiveDefinitionTable', module);


stories.addWithJSX(
  'default', () =>
    <ResponsiveDefinitionTable
      definitions={ object('definitions', {
        a: 1,
        b: 2,
        'sample': 'sample'
      }) }
    />
);
