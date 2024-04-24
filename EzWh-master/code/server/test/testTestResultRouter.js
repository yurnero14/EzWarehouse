const { expect } = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
chai.should();

const { deleteDb } = require("../unit_test/test-utils");

let agent;

describe("Test TestResult api", async () => {

    beforeEach(async () => {
        deleteDb();

        delete require.cache[require.resolve("../server")];
        const app = await require("../server");
        agent = chai.request.agent(app);
    });

    testGetSKUItemTestResults(200,"12345678901234567890123456789016",1,"2021/11/28",true);
    testGetSKUItemTestResult(200,"12345678901234567890123456789016",1,"2021/11/28",true);
    testNewTestResult(201,"12345678901234567890123456789016",1,"2021/11/28",true);
    testUpdateTestResult(200,"12345678901234567890123456789016",1,"2021/11/28",true);
    deleteTestResultTest(204,"12345678901234567890123456789016",1,"2021/11/28",true);

})

function testGetSKUItemTestResults(expectedHTTPStatus,rfid,idTestDescriptor,Date,Result) {
    it('Getting all Test Results', async function() {
        let res = await agent.post("/api/sku").send({
            "description" : "a new sku",
            "weight" : 100,
            "volume" : 50,
            "notes" : "first SKU",
            "price" : 10.99,
            "availableQuantity" : 50
        });
        res.should.have.status(201);

        res = await agent.post("/api/skuitem").send({
            "RFID":rfid,
            "SKUId":1,
            "DateOfStock":"2021/11/29 12:30"
        });
        res.should.have.status(201);

        res = await agent.post("/api/testDescriptor").send({
            "name":"test descriptor 3",
            "procedureDescription":"This test is described by...",
            "idSKU": 1
        });
        res.should.have.status(201);

        res = await agent.post("/api/skuitems/testResult").send({
            "rfid":rfid,
            "idTestDescriptor":idTestDescriptor,
            "Date":Date,
            "Result": Result
        });
        res.should.have.status(201);

        res = await agent.get("/api/skuitems/"+rfid+"/testResults");

        res.should.have.status(expectedHTTPStatus);

        res.body[0].id.should.equal(1);
        res.body[0].idTestDescriptor.should.equal(idTestDescriptor);
        res.body[0].Date.should.equal(Date);
        res.body[0].Result.should.equal(Result);
    })
}

function testGetSKUItemTestResult(expectedHTTPStatus,rfid,idTestDescriptor,Date,Result) {
    it('Getting a Test Results', async function() {
        let res = await agent.post("/api/sku").send({
            "description" : "a new sku",
            "weight" : 100,
            "volume" : 50,
            "notes" : "first SKU",
            "price" : 10.99,
            "availableQuantity" : 50
        });
        res.should.have.status(201);

        res = await agent.post("/api/skuitem").send({
            "RFID":rfid,
            "SKUId":1,
            "DateOfStock":"2021/11/29 12:30"
        });
        res.should.have.status(201);

        res = await agent.post("/api/testDescriptor").send({
            "name":"test descriptor 3",
            "procedureDescription":"This test is described by...",
            "idSKU": 1
        });
        res.should.have.status(201);

        res = await agent.post("/api/skuitems/testResult").send({
            "rfid":rfid,
            "idTestDescriptor":idTestDescriptor,
            "Date":Date,
            "Result": Result
        })
        res.should.have.status(201);

        res = await agent.get("/api/skuitems/"+rfid+"/testResults/"+1);

        res.should.have.status(expectedHTTPStatus);

        res.body.id.should.equal(1);
        res.body.idTestDescriptor.should.equal(idTestDescriptor);
        res.body.Date.should.equal(Date);
        res.body.Result.should.equal(Result);
    })
}

