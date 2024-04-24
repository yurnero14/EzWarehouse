'use strict'

const SKUitem = require("../models/SKUitem");

function _getAllSKUitems(db) {
    return db.loadSKUItem().then(skuitems => skuitems.map(skui => (
        {
            RFID: skui.getRFID(),
            SKUId: skui.getSKUid(),
            Available: skui.getAvailable(),
            DateOfStock: skui.getDateOfStock()
        }
    )).sort((a,b) => (a.RFID > b.RFID) ? 1 : -1))
}

function _getAvailableSKUitems(db, skuid) {
    return db.loadSKUItem().then(skuitems => skuitems.filter(skui => skui.getAvailable() === 1 && skui.getSKUid() === Number(skuid)).map(skui => (
        {
            RFID: skui.getRFID(),
            SKUId: skui.getSKUid(),
            DateOfStock: skui.getDateOfStock()
        }
    )))
}

function _getSKUitemRFID(db, rfid) {
    return db.loadSKUItem().then(skuitems => skuitems.filter(skui => skui.getRFID() === rfid).map(skui => (
        {
            RFID: skui.getRFID(),
            SKUId: skui.getSKUid(),
            Available: skui.getAvailable(),
            DateOfStock: skui.getDateOfStock()
        }
    )).shift())
}

function _createSKUItem(db, rfid, SKUid, dateOfStock) {
    return db.storeSKUItem(new SKUitem(rfid, SKUid, false, dateOfStock));
}

async function _updateSKUItem(db, rfid, new_rfid, new_available, new_dateofstock) {
    const skuitems = await db.loadSKUItem();
    const skuitem = skuitems.find(skui => skui.getRFID() === rfid);
    skuitem.setAvailable(new_available);
    skuitem.setDateOfStock(new_dateofstock);
    await db.storeSKUItem(skuitem);
    await db.updateSKUItemRFID(rfid, new_rfid);
}

function _deleteSKUItem(db, rfid) {
    return db.deleteSKUItem(new SKUitem(rfid));
}

module.exports = {
    _getAllSKUitems,
    _getAvailableSKUitems,
    _getSKUitemRFID,
    _createSKUItem,
    _updateSKUItem,
    _deleteSKUItem
}