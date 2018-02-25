import _ from 'lodash';
import React from 'react';
import { Button, Card, Input } from 'semantic-ui-react';
import ResponsiveDefinitionTable from './ResponsiveDefinitionTable';
import PropTypes from 'prop-types';


export default class DefinitionsCard extends React.Component {
    static propTypes = {
        options: PropTypes.object,
        header: PropTypes.string,
        description: PropTypes.string,

    };

    constructor(props) {
        super(props);
        this.state = {
            filter: ''
        };
    }

    handleFilterChange = (e, { value }) => {
        this.setState({ filter: value });
    };

    handleClearFilter = () => {
        this.setState({ filter: '' });
    };

    filterOptions = () => {
        const { options } = this.props;
        const { filter } = this.state;

        return _(options)
            .pickBy((optValue, optKey) =>
                _.lowerCase(optKey).indexOf(_.lowerCase(filter)) >= 0)
            .value();
    };

    render() {
        const { header, description } = this.props;
        return (
            <Card>
                <Card.Content>
                    <Card.Header content={ header } />
                    <Card.Meta content={ description } />

                    <Card.Description>
                        <Input
                            value={ this.state.filter }
                            icon='search'
                            iconPosition='left'
                            fluid={ true }
                            onChange={ this.handleFilterChange }
                            label={ <Button basic={ true } icon='remove' onClick={ this.handleClearFilter } /> }
                            labelPosition='right'
                            placeholder='Filter options...'
                        />
                        <ResponsiveDefinitionTable options={ this.filterOptions() } />
                    </Card.Description>

                </Card.Content>
            </Card>
        );
    }

}
