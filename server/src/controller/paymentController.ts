import { Request, Response } from 'express';
import Stripe from 'stripe';
import Property from '../model/PropertyModel';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  apiVersion: '2022-11-15' as any,
});

export const createPaymentIntent = async (req: Request, res: Response): Promise<void> => {
    try {
        const { propertyId } = req.params;
        const property = await Property.findById(propertyId);

        if (!property) {
            res.status(404).json({ Error: "Property not found" });
            return;
        }

        // In a real app, we would use Stripe's checkout session or payment intents.
        // For this task, we'll implement a mock session creation.

        const session = {
            id: `mock_session_${Date.now()}`,
            url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/payment-success?session_id=mock_${Date.now()}`
        };

        res.status(200).json({
            message: "Payment session created",
            session
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal Server Error',
            Error: "/users/checkout/:propertyId"
        });
    }
}
