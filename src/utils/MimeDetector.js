import fileType from 'file-type';
import { isEmpty, startsWith } from 'lodash';

import { convertStringToBinary } from './strings';


export class MimeDetector {
    constructor(rawStr) {
        const
            binary = convertStringToBinary(rawStr),
            ft = fileType(binary);
        const { mime = null, ext = null } = isEmpty(ft) ? {} : ft;
        this.mime = mime;
        this.ext = ext;
        this.rawStr = rawStr;
    }

    get imageDataURI() {
        const b64 = btoa(this.rawStr);
        return `data:${this.mime};charset=utf-8;base64,${b64}`;
    }

    get isImage() {
        return startsWith(this.mime, 'image');
    }
}
