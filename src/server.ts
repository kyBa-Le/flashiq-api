const port = process.env.PORT || 3000;
const appInstance = require('./app');
appInstance.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})