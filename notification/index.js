import express from 'express';
import dotenv from 'dotenv';
import amqp from "amqplib";
import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();


const app = express();
const PORT = process.env.PORT;

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // or 'smtp.yourprovider.com'
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send email
async function sendInvoiceEmail(invoice) {
  // Render the EJS template to HTML
 const templatePath = fileURLToPath(new URL('./views/invoiceEmail.ejs', import.meta.url));
  const html = await ejs.renderFile(templatePath, { invoice });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: invoice.customer_email, // could be invoice.created_by email if available
    subject: `New Invoice Created: ${invoice.invoice_number}`,
    // text: `Invoice Details:\nAmount: ${invoice.amount}\nDetails: ${invoice.details}`,
    html
  };

  await transporter.sendMail(mailOptions);
  console.log('Email sent for invoice', invoice.invoice_number);
}

async function startConsumer() {
  const rabbitUrl = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';
  const queue = 'invoice_created_queue';

  try{
    const connection = await amqp.connect(rabbitUrl);
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: true });
    console.log(` [*] Waiting for messages in ${queue}. To exit press CTRL+C`);

    channel.consume(queue,
      async (msg) => {
        if (msg !== null) {
          try {
            const invoice = JSON.parse(msg.content.toString());
            await sendInvoiceEmail(invoice);
            channel.ack(msg);
            console.log(` [x] Processed invoice ${invoice._id}`);
          } catch (err) {
            console.error('Message processing error:', err);
            channel.nack(msg, false, false); // discard if invalid
          }
        }
      },
      { noAck: false }
    );
  }catch(error){
    console.error('RabbitMQ connection error:', error);
    setTimeout(startConsumer, 5000); // retry after delay
  }

}

// Start everything
startConsumer().catch(console.error);

app.get('/', (req, res) => {
  res.send('Notification Service is running');
});

app.listen(PORT, () => {
    console.log(`Notification Service is running on port ${PORT}`);
});