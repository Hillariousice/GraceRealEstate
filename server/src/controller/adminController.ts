import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken'; // Import JwtPayload
import { GeneratePassword, GenerateSalt, adminSchema, option, agentSchema } from '../utils/utils';
import User from '../model/UserModel';
import Agent from '../model/AgentModel';


export const CreateSuperadmin = async (req: Request, res: Response): Promise<void> => { // Changed to Promise<void>
    try {
        const { firstName, lastName, email, password, phone } = req.body;
        const validateResult = adminSchema.validate(req.body, option);
        if (validateResult.error) {
            res.status(400).json({
                Error: validateResult.error.details[0].message
            });
            return;
        }
        const salt = await GenerateSalt();
        const superadminPassword = await GeneratePassword(password, salt);
        const superadmin = await User.findOne({ email });
        if (!superadmin) {
            await User.create({
                firstName,
                lastName,
                email,
                password: superadminPassword,
                confirm_password: superadminPassword,
                phone,
                address: "",
                gender: "",
                salt,
                lng: 0,
                lat: 0,
                verified: true,
                role: "superadmin",
                coverImage: ""
            });

            const superAdminExist = await User.findOne({ email });
            res.status(201).json({
                message: 'User registered',
                superAdminExist
            });
            return;
        }

        res.status(400).json({
            message: 'Superadmin already exist',
            Error: 'Superadmin already exist'
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal Server Error',
            Error: "/admins/create-superadmin"
        });
    }
}

export const CreateAdmin = async (req: Request, res: Response): Promise<void> => { // Changed to Promise<void>
    try {
        const userId = (req.user as JwtPayload)?._id;
        if (!userId) {
            res.status(403).json({ Error: "Authentication error: User ID not found in token." });
            return;
        }

        const { firstName, lastName, email, password, phone } = req.body;
        const validateResult = adminSchema.validate(req.body, option);
        if (validateResult.error) {
            res.status(400).json({
                Error: validateResult.error.details[0].message
            });
            return;
        }
        const salt = await GenerateSalt();
        const adminPassword = await GeneratePassword(password, salt); // Renamed variable
        const requestingUser = await User.findOne({ _id: userId }); // Use userId here

        if (requestingUser?.email === email) { // Check against new admin's email, not current user's
             res.status(400).json({ // This logic might be flawed, check if new email exists elsewhere
                message: "Email already exists for another user.", // Clarified message
            });
            return;
        }
        // Add check if email already exists for any user
        const existingEmailUser = await User.findOne({ email: email });
        if (existingEmailUser) {
            res.status(400).json({ message: "This email is already registered." });
            return;
        }


        if (requestingUser?.phone === phone) { // Check against new admin's phone
             res.status(400).json({
                message: "Phone number already exists for another user.", // Clarified message
            });
            return;
        }
         // Add check if phone already exists for any user
        const existingPhoneUser = await User.findOne({ phone: phone });
        if (existingPhoneUser) {
            res.status(400).json({ message: "This phone number is already registered." });
            return;
        }


        if (requestingUser?.role === "superadmin") {
            const newAdmin = await User.create({ // Capture created user
                firstName,
                lastName,
                email,
                password: adminPassword,
                confirm_password: adminPassword,
                phone,
                address: "",
                gender: "",
                salt,
                lng: 0,
                lat: 0,
                verified: true,
                role: "admin",
                coverImage: ""
            });

            res.status(201).json({
                message: "Admin created successfully",
                admin: newAdmin // Return the created admin
            });
            return;
        }
        res.status(403).json({ // Changed to 403, and clarified message
            message: "Unauthorized: Only superadmin can create admins.",
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal Server Error',
            Error: "/admins/create-admin"
        });
    }
}
export const CreateAgent = async (req: Request, res: Response): Promise<void> => { // Changed to Promise<void>
    try {
        const adminId = (req.user as JwtPayload)?._id; // Assuming the user creating agent is an admin/superadmin
        if (!adminId) {
            res.status(403).json({ Error: "Authentication error: Admin ID not found in token." });
            return;
        }

        const { name, companyName, email, password, phone } = req.body;
        const validateResult = agentSchema.validate(req.body, option);
        if (validateResult.error) {
            res.status(400).json({
                Error: validateResult.error.details[0].message
            });
            return;
        }

        const salt = await GenerateSalt();
        const agentPassword = await GeneratePassword(password, salt);
        
        const existingAgent = await Agent.findOne({ email }); // Check if agent email exists
        if (existingAgent) {
            res.status(400).json({ message: "Agent with this email already exists." });
            return;
        }

        const adminUser = await User.findOne({ _id: adminId });

        if (adminUser?.role === "admin" || adminUser?.role === "superadmin") {
            const createAgent = await Agent.create({
                name,
                companyName,
                pincode: "",
                phone,
                address: "",
                email,
                password: agentPassword,
                salt,
                serviceAvailable: false,
                rating: 0,
                role: "agent",
                coverImage: ""
            });

            res.status(201).json({
                message: "Agent created successfully",
                createAgent,
            });
            return;
        }

        res.status(403).json({
            message: "Unauthorized: Only admin or superadmin can create agents.",
        });

    } catch (err) {
        res.status(500).json({
            message: 'Internal Server Error',
            Error: "/admins/create-agent"
        });
    }
}
export const getAllAgents = async (req: Request, res: Response): Promise<void> => { // Changed to Promise<void>
    try {
        const agents = await Agent.find({});
        res.status(200).json({
          message:"Here Is All Agents",
          agents
      })
    } catch (err) {
        res.status(500).json({
            message: 'Internal Server Error',
            Error: "/admins/get-all-agents"
        });
    }
}

export const agentGet = async (req: Request, res: Response): Promise<void> => { // Changed to Promise<void>
    try {
        const id = req.params._id;
        const agent = await Agent.findOne({ _id: id });
        if (agent) {
            res.status(200).json({
                message: 'Here Is Your User',
                agent
            });
            return;
        }
        res.status(404).json({ // Changed to 404
            message: "Agent not found",
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal Server Error',
            Error: "/users/get-agent" // Should be /admins/get-agent/:_id or similar
        });
    }
}
export const agentDelete = async (req: Request, res: Response): Promise<void> => { // Changed to Promise<void>
    try {
        const id = req.params._id;
        const agent = await Agent.findByIdAndDelete(id); // Corrected: pass id directly
        if (agent) {
            res.status(200).json({
                message: 'Agent deleted successfully'
            });
            return;
        }
        // If agent is null, it means no document was found and deleted.
        res.status(404).json({
            message: 'Agent not found or already deleted'
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal Server Error',
            Error: "/admins/deleteAgent/:_id"
        });
    }
}
