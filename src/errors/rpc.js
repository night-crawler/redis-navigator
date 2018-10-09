import ExtendableError from 'es6-error';


export class RPCMethodNameError extends ExtendableError {
  constructor() {
    super('RPC method name should be a string');
  }
}


export class RPCBatchArgumentsError extends ExtendableError {
  constructor(message='Wrong arguments were supplied to mkBatch') {
    super(message);
  }
}


export class RPCEndpointError extends ExtendableError {
  constructor(message='Endpoint must be a string') {
    super(message);
  }
}


export class RPCBadActionTypesError extends ExtendableError {
  constructor(message='You must supply an array with length==3') {
    super(message);
  }
}

export class RPCEmptyRequestError extends ExtendableError {
  constructor(message='RPC Request must be a truthy object') {
    super(message);
  }
}
