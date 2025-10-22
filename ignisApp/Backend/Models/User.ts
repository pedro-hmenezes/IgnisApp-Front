import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: {
        type: String,
        enum: ['operador', 'major', 'administrador'],
        default: 'operador'
    },
    passwordHash: { type: String, required: true }
}, { timestamps: true });

export const UserModel = mongoose.model('User', UserSchema);