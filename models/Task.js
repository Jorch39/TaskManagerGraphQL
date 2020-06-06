const mongoose = require('mongoose');

const TaskSchema = mongoose.Schema({
    name: {
        type: String, 
        required: true, 
        trim: true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }, 
    project: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Project'
    },
    state: {
        type: Boolean, 
        default: false 
    },
    created_at: {
        type: Date, 
        default: Date.now()
    }
})

module.exports = mongoose.model('Task', TaskSchema)