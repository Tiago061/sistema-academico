import  express, { type Application, type Request, type Response } from 'express'
import { config } from 'dotenv'
import cors from 'cors'
import inscricaoRoutes from './routes/inscricoes.routes';
import pessoaRoutes from './routes/pessoas.routes';
import cursoRoutes from './routes/cursos.routes';

config()

const app: Application = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))    


app.use('/pessoas', pessoaRoutes);
app.use('/inscricoes', inscricaoRoutes);
app.use('/cursos', cursoRoutes);


app.get('/', async (_req: Request, res: Response) => {
        
        res.status(200).json({ 
            success: true,
            statusCode: '200', 
            body: "Welcome to Academy System", 
  });
});


export default app;