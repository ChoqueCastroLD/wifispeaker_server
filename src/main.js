const pcm = require('pcm-util');
const recorder = require('node-record-lpcm16')
const WebSocket = require('ws');
const fs = require('fs');
const wss = new WebSocket.Server({
    port: 8080
});

const recording = recorder.record({
    recorder: 'arecord'
})

const stream = recording.stream()
let buffer;

stream.prependListener("data", (d) => {
    buffer = pcm.toAudioBuffer(new Uint8Array(d));
    let data = JSON.stringify({
        buf: buffer
    });
    console.log(data.substring(0,100));
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN)
            client.send(data);
    });
})


const play = require('audio-play');
var load = require('audio-loader');

