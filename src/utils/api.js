// 统一管理后台api
const prefix = "https://mambahj.com";
const version = "/api/v1";

let makeApi = (url) => {
  return prefix + version + url;
};

export default {
  "login": makeApi("/login"),
  "articles": makeApi("/articles"),
  "fav": makeApi("/favlist")
}
