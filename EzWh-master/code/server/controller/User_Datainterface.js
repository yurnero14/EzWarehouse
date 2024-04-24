'use strict';

const {User} = require ('../models/UserAndSubclasses');

function getSuppliers(db){
    return db.loadUser().then(users=>users.filter(supp=>supp.getType()==="supplier").map(supp=>(
        {
            id:supp.getID(),
            name: supp.getname(),
            surname: supp.getSurname(),
            email: supp.getusername()

        }
    )))
    
}

function getUsers(db){
    return db.loadUser().then(users=>users.filter(u=>u.getType()!=="manager").map(u=>(
        {
            id:u.getID(),
            name: u.getname(),
            surname: u.getSurname(),
            email: u.getusername(),
            type: u.getType()
        }
    )))
}


function createUser(db, username, name, surname, password, type){
    return db.storeUser(new User(null, name, surname, username, type, password));
}

function updateUserType(db, username, oldType, newType){
    //We do not need oldtype here
    const action = db.loadUser()
        .then(users=>users.filter(u=>u.getusername()===username))
            .then(user_old=>{user_old[0].setType(newType); db.storeUser(user_old[0])})
                .then(()=>db.deleteUser(new User(oldType)));
    return action;
}

async function deleteUser(db, username, type){
    const found = await db.loadUser().then(users=>users.find(u=>u.getusername()===username && u.getType()===type && u.getType()!=="manager"))
    if(found) await db.deleteUser(found);
    return;
}

function loginManager(db, username, password){
    //const user_list = await db.loadUser();
    return db.loadUser().then(users=>users.filter(user=> user.getType()==="manager" && user.getusername()===username && user.getPassword()===password).map(user=>
        ({
            id: user.getID(),
            name: user.getname(),
            surname: user.getSurname(),
            email: user.getusername(),

        })))

}

function loginCustomer(db, username, password){
    return db.loadUser().then(users=>users.filter(user=> user.getType()==="customer" && user.getusername()===username && user.getPassword()===password).map(user=>
        ({
            id: user.getID(),
            name: user.getname(),
            surname: user.getSurname(),
            email: user.getusername(),

        })))

}

function loginSupplier(db, username, password){
    return db.loadUser().then(users=>users.filter(user=> user.getType()==="supplier" && user.getusername()===username && user.getPassword()===password).map(user=>
        ({
            id: user.getID(),
            name: user.getname(),
            surname: user.getSurname(),
            email: user.getusername(),

        })))
   
}

function loginClerk(db, username, password){
    return db.loadUser().then(users=>users.filter(user=> user.getType()==="clerk" && user.getusername()===username && user.getPassword()===password).map(user=>
        ({
            id: user.getID(),
            name: user.getname(),
            surname: user.getSurname(),
            email: user.getusername(),

        })))
   
}

function loginQualityEmployee(db, username, password){
    return db.loadUser().then(users=>users.filter(user=> user.getType()==="qualityEmployee" && user.getusername()===username && user.getPassword()===password).map(user=>
        ({
            id: user.getID(),
            name: user.getname(),
            surname: user.getSurname(),
            email: user.getusername(),

        })))
   
}

function loginDeliveryEmployee(db, username, password){
    return db.loadUser().then(users=>users.filter(user=> user.getType()==="deliveryEmployee" && user.getusername()===username && user.getPassword()===password).map(user=>
        ({
            id: user.getID(),
            name: user.getname(),
            surname: user.getSurname(),
            email: user.getusername(),

        })))
   
}


module.exports = {

    getSuppliers,
    getUsers,
    createUser,
    updateUserType,
    deleteUser,
    loginManager,
    loginCustomer,
    loginSupplier,
    loginClerk,
    loginQualityEmployee,
    loginDeliveryEmployee
}







