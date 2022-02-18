import { getCorrectZip, getFullPath, getIsFileExists } from "../../utils.js";
import deployToOpera from "./opera-deploy.js";

export class OperaOptions {
  /** The `sessionid` cookie to login to the publisher's account. If you have a hard time obtaining it, run: `web-ext-deploy --get-cookies=opera` */
  sessionid: string;

  /** The `csrftoken` cookie to upload the ZIP. If you have a hard time obtaining it, run: `web-ext-deploy --get-cookies=opera` */
  csrftoken: string;

  /** The extension ID. E.g. `https://addons.opera.com/developer/package/PACKAGE_ID` */
  packageId: number;

  /**
   * The path to the ZIP, relative from the current working directory (`process.cwd()`)<br>
   * You can use `{version}`, which will be replaced by the `version` entry from your `package.json`, e.g. `some-zip-v{version}.zip`
   */
  zip: string;

  /**
   * A description of the changes in this version, compared to the previous one.<br>
   * It's recommended to use instead `--opera-changelog` , so it stays up to date.
   */
  changelog?: string;

  /** If `true`, every step of uploading to the Opera Add-ons will be logged to the console. */
  verbose?: boolean;

  constructor(options) {
    if (!options.packageId) {
      throw new Error(
        getErrorMessage(
          "No package ID is provided, e.g. https://addons.opera.com/developer/package/PACKAGE_ID"
        )
      );
    }

    if (!options.sessionid) {
      throw new Error(
        getErrorMessage(
          `No "sessionid" is provided. If you have a hard time obtaining it, run:
web-ext-deploy --get-cookies=opera`
        )
      );
    }

    if (!options.csrftoken) {
      throw new Error(
        getErrorMessage(
          `No "csrftoken" is provided. If you have a hard time obtaining it, run:
web-ext-deploy --get-cookies=opera`
        )
      );
    }

    // Zip checking
    if (!options.zip) {
      throw new Error(getErrorMessage("No zip is provided"));
    }

    if (!getIsFileExists(options.zip)) {
      throw new Error(
        getErrorMessage(`Zip doesn't exist: ${getFullPath(options.zip)}`)
      );
    }
  }
}

function getErrorMessage(message: string): string {
  return `Opera: ${message}`;
}

export async function prepareToDeployOpera(
  options: OperaOptions
): Promise<boolean> {
  options.zip = getCorrectZip(options.zip);

  if (options.changelog) {
    options.changelog = options.changelog.replace(/\/\/n/g, "\n");
  }

  // Validate the options
  new OperaOptions(options);
  return deployToOpera(options);
}
