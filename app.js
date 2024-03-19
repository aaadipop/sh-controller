const express = require('express');
const app = express();
const port = 3001;
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const hi_msg = "\n\.sh controller \n\n"

let tests = {
  'script1.sh': 'script1.sh',
  'script2.sh': 'script2.sh',
  'script3.sh': 'script3.sh'
};

function generateOpList(tests) {
  let op_list = "\nEndpoint-uri disponibile: \n " +
                "/test_name \t\tporneste test-ul specificat \n\n" +
                "\n\nTeste disponibile: \n";

  for (const test in tests) {
    op_list += `${tests[test]}. ${test}\n`;
  }

  return op_list;
}

let op_list = generateOpList(tests);

function isAuth(req, res, next) {
    const base64auth = (req.headers.authorization || '').split(' ')[1] || ''
    const [username, password] = Buffer.from(base64auth, 'base64').toString().split(':')

    if (username && password && username === 'admin' && password === 'admin') {
      next();
    } else {
      res.status(401);
      res.send('Access forbidden');
    }
}

app.get('/', isAuth, (req, res) => {
  res.send(hi_msg + op_list);
});

app.post('/run/:scriptName', isAuth, async (req, res) => {
  const scriptName = req.params.scriptName;

  // Verifică dacă scriptul specificat este disponibil
  if (!(scriptName in tests)) {
    res.status(400).send('Bad request! Scriptul specificat nu există');
    return;
  } else {
     res.status(200).json({script: scriptName, status: 'started'});
  }

  let { spawn } = require('child_process');
  const path = require('path');

  // Directorul de lucru pentru scripturi
  const scriptsDir = path.join(__dirname, 'scripts');

  // Comanda pentru a executa scriptul specificat
  let ls = spawn('/bin/sh', [`${scriptName}`], {cwd: scriptsDir});
  let isError = false;
  let statusData;

  console.log(`Start executing ${scriptName}`);

  ls.on('exit', function (code, signal) {
        console.log('child process exited with ' +
            `code ${code} and signal ${signal}`);

        // Verifică codul de ieșire al procesului pentru a determina starea execuției
        if (code === 0) {
            console.log('Script executed successfully');
            // Setează statusul ca 'success' sau 'completed' în obiectul statusData
            statusData = {
                script: scriptName,
                status: 'success'
            };
            sendStatus(statusData);
        } else {
            console.error('Script execution encountered an error');
        }

        console.log(`Finished executing ${scriptName}`);
    });

  ls.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);

        // Dacă primești date pe canalul de eroare standard (stderr), setează statusul ca "error"
        statusData = {
            script: scriptName,
            status: 'error',
            error: data.toString
        };

        sendStatus(statusData);
    });

  ls.stdout.on('close', (data) => {
    console.error(`close: ${data}`);
  });

  ls.stdout.on('exit', function (code, signal) {
    console.log('child process exited with ' +
                `code ${code} and signal ${signal}`);
  });
});

function sendStatus (statusData){
      // POST status - endpoint-ul /status
        fetch('http://localhost:3001/status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(statusData)
        }).catch(err => console.error('Error posting status:', err));
}

app.post('/status', (req, res) => {
  const statusData = req.body;
  console.log('Received status:', statusData);
  res.status(200).send('Status received');
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});