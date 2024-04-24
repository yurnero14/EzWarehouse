const { expect } = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
chai.should();

const {User} = require ('../models/UserAndSubclasses');

const { deleteDb } = require("../unit_test/test-utils");

let agent;

describe("Test User api", async () => {

    beforeEach(async () => {
        deleteDb();

        delete require.cache[require.resolve("../server")];
        const app = await require("../server");
        agent = chai.request.agent(app);
    });
    getsupplierslistTest(200, "ez@ezwh.com", "user", "rodrigo", "testpassword");
    getuserslisttest(200, "ez@ezwh.com", "user", "rodrigo", "testpassword", "customer");
    newUserTest(201, "ez@ezwh.com", "user", "rodrigo", "testpassword", "customer");
    loginmanagertest(200, "ez@ezwh.com", "user", "rodrigo", "testpassword" );
    logincustomertest(200, "ez@ezwh.com", "user", "rodrigo", "testpassword" );
    loginsuppliertest(200, "ez@ezwh.com", "user", "rodrigo", "testpassword" );
    loginclerktest(200, "ez@ezwh.com", "user", "rodrigo", "testpassword" );
    loginQualityEmployeetest(200, "ez@ezwh.com", "user", "rodrigo", "testpassword" );
    logindeliveryemployeetest(200, "ez@ezwh.com", "user", "rodrigo", "testpassword" );
    updateusertest(200, "ez@ezwh.com", "user", "rodrigo", "testpassword" , "supplier","customer");
    deleteusertest(204, "ez@ezwh.com", "user", "rodrigo", "testpassword", "supplier" );

})

function getsupplierslistTest(expectedHTTPStatus, username, name, surname, password){
    it('Getting all suppliers',function(done){
        let u = {username: username, name:name, surname:surname, password:password, type:"supplier"}
        agent.post("/api/newUser")
        .send(u)
        .then(function(res){
            try{
                res.should.have.status(201);
                agent.get("/api/suppliers").then(function (r){
                    try{
                        r.should.have.status(expectedHTTPStatus);
                        const foundUser = r.body.find(u => u.email === username);
                        foundUser.name.should.equal(name);
                        foundUser.surname.should.equal(surname);
                        done();
                    }
                    catch(e){
                        done(e);
                    }
                })
            }
            catch(e){
                done(e);
            }
        })
    })
}


function getuserslisttest(expectedHTTPStatus, username, name, surname, password, type){
    it('Getting all users except managers',function(done){
        let u = {username: username, name:name, surname:surname, password:password, type:type}
        agent.post("/api/newUser")
        .send(u)
        .then(function(res){
            try{
                res.should.have.status(201);
                agent.get("/api/users").then(function (r){
                    try{
                        r.should.have.status(expectedHTTPStatus);
                        const foundUser = r.body.find(u => u.email === username);
                        foundUser.name.should.equal(name);
                        foundUser.surname.should.equal(surname);
                        foundUser.type.should.equal(type);
                        done();
                    }
                    catch(e){
                        done(e);
                    }
                })
            }
            catch(e){
                done(e);
            }
        })
    })
}

function newUserTest(expectedHTTPStatus, username, name, surname, password, type){
    it('Creating a new user', function (done) {
    
        let u = {username: username, name:name, surname:surname, password:password, type:type}
        agent.post("/api/newUser")
        .send(u)
            .then(function (res) {
                try {
                    res.should.have.status(expectedHTTPStatus);  
                    done();
                } catch (e) {
                    done(e);
                }
            })
    })
}

function loginmanagertest(expectedHTTPStatus, username, name, surname, password){
    it('login manager', function(done){
        let u = {username: username, name:name, surname:surname, password:password, type:"manager"}
        let m = {username: u.username, password: u.password};
        agent.post("/api/newUser")
        .send(u)
        .then(function(res){
            try{
                res.should.have.status(201);
                agent.post("/api/managerSessions")
                .send(m)
                .then(function (res){
                    try{
                        res.should.have.status(expectedHTTPStatus);
                        done();
                    }
                    catch(e){
                        done(e);
                    }
                })
            }
            catch(e){
                done(e);
            }
        })

    })
}

function logincustomertest(expectedHTTPStatus, username, name, surname, password){
    it('login customer', function(done){
        let u = {username: username, name:name, surname:surname, password:password, type:"customer"}
        let m = {username: u.username, password: u.password};
        agent.post("/api/newUser")
        .send(u)
        .then(function(res){
            try{
                res.should.have.status(201);
                agent.post("/api/customerSessions")
                .send(m)
                .then(function (res){
                    try{
                        res.should.have.status(expectedHTTPStatus);
                        done();
                    }
                    catch(e){
                        done(e);
                    }
                })
            }
            catch(e){
                done(e);
            }
        })

    })
}

