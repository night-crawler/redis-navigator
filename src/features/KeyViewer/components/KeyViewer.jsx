import PropTypes from 'prop-types';
import React from 'react';
import { Segment, Grid, Input, Button } from 'semantic-ui-react';
import { Timeouts } from '../../../timers';
import { FormattedMessage as Tr, injectIntl, intlShape } from 'react-intl';
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

    render() {
        const { intl } = this.props;

        return (
            <Grid>
                <Grid.Column width={ 5 }>
                    <Segment>
                        <Button.Group>
                            <Button icon='sort alphabet ascending' />
                        </Button.Group>
                        <Input
                            // value={ this.state.filter }
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
        this.props.actions.searchKeys({ pattern: 'bla' });
    }

    handleFilterKeysChange = (e, { value }) => {
        console.log(this.props.locationSearchParams);
        Timeouts.add({
            name: 'KeyViewer.search',
            callback: () => this.props.actions.searchKeys({ pattern: 'bla' + value }),
            timeout: 300
        });
    }

}

export default injectIntl(KeyViewer);