import express  from "express";

const notesRouter = express.Router();

notesRouter.get('/',(req,res)=>{
    res.send("Hello")
    console.log(req.body);;
})

export default notesRouter;