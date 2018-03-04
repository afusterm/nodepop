process.env.NODE_ENV = 'test';

const PushToken = require('../models/PushToken');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const should = chai.should();
const routes = require('../routes/api/v1/routes');
const config = require('config')
const HttpStatus = require('http-status-codes');

chai.use(chaiHttp);

describe('pushtoken', () => {
    beforeEach((done) => {
        if (PushToken.remove === undefined)
            done();

        PushToken.remove({}, (err) => {
            done();
        });
    });

    describe(`POST ${routes.REGISTER_PUSH_TOKEN}`, () => {
        it('should register a pushtoken without user', (done) => {
            const pushTokenData = {
                token: "xxxx",
                plataforma: "android"
            };

            chai.request(app)
                .get(`${routes.REGISTER_PUSH_TOKEN}`)
                .query(pushTokenData)
                .end((err, res) => {
                    res.should.have.status(HttpStatus.OK);
                    res.should.be.an('object');
                    res.body.should.have.property('success').eql(true);

                    done();
                });
        });

        it('should fail to register a pushtoken with user not registered', (done) => {
            const pushTokenData = {
                token: "xxxx",
                plataforma: "android",
                usuario: "andres"
            };

            chai.request(app)
                .get(`${routes.REGISTER_PUSH_TOKEN}`)
                .query(pushTokenData)
                .end((err, res) => {
                    res.should.have.status(HttpStatus.BAD_REQUEST);
                    res.should.be.an('object');
                    res.body.should.have.property('success').eql(false);
                    res.body.should.have.property('error');
                    res.body.error.should.be.a('string');

                    done();
                });
        })
    });
});
