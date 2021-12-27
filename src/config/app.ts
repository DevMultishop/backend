interface IApplicationConfig {
  port: number;
  name: string;
  backend: {
    host: string;
  };
  frontend: {
    host: string;
  };
}

export default {
  port: Number(process.env.PORT),

  name: process.env.APP_NAME,

  backend: {
    host: process.env.APP_API_URL,
  },

  frontend: {
    host: process.env.APP_CLIENT_URL,
  },
} as IApplicationConfig;
