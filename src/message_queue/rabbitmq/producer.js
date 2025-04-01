const amqp = require("amqplib");
const message = "hello rabbit mq 6";

const runProducer = async () => {
  try {
    const connection = await amqp.connect(
      "amqps://qemwnffm:NXeq6AfnsUemwc7AaPFHLUEcENpxpmYG@leopard.lmq.cloudamqp.com/qemwnffm"
    );
    const channel = await connection.createChannel();
    const queueName = "test-topic";
    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(message));
    console.log("message send: ", message);
    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (err) {
    console.log("error runProducer: ", err);
  }
};

runProducer().catch(console.error);
