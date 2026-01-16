export const jwtConstants = {
  secret: 'ChiteS',
};

export const basicConstants = {
  userName: process.env.SA_LOGIN || 'admin',
  password: process.env.SA_PASSWORD || 'qwerty',
};
