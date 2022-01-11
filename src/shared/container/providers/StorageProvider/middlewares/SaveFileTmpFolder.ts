import { FileUpload } from 'graphql-upload';
import { createWriteStream } from 'fs';
import { v4 } from 'uuid';
import uploadConfig from '../../../../../config/upload';

class SaveFileToTmpFolder {
  public async execute(file: FileUpload): Promise<string> {
    const filename = `${v4()}.${file.mimetype.split('/')[1]}`;
    await new Promise(res => {
      file
        .createReadStream()
        .pipe(createWriteStream(`${uploadConfig.tmpFolder}/${filename}`))
        .on('close', res);
    });
    return filename;
  }
}
export default SaveFileToTmpFolder;
