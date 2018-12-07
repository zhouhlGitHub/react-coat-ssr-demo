import {RedirectError} from "common/Errors";
import {checkFastRedirect, parseQuery} from "common/routers";
import {ModuleGetter} from "modules";
import {ModuleNames} from "modules/names";
import {renderApp} from "react-coat";

export default function render(path: string) {
  getInitEnv(global, process.env.NODE_ENV !== "production");
  const redirect = checkFastRedirect(path);
  if (redirect) {
    throw new RedirectError(redirect.code, redirect.url);
  } else {
    return renderApp(ModuleGetter, ModuleNames.app, [path], {queryParser: parseQuery});
  }
}
