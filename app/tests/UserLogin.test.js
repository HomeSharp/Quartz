"use strict";

var superagent = require('superagent');
var expect = require('expect.js');


describe('Quartz login user', function(){

  //Make sure the user has allready accepted a netatmo-connection for 

  var email = "testEmail@test.com";
  var password = "testPassword";

    it('User logs in successfully', function(done){
	    superagent.post('http://localhost:8080/')
	      .type('form')
	      .send({'email': email, 'pass': password})
	      .end(function(e, res){
	        expect(res.status).to.equal(200);
	        expect(res.body['email']).to.equal(email);
	        done()
	   	})
  	})

    it('User fails login with wrong password', function(done){
    superagent.post('http://localhost:8080/')
      .type('form')
      .send({'email': email, 'pass': 'wrongPassword'})
      .end(function(e, res){
        expect(res.status).to.equal(400);
        expect(e).to.not.be.ok();
        done()
      })
  	})

  	it('User fails login with wrong email', function(done){
    superagent.post('http://localhost:8080/')
      .type('form')
      .send({'email': 'wrongEmail', 'pass': password})
      .end(function(e, res){
        expect(res.status).to.equal(400);
        expect(e).to.not.be.ok();
        done()
      })
  	})
})