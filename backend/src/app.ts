import  express, { type Application, type Request, type Response } from 'express'
import { config } from 'dotenv'

config()

const app: Application = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))    


app.get('/', async (_req: Request, res: Response) => {
        
        res.status(200).json({ 
            success: true,
            statusCode: '200', 
            body: "Welcome to Academy System", 
  });
});


export default app;