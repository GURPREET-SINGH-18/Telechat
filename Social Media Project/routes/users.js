const router = require("express").Router();
const User = require("../models/User")
const bcrypt = require("bcrypt")


router.get('/allUsers',async(req,res)=> {
    try {
        const user = await User.find()
        res.status(200).json(user)
    } catch (err) {
        res.status(500).json(err)
    }
})

//Update User
router.put('/:id', async(req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (err) {
                return res.status(500).json(err);
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            })
            res.status(200).json("Account has been updated successfully");
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("You can update only your account")
    }
})

//Delete User
router.delete('/:id', async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndDelete(req.params.id)
            res.status(200).json("Account has been deleted successfully");
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("You can delete only your account")
    }
})

//Get a User
router.get('/', async (req, res) => {
    const userId = req.query.userId
    const username = req.query.username
    try {
        const user = userId ? await User.findById(userId) : await User.findOne({ username: username })
        const {
            password,
            updatedAt,
            ...other
        } = user._doc
        res.status(200).json(other);
    } catch (err) {
        res.status(500).json(err);
    }
})

//get friends
router.get("/friends/:username", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username })
        const friends = await Promise.all(
            user.following.map(friendId => {
                return User.findById(friendId);
            })
        )
        let friendList = [];
        friends.map(friend => {
            const { _id, username, profilePicture } = friend;
            friendList.push({ _id, username, profilePicture });
        });
        res.status(200).json(friendList);
    } catch (err) {
        res.status(500).json(err);
    }
})

//get friends using user id
router.get("/friends/userId/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        const friends = await Promise.all(
            user.following.map((friendId) => {
                return User.findById(friendId);
            })
        );
        let friendList = [];
        friends.map((friend) => {
            const { _id, username, profilePicture } = friend;
            friendList.push({ _id, username, profilePicture });
        });
        res.status(200).json(friendList)
    } catch (err) {
        res.status(500).json(err);
    }
});

//Follow a User
router.put('/:id/follow', async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({
                    $push: {
                        followers: req.body.userId
                    }
                })
                await currentUser.updateOne({
                    $push: {
                        following: req.params.id
                    }
                })
                res.status(200).json("Account has been followed successfully")
            } else {
                res.status(403).json("you already follow this user")
            }
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        req.status(403).json("You can't follow yourself")
    }
})

//Unfollow a User
router.put('/:id/unfollow', async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({
                    $pull: {
                        followers: req.body.userId
                    }
                })
                await currentUser.updateOne({
                    $pull: {
                        following: req.params.id
                    }
                })
                res.status(200).json("Account has been unfollowed successfully")
            } else {
                res.status(403).json("you don't follow this user")
            }
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        req.status(403).json("You can't unfollow yourself")
    }
})

module.exports = router;