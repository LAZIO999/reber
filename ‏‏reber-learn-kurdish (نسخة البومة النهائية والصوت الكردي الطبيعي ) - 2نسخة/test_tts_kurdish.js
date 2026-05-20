import https from "https";

const data = JSON.stringify({
  text: "سلاو",
  speaker_id: "sorani_1",
  model_version: "v4",
  speed: 1.0
});

const options = {
  hostname: 'www.kurdishtts.com',
  path: '/api/tts-proxy',
  method: 'POST',
  headers: {
    'x-api-key': 'f149c49a9bf8446c16ddf8b703d23b04076d9009',
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  let responseData = Buffer.alloc(0);
  res.on('data', (d) => {
    responseData = Buffer.concat([responseData, d]);
  });
  res.on('end', () => {
    console.log(`Received ${responseData.length} bytes`);
  })
});

req.on('error', (error) => {
  console.error(error);
});

req.write(data);
req.end();
