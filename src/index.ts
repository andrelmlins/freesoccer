import App from './config/App';

const port = process.env.PORT || 8080;

new App().app.listen(port, () => {
  console.log(`Free Soccer listening port ${port}`);
});
