import worker,{initialize,session,sql} from '../vercel-server/worker.mjs';
import {createTransport,streamResponse} from '../vercel/transport.mjs';
const handle=createTransport({worker,initialize,session,sql});
export default {async fetch(request){return streamResponse(await handle(request,process.env));}};
