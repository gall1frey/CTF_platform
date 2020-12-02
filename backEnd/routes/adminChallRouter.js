const router = require("express").Router();
const Chall = require("../models/challModel");
const auth = require("../middleware/auth");

router.post("/add_chall", auth, async (req, res) => {
    try {
        const loggedInUser = await User.findById(req.user);
        const regex = new RegExp(process.env.FLAG_REGEX, "");
        if (!loggedInUser) return res.status(401).json({ msg: "You're not logged in!" });
        //console.log(loggedInUser.admin);
        if (!(loggedInUser.admin)) return res.status(401).json({ msg: "You're not Authorised!" });
        let { title, content, link, points, flag } = req.body;
        //validate
        if (!title || !flag || !points)
            return res.status(400).json({ msg: "Not all fields have been entered" });
        if(!regex.test(flag))
            return res.status(400).json({ msg: "Flag format not matched" });
        if (!content) content = " ";
        if (!link) link = " ";
        flag = flag.match(regex)[0];
        const newChall = new Chall({
            title,
            content,
            link,
            points,
            flag,
            solves: []
        });
        const nc = await newChall.save();
        console.log(nc);
        res.json({ msg: "SUCCESS", id: newChall._id });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

router.post("/change_chall", auth, async (req, res) => {
    try {
        const loggedInUser = await User.findById(req.user);
        const regex = new RegExp(process.env.FLAG_REGEX, "");
        if (!loggedInUser) return res.status(401).json({ msg: "You're not logged in!" });
        //console.log(loggedInUser.admin);
        if (!(loggedInUser.admin)) return res.status(401).json({ msg: "You're not Authorised!" });
        let { id, title, content, link, points, flag } = req.body;
        //validate
        if(!id) return res.status(401).json({ msg: "Give an ID!" });
        if(!Number.isInteger(points*1)) return res.status(400).json({ msg: "Points have to be an integer!" });
        if(flag && !regex.test(flag)) return res.status(400).json({ msg: "Flag doesn't match the regex" });
        const chall = await Chall.findById(id);
        if(!chall) return res.status(400).json({ msg: "No such challendge" });
        console.log(chall.id,chall.title,chall.content,chall.link,chall.points,chall.flag);
        if(title && title != chall.title) chall.title = title;
        if(content && content.length >= 1 && content != chall.content) chall.content = content;
        if(link && link.length >= 1 && link != chall.link) chall.link = link;
        if(points && points.length >= 1 && points != chall.points) chall.points = points*1;
        if(flag && flag != chall.flag) chall.flag = flag;
        console.log(chall.id,chall.title,chall.content,chall.link,chall.points,chall.flag);

        await Chall.findByIdAndUpdate(id,chall,function(err,docs){
          if(err) res.status(500).json({ error: err.message });
          else res.json({msg:"SUCCESS"});
        });

    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

router.post("/delete_chall", auth, async (req, res) => {
    try {
        const { id } = req.body;
        console.log(req.body);
        const existingChall = await Chall.findById(id);
        if (!existingChall)
            return res.status(400).json({ msg: "No such challenge!" });
        //const deletedChall = await Chall.deleteOne({ title: title});
        res.json({msg:"SUCCESS"});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
