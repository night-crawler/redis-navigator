import { ValueError, TypeError } from './base';


export class RPCMethodNameError extends TypeError {
    constructor() {
        super('RPC method name should be a string');
    }
}


export class RPCBatchArgumentsError extends ValueError {
    constructor(message='Wrong arguments were supplied to mkBatch') {
        super(message);
    }
}


export class RPCEndpointError extends TypeError {
    constructor(message='Endpoint must be a string') {
        super(message);
    }
}


export class RPCBadActionTypesError extends TypeError {
    constructor(message='You must supply an array with length==3') {
        super(message);
    }
}

export class RPCEmptyRequestError extends ValueError {
    constructor(message='RPC Request must be a truthy object') {
        super(message);
    }
}