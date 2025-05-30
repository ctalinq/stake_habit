import { CompilerConfig } from "@ton/blueprint";

export const compile: CompilerConfig = {
    targets: ["contracts/commiter.fc", "contracts/imports/stdlib.fc", "contracts/imports/utils.fc"]
}