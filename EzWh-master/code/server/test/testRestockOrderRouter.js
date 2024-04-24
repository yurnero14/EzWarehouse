const { expect } = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
chai.should();

const { deleteDb } = require("../unit_test/test-utils");
const DatabaseHandler = require("../dbms");
const RestockOrder = require("../models/RestockOrder");

let agent;

describe("Test Restock Orders api", () => {

    beforeEach(async () => {
        deleteDb();

        const db = new DatabaseHandler();
        await db.init();

        delete require.cache[require.resolve("../server")];
        const app = await require("../server");
        agent = chai.request.agent(app);
    });

    testGetRestockOrders(200, "2021/11/29 09:33", "ISSUED", [], 1,[{"SKUId":1,"itemId":10,"description":"a product","price":10.99,"qty":30},{"SKUId":2,"itemId":18,"description":"another product","price":11.99,"qty":20}]);
    testGetRestockOrdersIssued(200, "2021/11/29 09:33", "ISSUED", [], 1, [{"SKUId":1,"itemId":10,"description":"a product","price":10.99,"qty":30},{"SKUId":2,"itemId":18,"description":"another product","price":11.99,"qty":20}]);
    testGetRestockOrderById(200, "2021/11/29 09:33", "ISSUED", [], 1, [{"SKUId":1,"itemId":10,"description":"a product","price":10.99,"qty":30},{"SKUId":2,"itemId":18,"description":"another product","price":11.99,"qty":20}]);
    newRestockOrderTest(201, "2021/11/29 09:33", "ISSUED", [], 1, [{"SKUId":1,"itemId":10,"description":"a product","price":10.99,"qty":30},{"SKUId":2,"itemId":18,"description":"another product","price":11.99,"qty":20}]);
    testPutRestockOrder(200, "2021/11/29 09:33", "DELIVERED", [], 1, [{"SKUId":1,"itemId":10,"description":"a product","price":10.99,"qty":30},{"SKUId":2,"itemId":18,"description":"another product","price":11.99,"qty":20}]);
    deleteRestockOrderTest(204, "2021/11/29 09:33", "ISSUED", [], 1, [{"SKUId":1,"itemId":10,"description":"a product","price":10.99,"qty":30},{"SKUId":2,"itemId":18,"description":"another product","price":11.99,"qty":20}]);
})

function testGetRestockOrders(expectedHTTPStatus, issueDate, state, SKUItems, supplierId, products){
    it('Getting all restock orders', async function () {
        let res;

        let ro = {issueDate : issueDate , supplierId: supplierId, products : products};

        for(let i = 0; i < products.length; i++){
            res = await agent.post("/api/sku").send({
                "description" : "a new sku",
                "weight" : 100,
                "volume" : 50,
                "notes" : "first SKU",
                "price" : 10.99,
                "availableQuantity" : 50
            });
            res.should.have.status(201);

            res = await agent.post("/api/item").send({
                "id" : products[i].itemId,
                "description" : "a new item",
                "price" : 10.99,
                "SKUId" : i + 1,
                "supplierId" : 2
            });
            res.should.have.status(201);
        }

        res = await agent.post("/api/restockOrder").send(ro);
        res.should.have.status(201);
        
        let r = await agent.get("/api/restockOrders")
        r.should.have.status(expectedHTTPStatus);
        r.body[0].issueDate.should.equal(issueDate);
        r.body[0].state.should.equal(state);
        r.body[0].supplierId.should.equal(supplierId);
    })
}

function testGetRestockOrdersIssued(expectedHTTPStatus, issueDate, state, SKUItems, supplierId, products){
    it('Getting all restock orders issued', async function () {
        let res;

        let ro = {issueDate : issueDate , supplierId: supplierId, products : products};

        for(let i = 0; i < products.length; i++){
            res = await agent.post("/api/sku").send({
                "description" : "a new sku",
                "weight" : 100,
                "volume" : 50,
                "notes" : "first SKU",
                "price" : 10.99,
                "availableQuantity" : 50
            });
            res.should.have.status(201);

            res = await agent.post("/api/item").send({
                "id" : products[i].itemId,
                "description" : "a new item",
                "price" : 10.99,
                "SKUId" : i + 1,
                "supplierId" : 2
            });
            res.should.have.status(201);
        }

        res = await agent.post("/api/restockOrder").send(ro);
        res.should.have.status(201);
        
        let r = await agent.get("/api/restockOrdersIssued")
        r.should.have.status(expectedHTTPStatus);
        r.body[0].issueDate.should.equal(issueDate);
        r.body[0].state.should.equal(state);
        r.body[0].supplierId.should.equal(supplierId);
    })
}

