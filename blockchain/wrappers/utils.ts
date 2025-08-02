import { beginCell, Cell } from "@ton/core";
import { getSecureRandomBytes } from "@ton/crypto";

export async function generateRecipientsKeys(
  recipientIds: string[]
): Promise<string[]> {
  let keys: string[] = [];
  for (let i = recipientIds.length - 1; i >= 0; i--) {
    const randomBytes = await getSecureRandomBytes(16);
    keys.push(`${recipientIds[i]}_${randomBytes.toString("hex")}`);
  }

  return keys;
}

export function generateRecipientsKeyList(recipientKeys: string[]): Cell {
  let nextCell: Cell | null = null;
  for (let i = recipientKeys.length - 1; i >= 0; i--) {
    const builder = beginCell();
    builder.storeStringTail(recipientKeys[i]);

    if (nextCell) {
      builder.storeRef(nextCell);
    }
    nextCell = builder.endCell();
  }

  return nextCell!;
}

function hexToString(hex: string): string {
  const hexPairs = hex.match(/.{1,2}/g);
  if (!hexPairs) return "";

  const str = hexPairs
    .map((byte) => String.fromCharCode(parseInt(byte, 16)))
    .join("");
  return str;
}

export function parseRecipientKeyList(cell: Cell): string[] {
  const result: string[] = [];
  let currentCell: Cell | null = cell;

  while (currentCell) {
    const slice = currentCell.beginParse().clone();
    const bits = slice.loadBits(slice.remainingBits).toString();
    result.push(hexToString(bits));

    if (currentCell.refs.length > 0)
      currentCell = currentCell.beginParse().clone().loadRef();
    else currentCell = null;
  }

  return result;
}
