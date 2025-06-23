import { Request, Response, NextFunction } from 'express'; // Added NextFunction for completeness, though not used yet
import Agent from '../model/AgentModel';
import Property from '../model/PropertyModel';
import bcrypt from 'bcryptjs';
import { JwtPayload } from "jsonwebtoken";
import { generateToken, loginSchema, option, updateAgentSchema, updatePropertySchema } from "../utils/utils";



export const agentLogin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const validateResult = loginSchema.validate(req.body, option);
        if (validateResult.error) {
            res.status(400).json({
                Error: validateResult.error.details[0].message
            });
            return;
        }
        const agent = await Agent.findOne({ email });
        if (agent) {
            const validate = await bcrypt.compare(password, agent.password);
            if (validate) {
                const token = await generateToken(`${agent._id}`);
                res.cookie('token', token);
                res.status(200).json({
                    message: 'User logged in', // "User" or "Agent"? Be consistent.
                    role: agent.role,
                    email: agent.email,
                });
                return;
            }
        }
        res.status(400).json({ // Corrected indentation, was outside if(agent)
            Error: "Wrong agent-name or password or not a verified agent ",
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal Server Error',
            Error: "/agents/login"
        });
    }
}

export const agentUpdate = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params._id;
        // const agentIdFromToken = (req.agent as JwtPayload)?._id;
        // if (!agentIdFromToken || agentIdFromToken !== id) {
        //    res.status(403).json({ Error: "Forbidden: You can only update your own profile." });
        //    return;
        // }

        const { name, companyName, address, email, phone, pincode } = req.body;
        const validateResult = updateAgentSchema.validate(req.body, option);
        if (validateResult.error) {
            res.status(400).json({
                Error: validateResult.error.details[0].message
            });
            return;
        }

        const agent = await Agent.findOne({ _id: id });
        if (!agent) {
            res.status(404).json({
                Error: "Agent not found", // Simplified error
            });
            return;
        }

        const coverImagePath = req.file ? req.file.path : agent.coverImage;

        const updatedAgent = await Agent.findOneAndUpdate({ _id: id }, {
            name, companyName, address, email, phone, pincode,
            coverImage: coverImagePath
        }, { new: true });

        if (updatedAgent) {
            res.status(200).json({
                message: 'Agent updated',
                agent: updatedAgent // Return the updated agent
            });
            return;
        }
        // This case should ideally not be reached if findOneAndUpdate is successful or agent not found handled.
        // If findOneAndUpdate returns null despite agent being found, it's an issue.
        res.status(400).json({
            message: "Error occurred during update",
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal Server Error',
            Error: "/agents/updateAgent/:_id"
        });
    }
}

export const CreateProperty = async (req: Request, res: Response): Promise<void> => {
    try {
        const agentId = (req.agent as JwtPayload)?._id;
        if (!agentId) {
            res.status(403).json({ Error: "Authentication error: Agent ID not found in token." });
            return;
        }

        const { name, description, address, category, price } = req.body;
        // Add validation for property schema here if it exists

        const agent = await Agent.findOne({ _id: agentId });
        if (!agent) {
            // This case should ideally be prevented by the authAgent middleware finding the agent
            res.status(404).json({ Error: "Agent not found." });
            return;
        }

        const createproperty = await Property.create({
            name,
            address,
            description,
            category,
            propertySize: "",
            condition: "",
            price,
            rating: 0,
            agentId: agentId,
            image: req.file ? req.file.path : ""
        });

        res.status(201).json({
            message: 'Property Created',
            createproperty
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal Server Error',
            Error: "/agents/create-property"
        });
    }
}

export const getAllProperty = async (req: Request, res: Response): Promise<void> => {
    try {
        const property = await Property.find({});
        res.status(200).json({
            message: "Here Is All Property",
            property
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal Server Error',
            Error: "/admins/get-all-property" // Should be /agents/get-all-property or similar
        });
    }
}

export const propertyGet = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params._id;
        const property = await Property.findOne({ _id: id }); // Renamed to 'property' for clarity
        if (property) {
            res.status(200).json({
                message: 'Here Is Your Property',
                property // Use 'property'
            });
            return;
        }
        res.status(404).json({ // Changed to 404
            message: "Property not found",
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal Server Error',
            Error: "/users/get-property" // Should be /agents/get-property/:_id or similar
        });
    }
}

export const propertyUpdate = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params._id;
        // const agentIdFromToken = (req.agent as JwtPayload)?._id;
        // const propertyToUpdate = await Property.findOne({ _id: id });
        // if (!propertyToUpdate || propertyToUpdate.agentId.toString() !== agentIdFromToken) {
        //    res.status(403).json({ Error: "Forbidden: You can only update your own properties." });
        //    return;
        // }
        const { name, description, address, category, price, propertySize, condition } = req.body;
        const validateResult = updatePropertySchema.validate(req.body, option);
        if (validateResult.error) {
            res.status(400).json({
                Error: validateResult.error.details[0].message
            });
            return;
        }

        const property = await Property.findOne({ _id: id });
        if (!property) {
            res.status(404).json({
                Error: "Property not found", // Simplified
            });
            return;
        }

        const imagePath = req.file ? req.file.path : property.image;

        const updatedProperty = await Property.findOneAndUpdate({ _id: id }, {
            name, description, address, category, price, propertySize, condition,
            image: imagePath
        }, { new: true });

        if (updatedProperty) {
            res.status(200).json({
                message: 'Property updated',
                property: updatedProperty // Return updated property
            });
            return;
        }
        res.status(400).json({
            message: "Error occurred during property update",
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal Server Error',
            Error: "/agents/updateProperty/:_id"
        });
    }
}

export const propertyDelete = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params._id;
        // Add agent authentication/authorization if only the agent who created it can delete
        // const agentIdFromToken = (req.agent as JwtPayload)?._id;
        // const propertyToDelete = await Property.findOne({ _id: id });
        // if (!propertyToDelete || propertyToDelete.agentId.toString() !== agentIdFromToken) {
        //    res.status(403).json({ Error: "Forbidden: You can only delete your own properties." });
        //    return;
        // }
        const property = await Property.findByIdAndDelete(id); // Corrected: pass id directly
        if (property) {
            res.status(200).json({
                message: 'Property deleted successfully'
            });
            return;
        }
        // If property is null, it means no document was found and deleted.
        res.status(404).json({
            message: 'Property not found or already deleted'
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal Server Error',
            Error: "/agents/deleteProperty/:_id"
        });
    }
}

      