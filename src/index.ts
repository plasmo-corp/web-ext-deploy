import {
  ChromeOptions,
  prepareToDeployChrome
} from "./stores/chrome/chrome-input";
import { EdgeOptions, prepareToDeployEdge } from "./stores/edge/edge-input";
import {
  FirefoxOptions,
  prepareToDeployFirefox
} from "./stores/firefox/firefox-input";
import { OperaOptions, prepareToDeployOpera } from "./stores/opera/opera-input";

export { OperaOptions, FirefoxOptions, EdgeOptions, ChromeOptions };

export async function deployChrome(options: ChromeOptions): Promise<boolean> {
  return prepareToDeployChrome(options);
}

export async function deployFirefox(options: FirefoxOptions): Promise<boolean> {
  return prepareToDeployFirefox(options);
}

export async function deployEdge(options: EdgeOptions): Promise<boolean> {
  return prepareToDeployEdge(options);
}

export async function deployOpera(options: OperaOptions): Promise<boolean> {
  return prepareToDeployOpera(options);
}
