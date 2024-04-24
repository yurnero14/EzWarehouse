const DatabaseHandler = require("../dbms");
const DataInterface = require("../controller/data-interface");
const {deleteDb} = require("./test-utils");

describe("testControllerRestockOrder", () => {
    beforeEach(() => {
        deleteDb();
    });
    
    testGetRestockOrders();
    testGetRestockOrdersIssued();
    testGetRestockOrderById();
    testGetReturnItemsById();
    testCreateRestockOrder("2021/11/29 09:33", [{"SKUId":12, "itemId":1,"description":"a product","price":10.99,"qty":30},
        {"SKUId":180,"itemId":2,"description":"another product","price":11.99,"qty":20}],1);
    testUpdateRestockOrder("DELIVERED");
    testUpdateSKUItems();
    testUpdateTransportNote("2021/12/29");
    testDeleteRestockOrder();
});

function testGetRestockOrders(){
    test("get restock orders", async () => {
        const db = new DatabaseHandler();
        await db.init();
        const datainterface = new DataInterface(db);

        const ro = {
            issueDate:"2021/11/29 09:33",
            products : [{"SKUId":12, "itemId":1,"description":"a product","price":10.99,"qty":30},
                        {"SKUId":180,"itemId":2,"description":"another product","price":11.99,"qty":20}],
            supplierId : 1
        }
        // await datainterface.CreateSKU("a product", null, null, null, 10.99)
        // await datainterface.CreateSKU("another product", null, null, null, 11.99)
        // await datainterface.createSKUItem("12345678901234567890123456789016", 1)
        // await datainterface.createSKUItem("12345678901234567890123456789069", 2)
        await datainterface.CreateItem(1, "a product", 10.99, 12, 1);
        await datainterface.CreateItem(2, "another product", 11.99, 180, 1);
        await datainterface.CreateRestockOrder(ro.issueDate, ro.products, ro.supplierId);
        
        var res = await datainterface.GetRestockOrders();
        expect(res.length).toStrictEqual(1);

        const test = res[0];
        expect(test.id).toStrictEqual(1);
        expect(test.issueDate).toStrictEqual(ro.issueDate);
        expect(test.state).toStrictEqual("ISSUED");
        expect(test.supplierId).toStrictEqual(ro.supplierId);
        //expect(test.products).toStrictEqual(ro.products);
    })
}

function testGetRestockOrdersIssued(){
    test("get issued restock orders", async () => {
        const db = new DatabaseHandler();
        await db.init();
        const datainterface = new DataInterface(db);

        const ro = {issueDate:"2021/11/29 09:33",
                    products : [{"SKUId":12, "itemId":1,"description":"a product","price":10.99,"qty":30},
                                {"SKUId":180,"itemId":2,"description":"another product","price":11.99,"qty":20}],
                    supplierId : 1};
        await datainterface.CreateItem(1, "a product", 10.99, 12, 1);
        await datainterface.CreateItem(2, "another product", 11.99, 180, 1);
        await datainterface.CreateRestockOrder(ro.issueDate, ro.products, ro.supplierId);
        
        var res = await datainterface.GetIssuedRestockOrders();
        expect(res.length).toStrictEqual(1);

        const test = res[0];
        expect(test.id).toStrictEqual(1);
        expect(test.issueDate).toStrictEqual(ro.issueDate);
        expect(test.state).toStrictEqual("ISSUED");
        expect(test.supplierId).toStrictEqual(ro.supplierId);
        expect([...test.products]).toStrictEqual(ro.products);
    })
}

