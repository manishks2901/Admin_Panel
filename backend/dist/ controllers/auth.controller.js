"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.logout = exports.login = exports.signup = void 0;
const utils_1 = require("../lib/utils");
const db_1 = __importDefault(require("../lib/db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const cloudinary_1 = __importDefault(require("../lib/cloudinary"));
const streamifier_1 = __importDefault(require("streamifier"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Promise<express.Response<any, Record<string, any>> | undefined>
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All the fields are required"
            });
        }
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }
        const user = yield db_1.default.user.findFirst({
            where: {
                email
            }
        });
        if (user)
            return res.status(400).json({
                message: "Email already exist"
            });
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const newUser = yield db_1.default.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                profilePic: ""
            }
        });
        if (newUser) {
            (0, utils_1.generateToken)(newUser.id, res);
            res.status(201).json({
                _id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                profilePic: newUser.profilePic
            });
        }
        else {
            res.status(400).json({
                message: "Invalid user data"
            });
        }
    }
    catch (error) {
        console.log("Error in signup controller :", error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield db_1.default.user.findFirst({
            where: {
                email
            }
        });
        if (!user)
            return res.status(400).json({ message: "Invalid Credentials" });
        const isPasswordCorrect = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordCorrect)
            return res.status(400).json({ message: "Invalid Credentails" });
        yield (0, utils_1.generateToken)(user.id, res);
        res.status(200).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            profilePic: user.profilePic
        });
    }
    catch (error) {
        console.log("Error in login Credentials", error);
        res.status(200).json({ message: "Internal Server Error" });
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch (error) {
        console.log("Error in logout controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.logout = logout;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file || !req.file.buffer) {
            return res.status(400).json({ message: 'No file uploaded or buffer missing' });
        }
        const user = yield req.user;
        const streamUpload = (buffer) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary_1.default.uploader.upload_stream((error, result) => {
                    if (result)
                        resolve(result);
                    else
                        reject(error);
                });
                streamifier_1.default.createReadStream(buffer).pipe(stream);
            });
        };
        const result = yield streamUpload(req.file.buffer);
        yield db_1.default.user.update({
            where: {
                email: user.email
            },
            data: { profilePic: result.secure_url },
        });
        res.status(200).json({ message: 'Profile updated', url: result.secure_url });
    }
    catch (err) {
        console.error('UpdateProfile Error:', err);
        res.status(500).json({ message: 'Something went wrong' });
    }
});
exports.updateProfile = updateProfile;
/**
 *  try {
    const uploadedFiles = await Promise.all(
      req.files.map(async (file) => {
        const params = {
          Bucket: process.env.DIGITALOCEAN_SPACES_BUCKET,
          Key: `uploads/${Date.now()}_${file.originalname}`, // Unique filename
          Body: file.buffer,
          ACL: 'public-read', // Make file publicly accessible
          ContentType: file.mimetype,
        };

        const uploadResult = await s3.upload(params).promise();
        return { fileName: file.originalname, fileUrl: uploadResult.Location };
      })
    );

    res.json({
      message: 'Files uploaded successfully',
      files: uploadedFiles,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'File upload failed' });
  }
});

 */ 