function loginsuppliertest(expectedHTTPStatus, username, name, surname, password){
    it('login supplier', function(done){
        let u = {username: username, name:name, surname:surname, password:password, type:"supplier"}
        let m = {username: u.username, password: u.password};
        agent.post("/api/newUser")
        .send(u)
        .then(function(res){
            try{
                res.should.have.status(201);
                agent.post("/api/supplierSessions")
                .send(m)
                .then(function (res){
                    try{
                        res.should.have.status(expectedHTTPStatus);
                        done();
                    }
                    catch(e){
                        done(e);
                    }
                })
            }
            catch(e){
                done(e);
            }
        })

    })
}

function loginQualityEmployeetest(expectedHTTPStatus, username, name, surname, password){
    it('login Quality Employee', function(done){
        let u = {username: username, name:name, surname:surname, password:password, type:"qualityEmployee"}
        let m = {username: u.username, password: u.password};
        agent.post("/api/newUser")
        .send(u)
        .then(function(res){
            try{
                res.should.have.status(201);
                agent.post("/api/qualityEmployeeSessions")
                .send(m)
                .then(function (res){
                    try{
                        res.should.have.status(expectedHTTPStatus);
                        done();
                    }
                    catch(e){
                        done(e);
                    }
                })
            }
            catch(e){
                done(e);
            }
        })

    })
}

function logindeliveryemployeetest(expectedHTTPStatus, username, name, surname, password){
    it('login delivery employee', function(done){
        let u = {username: username, name:name, surname:surname, password:password, type:"deliveryEmployee"}
        let m = {username: u.username, password: u.password};
        agent.post("/api/newUser")
        .send(u)
        .then(function(res){
            try{
                res.should.have.status(201);
                agent.post("/api/deliveryEmployeeSessions")
                .send(m)
                .then(function (res){
                    try{
                        res.should.have.status(expectedHTTPStatus);
                        done();
                    }
                    catch(e){
                        done(e);
                    }
                })
            }
            catch(e){
                done(e);
            }
        })

    })
}

function loginclerktest(expectedHTTPStatus, username, name, surname, password){
    it('login clerk', function(done){
        let u = {username: username, name:name, surname:surname, password:password, type:"clerk"}
        let m = {username: u.username, password: u.password};
        agent.post("/api/newUser")
        .send(u)
        .then(function(res){
            try{
                res.should.have.status(201);
                agent.post("/api/clerkSessions")
                .send(m)
                .then(function (res){
                    try{
                        res.should.have.status(expectedHTTPStatus);
                        done();
                    }
                    catch(e){
                        done(e);
                    }
                })
            }
            catch(e){
                done(e);
            }
        })

    })
}

function updateusertest(expectedHTTPStatus, username, name, surname, password, type, newType){
    it('Updating a User', function(done){
        let u = {username: username, name:name, surname:surname, password:password, type:type};
        let u_with_difftype =  {oldType: type, newType:newType};
        agent.post("/api/newUser")
        .send(u)
        .then(function(res){
            try{
                res.should.have.status(201);
                agent.put("/api/users/"+username)
                .send(u_with_difftype)
                .then(function (res){
                    try{
                        res.should.have.status(200);
                        agent.get("/api/users").then(function (r){
                            try{
                                r.should.have.status(expectedHTTPStatus);
                                r.body[5].id.should.equal(7); // Due to 6 default users
                                r.body[5].email.should.equal(username);
                                r.body[5].name.should.equal(name);
                                r.body[5].surname.should.equal(surname);
                                r.body[5].type.should.equal(u_with_difftype.newType);
                                done();
                            }
                            catch(e){
                                done(e);
                            }
                        })
                    }
                    catch(e){
                        done(e);
                    }    
                   
                })
            }
            catch(e){
                done(e);
            }
        })

    })
        
    }
function deleteusertest(expectedHTTPStatus, username, name, surname, password, type){
    it('Deleting a user', function (done) {

        let u = { username: username, name:name, surname:surname, password:password, type:type }
        agent.post("/api/newUser")
        .send(u)
        .then(function (res) {
            try {
                res.should.have.status(201);

                agent.delete("/api/users/"+username+"/"+type)
                .then(function (r) {
                    try {
                        r.should.have.status(expectedHTTPStatus);
                        done();
                    } catch (e) {
                        done(e);
                    }
                })
            } catch (e) {
                done(e);
            }
          })
    })
}
