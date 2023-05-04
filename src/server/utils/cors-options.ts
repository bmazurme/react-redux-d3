/* eslint-disable @typescript-eslint/no-explicit-any */
import cors from 'cors';

import { METHODS, ALLOWED_HEADERS, WHITE_LIST } from './const-cors';

const checkWhiteList: any = (origin: string, callback: any) => {
  if (WHITE_LIST.indexOf(origin) !== -1 || !origin) {
    callback(null, true);
  } else {
    callback(new Error('Not allowed by CORS'));
  }
};

const corsOptions: cors.CorsOptions = {
  credentials: true,
  origin: checkWhiteList,
  methods: METHODS,
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ALLOWED_HEADERS,
};

export default corsOptions;
