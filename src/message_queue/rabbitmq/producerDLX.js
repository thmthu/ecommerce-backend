const ampq = require("amqplib");
const message = "new product";

const runProducer = async (notiInfor) => {
  try {
    const connection = await ampq.connect(
      "amqps://qemwnffm:NXeq6AfnsUemwc7AaPFHLUEcENpxpmYG@leopard.lmq.cloudamqp.com/qemwnffm"
    );
    const channel = await connection.createChannel();

    const notiExchange = "notiExchange";
    const notiQueue = "notiQueue";
    const notiDlxExchange = "notiDlxExchange";
    const notiRoutingKeyDlx = "notiRoutingKeyDlx";

    await channel.assertExchange(notiExchange, "direct", { durable: true });

    const queueRes = await channel.assertQueue(notiQueue, {
      exclusive: false,
      deadLetterExchange: notiDlxExchange,
      deadLetterRoutingKey: notiRoutingKeyDlx,
    });

    await channel.bindQueue(queueRes.queue, notiExchange);

    const msg = "a new product";
    console.log("ok 1");
    await channel.sendToQueue(queueRes.queue, Buffer.from(notiInfor), {
      expiration: 1000,
    });
    console.log("ok 2");

    setTimeout(() => {
      connection.close();
      process.exit(0);
    });
  } catch (err) {
    console.log(err);
  }
};

runProducer();
