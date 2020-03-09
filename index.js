const express = require('express');
const app = express();
const EmailValidator = require('email-deep-validator');

app.get('/', (_req, res) => {
  res.send({ ok: true });
});

app.get('/:email', async (req, res) => {
  const emailValidator = new EmailValidator();

  const { wellFormed, validDomain, validMailbox } = await emailValidator.verify(
    req.params.email
  );

  console.log(req.params.email);

  res.send({ wellFormed, validDomain, validMailbox });
});

const port = process.env.PORT || 5000;
app.listen(port);
