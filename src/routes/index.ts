const testRoute = require('./test');
function setRoutes(app: any): void{
    app.use('/user', testRoute)
}
module.exports = setRoutes;