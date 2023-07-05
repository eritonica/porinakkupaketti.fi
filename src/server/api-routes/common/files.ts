import { ErrorHandler } from '../../core/errors';
import { createRouter } from '../../core/server';
import { confirmPermission } from '../../lib/access/groups';
import { confirmToken } from '../../lib/access/sessions';
import { createFile } from '../../lib/common/files';
import { FilesDTO } from '../../lib/schemas/filesSchema';

const filesRouter = createRouter();

filesRouter.Post('/api/files', async (req, res) => {

  try {
    const { account } = await confirmToken(req.headers.authorization);
    const { group } = await confirmPermission(account, "WRITE");
    console.log(req.files);
    for(const key in req.files) {
      const files = req.files[key];
      if (Array.isArray(files)) {
        for(const file of files) {
          const dbFile: FilesDTO = {
            group: group._id,
            author: account._id,
            domain: req.headers.host,
            filepath: file.filepath,
            newFilename: file.newFilename,
            originalFilename: file.originalFilename
          }
          console.log(dbFile);
          await createFile(account, group, dbFile);
        }
      }
      
    }
    return res.status(200).json({ result: "success", files: req.files });
  } catch (error) {
    return res.status(500).json(ErrorHandler(error));
  }
});

export {
  filesRouter,
}