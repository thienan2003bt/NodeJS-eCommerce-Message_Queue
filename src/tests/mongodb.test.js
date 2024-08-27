'use strict';
const mongoose = require('mongoose');

const connectString = 'mongodb://localhost:27017/shopDEV';

// Declare the Schema of the Mongo model
const testSchema = new mongoose.Schema({
    name: {
        type: String,
    },
});

const TestModel = mongoose.model('Test', testSchema);

describe('Mongoose Connection Test', () => {
    let connection;
    beforeAll(async () => {
        connection = await mongoose.connect(connectString);
    })

    afterAll(async () => {
        await connection.disconnect();
    })

    it('should connect to MongoDB by mongoose', () => {
        expect(mongoose.connection.readyState).toBe(1);
    })

    it('should save a document to the database', async () => {
        const user = new TestModel({ name: 'Thien An' });
        await user.save();
        expect(user.isNew).toBe(false);
    })

    it('should find a document from the database', async () => {
        const user = await TestModel.findOne({ name: 'Thien An' });
        expect(user).toBeDefined();
    })
})