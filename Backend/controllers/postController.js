const Post = require('../models/Post');
const Employee = require('../models/Employee');

exports.createPost = async(req, res) => {
    try{
        const newPostData = {
            content: req.body.content,
            title: req.body.title,
            tags: req.body.tags,
            creator: req.employee._id
        }

        const newPost = await Post.create(newPostData);

        const employee = await Employee.findById(req.employee._id);

        employee.posts.push(newPost._id);

        await employee.save();

        res.status(201).json({
            success: true,
            post: newPost
        });

    } catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }

}

exports.deletePost = async(req, res) => {
    try {
        const post  = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }
        
        if(post.creator.toString() !== req.employee._id.toString()){
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        await post.deleteOne();

        const employee = await Employee.findById(req.employee._id);

        const index = employee.posts.indexOf(req.params.id);

        employee.posts.splice(index, 1);

        await employee.save();

        res.status(200).json({
            success: true,
            message: "Post deleted"
        });

    } catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

exports.upvotePost = async(req, res) => {
    try{
        const post  = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({
                success: false,
                message: "post not found"
            });
        }
        
        if(post.upvotes.includes(req.employee._id)){
            const index = post.upvotes.indexOf(req.employee._id);
            post.upvotes.splice(index, 1);
            const upv = post.upvotes.length;
            const dwv = post.downvotes.length;
            post.voteScore = (upv - dwv);
            await post.save();
            return res.status(200).json({
                success: true,
                message: "upvote removed"
            });
        }
        
        else if(post.downvotes.includes(req.employee._id)){
            const index = post.downvotes.indexOf(req.employee._id);
            post.downvotes.splice(index, 1);
            post.upvotes.push(req.employee._id);
            const upv = post.upvotes.length;
            const dwv = post.downvotes.length;
            post.voteScore = (upv - dwv);
            await post.save();
            return res.status(200).json({
                success: true,
                message: "upvoted"
            });
        }
        
        else{
            post.upvotes.push(req.employee._id);
            const upv = post.upvotes.length;
            const dwv = post.downvotes.length;
            post.voteScore = (upv - dwv);
            await post.save();
            return res.status(200).json({
                success: true,
                message: "upvoted"
            });
        }

    } catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

exports.downvotePost = async(req, res) => {
    try{
        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({
                success: false,
                message: "post not found"
            });
        }
        
        if(post.downvotes.includes(req.employee._id)){
            const index = post.downvotes.indexOf(req.employee._id);
            post.downvotes.splice(index, 1);
            const upv = post.upvotes.length;
            const dwv = post.downvotes.length;
            post.voteScore = (upv - dwv);
            await post.save();
            return res.status(200).json({
                success: true,
                message: "downvote removed"
            });
        }

        else if(post.upvotes.includes(req.employee._id)){
            const index = post.upvotes.indexOf(req.employee._id);
            post.upvotes.splice(index, 1);
            post.downvotes.push(req.employee._id);
            const upv = post.upvotes.length;
            const dwv = post.downvotes.length;
            post.voteScore = (upv - dwv);
            await post.save();
            return res.status(200).json({
                success: true,
                message: "downvoted"
            });
        }

        else{
            post.downvotes.push(req.employee._id);
            const upv = post.upvotes.length;
            const dwv = post.downvotes.length;
            post.voteScore = (upv - dwv);
            await post.save();
            return res.status(200).json({
                success: true,
                message: "downvoted"
            });
        }

    } catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

exports.getPosts = async(req, res) => {
    try {
        const posts = await Post.find().populate('creator', 'name username').populate({
            path: 'comments',
            populate:{
                path: 'writer',
                model: 'Employee'
            }
        });
        res.status(200).json({
            success: true,
            posts
        });
    } catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

exports.getPostById = async(req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate({
            path: 'comments',
            populate:{
                path: 'writer',
                model: 'Employee'
            }
        });

        if(!post){
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        res.status(200).json({
            success: true,
            post
        })

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

exports.addComment = async(req, res) => {
    try {

        const post = await Post.findById(req.params.id);
        
        if(!post){
            return res.status(404).json({
                success: false,
                message: "post not found"
            });
        }

        post.comments.push({
            writer: req.employee._id,
            commentContent: req.body.commentContent
        });

        await post.save();

        return res.status(200).json({
            success: true,
            message: "comment added"
        })
        
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}