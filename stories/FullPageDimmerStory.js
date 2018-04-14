import { withInfo } from '@storybook/addon-info';
import { setAddon, storiesOf } from '@storybook/react';
import React from 'react';
import JSXAddon from 'storybook-addon-jsx';
import { host } from 'storybook-host';
import { Segment, Container } from 'semantic-ui-react';

import { FullPageDimmer } from 'features/Common/components';


const SegmentDecorator = (storyFn) => (
    <Container fluid={ true }>
        <Segment>{ storyFn() }</Segment>
    </Container>
);

setAddon(JSXAddon);


// TODO: fix broken flex layout
storiesOf('FullPageDimmer', module)
    .addDecorator((story, context) => withInfo('common info')(story)(context))
    .addDecorator(SegmentDecorator)
    .addDecorator(host({
        align: 'center bottom',
        height: '80%',
        width: '80%',
    }))
    .addWithJSX('with default text', () => <FullPageDimmer />)
    .addWithJSX('inverted', () => <FullPageDimmer inverted={ false } />)
    .addWithJSX('with `message`', () => <FullPageDimmer message='Custom message' />);
