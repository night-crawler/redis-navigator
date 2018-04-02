import debug from 'debug';
import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { Button, Grid, Input, Segment } from 'semantic-ui-react';
import { Timeouts } from '../../../timers';
import messages from '../messages';


class KeyViewer extends React.Component {
    static propTypes = {
        intl: intlShape.isRequired,
        actions: PropTypes.shape({
            searchKeys: PropTypes.func,
        }),
        locationSearchParams: PropTypes.object,
        routeInstanceSearchUrl: PropTypes.string,
        routeKeys: PropTypes.object,
    };

    constructor(props) {
        super(props);
        debug.enable('*');
        this.log = debug('KeyViewer');
        this.log('initialized', props);
    }

    render() {
        const { intl, locationSearchParams } = this.props;

        return (
            <Grid>
                <Grid.Column width={ 5 }>
                    <Segment>
                        <Button.Group>
                            <Button icon='sort alphabet ascending' />
                        </Button.Group>
                        <Input
                            defaultValue={ locationSearchParams.pattern }
                            icon='search'
                            iconPosition='left'
                            fluid={ true }
                            onChange={ this.handleFilterKeysChange }
                            label={ <Button basic={ true } icon='remove' /> }
                            labelPosition='right'
                            placeholder={ intl.formatMessage({ ...messages.filterKeys }) }
                        />

                        { this.props.routeInstanceSearchUrl }
                    </Segment>
                </Grid.Column>
            </Grid>

        );
    }

    componentDidMount() {
        const { locationSearchParams } = this.props;
        this.props.actions.searchKeys(locationSearchParams);
    }

    handleFilterKeysChange = (e, { value }) => {
        const { locationSearchParams } = this.props;
        const newParams = { ...locationSearchParams, pattern: value };

        Timeouts.add({
            name: 'KeyViewer.search',
            callback: () => this.props.actions.searchKeys(newParams),
            timeout: 300
        });
    }

}

export default injectIntl(KeyViewer);