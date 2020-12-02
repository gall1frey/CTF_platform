const router = require("express").Router();
const Chall = require("../models/challModel");
const User = require("../models/userModel");
const auth = require("../middleware/auth");

router.post("/validateFlag", auth, async (req, res) => {
    try {
        const loggedInUser = await User.findById(req.user);
        //Check for logged in user
        if (!loggedInUser) return res.status(401).json({ msg: "You're not logged in!" });
        const { id, flag } = req.body;
        //Get challenge info
        const existingChall = await Chall.findById(id);
        //Check if flag is correct
        if (flag.len <= 3) return res.status(406).json({ msg: "Wrong flag!" });
        if (!existingChall || (existingChall.flag !== flag)) return res.status(406).json({ msg: "Wrong flag!" });
        //Check if challenge is already solved
        if (loggedInUser.challs_done.includes(id)) return res.status(406).json({ msg: "Already solved!" });
        //Update user's points and challs
        await User.findByIdAndUpdate(loggedInUser._id,
            {
                $inc: { points: existingChall.points },
                $addToSet: { challs_done: id}
            },false
        );
        await Chall.findByIdAndUpdate(existingChall._id,
            {
                $addToSet: { solves: req.user }
            }, false
        );
        res.locals['socketio'].emit('server-update');
        return res.json({msg:"SUCCESS"});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/", auth, async (req, res) => {
    const allChalls = await Chall.find({}, { title: 1, content: 1, link: 1, points: 1 });
    res.json(allChalls);
});

router.get("/userChalls", auth, async (req, res) => {
    const queryChalls = await Chall.find({ "solves": { $nin: [req.user] } }, { title: 1, content: 1, link: 1, points: 1 });
    res.json(queryChalls);
});

module.exports = router;
