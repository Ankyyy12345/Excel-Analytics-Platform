import express from 'express';
import fs from 'fs';
import path from 'path';
import User from '../models/signup.js';
import File from '../models/file.js';


const router = express.Router();

router.delete('/delete-file/:filename', async(req, res)=>{
            const filename = req.params.filename;
        const filePath = path.join("uploads",filename);

try{
    if(fs.existsSync(filePath)){
        fs.unlinkSync(filePath)
    }

    await File.findOneAndDelete({filename})
    res.status(200).json({message: "File deleted successfully"});
} catch(error){
    console.error("Error deleting file:", error);
    res.status(500).json({message: "Failed to delete file"});
}

});

export default router;