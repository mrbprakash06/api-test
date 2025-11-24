import { createSign } from "node:crypto";

export function sign(data: string, privateKey: string) {
  const s = createSign("RSA-SHA256");
  s.update(data);

  return s.sign(privateKey, "base64");
}
