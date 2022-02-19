import { chromeWebstoreUpload } from "@plasmo-corp/cwu";
import fs from "fs";
import {
  getExtInfo,
  getVerboseMessage,
  logSuccessfullyPublished
} from "../../utils.js";
import { ChromeOptions } from "./chrome-input.js";

const store = "Chrome";

export async function deployToChrome({
  extId: extensionId,
  clientId,
  refreshToken,
  clientSecret,
  verbose,
  zip
}: ChromeOptions): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    const client = chromeWebstoreUpload({
      extensionId,
      clientId,
      refreshToken,
      clientSecret
    });

    if (verbose) {
      console.log(
        getVerboseMessage({
          store,
          message: `Updating extension with ID ${extensionId}`
        })
      );
    }

    const { uploadState, itemError } = await client.uploadExisting(
      fs.createReadStream(zip)
    );

    if (uploadState === "FAILURE") {
      const errors = itemError.map(({ error_detail }) => error_detail);
      reject(
        getVerboseMessage({
          store,
          message: `Item "${extensionId}" (${getExtInfo(zip, "name")}):
          ${errors.join("\n")}`,
          prefix: "Error"
        })
      );
      return;
    }

    await client.publish();

    logSuccessfullyPublished({ extId: extensionId, store, zip });

    resolve(true);
  });
}
