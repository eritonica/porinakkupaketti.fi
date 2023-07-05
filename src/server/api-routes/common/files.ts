import { ErrorHandler } from '../../core/errors';
import { createRouter } from '../../core/server';
import { confirmGroupPermission, confirmPermission, getGroup } from '../../lib/access/groups';
import { confirmToken } from '../../lib/access/sessions';
import { createFile, deleteFile, listFilesByGroup, listFilesByAuthor } from '../../lib/common/files';
import { FilesDTO } from '../../lib/schemas/filesSchema';

const filesRouter = createRouter();

filesRouter.Post('/api/files', async (req, res) => {
  try {
    const { account } = await confirmToken(req.headers.authorization);
    const { group } = await confirmPermission(account, 'WRITE');

    for (const key in req.files) {
      const files = req.files[key];
      if (Array.isArray(files)) {
        for (const file of files) {
          const dbFile: FilesDTO = {
            group: group._id,
            author: account._id,
            domain: req.headers.host,
            filepath: file.filepath,
            newFilename: file.newFilename,
            originalFilename: file.originalFilename,
          };
          await createFile(account, group, dbFile);
        }
      }
    }
    return res.status(200).json({ result: 'success', files: req.files });
  } catch (error) {
    return res.status(500).json(ErrorHandler(error));
  }
});

filesRouter.Get('/api/files/group/:groupId', async (req, res) => {
  try {
    const { account } = await confirmToken(req.headers.authorization);
    const { group } = await getGroup(req.params?.['groupId']);
    const { result } = await confirmGroupPermission('READ', group, account);
    if (result !== "success") {
      return res.status(500).json({ result: 'error', message: "No permission" });
    }
    const files = await listFilesByGroup(group);
    return res.status(200).json(files);
  } catch (error) {
    return res.status(500).json(ErrorHandler(error));
  }
});

filesRouter.Get('/api/files/author/', async (req, res) => {
  try {
    const { account } = await confirmToken(req.headers.authorization);
    const files = await listFilesByAuthor(account);
    return res.status(200).json(files);
  } catch (error) {
    return res.status(500).json(ErrorHandler(error));
  }
});

filesRouter.Delete('/api/files/:fileId', async (req, res) => {
  try {
    const { account } = await confirmToken(req.headers.authorization);
    const { group } = await getGroup(req.params?.['groupId']);
    const { result } = await confirmGroupPermission('READ', group, account);
    if (result !== "success") {
      return res.status(500).json({ result: 'error', message: "No permission" });
    }
    await deleteFile(req.params?.['fileId']);
    return res.status(200).json({ result: 'success', message: 'File deleted successfully.' });
  } catch (error) {
    return res.status(500).json(ErrorHandler(error));
  }
});

export { 
  filesRouter 
};
