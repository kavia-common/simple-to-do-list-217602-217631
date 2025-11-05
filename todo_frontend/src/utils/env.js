const cache = {};

/**
 * PUBLIC_INTERFACE
 * Reads a single environment variable (CRA style: REACT_APP_*)
 */
export function getEnv(name, fallback = '') {
  /** This is a public function. */
  if (cache[name] !== undefined) return cache[name];
  const value = process.env?.[name];
  cache[name] = value ?? fallback ?? '';
  return cache[name];
}

/**
 * PUBLIC_INTERFACE
 * Reads multiple env vars and returns an object map
 */
export function getEnvMap(names = []) {
  /** This is a public function. */
  return names.reduce((acc, n) => {
    acc[n] = getEnv(n, '');
    return acc;
  }, {});
}
