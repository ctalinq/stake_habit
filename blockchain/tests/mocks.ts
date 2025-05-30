const char = "😊"; // 4-byte symbol UTF-32
export const validDescription = char.repeat(1000);
export const tooLongDescription = validDescription + "x"
