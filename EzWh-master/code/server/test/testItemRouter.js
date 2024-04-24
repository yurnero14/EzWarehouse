const { expect } = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
chai.should();

const { deleteDb } = require("../unit_test/test-utils");

let agent;

describe("Test Item api", async () => {

    beforeEach(async () => {
        deleteDb();

        delete require.cache[require.resolve("../server")];
        const app = await require("../server");
        agent = chai.request.agent(app);
    });

    testGetItems(200, 1, "new item", 10.99, 1,2);
    testGetItemId(200, 1, "new item", 10.99, 1,2);
    testCreateItem(201, 1, "new item", 10.99, 1,2);
    testUpdateItem(200, 1, "new item", "a new sku!!", 10.99, 12.99, 1,2);
    testDeleteItem(204, 1, "new item", 10.99, 1,2);
})

function testGetItems(expectedHTTPStatus, id, description, price, SKUId, supplierId){
    it('Getting all Items', function (done) {
        
        let item = {id : id, description : description, price : price, SKUId : SKUId, supplierId: supplierId};

        agent.post("/api/sku").send({
            "description" : "a new sku",
            "weight" : 100,
            "volume" : 50,
            "notes" : "first SKU",
            "price" : 10.99,
            "availableQuantity" : 50
        }).then(function (skures) {
        try {
        
        skures.should.have.status(201);

        agent.post("/api/item")
        .send(item)
            .then(function (res) {
                try {
                    res.should.have.status(201);
                
                    agent.get("/api/items").then(function (r) {
                        try {
                            r.should.have.status(expectedHTTPStatus);
    
                            r.body[0].id.should.equal(id);
                            r.body[0].description.should.equal(description);
                            r.body[0].price.should.equal(price);
                            r.body[0].SKUId.should.equal(SKUId);
                            r.body[0].supplierId.should.equal(supplierId);
                            
                            done();
                        } catch (e) {
                            done(e);
                        }
                    })
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

function testGetItemId(expectedHTTPStatus, id, description, price, SKUId, supplierId){
    it('Getting all Items', function (done) {
        
        let item = {id : id, description : description, price : price, SKUId : SKUId, supplierId: supplierId};

        agent.post("/api/sku").send({
            "description" : "a new sku",
            "weight" : 100,
            "volume" : 50,
            "notes" : "first SKU",
            "price" : 10.99,
            "availableQuantity" : 50
        }).then(function (skures) {
        try {
        
        skures.should.have.status(201);

        agent.post("/api/item")
        .send(item)
            .then(function (res) {
                try {
                    res.should.have.status(201);
                
                    agent.get("/api/items/"+1).then(function (r) {
                        try {
                            r.should.have.status(expectedHTTPStatus);
    
                            r.body.id.should.equal(id);
                            r.body.description.should.equal(description);
                            r.body.price.should.equal(price);
                            r.body.SKUId.should.equal(SKUId);
                            r.body.supplierId.should.equal(supplierId);
                            
                            done();
                        } catch (e) {
                            done(e);
                        }
                    })
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

function testCreateItem(expectedHTTPStatus, id, description, price, SKUId, supplierId) {
    it('Creating new item', function (done) {
    
        let item = {id : id, description : description, price : price, SKUId : SKUId, supplierId: supplierId};

        agent.post("/api/sku").send({
            "description" : "a new sku",
            "weight" : 100,
            "volume" : 50,
            "notes" : "first SKU",
            "price" : 10.99,
            "availableQuantity" : 50
        }).then(function (skures) {
        try {
        
        skures.should.have.status(201);

        agent.post("/api/item")
        .send(item)
            .then(function (res) {
                try {
                    res.should.have.status(expectedHTTPStatus);  
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

function testUpdateItem(expectedHTTPStatus, id, description, newDescription, price, newPrice, SKUId, supplierId) {
    it('Updating item', function (done) {

        let item = {id : id, description : description, price : price, SKUId : SKUId, supplierId: supplierId};
        let newItem = {newDescription : newDescription, newPrice : newPrice}

        agent.post("/api/sku").send({
            "description" : "a new sku",
            "weight" : 100,
            "volume" : 50,
            "notes" : "first SKU",
            "price" : 10.99,
            "availableQuantity" : 50
        }).then(function (skures) {
        try {
        
        skures.should.have.status(201);

        agent.post("/api/item")
        .send(item)
        .then(function (res) {
            try {
                res.should.have.status(201);
            
                agent.put("/api/item/"+1)
                .send(newItem)
                .then(function (res) {
                    try {
                        res.should.have.status(200);
    
                        agent.get("/api/items").then(function (r) {

                            try {
                                r.should.have.status(expectedHTTPStatus);
                                
                                r.body[0].id.should.equal(id);
                                r.body[0].description.should.equal(newDescription);
                                r.body[0].price.should.equal(newPrice);
                                r.body[0].SKUId.should.equal(SKUId);
                                r.body[0].supplierId.should.equal(supplierId);
                            
                                done();
                            } catch (e) {
                                done(e);
                            }  
                        })
                    } catch (e) {
                        done(e);
                    }
                })
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

function testDeleteItem(expectedHTTPStatus, id, description, price, SKUId, supplierId) {
    it('Deleting item', function (done) {

        let item = {id : id, description : description, price : price, SKUId : SKUId, supplierId: supplierId};

        agent.post("/api/sku").send({
            "description" : "a new sku",
            "weight" : 100,
            "volume" : 50,
            "notes" : "first SKU",
            "price" : 10.99,
            "availableQuantity" : 50
        }).then(function (skures) {
        try {
        
        skures.should.have.status(201);

        agent.post("/api/item")
        .send(item)
        .then(function (res) {
            try {
                res.should.have.status(201);

                agent.delete("/api/items/"+1)
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
        } catch (e) {
            done(e);
        }
        })
    })
}