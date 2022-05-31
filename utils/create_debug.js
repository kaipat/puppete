import debug from 'debug';

debug.enable('app:*,random_images:*');

export default function create_debug(name) {
  const dbg = debug(name);
  const error = dbg.extend('error');
  const info = dbg.extend('info');
  const warn = dbg.extend('warn');
  return { error, info, warn };
}