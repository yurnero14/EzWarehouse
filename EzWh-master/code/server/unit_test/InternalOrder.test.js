const DatabaseHandler = require("../dbms");
const DataInterface = require("../controller/data-interface");
const { deleteDb } = require("./test-utils");
//const { expect } = require("chai");
//const { expect } = require("chai");

describe('testControllerInternalOrder', () => {

    beforeEach(() => {
        deleteDb()
    });
    testGetInternalOrders();
    testGetInternalOrdersIssued();
    testGetAcceptedInternalOrders();
    testGetInternalOrder();
    testCreateInternalOrder("2022/12/3", [{SKUId:1,description:"a product",price:10.99, RFID: "12345678901234567890123456789016", qty:3},
    {SKUId:2,description:"another product",price:11.99, RFID: "12345678901234567890123456789069", qty:3}],1);
    testUpdateInternalOrder("ACCEPTED");
    testUpdateInternalOrder2("COMPLETED", Products = [{SKUId:1,description:"a product",price:10.99, RFID: "12345678901234567890123456789016",qty:3},
    {SKUId:2,description:"another product",price:11.99,RFID: "12345678901234567890123456789069",qty:3}]);
    testDeleteInternalOrder();
});

function testGetInternalOrders(){
    test('get all Internal Orders', async () =>{
        const db = new DatabaseHandler();
        await db.init();
        const datainterface = new DataInterface(db);

        const IO =   {
            issueDate:"2021/11/29 09:33",
            products: [{SKUId:1,description:"a product",price:10.99, RFID: "12345678901234567890123456789016",qty:3},
                        {SKUId:2,description:"another product",price:11.99,RFID: "12345678901234567890123456789069",qty:3}],
            customerId: 1
        }
        await datainterface.CreateSKU("a product", null, null, null, 10.99) 
        await datainterface.CreateSKU("another product", null, null, null, 11.99)
        await datainterface.createSKUItem("12345678901234567890123456789016", 1)
        await datainterface.createSKUItem("12345678901234567890123456789069", 2)
        await datainterface.CreateInternalOrder(IO.issueDate, IO.products, IO.customerId);
        
        var res = await datainterface.GetInternalOrders();
        console.log('get internal order: ');
        console.log(res);
        expect(res.length).toStrictEqual(1);

        const i = res[0];
        console.log(i);
        expect(i.id).toStrictEqual(1);
        expect(i.issueDate).toStrictEqual(IO.issueDate);
        expect(i.state).toStrictEqual("ISSUED");
        //expect([...i.products]).toStrictEqual(IO.products);
        expect(i.customerId).toStrictEqual(IO.customerId);
        


    })

}

function testGetInternalOrdersIssued(){
    test("Get issued internal orders", async()=>{

    const db = new DatabaseHandler();
    await db.init();
    const datainterface = new DataInterface(db);
    const IO =   {
        issueDate:"2021/11/29 09:33",
        products: [{SKUId:1,description:"a product",price:10.99, RFID: "12345678901234567890123456789016",qty:3},
                    {SKUId:2,description:"another product",price:11.99,RFID: "12345678901234567890123456789069",qty:3}],
        customerId: 1
    }    
    await datainterface.CreateSKU("a product", null, null, null, 10.99) 
    await datainterface.CreateSKU("another product", null, null, null, 11.99)
    await datainterface.createSKUItem("12345678901234567890123456789016", 1)
    await datainterface.createSKUItem("12345678901234567890123456789069", 2)
    await datainterface.CreateInternalOrder(IO.issueDate, IO.products, IO.customerId);    
    
    var res = await datainterface.GetIssuedInternalOrders();
    console.log('get issued internal orders: ')
    console.log(res);
    expect(res.length).toStrictEqual(1);
    const i = res[0];
    expect(i.id).toStrictEqual(1);
    expect(i.issueDate).toStrictEqual(IO.issueDate);
    expect(i.state).toStrictEqual("ISSUED");
    //expect(i.Products).toStrictEqual(IO.products);
    expect(i.customerId).toStrictEqual(IO.customerId);
    
})
}   

function testGetAcceptedInternalOrders(){
    test("Get accepted internal orders", async()=>{
    const db = new DatabaseHandler();
    await db.init();
    const datainterface = new DataInterface(db);
    const IO =   {
        issueDate:"2021/11/29 09:33",
        products: [{SKUId:1,description:"a product",price:10.99, RFID: "12345678901234567890123456789016",qty:3},
                    {SKUId:2,description:"another product",price:11.99,RFID: "12345678901234567890123456789069",qty:3}],
        customerId: 1
    }    
    await datainterface.CreateSKU("a product", null, null, null, 10.99) 
    await datainterface.CreateSKU("another product", null, null, null, 11.99)
    await datainterface.createSKUItem("12345678901234567890123456789016", 1)
    await datainterface.createSKUItem("12345678901234567890123456789069", 2)
    await datainterface.CreateInternalOrder(IO.issueDate, IO.products, IO.customerId);    
    //var temp = await datainterface.GetInternalOrders();
    //t=temp[0];
    await datainterface.UpdateInternalOrder(1, "ACCEPTED");
    var res = await datainterface.GetAcceptedInternalOrders();
    console.log('get accepted internal order: ');
    console.log(res);
    expect(res.length).toStrictEqual(1);
    const i = res[0];
    expect(i.id).toStrictEqual(1);
    expect(i.issueDate).toStrictEqual(IO.issueDate);
    expect(i.state).toStrictEqual("ACCEPTED");
    //expect(i.Products).toStrictEqual(IO.products);
    expect(i.customerId).toStrictEqual(IO.customerId);
    
})
}

