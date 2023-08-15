// const amqp = require("amqplib/callback_api");
// const winstonlog = require("../errors/logger");
// const { log } = require("../modules/logModule");
// require("dotenv").config();
// const User = require("../models/userModel");

// const queue = process.env.QUEUE;

// let channel = null;

// let amqpUrl;

// if (process.env.NODE_ENV === "test") {
//   amqpUrl = process.env.AMQPURLTEST;
// } else if (process.env.NODE_ENV === "production") {
//   amqpUrl = process.env.AMQPURLPRODUCTION;
// }

// try {
//   amqp.connect(amqpUrl + "?heartbeat=60", (err, conn) => {
//     if (err) winstonlog.error("amqpt connect error: " + err);
//     conn.createChannel(async (e, ch) => {
//       if (err) winstonlog.error("amqpt create channel error: " + e);

//       ch.assertQueue(queue, { durable: true });

//       ch.consume(
//         queue,
//         async (msg) => {
//           let object;
//           try {
//             object = JSON.parse(msg.content.toString());
//           } catch (error) {
//             winstonlog.error("amqpt consume error: " + error);
//             object = msg.content.toString();
//           }

//           log("consume content: ", msg.content.toString());

//           if (
//             object.service.includes("all") ||
//             object.service.includes("post")
//           ) {
//             if (object.crud === "create") {
//               try {
//                 const createUserId = await User.create({
//                   user_id: object.playload._id,
//                 });
//                 if (!createUserId) {
//                   winstonlog.error(
//                     `user_id not created in ${process.env.CURRENTSERVICE} service`,
//                   );
//                 } else {
//                   ch.ack(msg);
//                 }
//               } catch (error) {
//                 winstonlog.error("amqpt mongodb error: " + error);
//               }
//             } else if (object.crud === "delete") {
//               try {
//                 const deleteUser = await User.deleteOne({
//                   user_id: object.payload._id,
//                 }).exec();

//                 if (!deleteUser) {
//                   winstonlog.error(
//                     `user_id not deleted in ${process.env.CURRENTSERVICE} service`,
//                   );
//                 } else {
//                   ch.ack(msg);
//                 }
//               } catch (error) {
//                 winstonlog.error("amqpt mongodb error: " + error);
//               }
//             }
//           } else {
//             ch.ack(msg);
//           }
//         },
//         { noAck: false },
//       );

//       channel = ch;
//     });
//   });
// } catch (error) {
//   winstonlog.error("amqpt error: " + error);
// }

// const pushToMessageQ = (msg) => {
//   if (!channel) {
//     setTimeout(() => {
//       pushToMessageQ(msg);
//     }, 999);
//   }
//   try {
//     channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
//     log("push to queue: " + queue);
//   } catch (error) {
//     winstonlog.error("amqpt error: " + error);
//   }

//   return { m: "done" };
// };

// module.exports = {
//   pushToMessageQ,
// };
