import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    filename: {type: String, required: true},
    originalname: {type: String, required: true},
    uploadDate: {type: Date, default: Date.now},
    columns: [String],
    data: [mongoose.Schema.Types.Mixed]
});

const File =  mongoose.model('File', fileSchema);
export default File