function testGetRestockOrderById(){
    test("get restock orders by id", async () => {
        const db = new DatabaseHandler();
        await db.init();
        const datainterface = new DataInterface(db);

        const ro = {issueDate:"2021/11/29 09:33",
                    products : [{"SKUId":12, "itemId":1,"description":"a product","price":10.99,"qty":30},
                                {"SKUId":180,"itemId":2,"description":"another product","price":11.99,"qty":20}],
                    supplierId : 1};
        await datainterface.CreateItem(1, "a product", 10.99, 12, 1);
        await datainterface.CreateItem(2, "another product", 11.99, 180, 1);
        await datainterface.CreateRestockOrder(ro.issueDate, ro.products, ro.supplierId);
        
        var test = await datainterface.GetRestockOrder(1);

        expect(test.issueDate).toStrictEqual(ro.issueDate);
        expect(test.state).toStrictEqual("ISSUED");
        expect(test.supplierId).toStrictEqual(ro.supplierId);
        expect(test.products).toEqual(ro.products);
    })
}

function testGetReturnItemsById(){
    test("get return items by id", async () => {
        const db = new DatabaseHandler();
        await db.init();
        const datainterface = new DataInterface(db);

        const skuitems = [{"SKUId":1,"itemId":1,"rfid":"12345678901234567890123456789016"}];

        const ro = {issueDate:"2021/11/29 09:33",
                    products : [{"SKUId":1, "itemId":1,"description":"a product","price":10.99,"qty":30},
                                {"SKUId":180,"itemId":2,"description":"another product","price":11.99,"qty":20}],
                    supplierId : 1};
        await datainterface.CreateSKU("sku description", 10, 10, "", 21, 5);
        await datainterface.CreateItem(1, "a product", 10.99, 1, 1);
        await datainterface.CreateItem(2, "another product", 11.99, 180, 1);
        await datainterface.CreateRestockOrder(ro.issueDate, ro.products, ro.supplierId);

        await datainterface.createSKUItem("12345678901234567890123456789016", 1, "2021/11/29");
        await datainterface.RestockOrderAddSKUItems(1, skuitems)
        await datainterface.createTestDescriptor("test 1", "description 1", 12);
        await datainterface.CreateTestResult("12345678901234567890123456789016", 1, "2021/11/29", false);

        var res = await datainterface.GetRestockOrderReturnItems(1);
        expect(res.length).toStrictEqual(1);
        
        expect(res[0].RFID).toStrictEqual(skuitems[0].rfid);
        expect(res[0].SKUId).toStrictEqual(skuitems[0].SKUId);
        expect(res[0].itemId).toStrictEqual(skuitems[0].itemId);

        //expect(res.getProducts()).toStrictEqual(ro.products);

    })
}

function testCreateRestockOrder(issueDate, products, supplierId){
    test("create restock order", async () => {
        const db = new DatabaseHandler();
        await db.init();
        const datainterface = new DataInterface(db);

        await datainterface.CreateItem(1, "a product", 10.99, 12, 1);
        await datainterface.CreateItem(2, "another product", 11.99, 180, 1);
        await datainterface.CreateRestockOrder(issueDate, products, supplierId);
        var test = await datainterface.GetRestockOrder(1);

        expect(test.issueDate).toStrictEqual(issueDate);
        expect(test.state).toStrictEqual("ISSUED");
        expect(test.supplierId).toStrictEqual(supplierId);
        expect(test.products).toEqual(products);
    })
}

function testUpdateRestockOrder(newState){
    test("update restock order state", async () => {
        const db = new DatabaseHandler();
        await db.init();
        const datainterface = new DataInterface(db);

        const ro = {issueDate:"2021/11/29 09:33",
                    products : [{"SKUId":12, "itemId":1,"description":"a product","price":10.99,"qty":30},
                                {"SKUId":180,"itemId":2,"description":"another product","price":11.99,"qty":20}],
                    supplierId : 1};
        await datainterface.CreateItem(1, "a product", 10.99, 12, 1);
        await datainterface.CreateItem(2, "another product", 11.99, 180, 1);
        await datainterface.CreateRestockOrder(ro.issueDate, ro.products, ro.supplierId);
        await datainterface.UpdateRestockOrderState(1, newState);
        var test = await datainterface.GetRestockOrder(1);

        expect(test.issueDate).toStrictEqual(ro.issueDate);
        expect(test.state).toStrictEqual(newState);
        expect(test.supplierId).toStrictEqual(ro.supplierId);
        expect(test.products).toEqual(ro.products);
    })
}

