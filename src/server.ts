import express, { Application, Request, Response } from 'express';

const app: Application = express();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello world');
});

const PORT = process.env.PORT || 1000;

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
