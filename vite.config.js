import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const attendanceApi = () => {
  let attendanceLog = [];
  return {
    name: 'attendance-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/api/attendance' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              attendanceLog.push({ ...data, id: Date.now() });
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true }));
            } catch (e) {
              res.statusCode = 400;
              res.end("Bad Request");
            }
          });
        } else if (req.url === '/api/attendance' && req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(attendanceLog));
        } else {
          next();
        }
      });
    }
  };
};

export default defineConfig({
  plugins: [react(), attendanceApi()],
  server: {
    host: true,
    proxy: {
      '/api_dev': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  }
});
