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
  extId,
  clientId,
  refreshToken,
  verbose,
  target = "default",
  zip
}: ChromeOptions) {
  const client = chromeWebstoreUpload({
    extId,
    clientId,
    refreshToken
  });

  if (verbose) {
    console.log(
      getVerboseMessage({
        store,
        message: `Updating extension with ID ${extId}`
      })
    );
  }

  const token = await client.fetchToken();

  const { uploadState, itemError } = await client.uploadExisting({
    readStream: fs.createReadStream(zip),
    token
  });

  if (uploadState === "FAILURE") {
    const errors = itemError.map(({ error_detail }) => error_detail);
    throw new Error(
      getVerboseMessage({
        store,
        message: `Item "${extId}" (${getExtInfo(zip, "name")}):
          ${errors.join("\n")}`,
        prefix: "Error"
      })
    );
  }

  await client.publish({
    target,
    token
  });

  logSuccessfullyPublished({ extId, store, zip });

  return true;
}
