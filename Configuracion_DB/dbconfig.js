const config = {
    user : 'grupo3',
    password: 'coffeeDB*',
    server: 'serv-coffee.database.windows.net',
    database: 'coffee_db',
    options:{
        trustedconnection: false,
        enableArithAbort: true,
        encrypt:true
    }
}

module.exports = config;