"use strict";

const TestResult = require("../models/test-result");


async function _getSKUItemTestResults(db, rfid){
        return db.loadTestResult().then(tests => tests.filter(test => test.getSKUItem() === rfid).map(
            test => ({
                "id": test.getID(),
                "Date": test.getDate(),
                "Result": test.getResult(),
                "idTestDescriptor": test.getTestDescriptor(),
            }
        )));
}

async function _getSKUItemTestResult(db, rfid, idTestResult){
    const test = await db.loadTestResult().then(tests => tests.find(test => test.getSKUItem() == rfid &&test.getID() == idTestResult))
    return {
        "id": test.getID(),
        "Date": test.getDate(),
        "Result": test.getResult(),
        "idTestDescriptor": test.getTestDescriptor()
    }
}

async function _createTestResult(db, rfid, idTestDescriptor, date, result){
    return db.storeTestResult(new TestResult(null, date, result, idTestDescriptor, rfid));
}

async function _updateTestResult(db, rfid, idTestResult, newTestDescriptor, newDate, newResult){
    const mytest = await db.loadTestResult().then(tests => tests.find(test => test.getSKUItem() == rfid && test.getID() == idTestResult));
    mytest.setTestDescriptorID(newTestDescriptor);
    mytest.setDate(newDate);
    return db.storeTestResult(mytest);
}

async function _deleteTestResult(db, rfid, idTestResult){
    const delTest = await db.loadTestResult().then(tests => tests.find(test => test.getSKUItem() == rfid && test.getID() == idTestResult));
    return db.deleteTestResult(delTest);
}

module.exports = {
    _getSKUItemTestResults,
    _getSKUItemTestResult,
    _createTestResult,
    _updateTestResult,
    _deleteTestResult
}