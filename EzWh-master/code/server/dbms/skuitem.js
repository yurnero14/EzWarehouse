const SKUItem = require("../models/SKUitem");

function _loadSKUItem(db) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM skuitem";
    db.all(query, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      const skuitems = rows.map(
        (r) => new SKUItem(r.rfid, r.sku, r.available, r.dateofstock, r.restockorder, r.internalorder, r.returnorder, r.item)
      );
      resolve(skuitems);
    });
  });
}

function _storeSKUItem(db, skui) {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM skuitem WHERE rfid=?";
    db.run(sql, [skui.getRFID()], (err) => {
      if (err) {
        reject(err);
        return;
      }

      let sql = "";
      let args = [];
      if (skui.getRFID()) {
        sql =
          "INSERT INTO skuitem (rfid, available, sku, dateofstock, restockorder, internalorder, returnorder, item) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        args = [
          skui.getRFID(),
          skui.getAvailable(),
          skui.getSKUid(),
          skui.getDateOfStock(),
          skui.getRestockOrder(),
          skui.getInternalOrder(),
          skui.getReturnOrder(),
          skui.getItemId()
        ];
      } else {
        sql =
          "INSERT INTO skuitem (available, sku, dateofstock, restockorder, internalorder, returnorder, item) VALUES (?, ?, ?, ?, ?, ?, ?)";
        args = [
          skui.getAvailable(),
          skui.getSKUid(),
          skui.getDateOfStock(),
          skui.getRestockOrder(),
          skui.getInternalOrder(),
          skui.getReturnOrder(),
          skui.getItemId()
        ];
      }

      db.run(sql, args, function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  });
}

function _deleteSKUItem(db, skui) {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM skuitem WHERE rfid=?";
    db.run(sql, [skui.getRFID()], (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

function _updateSKUItemRFID(db, oldRFID, newRFID) {
  return new Promise((resolve, reject) => {
    db.run("UPDATE skuitem SET rfid = ? WHERE rfid = ?", [newRFID, oldRFID], (err) => {
      if (err) {
        reject(err);
        return;
      }

      db.run("UPDATE testresult SET skuitem = ? WHERE skuitem = ?", [newRFID, oldRFID], (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  });
}

module.exports = { _loadSKUItem, _storeSKUItem, _deleteSKUItem, _updateSKUItemRFID };
