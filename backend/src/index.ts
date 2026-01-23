import express, {type Request, type Response} from "express"
import { authRoutes } from "./routes/authRoutes";



const app = express();

const port = 3000;

app.use(express.json());

app.get("/",(req : Request, res: Response)=>{
    res.send("Express + Typescript running");
});

app.use("/api/auth",authRoutes);

app.listen(port, ()=>{
    console.log('====================================');
    console.log("Server running on port 3000!");
    console.log('====================================');
})