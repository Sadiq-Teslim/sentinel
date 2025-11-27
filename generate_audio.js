// generate_audio.js
// Run with: node generate_audio.js

import fs from 'fs';
import https from 'https';
import path from 'path';

const API_KEY = "sk_live_DM-KylKxoumD3gETrP0Oo_BtacI-KZ3elL7PsIBaYaI";

const TASKS = [
  { lang: "english", voice: "Emma", text_safe: "This website is verified safe.", text_danger: "Warning! This website is a scam.", text_caution: "Be careful. We cannot verify this site." },
  { lang: "hausa", voice: "Umar", text_safe: "Wannan shafin yanar gizo ne ingantacce.", text_danger: "Kayi hattara! Wannan shafin na bogi ne.", text_caution: "Kayi a hankali. Bamuw tabbatar da wannan shafin ba." },
  { lang: "yoruba", voice: "Idera", text_safe: "Oju opo wẹẹbu yii wa ni ailewu.", text_danger: "Ikilọ! Oju opo wẹẹbu yii jẹ ayederu.", text_caution: "Ṣọra. A ko le jẹrisi oju opo wẹẹbu yii." },
  { lang: "igbo", voice: "Nonso", text_safe: "Ebe nrụọrụ weebụ a dị nchebe.", text_danger: "Dọọ aka na ntị! Ebe nrụọrụ weebụ a bụ wayo.", text_caution: "Kpachara anya. Anyị enweghị ike ịchọpụta saịtị a." },
];

