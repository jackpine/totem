import MessageValidator from '../../services/MessageValidator';
import { MessageValidationError } from '../../services/MessageValidator';

import { expect } from 'chai';

var testSubject = "Hi there this is a test Subject";
var testBody = "Hi there this is a test body"

describe('#validate', () => {
    it('should validate the structure of the message', ()=>{
        var messageValidator = new MessageValidator(testSubject, testBody);
        expect(messageValidator.validate()).to.be.true
        expect(messageValidator.errors).to.be.empty;
    });
    it('should validate the presence of the message subject', ()=>{
        var messageValidator = new MessageValidator('', testBody);
        expect(messageValidator.validate()).to.be.false
        expect(messageValidator.errors).to.include('Your totem message subject is empty!');
    });
    it('should validate the presence of the message body', ()=>{
        var messageValidator = new MessageValidator(testSubject, '');
        expect(messageValidator.validate()).to.be.false
        expect(messageValidator.errors).to.include('Your totem message body is empty!');
    });
    it('should thow an exception for invalid types', ()=>{

        var messageValidator = new MessageValidator(null, testBody);
        expect( ()=> messageValidator.validate() ).to.throw('subject is not a string')
        var messageValidator = new MessageValidator(testSubject, null);
        expect( ()=> messageValidator.validate() ).to.throw('body is not a string')
    });
});
