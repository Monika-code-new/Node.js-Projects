import fp from "fastify-plugin";
import { APM } from "../Utils/Apm";

export default fp(async (fastify) => {

 fastify.addHook("onRequest", async (req) => {
  APM.attr({
   requestId: req.id,
   route:  req.url,
   method: req.method
  });
 });

 fastify.addHook("onResponse", async (req, reply) => {
  APM.attr({
   statusCode: reply.statusCode
  });
 });

});
