'use strict';

const amqp = require('amqplib');

class RabbitMQDatabase {
    static async connectToRabbitMQ() {
        try {
            const connection = await amqp.connect('amqp://guest:12345@localhost')
            if (!connection) throw new Error;

            const channel = await connection.createChannel();

            return { channel, connection };
        } catch (error) {
            console.error("Error connecting to RabbitMQ: " + error.message);
        }
    }

    static async connectToRabbitForTest() {
        try {
            const { channel, connection } = await RabbitMQDatabase.connectToRabbitMQ();

            const queueName = 'test-queue';
            const message = 'Hello, shopDEV by Thien An following TipsJS!';

            await channel.assertQueue(queueName, { durable: false, });
            await channel.sendToQueue(queueName, Buffer.from(message));

            await connection.close();
        } catch (error) {
            console.error("Error testing connection to RabbitMQ: " + error.message);

        }
    }

    static async consumeQueue(channel, queueName) {
        try {
            await channel.assertQueue(queueName, { durable: true });
            console.log("Waiting for incoming messages ...");

            channel.consume(queueName, (message) => {
                console.log(`Received messages from ${queueName}: ${message.content.toString()}`);
            }, { noAck: true })
        } catch (error) {
            console.error("Error consuming queue of RabbitMQ: " + error.message);
        }
    }
}


module.exports = RabbitMQDatabase;