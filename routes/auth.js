import express from "express";
import User from "../models/Users.js";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fetchUser from "../middleware/fetchUser.js";

const JWT_SECRET = "ashwinilovemadhu";
const router = express.Router();
//create a user using :POST "/api/auth/createuser   .Does not require Auth"   // no login required
/// i can also create custom  validation for what to check or not from the express validator for more guide\

// ROUTE:1
router.post(
  "/createuser",
  [
    body("name", "Enter a valid Name").isLength({ min: 3 }),
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password must be atleast 8 characters").isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    //this is basically for  the validation of the login user from express validator package
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // here we check whether the email is already in use or exists or not
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry a user with this email is already exists" });
      }

      // (async () => {
      //     // Technique 1 (generate a salt and hash on separate function calls):
      //     const salt = await bcrypt.genSalt(saltRounds);
      //     const hash = await bcrypt.hash(myPlaintextPassword, salt);
      //     // Store hash in your password DB.

      //     // Technique 2 (auto-gen a salt and hash):
      //     const hash2 = await bcrypt.hash(myPlaintextPassword, saltRounds);
      //     // Store hash in your password DB.
      // })();

      //    (async ()=>{
      //         const salt= await bcrypt.genSalt(10);
      //         const securePassword = await bcrypt.hash(req.body.password ,salt);
      //     })();

      const salt = await bcrypt.genSalt(10);
      const securePassword = await bcrypt.hash(req.body.password, salt);

      //create a new user
      user = await User.create({
        name: req.body.name,
        // password:req.body.password,
        //here i use bcrypt js for secure my pass so i create a variable secPass
        password: securePassword,
        email: req.body.email,
      });

      //jwt token used here
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      console.log(authToken);

      res.json({ authToken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send(`Internal Server Error`);
    }
  }
);

//Authenticate a user using :POST "/api/auth/login". No login required

// ROUTE:2
router.post(
  "/login",
  [
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password can not be blanked").exists({
      min: 8,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "please try with correct credentials" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: "please try with correct credentials" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({ authToken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send(`Internal Server Error`);
    }
  }
);

// ROUTE:3 GET LOGGED IN USER DETAILS USING : "/api/auth/getuser". Login required

router.post("/getuser", fetchUser, async (req, res) => {
  try {
    let userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send(`Internal Server Error`);
  }
});

export default router;
