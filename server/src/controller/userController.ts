import { Request, Response } from 'express';
// JwtPayload might be needed if req.user is used more extensively, but for now, it's not directly used for casting in this file.
// import { JwtPayload } from 'jsonwebtoken';
import { GeneratePassword, GenerateSalt, generateToken, loginSchema, option, registerSchema, updateSchema } from '../utils/utils';
import User from '../model/UserModel';
import bcrypt from 'bcryptjs';




export const Register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { firstName, lastName, email, password, confirm_password, phone } = req.body;
        const validateResult = registerSchema.validate(req.body, option);
        if (validateResult.error) {
            res.status(400).json({
                Error: validateResult.error.details[0].message
            });
            return;
        }

        // TODO: Add check for password === confirm_password before hashing
        if (password !== confirm_password) {
            res.status(400).json({ Error: "Passwords do not match." });
            return;
        }

        const salt = await GenerateSalt();
        const hashedPassword = await GeneratePassword(password, salt);
        const existingUser = await User.findOne({ email }); // Renamed variable for clarity
        if (!existingUser) {
            const newUser = await User.create({ // Capture created user
                firstName,
                lastName,
                email,
                password: hashedPassword,
                confirm_password: hashedPassword, // Storing confirm_password might be redundant
                phone,
                address: "",
                gender: "",
                salt,
                lng: 0,
                lat: 0,
                verified: false,
                role: "user",
                coverImage: ""
            });

            // const userExist = await User.findOne({email}) // Not needed, newUser is the created user
            res.status(201).json({
                message: 'User registered successfully', // Added "successfully"
                user: newUser // Return the created user
            });
            return;
        }

        res.status(400).json({
            message: 'User already exist',
            Error: 'User already exist'
        });

    } catch (err) {
        // console.log(err) // Keep for debugging if necessary, but remove for production
        res.status(500).json({
            message: 'Internal Server Error',
            Error: "/users/signup"
        });
    }
}

export const Login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const validateResult = loginSchema.validate(req.body, option);
        if (validateResult.error) {
            res.status(400).json({
                Error: validateResult.error.details[0].message
            });
            return;
        }
        const user = await User.findOne({ email });
        if (user) {
            const validate = await bcrypt.compare(password, user.password);
            if (validate) {
                const token = await generateToken(`${user._id}`);
                res.cookie('token', token);
                res.status(200).json({
                    message: 'User logged in successfully', // Added "successfully"
                    role: user.role,
                    email: user.email,
                    verified: user.verified,
                    token: token // Optionally return token in body as well
                });
                return;
            }
        }
        res.status(400).json({
            Error: "Wrong Username or password or not a verified user", // Slightly rephrased
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal Server Error',
            Error: "/users/login"
        });
    }
}

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find({});
        res.status(200).json({
            message: "Here Are All Users", // Consistent casing
            users
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal Server Error',
            Error: "/users/get-all-users"
        });
    }
}

export const userGet = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params._id;
        const user = await User.findOne({ _id: id });
        if (user) {
            res.status(200).json({
                message: 'Here Is Your User', // Consistent casing
                user
            });
            return;
        }
        res.status(404).json({ // Changed to 404
            message: "User not found",
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal Server Error',
            Error: "/users/get-all-users/:_id" // Path seems specific, ensure it matches route
        });
    }
}

export const userUpdate = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params._id;
        // const userIdFromToken = (req.user as JwtPayload)?._id; // Assuming auth middleware adds req.user
        // if (!userIdFromToken || userIdFromToken !== id) {
        //    res.status(403).json({ Error: "Forbidden: You can only update your own profile." });
        //    return;
        // }

        const { firstName, lastName, address, gender, phone } = req.body;
        const validateResult = updateSchema.validate(req.body, option);
        if (validateResult.error) {
            res.status(400).json({
                Error: validateResult.error.details[0].message
            });
            return;
        }
        const user = await User.findOne({ _id: id });
        if (!user) {
            res.status(404).json({
                Error: "User not found",
            });
            return;
        }

        const coverImagePath = req.file ? req.file.path : user.coverImage;

        const updatedUser = await User.findOneAndUpdate({ _id: id }, {
            firstName, lastName, address, gender, phone,
            coverImage: coverImagePath
        }, { new: true });

        if (updatedUser) {
            res.status(200).json({
                message: 'User updated successfully', // Added "successfully"
                user: updatedUser // Return updated user
            });
            return;
        }
        res.status(400).json({ // Should ideally not be reached if findOneAndUpdate is successful
            message: "Error occurred during user update",
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal Server Error',
            Error: "/users/updateUser/:_id"
        });
    }
}

export const userDelete = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params._id;
        // Add authorization if needed, e.g., only admin or user themselves can delete
        const user = await User.findByIdAndDelete(id); // Corrected: pass id directly
        if (user) {
            res.status(200).json({
                message: 'User deleted successfully'
            });
            return;
        }
        res.status(404).json({
            message: 'User not found or already deleted'
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal Server Error',
            Error: "/users/deleteUser/:_id"
        });
    }
}