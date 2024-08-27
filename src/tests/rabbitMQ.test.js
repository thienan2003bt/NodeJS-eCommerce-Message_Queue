'use strict';

const RabbitMQDatabase = require('../dbs/init.rabbitmq');

describe('RabbitMQ Connection Test', () => {
    it('should connect to RabbitMQ successfully', async () => {
        const result = await RabbitMQDatabase.connectToRabbitForTest();
        expect(result).toBeUndefined();
    })

})



class RabbitMQTest {
    static async testConnection() {
    }
}