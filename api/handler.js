import worker from '../vercel-server/worker.mjs';
// Preserve the existing Fetch API, session cookies, encryption and Turso storage.
export default {fetch(request){return worker.fetch(request,process.env);}};
