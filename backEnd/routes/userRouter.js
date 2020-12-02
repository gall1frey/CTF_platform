const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const Chall = require("../models/challModel")
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
require("dotenv").config();

var allranks = [];
var secret = "asdfgh";

setInterval(async function(){
    secret = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, process.env.SECRET_LENGTH);
},process.env.SECRET_UPDATE_TIME_MS);

//refresh the ranks every three seconds
setInterval(async function(){
    allranks = await User.find({admin:false}, { displayName: 1, points: 1 }).sort({ points: -1 });
},process.env.REFRESH_RATE_MS);

router.post("/register", async (req, res) => {
    try {
        let { email, password, passwordCheck, displayName } = req.body;
        //validate
        if (!email || !password || !passwordCheck)
            return res.status(400).json({ msg: "Not all fields have been entered" });
        if (password.length < 5)
            return res.status(400).json({ msg: "Password needs to be at least 5 chars long" });
        if (password !== passwordCheck)
            return res.status(400).json({ msg: "Passwords do not match!" });

        const existingUser = await User.findOne({ email: email });
        if (existingUser)
            return res.status(400).json({ msg: "Account with this email already exists!" });
        if (!displayName)
            displayName = email;
        const dispCheck = await User.findOne({ displayName: displayName });
        if (dispCheck)
            return res.status(400).json({ msg: "Account with this display name already exists!" });
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        let newUser = new User({
            admin: false,
            email,
            password: passwordHash,
            displayName,
            points: 0,
            challs_done: []
        });

        var num_of_admins = await User.find({admin:true}).count();
        if (num_of_admins < 1*process.env.NO_OF_ADMINS){
          newUser = new User({
              admin: true,
              email,
              password: passwordHash,
              displayName,
              points: 0,
              challs_done: []
          });
          await newUser.save();
          res.json({ msg: "SUCCESS",admin:true });
        } else {
          await newUser.save();
          res.json({ msg: "SUCCESS",admin:false });
        }

        const io = res.locals['socketio'];
        io.emit('server-update');

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password, secretStr } = req.body;
        //validate
        if (!email || !password)
            return res.status(400).json({ msg: "Not all fields have been entered" });
        const user = await User.findOne({ email: email });
        if (!user)
            return res.status(400).json({ msg: "Wrong credentials" });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ msg: "Wrong credentials" });
        if (user.admin === true && secretStr != secret)
            return res.status(400).json({ msg: "Secret mismatch" });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({
            token,
            user: {
                id: user._id,
                displayName: user.displayName,
                points: user.points,
            },
            admin: user.admin
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/is_admin", async (req, res) => {
    try {
        const loggedInUser = await User.findOne({ email: req.body.email });
        if(!loggedInUser || !loggedInUser.admin) return res.json({ msg: "false" });
        console.log(`\n==========================================\n YOUR SECRET IS:` + secret + `\n VALID FOR ` + (process.env.SECRET_UPDATE_TIME_MS*1)/1000 + ` SECONDS \n==========================================`);
        res.json({ msg: "true" });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

router.delete("/delete", auth, async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.user);
        res.json(deletedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/tokenIsValid", async (req, res) => {
    try {
        const token = req.header("x-auth-token");
        if (!token) return res.json(false);
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) return res.json(false);
        const user = await User.findById(verified.id);
        if (!user) return res.json(false);
        return res.json(true);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/", auth, async (req, res) => {
    const user = await User.findById(req.user);
    res.json({
        user: {
          displayName: user.displayName,
          id: user._id,
          points: user.points,
        },
        admin: user.admin
    });
});

router.get("/ranks", auth, async (req, res) => {
    res.json(allranks);

});

router.get("/rank", auth, async (req, res) => {
    var user = await User.find({admin:false}, { _id: 1, displayName: 1, points: 1 }).sort({ points: -1 });
    index = user.findIndex(x => {
        var id = x._id;
        if (id == req.user)
            return true;
    });

    if (user[index])
      res.json({ rank: index+1, points: user[index].points });
    else
      res.json({ rank: 0, points: 0 });
});

router.post("/user", auth, async (req, res) => {
    try {
        var user = await User.findOne({ displayName: req.body.user });
        var records = await Chall.find({},{ title: 1, _id: 1, points: 1 }).where('_id').in(user.challs_done).exec();
        res.json({"challs":records,"user":user.displayName});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/add_admin", auth, async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.body.id,{admin:true},function(err,docs){
          if(err) res.status(500).json({ error: err.message });
          else res.json({msg:"SUCCESS"});
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/remove_admin", auth, async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.body.id,{admin:false},function(err,docs){
          if(err) res.status(500).json({ error: err.message });
          else res.json({msg:"SUCCESS"});
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
