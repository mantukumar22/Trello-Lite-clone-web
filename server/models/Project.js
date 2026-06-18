const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        members: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }, 
            role: {
                    type: String,
                    enum: ['admin', 'member', 'viewer'],
                    default: 'member'
                }
            }],
        columns: [{
            id: {
                type: String,
            },
            title: {
                type: String,
            }
        }],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);