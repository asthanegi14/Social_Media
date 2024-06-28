const express = require('express');
const multer = require('multer');
const router = express.Router();
const User = require('../model/Users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const Post = require('../model/Post');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage }).single('image');

router.post("/register", upload, async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const image = `/uploads/${req.file.filename}`;

        const existingUser = await User.findOne({ $or: [{ email: email }, { name: username }] });
        if (existingUser) {
            return res.json({ message: 'User already exists' });
        }

        const hashedPass = await bcrypt.hash(password, 10);

        const user = new User({
            name: username,
            email: email,
            password: hashedPass,
            image: image,
        });

        await user.save();

        res.json({ message: 'User registered successfully!' });
    } catch (e) {
        console.log(e);
        res.json({ message: e.message });
    }
});

router.post("/login", async (req, res) => {
    const jwtSecret = process.env.Secret_Key;

    try {
        const { username, password } = req.body;

        const user = await User.findOne({ name: username });

        if (!user) {
            return res.json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ message: 'Wrong password' });
        }

        const token = jwt.sign(
            { userId: user._id, name: user.name, email: user.email, image: user.image },
            jwtSecret,
            { expiresIn: '1h' }
        );

        res.json({ message: 'Login successful', token,  user: { name: user.name, email: user.email, image: user.image } });
    } catch (e) {
        console.log(e);
        res.json({ message: e.message });
    }
});

router.get("/fetchImg", async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const jwtSecret = process.env.SECRET_KEY;
        
        const decoded = jwt.verify(token, jwtSecret);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ name: user.name, image: user.image });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

router.post('/post', upload, async (req, res) => {
    try {
        const { postData, username, userImage } = req.body;
        const image = `/uploads/${req.file.filename}`;
        
        const post = new Post({
            name: username,
            userImage: userImage,
            description: postData,
            image: image,
            likes: 0,
            comments: []
        });

        await post.save();
        res.json({ message: "Post added successfully!" });
    } catch (e) {
        console.log("error posting", e);
        res.json({ message: e.message });
    }
});

router.get('/getPost/:postId', async (req, res) => {
    const postId = req.params.postId;

    try {
        const post = await Post.findById(postId).populate('comments'); 
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json(post);
    } catch (error) {
        console.error("Error fetching post:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get("/getAllPosts", async (req, res)=>{
        try {
            const posts = await Post.find();
            res.json(posts);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching posts', error });
        }
})

router.post('/updateLike', async (req, res) => {
    const { postId, isLiked } = req.body;
    try {
        const post = await Post.findById(postId);
        if (isLiked) {
            post.likes += 1;
        } else {
            post.likes -= 1;
        }
        await post.save();
        res.json({ success: true, likes: post.likes });
    } catch (error) {
        res.json({ success: false, error: 'Server error' });
    }
});

router.post('/addComment', async (req, res) => {
    const { postId, comment } = req.body;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }

        post.comments.push({ text: comment });
        await post.save();

        res.json({ success: true, comments: post.comments });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

router.delete('/deletePost/:postId', async (req, res) => {
    const postId = req.params.postId;

    try {
        const deletedPost = await Post.findByIdAndDelete(postId);
        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json({ success: true, message: 'Post deleted successfully' });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/updatePassword', async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        // if (user._id.toString() !== userId) {
        //     return res.status(403).json({ success: false, message: 'Unauthorized access' });
        // }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        res.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
