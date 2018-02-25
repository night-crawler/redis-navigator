import _ from 'lodash';
import React from 'react';
import { Button, Card, Input } from 'semantic-ui-react';
import ResponsiveDefinitionTable from './ResponsiveDefinitionTable';
import PropTypes from 'prop-types';


export default class DefinitionsCard extends React.Component {
    static propTypes = {
        definitions: PropTypes.object,
        header: PropTypes.string,
        description: PropTypes.string,
        rowComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
        headerComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
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

    filterDefinitions = () => {
        const { definitions } = this.props;
        const { filter } = this.state;

        return _(definitions)
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

                        <ResponsiveDefinitionTable
                            definitions={ this.filterDefinitions() }
                            rowComponent={ this.props.rowComponent }
                            headerComponent={ this.props.headerComponent }
                        />
                    </Card.Description>

                </Card.Content>
            </Card>
        );
    }

}
