const mongoose = require('mongoose');

const ProjectSchema = mongoose.Schema({
    name: {
        type: String, 
        required: true, 
        trim: true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }, 
    created_at: {
        type: Date, 
        default: Date.now()
    }
})

module.exports = mongoose.model('Project', ProjectSchema)