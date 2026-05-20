import https from "https";
const options = {
  hostname: 'api.elevenlabs.io',
  path: '/v1/user',
  method: 'GET',
  headers: { 'xi-api-key': 'f149c49a9bf8446c16ddf8b703d23b04076d9009' }
};
const req = https.request(options, (res) => {
  let data = "";
  res.on("data", (chunk) => data += chunk);
  res.on("end", () => console.log("Status ElevenLabs:", res.statusCode, data));
});
req.end();
