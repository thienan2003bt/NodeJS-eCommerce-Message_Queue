'use strict';

const RabbitMQDatabase = require('../dbs/init.rabbitmq')

class ConsumerQueueService {
    static notiQueue = 'notificationQueueProcess';
    static notiExchangeDLX = 'notificationExchangeDLX';
    static notiRoutingKeyDLX = 'notificationRoutingKeyDLX';
    static notiQueueHandler = 'notificationQueueHotFix';

    static async consumerToQueue(queueName) {
        try {
            const { channel, connection } = await RabbitMQDatabase.connectToRabbitMQ();
            await RabbitMQDatabase.consumeQueue(channel, queueName);
        } catch (error) {
            console.error("Error consumer to queue: ", error.message);
        }
    }

    static async consumerToQueueNormal() {
        try {
            const { channel, connection } = await RabbitMQDatabase.connectToRabbitMQ();
            await channel.assertQueue(ConsumerQueueService.notiQueue, {
                exclusive: false,
                durable: true,
                deadLetterExchange: ConsumerQueueService.notiExchangeDLX,
                deadLetterRoutingKey: ConsumerQueueService.notiRoutingKeyDLX
            });


            // TTL Handling
            const ttl = 5000; //5s
            setTimeout(() => {
                channel.consume(ConsumerQueueService.notiQueue, (msg) => {
                    try {
                        // Mock Logic error handling
                        const testNumber = Math.random();
                        console.log("Test number: " + testNumber);
                        if (testNumber < 0.8) {
                            throw new Error('Send notification failed: HOT FIX');
                        }

                        console.log(`SEND notification successfully: ${msg?.content?.toString() ?? ''}`);
                        channel.ack(msg);
                    } catch (error) {
                        console.error("Send normal notification failed: " + error.message);
                        channel.nack(msg, false, false);
                    }
                })
            }, ttl);



        } catch (error) {
            console.error("Error consumer to queue normal: ", error.message);
        }
    }

    static async consumerToQueueFailed() {
        try {
            const { channel, connection } = await RabbitMQDatabase.connectToRabbitMQ();
            await channel.assertExchange(ConsumerQueueService.notiExchangeDLX, 'direct', { durable: true });
            const queueResult = await channel.assertQueue(ConsumerQueueService.notiQueueHandler, { exclusive: false });

            await channel.bindQueue(queueResult.queue, ConsumerQueueService.notiExchangeDLX, ConsumerQueueService.notiRoutingKeyDLX);

            channel.consume(queueResult.queue, (msgFailed) => {
                console.log(`Error notification, please hot fix it: ${msgFailed?.content?.toString() ?? ''}`);
            }, { noAck: true })
        } catch (error) {
            console.error("Error consumer to queue failed: ", error.message);
            throw error;
        }
    }
}

module.exports = ConsumerQueueService;