const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
app.use(bodyParser.json());

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
  'script1.sh': 'script1.sh',
  'script2.sh': 'script2.sh',
  'script3.sh': 'script3.sh'
})

app.get('/', isAuth, (req, res) => {
  res.send(hi_msg + op_list);
});

app.post('/run/:scriptName', isAuth, async (req, res) => {
  const scriptName = req.params.scriptName;

  // Verifică dacă scriptul specificat este disponibil
  if (!(scriptName in tests)) {
    res.status(400).send('Bad request! Scriptul specificat nu există');
    return;
  }

  // curl localhost:3000/script.sh --header "Authorization: Basic YWRtaW46YWRtaW4="
  let { spawn } = require('child_process');
  // let ls = spawn('echo', ['123' + scriptName], {cwd: '/'});

  console.log(`Start executing ${scriptName}`);
  let ls = spawn('/bin/bash', [`./${scriptName}`], {cwd: '/Users/maria/git/sh-controller/scripts'});

  ls.on('exit', function (code, signal) {
        console.log('child process exited with ' +
            `code ${code} and signal ${signal}`);

        let statusData = {};

        // Verifică codul de ieșire al procesului pentru a determina starea execuției
        if (code === 0) {
            console.log('Script executed successfully');
            // Setează statusul ca 'success' sau 'completed' în obiectul statusData
            statusData = {
                script: scriptName,
                status: 'success'
            };
        } else {
            console.error('Script execution encountered an error');
            // Setează statusul ca 'error' sau 'failed' în obiectul statusData
            statusData = {
                script: scriptName,
                status: 'error'
            };
        }

        // POST status - endpoint-ul /status
        fetch('http://localhost:3000/status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(statusData)
        }).catch(err => console.error('Error posting status:', err));

        res.status(200).json({ message: "FINISHED", statusData });
        console.log(`Finished executing ${scriptName}`);
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
  // res.send('Hello World ! ' + tests[req.params.test]);
});

app.post('/status', (req, res) => {
  const statusData = req.body;
  console.log('Received status:', statusData);
  res.status(200).send('Status received');
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