function testUpdateSKUItems(){
    test("update restock order skuItems", async () => {
        const db = new DatabaseHandler();
        await db.init();
        const datainterface = new DataInterface(db);

        const skuitems = [{"SKUId":1,"itemId":1,"rfid":"12345678901234567890123456789016"},{"SKUId":2,"itemId":2,"rfid":"12345678901234567890123456789017"}]

        const ro = {issueDate:"2021/11/29 09:33",
                    products : [{"SKUId":1, "itemId":1,"description":"a product","price":10.99,"qty":30},
                                {"SKUId":2,"itemId":2,"description":"another product","price":11.99,"qty":20}],
                    supplierId : 1};

        await datainterface.CreateSKU("sku description", 10, 10, "", 21, 5);
        await datainterface.CreateSKU("sku description 2", 10, 15, "", 21, 5);
        await datainterface.CreateItem(1, "a product", 10.99, 1, 1);
        await datainterface.CreateItem(2, "another product", 11.99, 2, 1);
        await datainterface.createSKUItem("12345678901234567890123456789016", 1, "2021/11/29");
        await datainterface.createSKUItem("12345678901234567890123456789017", 2, "2021/11/29");
        await datainterface.CreateRestockOrder(ro.issueDate, ro.products, ro.supplierId);
        await datainterface.UpdateRestockOrderState(1, "DELIVERED");
        await datainterface.RestockOrderAddSKUItems(1, skuitems);

        var test = await datainterface.GetRestockOrder(1);

        expect(test.issueDate).toStrictEqual(ro.issueDate);
        expect(test.state).toStrictEqual("DELIVERED");
        expect(test.supplierId).toStrictEqual(ro.supplierId);
        expect(test.products).toEqual(ro.products);
        //expect(test.SKUItems).toStrictEqual(skuItems);
    })
}

function testUpdateTransportNote(deliveryDate){
    test("update restock order transport note", async () => {
        const db = new DatabaseHandler();
        await db.init();
        const datainterface = new DataInterface(db);

        const ro = {issueDate:"2021/11/29 09:33",
                    products : [{"SKUId":12, "itemId":1,"description":"a product","price":10.99,"qty":30},
                                {"SKUId":180,"itemId":2,"description":"another product","price":11.99,"qty":20}],
                    supplierId : 1};
        await datainterface.CreateItem(1, "a product", 10.99, 12, 1);
        await datainterface.CreateItem(2, "another product", 11.99, 180, 1);
        await datainterface.CreateRestockOrder(ro.issueDate, ro.products, ro.supplierId);
        await datainterface.UpdateRestockOrderState(1, "DELIVERY");
        var test = await datainterface.GetRestockOrder(1);

        expect(test.issueDate).toStrictEqual(ro.issueDate);
        expect(test.state).toStrictEqual("DELIVERY");
        expect(test.supplierId).toStrictEqual(ro.supplierId);
        expect(test.products).toEqual(ro.products);
    })
}

function testDeleteRestockOrder(){
    test("delete restock order", async () => {
        const db = new DatabaseHandler();
        await db.init();
        const datainterface = new DataInterface(db);

        const ro = {issueDate:"2021/11/29 09:33",
                    products : [{"SKUId":12, "itemId":1,"description":"a product","price":10.99,"qty":30},
                                {"SKUId":180,"itemId":2,"description":"another product","price":11.99,"qty":20}],
                    supplierId : 1};
        await datainterface.CreateItem(1, "a product", 10.99, 12, 1);
        await datainterface.CreateItem(2, "another product", 11.99, 180, 1);
        await datainterface.CreateRestockOrder(ro.issueDate, ro.products, ro.supplierId);
        await datainterface.DeleteRestockOrder(1);

        var res = await datainterface.GetRestockOrders();
        expect(res.length).toStrictEqual(0);
    })
}