function testNewTestResult(expectedHTTPStatus,rfid,idTestDescriptor,Date,Result) {
    it('Creating a new TestResult', async function() {
        let res = await agent.post("/api/sku").send({
            "description" : "a new sku",
            "weight" : 100,
            "volume" : 50,
            "notes" : "first SKU",
            "price" : 10.99,
            "availableQuantity" : 50
        });
        res.should.have.status(201);

        res = await agent.post("/api/skuitem").send({
            "RFID":rfid,
            "SKUId":1,
            "DateOfStock":"2021/11/29 12:30"
        });
        res.should.have.status(201);

        res = await agent.post("/api/testDescriptor").send({
            "name":"test descriptor 3",
            "procedureDescription":"This test is described by...",
            "idSKU": 1
        });
        res.should.have.status(201);

        res = await agent.post("/api/skuitems/testResult").send({
            "rfid":rfid,
            "idTestDescriptor":idTestDescriptor,
            "Date":Date,
            "Result": Result
        })
        res.should.have.status(expectedHTTPStatus);
    })
}

function testUpdateTestResult(expectedHTTPStatus,rfid,idTestDescriptor,Date,Result) {
    it('Updating a TestResult', async function() {
        let newtr = {
            "newIdTestDescriptor":2,
            "newDate":"2021/11/28",
            "newResult": true
        }

        let res = await agent.post("/api/sku").send({
            "description" : "a new sku",
            "weight" : 100,
            "volume" : 50,
            "notes" : "first SKU",
            "price" : 10.99,
            "availableQuantity" : 50
        });
        res.should.have.status(201);

        res = await agent.post("/api/skuitem").send({
            "RFID":rfid,
            "SKUId":1,
            "DateOfStock":"2021/11/29 12:30"
        });
        res.should.have.status(201);

        res = await agent.post("/api/testDescriptor").send({
            "name":"test descriptor 3",
            "procedureDescription":"This test is described by...",
            "idSKU": 1
        });
        res.should.have.status(201);

        res = await agent.post("/api/testDescriptor").send({
            "name":"test descriptor new new",
            "procedureDescription":"This test is described by...",
            "idSKU": 1
        });
        res.should.have.status(201);

        res = await agent.post("/api/skuitems/testResult").send({
            "rfid":rfid,
            "idTestDescriptor":idTestDescriptor,
            "Date":Date,
            "Result": Result
        })
        res.should.have.status(201);

        res = await agent.put("/api/skuitems/"+rfid+"/testResult/"+1).send(newtr)
        res.should.have.status(200);

        res = await agent.get("/api/skuitems/"+rfid+"/testResults");
        res.should.have.status(expectedHTTPStatus);

        res.body[0].id.should.equal(1);
        res.body[0].idTestDescriptor.should.equal(newtr.newIdTestDescriptor);
        res.body[0].Date.should.equal(newtr.newDate);
        res.body[0].Result.should.equal(newtr.newResult);
    })
}

function deleteTestResultTest(expectedHTTPStatus,rfid,idTestDescriptor,Date,Result) {
    it('Deleting a TestResult', async function () {
        let res = await agent.post("/api/sku").send({
            "description" : "a new sku",
            "weight" : 100,
            "volume" : 50,
            "notes" : "first SKU",
            "price" : 10.99,
            "availableQuantity" : 50
        });
        res.should.have.status(201);

        res = await agent.post("/api/skuitem").send({
            "RFID":rfid,
            "SKUId":1,
            "DateOfStock":"2021/11/29 12:30"
        });
        res.should.have.status(201);

        res = await agent.post("/api/testDescriptor").send({
            "name":"test descriptor 3",
            "procedureDescription":"This test is described by...",
            "idSKU": 1
        });
        res.should.have.status(201);

        res = await agent.post("/api/skuitems/testResult").send({
            "rfid":rfid,
            "idTestDescriptor":idTestDescriptor,
            "Date":Date,
            "Result": Result
        });
        res.should.have.status(201);

        res = await agent.delete("/api/skuitems/"+rfid+"/testResult/"+1);
        res.should.have.status(expectedHTTPStatus);
    })
}