import type { Options, PublishTarget } from "@plasmo-corp/cwu";
import { getCorrectZip, getFullPath, getIsFileExists } from "../../utils.js";
import { deployToChrome } from "./chrome-deploy.js";

export type ChromeOptions = {
  target?: PublishTarget;

  /**
   * The path to the ZIP, relative from the current working directory (`process.cwd()`)<br>
   * You can use `{version}`, which will be replaced by the `version` entry from your `package.json`, e.g. `some-zip-v{version}.zip`
   */
  zip: string;

  /** If `true`, it will be logged to the console when the uploading has begun. */
  verbose?: boolean;
} & Options;

function getErrorMessage(message: string): string {
  return `Chrome: ${message}`;
}

function validateOptions(options: ChromeOptions): void {
  if (!options.extId) {
    throw new Error(
      getErrorMessage(
        "No extension ID was provided, e.g. https://chrome.google.com/webstore/detail/EXT_ID"
      )
    );
  }

  if (!options.refreshToken) {
    throw new Error(
      getErrorMessage(
        "No refresh token was provided. To get one: https://github.com/fregante/chrome-webstore-upload/blob/main/How%20to%20generate%20Google%20API%20keys.md"
      )
    );
  }

  if (!options.clientId) {
    throw new Error(
      getErrorMessage(
        "No client ID was provided. To get one: https://github.com/fregante/chrome-webstore-upload/blob/main/How%20to%20generate%20Google%20API%20keys.md"
      )
    );
  }

  // Zip checking
  if (!options.zip) {
    throw new Error(getErrorMessage("No zip was provided"));
  }

  if (!getIsFileExists(options.zip)) {
    throw new Error(
      getErrorMessage(`Zip doesn't exist: ${getFullPath(options.zip)}`)
    );
  }
}

export async function prepareToDeployChrome(
  options: ChromeOptions
): Promise<boolean> {
  options.zip = getCorrectZip(options.zip);

  validateOptions(options);

  return deployToChrome(options);
}
