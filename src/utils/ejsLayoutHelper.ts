import ejs from 'ejs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const ejsHelper = async (template: string, templateData = {}, layout = false): Promise<string> => {
  let resultTemplate;
  const rootDir = path.join(__dirname, '../templates');
  const data = {
    appName: process.env.APP_NAME,
    appUrl: process.env.APP_URL,
    appLogo: process.env.APP_LOGO,
    appIcon: process.env.APP_ICON,
    ...process.env,
    body: {},
    filesDir: [''],
    ...templateData,
  };
  const customLayoutDir = !layout
    ? `${rootDir}/layouts/default.ejs`
    : `${rootDir}/layouts/${layout}.ejs`;
  const templateDir = `${rootDir}/mails/${template}.ejs`;
  if (!layout) {
    try {
      const customLayoutString = ejs.fileLoader(customLayoutDir).toString();
      const [top, bottom] = customLayoutString.split(/<%-[ ]*body[ ]*%>/);
      const bodyTemplate = ejs.fileLoader(templateDir);
      resultTemplate = [top, bodyTemplate, bottom].join('');
    } catch (err) {
      console.error(err);
    }
  }
  const result = await ejs.render(resultTemplate, data, { root: rootDir });
  return result;
};

export default ejsHelper;
