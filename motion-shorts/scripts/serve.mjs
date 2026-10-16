// npm run dev → live preview with play/scrub controls.
import { startServer } from './server.mjs';
const port = Number(process.env.PORT || 5174);
await startServer(port);
console.log(`Preview: http://localhost:${port}/?episode=tristan`);
