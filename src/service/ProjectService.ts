import * as fs from "fs";
import path = require("path");
import { FileRespDTO } from "../dto/FileRespDTO";

export class ProjectService {

    /**
     * 处理文件到磁盘
     * @param projectPath 项目路径
     * @param files 文件列表
     * @returns 成功的文件列表
     */
    public static processFileToDisk(projectPath: string, files: FileRespDTO[]): FileRespDTO[] {
        const successList: FileRespDTO[] = [];
        for (let index = 0; index < files.length; index++) {
            const fileRespDTO = files[index];
            const filePath = projectPath + "/" + fileRespDTO.path?.replace(/^\//g, '');

            if (fs.existsSync(filePath)) {
                continue
            }
            const dir = path.dirname(filePath)
            fs.mkdirSync(dir, { recursive: true })
            fs.writeFileSync(filePath, fileRespDTO.content);
            successList.push(fileRespDTO)
        }
        return successList;
    }
}