import { withInfo } from '@storybook/addon-info';
import { setAddon, storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import React from 'react';
import JSXAddon from 'storybook-addon-jsx';
import { host } from 'storybook-host';
import { Segment, Container } from 'semantic-ui-react';
import { withKnobs, text, boolean } from '@storybook/addon-knobs/react';

import { CodeMirrorTextEditor } from 'features/Common/components';


const SegmentDecorator = (storyFn) => (
    <Container fluid={ true }>
        <Segment>{ storyFn() }</Segment>
    </Container>
);

setAddon(JSXAddon);


// TODO: fix broken flex layout
const stories = storiesOf('CodeMirrorTextEditor', module);
stories.addDecorator((story, context) => withInfo('common info')(story)(context));
stories.addDecorator(withKnobs);
// stories.addDecorator(SegmentDecorator);
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
