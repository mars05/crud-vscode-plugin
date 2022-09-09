import request from '@/utils/request'

export function list(data) {
  return request({
    url: '/api/crud-admin/marketplace/list',
    method: 'post',
    data
  })
}
export function get(id) {
  return request({
    url: '/api/crud-admin/marketplace/get',
    method: 'get',
    params: { id }
  })
}
export function getByToken(accessToken) {
  return request({
    url: '/api/crud-admin/plugin/getTemplate',
    method: 'get',
    params: { accessToken }
  })
}
export function getTablesByDdl(data) {
  return request({
    url: '/api/crud-admin/plugin/getTablesByDdl',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data
  })
}
export function generateProject(data) {
  return request({
    url: '/api/crud-admin/plugin/generateProject',
    method: 'post',
    data
  })
}
export function generateCode(data) {
  return request({
    url: '/api/crud-admin/plugin/generateCode',
    method: 'post',
    data
  })
}