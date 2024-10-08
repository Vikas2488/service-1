import { registerAs } from '@nestjs/config';
import * as path from 'path';

function parseLogLevel(level: string | undefined): string[] {
  if (!level) {
    return ['log', 'error', 'warn', 'debug', 'verbose'];
  }

  if (level === 'none') {
    return [];
  }

  return level.split(',');
}

export default registerAs('app', () => ({
  websiteDataParsingBackendBaseUrl:
    process.env.WEBSITE_DATA_PARSING_BACKEND_BASE_URL,
  port: process.env.PORT || 8000,
  baseUrl: process.env.BASE_URL || 'http://localhost:8000',
  loggerLevel: parseLogLevel(
    process.env.APP_LOGGER_LEVEL || 'log,error,warn,debug,verbose',
  ),
  env: process.env.NODE_ENV || 'dev',
  sentryDns: process.env.SENTRY_DNS,
  // eslint-disable-next-line global-require,@typescript-eslint/no-var-requires
  version: require(path.join(process.cwd(), 'package.json')).version,
}));
