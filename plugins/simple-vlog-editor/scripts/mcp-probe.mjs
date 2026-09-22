/**
 * A minimal MCP client for checking the launcher from the outside, exactly as
 * an AI client would see it: a child process speaking JSON-RPC over stdio.
 * Used by the doctor. Every line that is not a JSON-RPC message is recorded,
 * because a single stray log line on stdout is enough to break a real client.
 */

import { spawn } from 'node:child_process';

export function startProbe(options) {
  const child = spawn(options.command || process.execPath, options.args, {
    cwd: options.cwd,
    env: options.env || process.env,
    stdio: ['pipe', 'pipe', 'pipe'],
    windowsHide: true,
    shell: false
  });
  let sequence = 0;
  let buffer = '';
  let stderr = '';
  const contamination = [];
  const pending = new Map();
  const exited = new Promise((resolve) => child.once('exit', (code, signal) => resolve({ code, signal })));

  child.stdout.setEncoding('utf8');
  child.stdout.on('data', (chunk) => {
    buffer += chunk;
    let at;
    while ((at = buffer.indexOf('\n')) >= 0) {
      const line = buffer.slice(0, at).replace(/\r$/, '');
      buffer = buffer.slice(at + 1);
      if (!line.trim()) continue;
      let message;
      try { message = JSON.parse(line); } catch { contamination.push(line); continue; }
      if (message?.jsonrpc !== '2.0') { contamination.push(line); continue; }
      const waiter = pending.get(message.id);
      if (!waiter) continue;
      pending.delete(message.id);
      clearTimeout(waiter.timer);
      if (message.error) waiter.reject(Object.assign(new Error(message.error.message), { rpc: message.error }));
      else waiter.resolve(message.result);
    }
  });
  child.stderr.setEncoding('utf8');
  child.stderr.on('data', (chunk) => { if (stderr.length < 200_000) stderr += chunk; });
  child.stdin.on('error', () => {});

  const request = (method, params = {}, timeoutMs = options.timeoutMs || 120_000) => new Promise((resolve, reject) => {
    const id = ++sequence;
    const timer = setTimeout(() => { pending.delete(id); reject(new Error(`${method} timed out after ${timeoutMs} ms`)); }, timeoutMs);
    pending.set(id, { resolve, reject, timer });
    child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n');
  });
  const notify = (method, params) => child.stdin.write(JSON.stringify({ jsonrpc: '2.0', method, ...(params ? { params } : {}) }) + '\n');
  const tool = async (name, args = {}, timeoutMs) => {
    const result = await request('tools/call', { name, arguments: args }, timeoutMs);
    if (result?.isError) throw Object.assign(new Error(result.content?.[0]?.text || `${name} failed`), { result });
    return result?.structuredContent ?? result;
  };
  const initialize = async () => {
    const result = await request('initialize', { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'simple-vlog-editor-doctor', version: '1' } });
    notify('notifications/initialized');
    return result;
  };
  const close = async (timeoutMs = 15_000) => {
    child.stdin.end();
    const outcome = await Promise.race([exited, new Promise((resolve) => setTimeout(() => resolve(null), timeoutMs))]);
    if (!outcome) { child.kill(); return { code: null, timedOut: true }; }
    return outcome;
  };
  return { child, request, notify, tool, initialize, close, exited, contamination, stderr: () => stderr };
}

/** True while a process with this id exists. */
export function processAlive(pid) {
  if (!pid) return false;
  try { process.kill(pid, 0); return true; } catch (error) { return error.code === 'EPERM'; }
}
