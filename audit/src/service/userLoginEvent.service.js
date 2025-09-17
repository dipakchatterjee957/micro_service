import amqp from "amqplib";
import UserLoginEvent from "../model/userLoginEvent.model.js";

async function startUserLoginConsumer() {
  const rabbitUrl = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';
  const queue = 'user_login_event';

  try {
    const connection = await amqp.connect(rabbitUrl);
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: true });

    console.log(` [*] Waiting for messages in ${queue}. To exit press CTRL+C`);

    channel.consume(
      queue,
      async (msg) => {
        if (msg !== null) {
          try {
            const data = JSON.parse(msg.content.toString());
            const { userId, loginId } = data;

            // Update if exists, else create
            await UserLoginEvent.findOneAndUpdate(
              { user_master_id: userId, login_id: loginId },
              {
                $inc: { login_count: 1 },
                $set: { last_login_time: new Date() },
              },
              { upsert: true, new: true }
            );

            channel.ack(msg);
            console.log(` [x] Processed login for user_master_id=${userId}`);
          } catch (err) {
            console.error('Message processing error:', err);
            channel.nack(msg, false, false); // discard if invalid
          }
        }
      },
      { noAck: false }
    );
  } catch (error) {
    console.error('RabbitMQ connection error:', error);
    setTimeout(startUserLoginConsumer, 5000); // retry after delay
  }
}

export default { startUserLoginConsumer };
