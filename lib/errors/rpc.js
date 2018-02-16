import ExtendableError from 'es6-error';

export class RPCMethodNameError extends ExtendableError {
    constructor() {super('RPC method name should be a string');}
}


export class RPCBatchArgumentsError extends ExtendableError {
    constructor(message='Wrong arguments were supplied to mkBatch') {
        super(message);
    }
}
