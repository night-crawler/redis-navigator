import ExtendableError from 'es6-error';


export class TypeError extends ExtendableError {
    constructor(message='Invalid Type') {
        super(message);
    }
}


export class ValueError extends ExtendableError {
    constructor(message='Invalid Value') {
        super(message);
    }
}