// Convert a CamelCase string to kebab-case
export default (string: string): string =>
  string.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
