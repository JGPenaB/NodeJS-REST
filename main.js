const app = require("./driver");
const config = require("./config/server");

var server = app.listen(config.port, config.host, () => {
    console.log(`Listening at http://${server.address().address}:${config.port}`);
});