function testGetInternalOrder(){
    test('Get internal order by ID ', async()=>{
    const db = new DatabaseHandler();
    await db.init();
    const datainterface = new DataInterface(db);
    const IO =   {
        issueDate:"2021/11/29 09:33",
        products: [{SKUId:1,description:"a product",price:10.99, RFID: "12345678901234567890123456789016",qty:3},
                    {SKUId:2,description:"another product",price:11.99,RFID: "12345678901234567890123456789069",qty:3}],
        customerId: 1
    }    
    await datainterface.CreateSKU("a product", null, null, null, 10.99) 
    await datainterface.CreateSKU("another product", null, null, null, 11.99)
    await datainterface.createSKUItem("12345678901234567890123456789016", 1)
    await datainterface.createSKUItem("12345678901234567890123456789069", 2)
    await datainterface.CreateInternalOrder(IO.issueDate, IO.products, IO.customerId);
    //var temp = await datainterface.GetInternalOrders();
    //t=temp[0];
    var res = await datainterface.GetInternalOrder(1);
    console.log('getting internal order by id');
    console.log(res);
    expect(res.id).toStrictEqual(1);
    expect(res.issueDate).toStrictEqual(IO.issueDate);
    //expect(i.state).toStrictEqual(IO.state);
    //expect(i.Products).toStrictEqual(IO.products); 
    expect(res.customerId).toStrictEqual(IO.customerId);
       

    })
}

function testCreateInternalOrder(issueDate, products, customerId){
    test('create internal order ', async()=>{
        const db = new DatabaseHandler();
        await db.init();
        const datainterface = new DataInterface(db);

        await datainterface.CreateSKU("a product", null, null, null, 10.99) 
    await datainterface.CreateSKU("another product", null, null, null, 11.99)
    await datainterface.createSKUItem("12345678901234567890123456789016", 1)
    await datainterface.createSKUItem("12345678901234567890123456789069", 2)
    await datainterface.CreateInternalOrder(issueDate, products, customerId);
        
        var res = await datainterface.GetInternalOrders();
        expect(res.length).toStrictEqual(1);

        const i = res[0];
        expect(i.id).toStrictEqual(1);
        expect(i.issueDate).toStrictEqual(issueDate);
        expect(i.state).toStrictEqual("ISSUED");
        //expect(i.Products).toStrictEqual(products);
        expect(i.customerId).toStrictEqual(customerId);
        


    })
}

function testUpdateInternalOrder(newState){
    test('Update internal order', async()=>{
        const db = new DatabaseHandler();
        await db.init();
        const datainterface = new DataInterface(db);
        const IO =   {
            issueDate:"2021/11/29 09:33",
            products: [{SKUId:1,description:"a product",price:10.99, RFID: "12345678901234567890123456789016",qty:3},
                        {SKUId:2,description:"another product",price:11.99,RFID: "12345678901234567890123456789069",qty:3}],
            customerId: 1
        }    
        await datainterface.CreateSKU("a product", null, null, null, 10.99) 
        await datainterface.CreateSKU("another product", null, null, null, 11.99)
        await datainterface.createSKUItem("12345678901234567890123456789016", 1)
        await datainterface.createSKUItem("12345678901234567890123456789069", 2)
        await datainterface.CreateInternalOrder(IO.issueDate, IO.products, IO.customerId);
        await datainterface.UpdateInternalOrder(1,newState);
        var res = await datainterface.GetInternalOrders();
        console.log('Updated internal Order: ');
        console.log(res);
        expect(res.length).toStrictEqual(1);
        const i = res[0];
        expect(i.id).toStrictEqual(1);
        expect(i.issueDate).toStrictEqual(IO.issueDate);
        expect(i.state).toStrictEqual(newState);
        //expect(i.Products).toStrictEqual(IO.products);
        expect(i.customerId).toStrictEqual(IO.customerId);
        
        
    })
}

function testUpdateInternalOrder2(newState, Products){
    test('Update internal order', async()=>{
        const db = new DatabaseHandler();
        await db.init();
        const datainterface = new DataInterface(db);
        const IO =   {
            issueDate:"2021/11/29 09:33",
            products: Products,
            customerId: 1
        }    
        await datainterface.CreateSKU("a product", null, null, null, 10.99) 
        await datainterface.CreateSKU("another product", null, null, null, 11.99)
        await datainterface.createSKUItem("12345678901234567890123456789016", 1)
        await datainterface.createSKUItem("12345678901234567890123456789069", 2)
        await datainterface.CreateInternalOrder(IO.issueDate, IO.products, IO.customerId);
        await datainterface.UpdateInternalOrder2(1,newState, Products);
        var res = await datainterface.GetInternalOrders();
        console.log('Updated internal Order: ');
        console.log(res);
        expect(res.length).toStrictEqual(1);
        const i = res[0];
        expect(i.id).toStrictEqual(1);
        expect(i.issueDate).toStrictEqual(IO.issueDate);
        expect(i.state).toStrictEqual(newState);
        //expect(i.Products).toStrictEqual(IO.products);
        expect(i.customerId).toStrictEqual(IO.customerId);
        
        
    })
}

function testDeleteInternalOrder(){
    test("Delete Internal Order",async()=>{
        const db = new DatabaseHandler();
        await db.init();
        const datainterface = new DataInterface(db);
        const IO =   {
            issueDate:"2021/11/29 09:33",
            products: [{SKUId:1,description:"a product",price:10.99, RFID: "12345678901234567890123456789016",qty:3},
                        {SKUId:2,description:"another product",price:11.99,RFID: "12345678901234567890123456789069",qty:3}],
            customerId: 1
        }    
        await datainterface.CreateInternalOrder(IO.issueDate, IO.products, IO.customerId);
        await datainterface.DeleteInternalOrder(1);
        var res = await datainterface.GetInternalOrders();
        expect(res.length).toStrictEqual(0);
    })
}

