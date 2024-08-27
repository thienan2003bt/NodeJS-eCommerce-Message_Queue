'use strict';

const RabbitMQDatabase = require('../dbs/init.rabbitmq')

class ConsumerQueueService {
    static async consumerToQueue(queueName) {
        try {
            const { channel, connection } = await RabbitMQDatabase.connectToRabbitMQ();
            await RabbitMQDatabase.consumeQueue(channel, queueName);
        } catch (error) {
            console.error("Error consumer to queue: ", error.message);
        }
    }
}

module.exports = ConsumerQueueService;