function testGetRestockOrderById(expectedHTTPStatus, issueDate, state, SKUItems, supplierId, products){
    it('Getting a restock order by id', async function () {
        let res;

        let ro = {issueDate : issueDate , supplierId: supplierId, products : products};

        for(let i = 0; i < products.length; i++){
            res = await agent.post("/api/sku").send({
                "description" : "a new sku",
                "weight" : 100,
                "volume" : 50,
                "notes" : "first SKU",
                "price" : 10.99,
                "availableQuantity" : 50
            });
            res.should.have.status(201);

            res = await agent.post("/api/item").send({
                "id" : products[i].itemId,
                "description" : "a new item",
                "price" : 10.99,
                "SKUId" : i + 1,
                "supplierId" : 2
            });
            res.should.have.status(201);
        }

        res = await agent.post("/api/restockOrder").send(ro);
        res.should.have.status(201);
        
        let r = await agent.get("/api/restockOrders/1")
        r.should.have.status(expectedHTTPStatus);
        r.body.issueDate.should.equal(issueDate);
        r.body.state.should.equal(state);
        r.body.supplierId.should.equal(supplierId);
    })
}

function newRestockOrderTest(expectedHTTPStatus, issueDate, state, SKUItems, supplierId, products) {
    it('Creating a Restock Order', async function () {
        let res;

        let ro = {issueDate : issueDate , supplierId: supplierId, products : products};

        for(let i = 0; i < products.length; i++){
            res = await agent.post("/api/sku").send({
                "description" : "a new sku",
                "weight" : 100,
                "volume" : 50,
                "notes" : "first SKU",
                "price" : 10.99,
                "availableQuantity" : 50
            });
            res.should.have.status(201);

            res = await agent.post("/api/item").send({
                "id" : products[i].itemId,
                "description" : "a new item",
                "price" : 10.99,
                "SKUId" : i + 1,
                "supplierId" : 2
            });
            res.should.have.status(201);
        }

        res = await agent.post("/api/restockOrder").send(ro);
        res.should.have.status(201);
    })
}

function testPutRestockOrder(expectedHTTPStatus, issueDate, state, SKUItems, supplierId, products){
    it('Modifying a restock order', async function () {
        let res;
        
        let ro = {issueDate : issueDate , supplierId: supplierId, products : products};
        let newro = { newState: state }

        for(let i = 0; i < products.length; i++){
            res = await agent.post("/api/sku").send({
                "description" : "a new sku",
                "weight" : 100,
                "volume" : 50,
                "notes" : "first SKU",
                "price" : 10.99,
                "availableQuantity" : 50
            });
            res.should.have.status(201);

            res = await agent.post("/api/item").send({
                "id" : products[i].itemId,
                "description" : "a new item",
                "price" : 10.99,
                "SKUId" : i + 1,
                "supplierId" : 2
            });
            res.should.have.status(201);
        }

        res = await agent.post("/api/restockOrder").send(ro);
        res.should.have.status(201);
        
        res = await agent.put("/api/restockOrder/1").send(newro);
        res.should.have.status(200);

        let r = await agent.get("/api/restockOrders")
        r.should.have.status(expectedHTTPStatus);
        r.body[0].issueDate.should.equal(issueDate);
        r.body[0].state.should.equal(state);
        r.body[0].supplierId.should.equal(supplierId);
    })
}

function deleteRestockOrderTest(expectedHTTPStatus, issueDate, state, SKUItems, supplierId, products) {
    it('Deleting a Restock Order', async function () {
        let res;

        let ro = {issueDate : issueDate , supplierId: supplierId, products : products};

        for(let i = 0; i < products.length; i++){
            res = await agent.post("/api/sku").send({
                "description" : "a new sku",
                "weight" : 100,
                "volume" : 50,
                "notes" : "first SKU",
                "price" : 10.99,
                "availableQuantity" : 50
            });
            res.should.have.status(201);

            res = await agent.post("/api/item").send({
                "id" : products[i].itemId,
                "description" : "a new item",
                "price" : 10.99,
                "SKUId" : i + 1,
                "supplierId" : 2
            });
            res.should.have.status(201);
        }

        res = await agent.post("/api/restockOrder").send(ro);
        res.should.have.status(201);

        res = await agent.delete("/api/restockOrder/1")
        res.should.have.status(expectedHTTPStatus);
    })
}