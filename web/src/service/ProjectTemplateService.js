import * as projectTemplateDao from '@/dao/ProjectTemplateDao'

export function create(projectTemplate) {
    //校验
    if (projectTemplateDao.selectList().filter(projectTemplateDO =>
        projectTemplateDO.id == projectTemplate.id).length > 0) {
        throw new Error("模板已存在");
    }
    //新增
    projectTemplateDao.insert(projectTemplate);
}
export function list() {
    return projectTemplateDao.selectList();
}
export function detail(id) {
    const obj = projectTemplateDao.selectById(id);
    if (!obj) {
        throw new Error("项目模板不存在")
    }
    return obj;
}

export function update(projectTemplate) {
    //校验
    const oldDO = projectTemplateDao.selectById(projectTemplate.id);
    if (!oldDO) {
        throw new Error("项目模板不存在")
    }
    //修改
    projectTemplateDao.updateById(projectTemplate);
}

export function del(id) {
    projectTemplateDao.deleteById(id);
}