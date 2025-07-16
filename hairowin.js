//hairo clapping gpt coders 
const tls = require("tls");
const WebSocket = require("ws");
const http2 = require("http2");
const events = require("events");
const figlet = require("figlet");
const gradient = require("gradient-string");
const cluster = require("cluster");
const os = require("os");
const winston = require("winston");
const { PromisePool } = require("@supercharge/promise-pool");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "sniper.log" })
  ]
});
figlet('DUCKEVILS4K', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const lines = data.split('\n');
  const maxLength = Math.max(...lines.map(line => line.length));
  const padding = 4;
  const totalWidth = maxLength + padding * 2;
  const topBorder = '╔' + '═'.repeat(totalWidth) + '╗';
  const bottomBorder = '╚' + '═'.repeat(totalWidth) + '╝';
  const framedLines = lines.map(line => {
    const space = totalWidth - line.length;
    const leftPadding = Math.floor(space / 2);
    const rightPadding = space - leftPadding;
    return '║' + ' '.repeat(leftPadding) + line + ' '.repeat(rightPadding) + '║';
  });
  const framedText = [topBorder, ...framedLines, bottomBorder].join('\n');
  console.log(gradient.pastel(framedText));
});

let tlsSocket = null
	async function connectTLS(port) {
		tlsSocket = tls.connect({
			host: "canary.discord.com",
			port,
			minVersion: "TLSv1.2",
			maxVersion: "TLSv1.2",
			rejectUnauthorized: false,
			checkServerIdentity: () => undefined,
			servername: "canary.discord.com",
			keepAlive: true,
			session: sessionCache.get("canary.discord.com")
		})
		tlsSocket.setNoDelay(true)
		tlsSocket.setKeepAlive(true, 10000)
		tlsSocket.setMaxListeners(0)
		tlsSocket.setEncoding("latin1")

		tlsSocket.on("error", (err) => {
			tlsSocket?.destroy()
		})

		tlsSocket.on("close", () => {
			const nextPort = port === 8443 ? 443 : 8443
			setTimeout(() => connectTLS(nextPort), 950)
		})

		tlsSocket.on("end", () => {
			tlsSocket?.destroy()
		})

		tlsSocket.on("session", (session) => {
			sessionCache.set("canary.discord.com", session)
		})
	}
	

const token = ""
const serverId = ""
const gatewayURL = "wss://gateway-us-east1-c.discord.gg"
const password = ""

const guilds = {}
let mfaToken = null
const sessionCache = new Map()

