class HttpError extends Error {
    constructor(body, status = 500) {
        super(body);
        this.status = status;
        this.body = body;
        this.name = this.constructor.name;

        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = new Error(body).stack;
        }
    }
}

export default HttpError;