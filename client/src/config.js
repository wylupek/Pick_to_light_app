const config = {
    server: {
        ip: '192.168.1.100',
        port: 443
    }
};
config.server.url = `https://${config.server.ip}:${config.server.port}`;

module.exports = config;
