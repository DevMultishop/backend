import path from 'path';

interface IMailConfig {
  driver: 'ethereal' | 'gmail';
  templatesFolder: string;

  credentials: {
    user: string;
    pass: string;
  };

  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'gmail',
  templatesFolder: path.resolve(__dirname, '..', '..', 'mailTemplates'),

  credentials: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },

  defaults: {
    from: {
      email: process.env.MAIL_USER,
      name: `Team ${process.env.APP_NAME}`,
    },
  },
} as IMailConfig;
