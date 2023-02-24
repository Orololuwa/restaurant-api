require('dotenv').config();

function getEnv(variable: string, optional: boolean = false) {
  if (process.env[variable] === undefined) {
    if (optional) {
      console.warn(
        `[@env]: Environmental variable for ${variable} is not supplied. \n So a default value will be generated for you.`,
      );
    } else {
      throw new Error(
        `You must create an environment variable for ${variable}`,
      );
    }
  }

  return process.env[variable]?.replace(/\\n/gm, '\n');
}

export const JWT_CONSTANT = {
  secret: getEnv('JWT_CONSTANT'),
  expiration: 1800,
};

export const COOKIE_SESSION = {
  secret: getEnv('COOKIE_SESSION_KEY'),
};

export const PORT = getEnv('PORT');