async function generate(text, voice, filename) {
  // Provide helpful runtime logging for debugging
  console.log(`[generate] Start: ${filename} (voice=${voice})`);

  const REQUEST_TIMEOUT_MS = 20000; // 20s explicit timeout
  const MAX_RETRIES = 2; // total attempts = 1 + MAX_RETRIES

  // If no API key, create a dummy file to prevent app crash and log reason
  if (!API_KEY || API_KEY === "YOUR_YARNGPT_KEY_HERE") {
    console.warn(`⚠️ No API Key found. Creating placeholder for: ${filename}`);
    try {
      fs.writeFileSync(`./public/audio/${filename}`, "dummy-audio-content");
      console.log(`[generate] Placeholder created: ./public/audio/${filename}`);
    } catch (err) {
      console.error(`[generate] Failed creating placeholder for ${filename}:`, err);
    }
    return;
  }

  const postData = JSON.stringify({ text: text, voice: voice, response_format: "mp3" });

  const options = {
    hostname: 'yarngpt.ai',
    path: '/api/v1/tts',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  // Log non-sensitive API key info and request metadata
  console.log(`[generate] API key present: ${API_KEY ? 'yes' : 'no'}, keyLength=${API_KEY ? API_KEY.length : 0}`);
  console.log(`[generate] Request -> ${options.method} https://${options.hostname}${options.path} headers=${Object.keys(options.headers).join(',')}`);
  console.log(`[generate] postData bytes=${Buffer.byteLength(postData)}`);

  return new Promise((resolve) => {
    const startTime = Date.now();

    const attemptRequest = (attempt) => {
      console.log(`[generate] Attempt ${attempt + 1} for ${filename}`);
      const req = https.request(options, (res) => {
        console.log(`[generate] Response for ${filename}: status=${res.statusCode}`);
        console.log(`[generate] Response headers: ${JSON.stringify(res.headers)}`);

        let receivedBytes = 0;
        const chunks = [];

        res.on('data', (chunk) => {
          receivedBytes += chunk.length;
          chunks.push(chunk);
        });

        res.on('end', () => {
          if (res.statusCode !== 200) {
            const body = Buffer.concat(chunks).toString('utf8');
            console.error(`[generate] Non-200 response for ${filename}: ${res.statusCode}`);
            console.error(`[generate] Response body: ${body}`);
            try {
              fs.writeFileSync(`./public/audio/${filename}`, "dummy-error-content");
              console.log(`[generate] Wrote error placeholder for ${filename}`);
            } catch (err) {
              console.error(`[generate] Failed writing error placeholder for ${filename}:`, err);
            }
            return resolve();
          }

          // If we got here and there were no errors, ensure file exists (some servers close before 'finish')
          const outPath = `./public/audio/${filename}`;
          try {
            // If content was already piped to a stream, it's written; otherwise write from buffer
            if (fs.existsSync(outPath)) {
              const duration = Date.now() - startTime;
              console.log(`[generate] File already exists: ${outPath} (${receivedBytes} bytes) duration=${duration}ms`);
              return resolve();
            }

            fs.writeFileSync(outPath, Buffer.concat(chunks));
            const duration = Date.now() - startTime;
            console.log(`✅ Generated: ${filename} (${receivedBytes} bytes) duration=${duration}ms`);
          } catch (err) {
            console.error(`[generate] Error writing file for ${filename}:`, err);
          }
          return resolve();
        });
      });
      // attach helpful socket event logging
      req.on('socket', (socket) => {
        socket.on('close', (hadError) => {
          console.log(`[generate] socket close for ${filename} hadError=${hadError}`);
        });
        socket.on('end', () => {
          console.log(`[generate] socket end for ${filename}`);
        });
        socket.on('error', (err) => {
          console.log(`[generate] socket error for ${filename}:`, err && err.code ? err.code : err);
        });
      });

      req.setTimeout(REQUEST_TIMEOUT_MS);

      req.on('error', (e) => {
        console.error(`[generate] Request error for ${filename}:`, e && e.code ? `${e.code} ${e.message}` : e);
        if (attempt < MAX_RETRIES) {
          const backoff = 1000 * (attempt + 1);
          console.log(`[generate] Will retry ${filename} in ${backoff}ms (attempt ${attempt + 2})`);
          return setTimeout(() => attemptRequest(attempt + 1), backoff);
        }

        try {
          fs.writeFileSync(`./public/audio/${filename}`, "dummy-request-error");
          console.log(`[generate] Wrote request-error placeholder for ${filename}`);
        } catch (err) {
          console.error(`[generate] Failed writing request-error placeholder for ${filename}:`, err);
        }
        return resolve(); // Resolve to continue the loop
      });

      req.on('timeout', () => {
        console.error(`[generate] Request timeout for ${filename} after ${REQUEST_TIMEOUT_MS}ms`);
        req.abort();
        if (attempt < MAX_RETRIES) {
          const backoff = 1000 * (attempt + 1);
          console.log(`[generate] Will retry ${filename} after timeout in ${backoff}ms (attempt ${attempt + 2})`);
          return setTimeout(() => attemptRequest(attempt + 1), backoff);
        }
        try {
          fs.writeFileSync(`./public/audio/${filename}`, "dummy-timeout-error");
        } catch (err) {
          console.error(`[generate] Failed writing timeout placeholder for ${filename}:`, err);
        }
        return resolve();
      });

      try {
        req.write(postData);
        req.end();
      } catch (err) {
        console.error(`[generate] Failed sending request for ${filename}:`, err);
        if (attempt < MAX_RETRIES) {
          return setTimeout(() => attemptRequest(attempt + 1), 1000);
        }
        return resolve();
      }
    };

    // start first attempt
    attemptRequest(0);
  });
}

async function run() {
  // Ensure folder exists
  try {
    if (!fs.existsSync('./public/audio')) {
      fs.mkdirSync('./public/audio', { recursive: true });
      console.log('[run] Created directory: ./public/audio');
    } else {
      console.log('[run] Directory exists: ./public/audio');
    }

    console.log('🎙️ Starting Audio Generation...');

    for (const task of TASKS) {
      console.log(`[run] Generating safe audio for: ${task.lang}`);
      await generate(task.text_safe, task.voice, `${task.lang}_safe.mp3`);

      console.log(`[run] Generating danger audio for: ${task.lang}`);
      await generate(task.text_danger, task.voice, `${task.lang}_danger.mp3`);

      console.log(`[run] Generating caution audio for: ${task.lang}`);
      await generate(task.text_caution, task.voice, `${task.lang}_caution.mp3`);
    }

    console.log('✨ Audio Assets Complete.');
  } catch (err) {
    console.error('[run] Unexpected error:', err);
  }
}

run();