const amqp = require("amqplib");
const message = "hello rabbit mq";

const runConsumer = async () => {
  try {
    const connection = await amqp.connect(
      "amqps://qemwnffm:NXeq6AfnsUemwc7AaPFHLUEcENpxpmYG@leopard.lmq.cloudamqp.com/qemwnffm"
    );
    const queueName = "notiQueue";
    const channel = await connection.createChannel();
    const queueRes = await channel.assertQueue(queueName, {
      exclusive: false,
      deadLetterExchange: "notiDlxExchange",
      deadLetterRoutingKey: "notiRoutingKeyDlx",
    });
    channel.consume(
      queueRes.queue,
      (mess) => {
        console.log("message reciever: ", mess.content.toString());
      },
      {
        noAck: true,
      }
    );
  } catch (err) {
    console.log("error runConsumer: ", err);
  }
};

runConsumer().catch(console.error);
