'use strict';

const ConsumerQueueService = require('./src/services/consumerQueue.service');

const queueName = 'test-topic';

// ConsumerQueueService.consumerToQueue(queueName).then(() => {
//     console.log("Message consumer started: " + queueName);
// }).catch(err => console.error("Message Queue server error: " + err));

ConsumerQueueService.consumerToQueueNormal().then(() => {
    console.log("Message consumer normal started waiting for messages ...");
}).catch(err => console.error("Message Queue server error: " + err));

ConsumerQueueService.consumerToQueueFailed().then(() => {
    console.log("Message consumer failed started waiting for messages ... ");
}).catch(err => console.error("Message Queue server error: " + err));