import 'dotenv/config';
import app from './app.js';
import { sequelize } from './models/index.js';
import config from './config/index.js';

const { HTTP } = config;

try {
  await sequelize.authenticate();
  
  if (process.env.APP_ENV != 'production') {
    await sequelize.sync();
  }

  console.log('Database connected');

  app.listen(HTTP.port, () => {
    console.log(`Server running on port ${HTTP.port}`);
  });

} catch (err) {
  console.error('Startup failed:', err);
  process.exit(1);
}
