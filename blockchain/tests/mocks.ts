import {toNano} from "@ton/core";

const char = "😊"; // 4-byte symbol UTF-32
export const validDescription = char.repeat(1000);
export const tooLongDescription = validDescription + "x"

export const validTitle = char.repeat(40);
export const emptyTitle = ""
export const tooLongTitle = validTitle + "x"

const now = Math.floor(Date.now() / 1000);

//tomorrow
export const validMinimumDate = now + 24 * 60 * 60;
export const validDueDate = now + 2 * 24 * 60 * 60;
//90 days
export const validMaximumDate = now + 90 * 24 * 60 * 60;
//less than tomorrow
export const tooEarlyDueDate = now + 3 * 60 * 60;
//less than 90 days
export const tooLateDueDate = now + 91 * 24 * 60 * 60;

export const validStake = toNano("10")
export const notEnoughStake = toNano("2.99")
export const tooManyStake = toNano("100.1")
