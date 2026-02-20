/* import { FastifyInstance } from "fastify"
import { logger } from "./Pino"
import { slowLogger } from "./Winston"
import { APM } from "../Utils/Apm"

export function registerErrorHandler(app: FastifyInstance) {

 app.setErrorHandler((err, req, reply) => {

 const error = err instanceof Error
  ? err
  : new Error(String(err))

 APM.error(error)

 reply.status(500).send({
  message: "Internal Server Error"
 })
})

}
 */
import { FastifyInstance } from "fastify"
import { logger } from "../Observability/Logger"
import { slowLogger } from "./Winston"
import { APM } from "../Utils/Apm"
export function registerErrorHandler(app: FastifyInstance) {

 app.setErrorHandler((err, req, reply) => {

  const error = err instanceof Error
   ? err
   : new Error(String(err));

  // send to APM
  APM.error(error);

  // log with pino
  logger.error({
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method
  });

  // log slow/critical separately
  slowLogger.error(error);

  reply.status(500).send({
    message: "Internal Server Error"
  });
 });
}
