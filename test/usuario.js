process.env.NODE_ENV = 'test';

const Usuario = require('../models/Usuario');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const should = chai.should();
const routes = require('../routes/api/v1/routes');
const bcrypt = require('bcrypt');
const config = require('config')
const HttpStatus = require('http-status-codes');

chai.use(chaiHttp);

describe('usuarios', () => {
    beforeEach((done) => {
        Usuario.remove({}, (err) => {
            done();
        })
    });

    describe(`POST ${routes.REGISTER_USER}`, () => {
        it('should register a user', (done) => {
            const usuario = createUser();

            chai.request(app)
                .post(`${routes.REGISTER_USER}`)
                .send(usuario)
                .end((err, res) => {
                    res.should.have.status(HttpStatus.OK);
                    res.should.be.an('object');
                    res.body.should.have.property('success').eql(true);
                    res.body.should.have.property('saved');
                    res.body.saved.should.be.an('object');

                    done();
                });
        });

        it('register a user without name should fail', (done) => {
            const usuario = createUser();
            usuario.nombre = null;

            testRegisterUser(usuario, done);
        });

        it('register a user without password should fail', (done) => {
            const usuario = createUser();
            usuario.clave = null;

            testRegisterUser(usuario, done);
        });

        it('register a user without email should fail', (done) => {
            const usuario = createUser();
            usuario.email = null;

            testRegisterUser(usuario, done);
        });

        it('register a user already registered should fail', (done) => {
            const usuario = new Usuario(createUser());
            bcrypt.hash(usuario.clave, config.SALT_ROUNDS, (err, hash) => {
                usuario.save((err, user) => {
                    const userToRegisterAgain = createUser();

                    chai.request(app)
                        .post(`${routes.REGISTER_USER}`)
                        .send(userToRegisterAgain)
                        .end((err, res) => {
                            err.should.not.be.null;
                            res.should.have.status(HttpStatus.CONFLICT);
                            res.should.be.an('object');
                            res.body.should.have.property('success').eql(false);
                            res.body.should.have.property('error');
                            res.body.error.should.be.a('string');

                            done();
                        });
                });
            });
        });
    });

    describe(`POST ${routes.AUTHENTICATE_USER}`, () => {
        it('should authenticate a registered user', (done) => {
            const userToRegister = new Usuario(createUser());

            bcrypt.hash(userToRegister.clave, config.SALT_ROUNDS, (err, hash) => {
                userToRegister.clave = hash;

                userToRegister.save((err, user) => {
                    const userToAuthenticate = {
                        email: 'blas@gmail.com',
                        clave: 'blas'
                    };

                    chai.request(app)
                        .post(`${routes.AUTHENTICATE_USER}`)
                        .send(userToAuthenticate)
                        .end((err, res) => {
                            res.should.have.status(HttpStatus.OK);
                            res.should.be.an('object');
                            res.body.should.have.property('success').eql(true);
                            res.body.should.have.property('token');

                            done();
                        });
                });
            });
        });

        it('authenticate a not registered user should fail', (done) => {
            const userToRegister = new Usuario(createUser());
            userToRegister.save((err, user) => {
                const userToAuthenticate = {
                    email: 'david@gmail.com',
                    clave: 'david'
                };

                chai.request(app)
                    .post(`${routes.AUTHENTICATE_USER}`)
                    .send(userToAuthenticate)
                    .end((err, res) => {
                        res.should.have.status(HttpStatus.UNAUTHORIZED);
                        res.should.be.an('object');
                        res.body.should.have.property('success').eql(false);
                        res.body.should.have.property('error');
                        res.body.error.should.be.a('string');

                        done();
                    });
            });
        });

        it('authenticate a user with bad password should fail', (done) => {
            const userToRegister = new Usuario(createUser());
            userToRegister.save((err, user) => {
                const userToAuthenticate = {
                    email: 'blas@gmail.com',
                    clave: 'david'
                };

                chai.request(app)
                    .post(`${routes.AUTHENTICATE_USER}`)
                    .send(userToAuthenticate)
                    .end((err, res) => {
                        err.should.not.be.null;
                        res.should.have.status(HttpStatus.UNAUTHORIZED);
                        res.should.be.an('object');
                        res.body.should.have.property('success').eql(false);
                        res.body.should.have.property('error');
                        res.body.error.should.be.a('string');

                        done();
                    });
            });
        });

        it('authenticate a user without password should fail', (done) => {
            const userToRegister = new Usuario(createUser())
            userToRegister.save((err, user) => {
                const userToAuthenticate = {
                    email: 'blas@gmail.com'
                };

                chai.request(app)
                    .post(`${routes.AUTHENTICATE_USER}`)
                    .send(userToAuthenticate)
                    .end((err, res) => {
                        err.should.not.be.null;
                        res.should.be.an('object');
                        res.body.should.have.property('success').eql(false);
                        res.body.should.have.property('error');
                        res.body.error.should.be.a('string');

                        done();
                    });
                })
            });

            it('authenticate a user without email should fail', (done) => {
                const userToRegister = new Usuario(createUser());
                userToRegister.save((err, user) => {
                    const userToAuthenticate = {
                        clave: 'blas'
                    };

                    chai.request(app)
                        .post(`${routes.AUTHENTICATE_USER}`)
                        .send(userToAuthenticate)
                        .end((err, res) => {
                            err.should.not.be.null;
                            res.should.have.status(HttpStatus.BAD_REQUEST);
                            res.should.be.an('object');
                            res.body.should.have.property('success').eql(false);
                            res.body.should.have.property('error');
                            res.body.error.should.be.a('string');

                            done();
                        });
                });
            })
    });

    function createUser() {
        const usuario = {
            nombre: 'Blas',
            email: 'blas@gmail.com',
            clave: 'blas',
            lang: 'es'
        };

        return usuario;
    }

    function testRegisterUser(user, done) {
        chai.request(app)
        .post(`${routes.REGISTER_USER}`)
        .send(user)
        .end((err, res) => {
            res.should.have.status(HttpStatus.BAD_REQUEST);
            res.should.be.an('object');

            done();
        });
    }
});
