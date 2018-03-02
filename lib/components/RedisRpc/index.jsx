import debug from 'debug';
import React  from 'react';
import { Dropdown } from 'semantic-ui-react';


export default class RedisRpc extends React.Component {
    constructor(props) {
        super(props);
        debug.enable('*');
        this.log = debug('RedisRpc');
        this.log('initialized');
        this.log(props);
        this.state = {
            cmd: null
        };
    }

    render() {
        const { inspections } = this.props;
        const options = Object.entries(inspections).map(([ fName, fOptions ], i) => {
            return {
                key: fName,
                text: fName,
                value: fName,
                content: <div>{ fName } </div>
            };
        });


        return <Dropdown
            options={ options }
            placeholder='Find command'
            search={ true }
            fluid={ true }
            selection={ true }
        />;
    }
}
