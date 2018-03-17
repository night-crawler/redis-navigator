import { isArray, isBoolean, isPlainObject, isString } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Card, Header, Segment } from 'semantic-ui-react';
import { isJson, MimeDetector } from '../../../../utils';
import { TextareaSpoiler } from '../../../Common/components';
import BooleanCard from './BooleanCard';
import ImageCard from './ImageCard';
import ReactJsonCard from './ReactJsonCard';
import isBase64 from 'is-base64';


StringCard.propTypes = {
    result: PropTypes.string.isRequired,
};
export function StringCard(props) {
    const { result } = props;

    let innerResult = false, type = '';

    if (isBase64(result, { paddingRequired: true })) {
        innerResult = atob(result);
        type = 'base64';
    } else if (!isNaN(+result)) {
        // _.isNumber(NaN) === true, lol
        // just deny json conversion
    } else if (isJson(result)) {
        innerResult = JSON.parse(result);
        type = 'json';
    }

    if (innerResult) {
        return (
            <Segment basic={ true }>
                <Header as='h5'>String[{ result.length }], { type }</Header>
                <TextareaSpoiler className='left floated' result={ result } />
                { <Result result={ innerResult } /> }
            </Segment>
        );
    }

    return (
        <Card fluid={ true }>
            <Card.Content>
                <Card.Header>String[{ result.length }]{ type ? ', ' : '' }{ type }</Card.Header>
                <Card.Description>
                    { result }
                </Card.Description>
            </Card.Content>
        </Card>
    );
}


Result.propTypes = {
    result: PropTypes.any,
};

export default function Result(props) {
    const
        { result } = props,
        detector = new MimeDetector(result);

    if (detector.isImage) {
        return <ImageCard dataUri={ detector.imageDataURI } />;
    }

    if (isArray(result))
        return <ReactJsonCard result={ result } />;

    if (isPlainObject(result))
        return <ReactJsonCard result={ result } />;

    if (isBoolean(result))
        return <BooleanCard result={ result } />;

    if (isString(result))
        return <StringCard result={ result } />;

    if (result === null)
        return <div>null</div>;

    return <div>{ result }</div>;
}
