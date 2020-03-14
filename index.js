const express = require('express');
const app = express();
const EmailValidator = require('email-deep-validator');
const validate = require('deep-email-validator').validate;

const remote =
  process.env.NODE_ENV === 'production' ||
  process.env.NODE_ENV === 'staging' ||
  process.env.NODE_ENV === 'preprod';

app.get('/api/:email', async (req, res) => {
  const emailValidator = new EmailValidator();

  const { wellFormed, validDomain, validMailbox } = await emailValidator.verify(
    req.params.email
  );

  console.log(req.params.email);

  res.send({ wellFormed, validDomain, validMailbox });
});

app.get('/api/test/:email', async (req, res) => {
  let result = await validate(req.params.email);
  res.send(result);
});

if (remote) {
  app.use(
    express.static('fe/build', {
      etag: true, // Just being explicit about the default.
      lastModified: true, // Just being explicit about the default.
      setHeaders: (res, path) => {
        const hashRegExp = new RegExp(
          '(.js|.css|.svg|.png|.jpg|.jpeg|.ico|.manifest.json)$'
        );

        if (path.endsWith('.html')) {
          // All of the project's HTML files end in .html
          res.setHeader('Cache-Control', 'no-cache');
        } else if (hashRegExp.test(path)) {
          // If the RegExp matched, then we have a versioned URL.
          res.setHeader('Cache-Control', 'max-age=31536000');
        }
      }
    })
  );

  const path = require('path');
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'fe', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 5000;
app.listen(port);
