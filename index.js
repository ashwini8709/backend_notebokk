import { connectToMongo } from "./database/db.js";
import express  from "express";
import  router  from "./routes/auth.js";
import notesRouter from "./routes/notes.js";

connectToMongo();

const app = express()
const port = 5000
//Available routes

//use a middleware for get request from endpoint from the api  that prints madhu {"Love": "Madhu"}

app.use(express.json());

app.use('/api/auth',router);
app.use('/api/notes',notesRouter);

app.get('/', (req, res) => { 
  res.send('Hello Ashwini!!!!!')
})
// app.get('/about', (req, res) => {
//   res.send('MongoDb connected successfully')
// })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


















































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































