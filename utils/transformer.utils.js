var Transformer = {};

Transformer.transformResponse = function(responseCode, responseText, payload){
    if(payload == undefined)
    {
        payload = {};
    }

    return {
        responseCode: responseCode,
        responseText: responseText,
        payload: payload
    };
};


module.exports = Transformer;