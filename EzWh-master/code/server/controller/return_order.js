'use strict'

const ReturnOrder = require("../models/ReturnOrder");

async function _getReturnOrders(db) {
   
    const prod = await db.loadSKUItem();
    const items = await db.loadItem();

    return db.loadReturnOrder().then(ros => ros.map(ro => {

        const products = prod.filter(skui => skui.getReturnOrder() === ro.getId()).map(p => {
            const item = items.find(item => item.getId() === p.getItemId());

            return {
                    SKUId: p.getSKUid(),
                    itemId: item.getId(),
                    description: item.getDescription(),
                    price: item.getPrice(),
                    RFID: p.getRFID()
            }
        });   

        return {
            id: ro.getId(),
            returnDate: ro.getReturnDate(),
            products: products,
            restockOrderId: ro.getRestockOrderId()
        }
    }));
}

async function _getReturnOrder(db, id) {

    const prod = await db.loadSKUItem();
    const items = await db.loadItem();

    const orders = await db.loadReturnOrder();
    const ro = orders.find(ro => ro.id === Number(id));

    const products = prod.filter(skui => skui.getReturnOrder() === ro.getId()).map(p => {
        const item = items.find(item => item.getId() === p.getItemId());

        return {
                SKUId: p.getSKUid(),
                itemId: item.getId(),
                description: item.getDescription(),
                price: item.getPrice(),
                RFID: p.getRFID()
        }
    });   

    return {
        returnDate: ro.getReturnDate(),
        products: products,
        restockOrderId: ro.getRestockOrderId()
    }
}

async function _createReturnOrder(db, returnDate, products, restockOrderId) {

    const ro = new ReturnOrder(null, returnDate, products, restockOrderId);
    await db.storeReturnOrder(ro);  

    const skuitems = await db.loadSKUItem();
    const productRFIDs = products.map(p => p.RFID);
    skuitems.filter(skui => productRFIDs.includes(skui.getRFID())).forEach(async skui => {
        skui.setReturnOrder(ro.getId());
        skui.setItemId(products.find(p=>p.RFID === skui.getRFID()).itemId);
        await db.storeSKUItem(skui);
    })
}

async function _deleteReturnOrder(db, id) {
    await db.deleteReturnOrder(new ReturnOrder(id));
    const skuitems = await db.loadSKUItem();
    const skuis = skuitems.filter(skui => skui.getReturnOrder() === Number(id));
    for(const skui of skuis) {
        skui.setReturnOrder(null);
        skui.setItemId(null);
        await db.storeSKUItem(skui);
    }
}

module.exports = {
    _getReturnOrders,
    _getReturnOrder,
    _createReturnOrder,
    _deleteReturnOrder
}