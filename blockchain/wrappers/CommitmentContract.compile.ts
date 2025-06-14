import { CompilerConfig } from "@ton/blueprint";

export const compile: CompilerConfig = {
    targets: ["contracts/commitment.fc", "contracts/imports/stdlib.fc", "contracts/imports/utils.fc"]
}