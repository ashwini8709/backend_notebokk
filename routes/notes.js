import express from "express";
import Router from "express";
import fetchUser from "../middleware/fetchUser.js";
import note from "../models/Notes.js";
import { body, validationResult } from "express-validator";

const notesRouter = express.Router();
// ROUTE 1: GET ALL THE NOTES USING GET "api/auth/getuser",Login required

notesRouter.get("/fetchAllNotes", fetchUser, async (req, res) => {
  try {
    const notes = await note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send(`Internal Server Error`);
  }
});
// ROUTE 2: ADD A NEW  NOTE USING POST "api/auth/addnote",Login required

notesRouter.post(
  "/addnote",
  fetchUser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "descroption must be atleast 8 characters").isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    //this is basically for  the validation of the login user from express validator package

    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const notes = new note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await notes.save();
      res.json(savedNote);
    } catch (error) {
      console.log(error.message);
      res.status(500).send(`Internal Server Error`);
    }
  }
);

//ROUTE 3 : UPDATE AN EXISTING NOTE USING :POST "api/notes/updatenote"

notesRouter.put("/updatenote/:id", fetchUser, async (req, res) => {
  const { title, description, tag } = req.body;

  try {
    // create a new note object

    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    //FIND THE NOTE TO BE UPDATED AND UPDATE
    let updateNote = await note.findById(req.params.id);
    if (!updateNote) {
      return res.status(401).send("Not Found");
    }
    if (updateNote.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    updateNote = await note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ updateNote });
  } catch (error) {
    console.log(error.message);
    res.status(500).send(`Internal Server Error`);
  }
});

//ROUTE 4 : DELETE AN EXISTING NOTE USING :POST "api/notes/updatenote"

notesRouter.delete("/deletenote/:id", fetchUser, async (req, res) => {
  try {
    //FIND THE NOTE TO BE DELETED AND DELETE
    let updateNote = await note.findById(req.params.id);
    if (!updateNote) {
      return res.status(401).send("Not Found");
    }

    //ALLOW DELETION ONLY IF USER OWNS THIS NOTE

    if (updateNote.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    updateNote = await note.findByIdAndDelete(req.params.id);
    res.json({ SUCCESS: "Note has been deleted" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send(`Internal Server Error`);
  }
});
export default notesRouter;