process.title = "Zafer Allah'ın yanında olanındır."
process.setMaxListeners(0)
events.EventEmitter.defaultMaxListeners = 0
let session
const HEARTBEAT = Buffer.from('{"op":1,"d":{}}')
const IDENTIFY = Buffer.from(
    JSON.stringify({
        op: 2,
        d: {
            token: token,
            intents: 1,
            properties: {os: "linux", browser: "Discord Android"},
            guild_subscriptions: false,
            large_threshold: 0
        }
    })
)
function connectWebSocket() {
    let websocket = null
    let reconnecting = false
    let heartbeat = null
    const HEARTBEAT_INTERVAL = 41250
    const CONNECTION_LIFETIME = 900000

    const start = () => {
        try {
            const identifyPayload = Buffer.from(IDENTIFY)
            const heartbeatPayload = Buffer.from(HEARTBEAT)

            websocket = new WebSocket(gatewayURL, {
                handshakeTimeout: 0,
                perMessageDeflate: false,
                skipUTF8Validation: true
            })

            websocket.on("upgrade", (response, socket) => {
                if (socket?._handle) {
                    socket._handle.setNoDelay(true)
                    socket.setNoDelay(true)
                    socket.setKeepAlive(true, 10000)
                    socket.setTimeout(0)
                    socket.setMaxListeners(0)
                }
            })

            websocket.onopen = () => {
                websocket.send(identifyPayload, {binary: false}, (err) => {
                    if (err) setImmediate(reconnect)
                })

                heartbeat = setInterval(() => {
                    if (websocket.readyState !== WebSocket.OPEN) {
                        setImmediate(reconnect)
                        return
                    }

                    websocket.send(heartbeatPayload, {binary: false}, (err) => {
                        if (err) setImmediate(reconnect)
                    })
                }, HEARTBEAT_INTERVAL)

                heartbeat.unref()
            }

            websocket.onmessage = async ({ data }) => {
                const { d, t } = JSON.parse(data);
                if (t === "GUILD_UPDATE") {
                    const guildId = d.guild_id || d.id;
                    const find = guilds[guildId];
                    if (find && find !== d.vanity_url_code) {
                        const begin = '{"code":"';
                        const end = '"}';
                        const body = begin + find + end;
                        for (let i = 0; i < 250; i++) {
                            queueMicrotask(() => {
                             tlsSocket.write(Buffer.from(`PATCH /api/v10/guilds/${serverId}/vanity-url HTTP/1.1\r\n`));
                            tlsSocket.write(Buffer.from(`Host: canary.discord.com\r\n`));
                            tlsSocket.write(Buffer.from(`X-Discord-MFA-Authorization: ${mfaToken}\r\n`));
                            tlsSocket.write(Buffer.from(`Content-Length: ${body.length}\r\n`));
                            tlsSocket.write(Buffer.from(`Authorization: ${token}\r\n`));
                            tlsSocket.write(Buffer.from(`Content-Type: application/json\r\n`));
                            tlsSocket.write(Buffer.from(`User-Agent: 0\r\n`));
                            tlsSocket.write(Buffer.from(`X-Super-Properties: eyJvcyI6IkFuZHJvaWQiLCJicm93c2VyIjoiQW5kcm9pZCBDaHJvbWUiLCJkZXZpY2UiOiJBbmRyb2lkIiwic3lzdGVtX2xvY2FsZSI6InRyLVRSIiwiYnJvd3Nlcl91c2VyX2FnZW50IjoiTW96aWxsYS81LjAgKExpbnV4OyBBbmRyb2lkIDYuMDsgTmV4dXMgNSBCdWlsZC9NUkE1OE4pIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS8xMzEuMC4wLjAgTW9iaWxlIFNhZmFyaS81MzcuMzYiLCJicm93c2VyX3ZlcnNpb24iOiIxMzEuMC4wLjAiLCJvc192ZXJzaW9uIjoiNi4wIiwicmVmZXJyZXIiOiJodHRwczovL2Rpc2NvcmQuY29tL2NoYW5uZWxzL0BtZS8xMzAzMDQ1MDIyNjQzNTIzNjU1IiwicmVmZXJyaW5nX2RvbWFpbiI6ImRpc2NvcmQuY29tIiwicmVmZXJyaW5nX2N1cnJlbnQiOiIiLCJyZWxlYXNlX2NoYW5uZWwiOiJzdGFibGUiLCJjbGllbnRfYnVpbGRfbnVtYmVyIjozNTU2MjQsImNsaWVudF9ldmVudF9zb3VyY2UiOm51bGwsImhhc19jbGllbnRfbW9kcyI6ZmFsc2V9=\r\n`));
                            tlsSocket.write(Buffer.from(`\r\n`));
                            tlsSocket.write(Buffer.from(body));                         
                        })
                        }
                    }
                } else if (t === "READY") {
                    for (const guild of d.guilds) {
                        if (guild.vanity_url_code) {
                            guilds[guild.id] = guild.vanity_url_code;
                            console.log(gradient.rainbow(`GUILD => ${guild.id} || VANITY => ${guild.vanity_url_code}`));
                        }
                    }
                    console.log("duckevils wishes you a good flight!\nZafer Allah'ın yanında olanlardır.");
                }
            };
            websocket.onclose = () => setImmediate(reconnect)
            setTimeout(() => {
                if (websocket?.readyState === WebSocket.OPEN) {
                    clearInterval(heartbeat)
                    websocket.close(1000, "Connection lifetime exceeded")
                }
            }, CONNECTION_LIFETIME).unref()
        } catch (error) {
            console.error("WebSocket connection error:", error)
            reconnecting = false
            reconnect()
        }
    }

    const reconnect = () => {
        if (reconnecting) return
        reconnecting = true

        clearInterval(heartbeat)
        websocket?.close?.(1000)

        setTimeout(() => {
            reconnecting = false
            start()
        }, 3000)
    }

    start()
}



