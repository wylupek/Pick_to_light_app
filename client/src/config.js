const config = {
    server: {
        ip: '192.168.1.100',
        port: 80
    },
    constants: {
        SECTOR_LENGTH: 48,
    }
};
config.server.url = `http://${config.server.ip}:${config.server.port}`;

module.exports = config;
