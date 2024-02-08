const express = require('express');
const app = express();
const port = 3000;

function isAuth(req, res, next) {
    const base64auth = (req.headers.authorization || '').split(' ')[1] || ''
    const [username, password] = Buffer.from(base64auth, 'base64').toString().split(':')

    // if (username && password && username === process.env.AUTH_USERNAME && password === process.env.AUTH_PASSWORD) {
    if (username && password && username === 'admin' && password === 'admin') {
      next();
    } else {
      res.status(401);
      res.send('Access forbidden');
    }
}

const hi_msg = "\n\.sh controller \n\n"

const op_list = "\nEndpoint-uri disponibile: \n " +
                "/test_name \t\tporneste test-ul specificat \n\n" +
                "\n\nTeste disponibile: \n" +
                "1. test1 \n\n "

const tests = ({
  'script.sh': 'script.sh',
  2: 'Two',
  3: 'Three'
})

app.get('/', isAuth, (req, res) => {
  res.send(hi_msg + op_list);
});

app.get('/:test', isAuth, (req, res) => {
  let test = tests[req.params.test]

  if (test == 'undefined'){
    res.status(400);
    res.send('Bad request!');
  }

  let { spawn } = require('child_process');
  // let ls = spawn('echo', ['cy:run-' + test, param], {cwd: '/'});
  let ls = spawn('yarn', ['install'], {cwd: '/path/to/sh/scripts'});


  ls.on('exit', function (code, signal) {
    console.log('child process exited with ' +
                `code ${code} and signal ${signal}`);
  });

  ls.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
    // res.status(200).send(data);
  });

  ls.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  ls.stdout.on('close', (data) => {
    console.error(`close: ${data}`);
  });

  ls.stdout.on('exit', function (code, signal) {
    console.log('child process exited with ' +
                `code ${code} and signal ${signal}`);
  });

  res.status(200).send({ message: "123" });

  // res.send('Hello World ! ' + tests[req.params.test]);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
