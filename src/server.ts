import { app } from './app';
import { env } from './env';

app.listen({ port: env.PORT, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }

  if (env.NODE_ENV === 'dev') {
    app.log.info(`Docs disponiveis em ${address}/docs`);
  }
});
