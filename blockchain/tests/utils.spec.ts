import { describe, expect, it } from "vitest";
import {
  generateRecipientsKeyList,
  parseRecipientKeyList,
} from "../wrappers/utils";

describe("wrappers utils tests", () => {
  it("should create chain of keys and parse it back", () => {
    const initialKeys = ["key_number_1", "key_number_2", "key_number_323123"];

    const recepientKeysCell = generateRecipientsKeyList(initialKeys);
    const parsedKeys = parseRecipientKeyList(recepientKeysCell);

    expect(parsedKeys).toEqual(initialKeys);
  });
});
