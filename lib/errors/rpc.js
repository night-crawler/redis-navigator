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