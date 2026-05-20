import https from "https";
const data = JSON.stringify({ token: "f149c49a9bf8446c16ddf8b703d23b04076d9009", text: "Hello", voice_id: 1, language: "en" });
const options = {
  hostname: 'api.ttsmaker.com',
  path: '/v1/create-tts-order',
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Content-Length': data.length }
};
const req = https.request(options, (res) => {
  let resData = "";
  res.on("data", (chunk) => resData += chunk);
  res.on("end", () => {
    console.log("Status TTSMaker:", res.statusCode);
    console.log("Response:", resData); 
  });
});
req.write(data);
req.end();
