import app from "./src/app";

const port = 3001;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
