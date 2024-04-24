const DatabaseHandler = require("../dbms");
const DataInterface = require("../controller/data-interface");
const { deleteDb } = require("./test-utils")


describe("testControllerTestResult", () => {
    beforeEach(async () => {
        deleteDb()
    });

    testGetTestResults();
    testGetTestResultById();
    createTestResult("123456789012345678901234567890123456", 12, "2021/11/28", true);
    updateTestResult(12, "2021/11/28", true);
    deleteTestResult();
});

function testGetTestResults(){
    test("get test results by rfid", async () => {
        const db = new DatabaseHandler();
        await db.init();
        const datainterface = new DataInterface(db);

        const testResult = {rfid : "123456789012345678901234567890123456", idTestDescriptor : 12, date :  "2021/11/28", result : true};
        await datainterface.CreateTestResult(testResult.rfid, testResult.idTestDescriptor, testResult.date, testResult.result);

        var res = await datainterface.GetSKUItemTestResults(testResult.rfid);
        expect(res.length).toStrictEqual(1);
        const tr = res[0];
        console.log(tr);
        expect(tr.id).toStrictEqual(1);
        expect(tr.idTestDescriptor).toStrictEqual(testResult.idTestDescriptor);
        expect(tr.Date).toStrictEqual(testResult.date);
        expect(tr.Result).toStrictEqual(testResult.result);
    })
}


function testGetTestResultById(){
    test("get test results by rfid and id", async () => {
        const db = new DatabaseHandler();
        await db.init();
        const datainterface = new DataInterface(db);

        const testResult = {rfid : "123456789012345678901234567890123456", idTestDescriptor : 12, date :  "2021/11/28", result : true};
        await datainterface.CreateTestResult(testResult.rfid, testResult.idTestDescriptor, testResult.date, testResult.result);

        var tr = await datainterface.GetSKUItemTestResult(testResult.rfid, 1)

        expect(tr.idTestDescriptor).toStrictEqual(testResult.idTestDescriptor);
        expect(tr.Date).toStrictEqual(testResult.date);
        expect(tr.Result).toStrictEqual(testResult.result);
    })
}

function createTestResult(rfid, idTestDescriptor, date, result){
    test("create test result", async () => {
        const db = new DatabaseHandler();
        await db.init();
        const datainterface = new DataInterface(db);

        await datainterface.CreateTestResult(rfid, idTestDescriptor, date, result);

        var tr = await datainterface.GetSKUItemTestResult(rfid, 1)

        expect(tr.idTestDescriptor).toStrictEqual(idTestDescriptor);
        expect(tr.Date).toStrictEqual(date);
        expect(tr.Result).toStrictEqual(result);
        
    })
}

function updateTestResult(newTestDescriptor, newDate, newResult){
    test("update test result", async () => {
        const db = new DatabaseHandler();
        await db.init();
        const datainterface = new DataInterface(db);

        const testResult = {rfid : "123456789012345678901234567890123456", idTestDescriptor : 12, date :  "2021/11/28", result : 1};
        await datainterface.CreateTestResult(testResult.rfid, testResult.idTestDescriptor, testResult.date, testResult.result);

        await datainterface.UpdateTestResult(testResult.rfid, 1, newTestDescriptor, newDate, newResult);

        var tr = await datainterface.GetSKUItemTestResult(testResult.rfid, 1)

        expect(tr.idTestDescriptor).toStrictEqual(newTestDescriptor);
        expect(tr.Date).toStrictEqual(newDate);
        expect(tr.Result).toStrictEqual(newResult);

    })
}

function deleteTestResult(){
    test("delete test result", async () => {
        const db = new DatabaseHandler();
        await db.init();
        const datainterface = new DataInterface(db);

        const testResult = {rfid : "123456789012345678901234567890123456", idTestDescriptor : 12, date :  "2021/11/28", result : 1};
        await datainterface.CreateTestResult(testResult.rfid, testResult.idTestDescriptor, testResult.date, testResult.result);

        await datainterface.DeleteTestResult(testResult.rfid, 1);
        var res = await datainterface.GetSKUItemTestResults(testResult.rfid);
        expect(res.length).toStrictEqual(0);
    })
}


