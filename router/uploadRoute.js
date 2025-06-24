import express from "express";
import upload from "../middleware/multer.js";
import authMiddleware from "../middleware/authMiddleware.js";
import File from "../models/file.js";
import * as XLSX from "xlsx";
import fs from "fs";

const router = express.Router();

router.post("/", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    console.log("req.user:", req.user);

    const buffer = fs.readFileSync(req.file.path);
    const workbook = XLSX.read(buffer, { type: "buffer" });

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const data = XLSX.utils.sheet_to_json(worksheet);

   const headerRow = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0] || [];
const columns = headerRow;


    console.log("columns:", columns);
    console.log("data:", data);

    console.log("Excel Data:", data);

    const fileRecord = await File.create({
      filename: req.file.filename,
      originalname: req.file.originalname,
      userId: req.user.userId,
      columns: columns,
      data: data,
    });

    console.log(req.user, "upload route file");

    res.status(200).json({
      message: "file uploaded successfully",
      file: fileRecord,
    });
  } catch (error) {
    console.error("uploaded error:", error);
    res.status(500).json({ error: "uploaded failed" });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const files = await File.find({ userId }).sort({ uploadDate: -1 });

    res.status(200).json({ files });
  } catch (error) {
    console.error("fetch files error:", error);
    res.status(500).json({ error: "failed to fetch files" });
  }
});

export default router;
