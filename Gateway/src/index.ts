import express from 'express';
import cors from 'cors';
import proxy from 'express-http-proxy';

const app = express();

app.use(cors());

app.use(express.json());

app.use ('/product',proxy("http://localhost:8002"))
app.use ('/shopping',proxy("http://localhost:8003"))

app.use ('/',proxy("http://localhost:8001")) //customer



const port = 8000;
 
 
app.listen(port,()=>{
    console.log("Gateway running on port "+ port +" ...");
});