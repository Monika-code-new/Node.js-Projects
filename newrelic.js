exports.config = {
  app_name: [process.env.NEW_RELIC_APP_NAME || "destination-property-api-dev"],
  license_key: process.env.NEW_RELIC_LICENSE_KEY,
  distributed_tracing: { enabled: true },
  logging: {
    level: "info",
    filepath: "stdout"
  },
  attributes: {
    include: ['request.parameters.*', 'response.status', 'response.duration'],
  },
  application_logging: {
    enabled: true,
    forwarding: { enabled: true },
    metrics: { enabled: true },
    local_decorating: { enabled: true }
  }
};
