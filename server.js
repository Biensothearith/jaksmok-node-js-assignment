const http = require('http');
const app = require('./app');
// ---------- generate auto ip server
const { networkInterfaces } = require('os');
const nets = networkInterfaces();
const ips = Object.create(null); // Or just '{}', an empty object
for (const name of Object.keys(nets)) {
  for (const net of nets[name]) {
       const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
      if (net.family === familyV4Value && !net.internal) {
          if (!ips[name]) {
              ips[name] = [];
          }
          ips[name].push(net.address);
      }
  }
}

const port = 3010;
const hostname=ips['en0'];
const server = http.createServer(app);
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
