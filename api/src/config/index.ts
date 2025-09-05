import { dbConfig } from './database';
import { s3Config } from './s3';

interface iConfig {
  port: number;
  app_url: string;
  jwt_secret: string;
  fcm_web_api_key: string;
  database;
  gmail_user;
  gmail_app_password;
  /*keys: {
    privateKey: string;
    publicKey: string;
  };*/
  s3: any
}

export default (): Partial<iConfig> => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  app_url: process.env.APP_URL,
  jwt_secret: process.env.JWT_SECRET,
  fcm_web_api_key: process.env.FCM_WEB_API_KEY,
  gmail_user: process.env.GMAIL_USER,
  gmail_app_password: process.env.GMAIL_APP_PASSWORD,
  /*keys: {
    privateKey: process.env.PRIVATE_KEY.replace(/\\n/gm, '\n'),
    publicKey: process.env.PUBLIC_KEY.replace(/\\n/gm, '\n'),
  },*/
  database: dbConfig(),
  s3: s3Config(),
});
