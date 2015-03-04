"use strict";

var superagent = require('superagent');
var expect = require('expect.js');

//testUserCredentials
var email = "testEmail@test.com";
var password = "testPassword";


  describe('Get to connected netatmo account page on Homesharp', function() {

      var agent = superagent.agent();

      it('Should login user and create session.', function(done) {
        agent
          .post('http://127.0.0.1:8080/')
          .type('form')
          .send({ 'email': email, 'pass': password })
          .end( function(err, res) {
            expect(res.status).to.equal(200);
            expect(res.body['NetatmoAccessToken']).to.not.equal('');
            expect(res.body['email']).to.equal(email);
            done()
          });
      });


      it('Should logout user and destroy session', function(done) {
        agent
          .get('http://127.0.0.1:8080/logout')
          .end( function(err, res) {
            expect(res.status).to.equal(200);
            expect(res.body['email']).to.equal(undefined);
            done()
          });
      });
  });