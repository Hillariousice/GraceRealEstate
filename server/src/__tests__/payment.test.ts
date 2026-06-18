import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { createPaymentIntent } from '../controller/paymentController';
import Property from '../model/PropertyModel';
import { auth } from '../middleware/auth';

// Mock the auth middleware
jest.mock('../middleware/auth', () => ({
  auth: (req: any, res: any, next: any) => {
    req.user = { _id: 'mock_user_id' };
    next();
  },
}));

// Mock Property model
jest.mock('../model/PropertyModel');

const app = express();
app.use(express.json());
app.post('/users/checkout/:propertyId', auth, createPaymentIntent);

describe('Payment Flow', () => {
  it('should create a payment session for a valid property', async () => {
    (Property.findById as jest.Mock).mockResolvedValue({
      _id: 'mock_property_id',
      name: 'Mock Property',
      price: 1000,
    });

    const response = await request(app)
      .post('/users/checkout/mock_property_id')
      .send();

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Payment session created');
    expect(response.body.session).toHaveProperty('id');
    expect(response.body.session).toHaveProperty('url');
  });

  it('should return 404 if property is not found', async () => {
    (Property.findById as jest.Mock).mockResolvedValue(null);

    const response = await request(app)
      .post('/users/checkout/invalid_id')
      .send();

    expect(response.status).toBe(404);
    expect(response.body.Error).toBe('Property not found');
  });
});
