import { Injectable } from '@nestjs/common';
import client from 'prom-client';

@Injectable()
export class MetricsService {
  registry: client.Registry;
  requestsCounter: client.Counter<string>;
  errorsCounter: client.Counter<string>;
  requestHistogram: client.Histogram<string>;

  constructor() {
    this.registry = new client.Registry();
    client.collectDefaultMetrics({ register: this.registry }); // process metrics

    this.requestsCounter = new client.Counter({
      name: 'api_requests_total',
      help: 'Total number of requests received',
      labelNames: ['method', 'route', 'status_code'],
      registers: [this.registry],
    });

    this.errorsCounter = new client.Counter({
      name: 'api_errors_total',
      help: 'Total number of error responses',
      labelNames: ['method', 'route', 'exception'],
      registers: [this.registry],
    });

    this.requestHistogram = new client.Histogram({
      name: 'api_request_duration_seconds',
      help: 'Request duration histogram',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
      registers: [this.registry],
    });
  }

  metrics() {
    return this.registry.metrics();
  }
}
