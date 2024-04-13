import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { HoneycombSDK } from '@honeycombio/opentelemetry-node';

export const trace = () => {
  if (!process.env.TRACE_ENABLED) {
    return;
  }

  const sdk = new HoneycombSDK({
    instrumentations: [
      getNodeAutoInstrumentations({
        // we recommend disabling fs autoinstrumentation since it can be noisy
        // and expensive during startup
        '@opentelemetry/instrumentation-fs': {
          enabled: false,
        },
      }),
    ],
  });

  process.on('SIGTERM', async () => {
    try {
      await sdk.shutdown();
    } catch (err) {
      console.error('Error shutting down SDK', err);
    } finally {
      process.exit(0);
    }
  });

  sdk.start();
};
