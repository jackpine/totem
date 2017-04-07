export class MessageValidationError extends Error { };

export default class MessageValidator {

    constructor(subject, body){
        this.subject = subject;
        this.body = body;
        this.errors = [];
    }

    validatePresence(attributeName){

        var stringAttr = this[attributeName];

        if (typeof stringAttr !== 'string'){
            throw new MessageValidationError(`${attributeName} is not a string`);
        }
        var present = stringAttr.length > 0;

        if(!present){
            this.errors.push(`Your totem message ${attributeName} is empty!`);
        }

        return present;
    }

    validateSubject(){
        return this.validatePresence('subject');
    }

    validateBody(){
        return this.validatePresence('body');
    }

    validate(){
        this.validateSubject();
        this.validateBody();
        return this.errors.length == 0;
    }
}