class Http2Client {
    constructor() {
        this.s = null
        this.p = null
        this.url = "https://canary.discord.com"
        this.headers = {
            Authorization: token,
            "Content-Type": "application/json",
            "User-Agent": "discord/1.0.1134",
            "X-Super-Properties":
                "eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiRGlzY29yZCBDbGllbnQiLCJyZWxlYXNlX2NoYW5uZWwiOiJwdGIiLCJjbGllbnRfdmVyc2lvbiI6IjEuMC4xMTMwIiwib3NfdmVyc2lvbiI6IjEwLjAuMTkwNDUiLCJvc19hcmNoIjoieDY0IiwiYXBwX2FyY2giOiJ4NjQiLCJzeXN0ZW1fbG9jYWxlIjoidHIiLCJoYXNfY2xpZW50X21vZHMiOmZhbHNlLCJicm93c2VyX3VzZXJfYWdlbnQiOiJNb3ppbGxhLzUuMCAoV2luZG93cyBOVCAxMC4wOyBXaW42NDsgeDY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBkaXNjb3JkLzEuMC4xMTMwIENocm9tZS8xMjguMC42NjEzLjE4NiBFbGVjdHJvbi8zMi4yLjcgU2FmYXJpLzUzNy4zNiIsImJyb3dzZXJfdmVyc2lvbiI6IjMyLjIuNyIsIm9zX3Nka192ZXJzaW9uIjoiMTkwNDUiLCJjbGllbnRfYnVpbGRfbnVtYmVyIjozNjY5NTUsIm5hdGl2ZV9idWlsZF9udW1iZXIiOjU4NDYzLCJjbGllbnRfZXZlbnRfc291cmNlIjpudWxsfQ=="
        }
    }

    async c() {
        if (this.s && !this.s.destroyed) return this.s
        if (this.p) return this.p
        return (this.p = new Promise((res, rej) => {
            const s = http2.connect(this.url, {
                settings: {
                    enablePush: false,
                    session: sessionCache.get("canary.discord.com"),
                    handshakeTimeout: 0
                },
                secureContext: tls.createSecureContext({
                    ciphers:
                        "ECDHE-ECDSA-AES128-GCM-SHA256"
                })
            })
            s.once("connect", () => {
                this.s = s
                res(s)
            })
            s.once("error", rej)
            s.once("close", () => (this.s = null))
        }).finally(() => (this.p = null)))
    }

    req(m, p, h = {}, b = null, cb) {
        this.c()
            .then((s) => {
                const r = s.request({":method": m, ":path": p, ...this.headers, ...h})
                const chunks = []
                r.on("data", (d) => chunks.push(d))
                r.on("end", () => cb(null, Buffer.concat(chunks).toString()))
                r.on("error", cb)
                r.end(b ? Buffer.from(b) : undefined)
            })
            .catch(cb)
    }
}

const http2Client = new Http2Client()
async function handleMfa() {
    try {
        const r1 = await new Promise((r, e) =>
                http2Client.req(
                    "PATCH",
                    "/api/v10/guilds/0/vanity-url",
                    {"Content-Type": "application/json"},
                    JSON.stringify({code: ""}),
                    (err, d) => (err ? e(err) : r(d))
                )
            ),
            d = JSON.parse(r1)
        if (d?.code !== 60003 || !d?.mfa?.ticket) return

        const r2 = await new Promise((r, e) =>
                http2Client.req(
                    "POST",
                    "/api/v10/mfa/finish",
                    {"Content-Type": "application/json"},
                    JSON.stringify({
                        ticket: d.mfa.ticket,
                        mfa_type: "password",
                        data: password
                    }),
                    (err, d) => (err ? e(err) : r(d))
                )
            ),
            o = JSON.parse(r2)
        if (o?.token) {
            mfaToken = o.token
            console.log(`[${new Date().toLocaleTimeString()}] MFA OK:`, mfaToken)
        } else console.error("MFA token alınamadı:", o)
    } catch (e) {
        console.error("MFA hatası:", e)
    }
}
connectHTTP2()
handleMfa()
connectTLS(8443)
setInterval(handleMfa, 290000) // 4 dakika 50 saniye
setInterval(() => {
    console.log("Kapatiyorum.......................")
    process.exit(0)
}, 360000)

  if (cluster.isMaster) {
    const cpuCount = os.cpus().length;
    for (let i = 0; i < Math.min(socketCount, cpuCount); i++) {
      cluster.fork();
    }
    cluster.on("exit", (worker, code, signal) => {
      logger.warn(`Worker ${worker.process.pid} died. Restarting...`);
      cluster.fork();
    });
  } else {
    await PromisePool
      .for(Array(socketCount).fill(0))
      .withConcurrency(1)
      .process(async () => {
        connectWebSocket();
      });
  }
