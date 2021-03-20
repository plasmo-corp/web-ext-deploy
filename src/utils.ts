import * as fs from "fs";
import * as path from "path";
import { Page } from "puppeteer";
import zipper from "zip-local";

export function getFullPath(file: string): string {
  return path.resolve(process.cwd(), file);
}

export function getIsFileExists(file: string): boolean {
  return fs.existsSync(getFullPath(file));
}

export function isObjectEmpty(object: object) {
  return Object.keys(object).length === 0;
}

export function getCorrectZip(zip: string): string {
  const { version } = JSON.parse(fs.readFileSync("package.json").toString());
  return zip.replace("{version}", version);
}

export function getExtVersion(zip: string) {
  const unzippedFs = zipper.sync.unzip(zip).memory();
  const manifest = unzippedFs.read("manifest.json", "text");
  const { version } = JSON.parse(manifest);
  return version;
}

export async function disableImages(page: Page) {
  await page.setRequestInterception(true);
  page.on("request", request => {
    if (request.resourceType() === "image") {
      request.abort();
      return;
    }
    request.continue();
  });
}

export async function getExistingElementSelector(
  page: Page,
  selectors: string[]
): Promise<string> {
  const promises = selectors.map(selector => page.waitForSelector(selector));
  const {
    // @ts-ignore
    _remoteObject: { description }
  } = await Promise.race(promises);
  return description;
}

const gStepCounters = {};

export function getVerboseMessage({
  message,
  prefix,
  store
}: {
  message: string;
  prefix?: string;
  store: string;
}): string {
  gStepCounters[store] = 1 + (gStepCounters?.[store] ?? 0);
  let msg = `${store}: Step ${gStepCounters[store]}) ${message}`;
  if (prefix !== "Error") {
    prefix = prefix || "Info";
    msg = `${prefix} ${msg}`;
  }
  if (prefix === "Info") {
    msg = msg.trim();
  } else if (prefix === "Error") {
    msg = msg.trimLeft();
  }
  return msg;
}
