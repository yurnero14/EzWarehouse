'use strict';
const InternalOrder = require('../models/InternalOrder');
const SKUitem = require('../models/SKUitem');
const SKU = require('../models/sku')
async function getInternalOrders(db){
    const prod = await db.loadSKUItem();
    const skus = await db.loadSKU();
    return db.loadInternalOrder().then(internalOrder=>internalOrder.map((IO)=>({
           id: IO.getID(),
           issueDate: IO.getIssueDate(),
           state: IO.getState(),
           customerId: IO.getCustomerID(),
            products: IO.getProducts()
    }
    )));
}

async function getIssuedInternalOrders(db){
    let IO_issued = await db.loadInternalOrder();
    const prod = await db.loadSKUItem();
    const skus = await db.loadSKU();
    return IO_issued.filter(io_a => io_a.state==="ISSUED").map((IO)=>({
        id: IO.getID(),
        issueDate: IO.getIssueDate(),
        state: IO.getState(),
        customerId: IO.getCustomerID(),
        products: IO.getProducts()
     }));
}

async function getAcceptedInternalOrders(db){
    let IO_accepted = await db.loadInternalOrder();
    const prod = await db.loadSKUItem();
    const skus = await db.loadSKU();
    return IO_accepted.filter(io_a => io_a.state==="ACCEPTED").map((IO)=>({
        id: IO.getID(),
        issueDate: IO.getIssueDate(),
        state: IO.getState(),
        customerId: IO.getCustomerID(),
        products: IO.getProducts()
     }));
}

async function get_InternalOrder(db, id){

    const ios = await db.loadInternalOrder()
    const io = ios.find(io => io.id === Number(id))
    return {
        id: io.getID(),
        issueDate: io.getIssueDate(),
        state: io.getState(),
        customerId: io.getCustomerID(),
        products: io.getProducts()
    }
}
        

async function createInternalOrder(db, issueDate, products, customerId){
    const IO_new = new InternalOrder(null, issueDate, "ISSUED", products, customerId);
    await db.storeInternalOrder(IO_new);
}

async function updateInternalOrder(db, id, newState){

        const InternalOrder = await db.loadInternalOrder().then(orders => orders.find(order => order.getID() == id));
        InternalOrder.setstate(newState);
        return db.storeInternalOrder(InternalOrder);

}

async function updateInternalOrder2(db,id,newState, products){
    const InternalOrder = await db.loadInternalOrder().then(orders => orders.find(order => order.getID() == id));
    InternalOrder.setstate(newState);
    InternalOrder.setProducts(products);
    return db.storeInternalOrder(InternalOrder);
}
function deleteInternalOrder(db, id){
    return db.deleteInternalOrder(new InternalOrder(id));
}

module.exports = {
    getInternalOrders,
    getIssuedInternalOrders,
    getAcceptedInternalOrders,
    get_InternalOrder,
    createInternalOrder,
    updateInternalOrder,
    updateInternalOrder2,
    deleteInternalOrder,
    
}






