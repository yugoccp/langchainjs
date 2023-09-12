import snakeCase from "decamelize";
import camelCase from "camelcase";

export interface SerializedFields {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface SerializedKeyAlias {
  [key: string]: string;
}

function getPath(fields: SerializedFields, path: string): unknown {
  const [last, ...rest] = path.split(".");
  let current: SerializedFields = fields;
  for (const part of rest.reverse()) {
    if (!(part in current) || current === undefined) return undefined;
    if (Array.isArray(current[part]))
      throw new Error("Aliasing arrays is not supported");
    current = current[part];
  }
  return current[last];
}

function setPath(fields: SerializedFields, path: string, value: unknown) {
  const [last, ...rest] = path.split(".").reverse();
  let current: SerializedFields = fields;
  for (const part of rest.reverse()) {
    if (!(part in current) || current[part] === undefined) current[part] = {};
    current = current[part];
  }
  current[last] = value;
}

function deletePath(fields: SerializedFields, path: string) {
  const [last, ...rest] = path.split(".").reverse();
  let current: SerializedFields = fields;
  for (const part of rest.reverse()) {
    if (!(part in current) || current[part] === undefined) return;
    current = current[part];
  }
  delete current[last];
}

export function keyToJson(key: string, map?: SerializedKeyAlias): string {
  return map?.[key] || snakeCase(key);
}

export function keyFromJson(key: string, map?: SerializedKeyAlias): string {
  return map?.[key] || camelCase(key);
}

export function mapKeys(
  fields: SerializedFields,
  mapper: typeof keyToJson,
  map?: SerializedKeyAlias
): SerializedFields {
  const mapped: SerializedFields = {};

  for (const key in fields) {
    if (Object.hasOwn(fields, key)) {
      const targetKey = mapper(key, map);
      if (targetKey.includes(".") || key.includes(".")) continue;
      mapped[targetKey] = fields[key];
    }
  }

  const nestedMap = Object.entries(map ?? {}).filter((paths) =>
    paths.some((path) => path.includes("."))
  );
  for (const [source, target] of nestedMap) {
    const value = getPath(fields, source);
    setPath(mapped, target, value);
    deletePath(mapped, source);
  }

  return mapped;
}
