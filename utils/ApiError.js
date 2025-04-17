class ApiError extends Error{
    constructor(statusCode, message =  "Something went wrong", stack){
        super();
        this.statusCode = statusCode;
        this.message = message;
        if(stack){
            this.stack = stack;
        }
        this.success = false;
    }
}

export default ApiError;