"use strict"

const RestockOrder = require("../models/RestockOrder");

async function _getRestockOrders(db){
    const items = await db.loadItem();
    return db.loadRestockOrder().then(orders => orders.map(order => {
        let transportNote = {};
        if (order.getTransportNoteDate()) {
            transportNote = {
              deliveryDate: order.getTransportNoteDate().replaceAll("-", "/"),
            };
        }

        const products = order.getProducts().map(product => {
            const item = items.find(item => item.getId() == product.item);

            return {
                "SKUId": item.getSKUId(),
                "itemId": item.getId(),
                "description": item.getDescription(),
                "price": item.getPrice(),
                "qty": product.qty
            }
        });

        return {
            "id": order.getId(),
            "issueDate": order.getIssueDate(),
            "state": order.getState(),
            "transportNote": transportNote,
            "skuItems": order.getSKUItems().map(skuitem => ({
                "SKUId": skuitem.getSKUid(),
                "itemId": skuitem.getItemId(),
                "rfid": skuitem.getRFID()
            })),
            "supplierId": order.getSupplierId(),
            "products": products
        }
    }));
}

async function _getIssuedRestockOrders(db){
    const items = await db.loadItem();
    return db.loadRestockOrder().then(orders => orders.filter(order => order.getState() === "ISSUED").map(
        order => {
            let transportNote = {};
            if (order.getTransportNoteDate()) {
                transportNote = {
                  deliveryDate: order.getTransportNoteDate().replaceAll("-", "/"),
                };
            }

            const products = order.getProducts().map(product => {
                const item = items.find(item => item.getId() == product.item);
    
                return {
                    "SKUId": item.getSKUId(),
                    "itemId": item.getId(),
                    "description": item.getDescription(),
                    "price": item.getPrice(),
                    "qty": product.qty
                }
            });

            return {
                "id": order.getId(),
                "issueDate": order.getIssueDate(),
                "state": order.getState(),
                "transportNote": transportNote,
                "skuItems": order.getSKUItems().map(skuitem => ({
                    "SKUId": skuitem.getSKUid(),
                    "itemId": skuitem.getItemId(),
                    "rfid": skuitem.getRFID()
                })),
                "supplierId": order.getSupplierId(),
                "products": products
            }
        }
    ))
}

async function _getRestockOrder(db, id){
    const order = await db.loadRestockOrder().then(orders => orders.find(order => order.getId() === id));
    const items = await db.loadItem();

    let transportNote = {};
    if (order.getTransportNoteDate()) {
        transportNote = {
            deliveryDate: order.getTransportNoteDate().replaceAll("-", "/"),
        };
    }

    const products = order.getProducts().map(product => {
        const item = items.find(item => item.getId() == product.item);

        return {
            "SKUId": item.getSKUId(),
            "itemId": item.getId(),
            "description": item.getDescription(),
            "price": item.getPrice(),
            "qty": product.qty
        }
    });

    return {
        "issueDate": order.getIssueDate(),
        "state": order.getState(),
        "transportNote": transportNote,
        "skuItems": order.getSKUItems().map(skuitem => ({
            "SKUId": skuitem.getSKUid(),
            "itemId": skuitem.getItemId(),
            "rfid": skuitem.getRFID()
        })),
        "supplierId": order.getSupplierId(),
        "products": products
    }
}

async function _getRestockOrderReturnItems(db, id){
    const orders = await db.loadRestockOrder();
    const order =  orders.find(order => order.getId() == id);

    const testResults = await db.loadTestResult();
    const failedTestResultRFIDs = testResults.filter(testResult => testResult.getResult() == false).map(testResult => testResult.getSKUItem());

    const returnItems = order.getSKUItems().filter(skuitem => failedTestResultRFIDs.includes(skuitem.getRFID()));

    return returnItems.map(skui => {
        return {
            RFID: skui.getRFID(),
            SKUId: skui.getSKUid(),
            itemId: skui.getItemId()
        }
    })
}

async function _createRestockOrder(db, issueDate, products, supplierId){
    const items = await db.loadItem();
    for(const product of products)
    {
        if (!items.find(item => item.getId() == product.itemId)) {
            throw new Error("Item not found");
        }
    }

    const prods = products.map(product => ({
        item: product.itemId,
        qty: product.qty
    }));
    return db.storeRestockOrder(new RestockOrder(null, issueDate, "ISSUED", null, [], supplierId, prods));
}

async function _updateRestockOrderState(db, id, newState){
    const restockOrder = await db.loadRestockOrder().then(orders => orders.find(order => order.getId() == id));
    restockOrder.setState(newState);
    return db.storeRestockOrder(restockOrder);
}

async function _restockOrderAddSKUItems(db, orderId, skuitems){
    const dbskuitems = await db.loadSKUItem()

    skuitems.forEach(async skuitem => {
        const dbskuitem = dbskuitems.find(dbskuitem => dbskuitem.getRFID() == skuitem.rfid);
        dbskuitem.setRestockOrder(orderId);
        dbskuitem.setItemId(skuitem.itemId);
        await db.storeSKUItem(dbskuitem);
    });
}

async function _restockOrderAddTransportNote(db, orderId, deliveryDate){
    const ro = await db.loadRestockOrder().then(orders => orders.find(order => order.getId() == orderId));
    ro.setTransportNoteDate(deliveryDate);
    return await db.storeRestockOrder(ro);
}

async function _deleteRestockOrder(db, orderId){
    const delRo = await db.loadRestockOrder().then(orders => orders.find(order => order.getId() == orderId));
    return await db.deleteRestockOrder(delRo);
}

module.exports = {
    _getRestockOrders,
    _getIssuedRestockOrders,
    _getRestockOrder,
    _getRestockOrderReturnItems,
    _createRestockOrder,
    _updateRestockOrderState,
    _restockOrderAddSKUItems,
    _restockOrderAddTransportNote,
    _deleteRestockOrder
}