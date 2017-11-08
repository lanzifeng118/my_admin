<script>
const LANG = 'cn'
// basicInfo
let basicInfoUrl = '/api/admin/basicinfo'
let productListUrl = '/api/admin/product/list'
let productClassifyUrl = '/api/admin/product/classify'
let productBannerUrl = '/api/admin/product/banner'

let queryFun = (url) => {
  return {
    method: 'post',
    url: url,
    data: {
      method: 'query',
      data: {
        lang: LANG
      }
    }
  }
}

let api = {
  uploadFile(data) {
    return {
      method: 'post',
      url: '/api/admin/upload',
      headers: {'content-type': 'multipart/form-data'},
      data: data
    }
  },
  basicInfo: {
    query() {
      return queryFun(basicInfoUrl)
    },
    update(data) {
      return {
        method: 'post',
        url: basicInfoUrl,
        data: {
          method: 'update',
          data: data
        }
      }
    }
  },
  // product
  productList: {
    query() {
      return queryFun(productListUrl)
    },
    queryById(id) {
      return {
        method: 'post',
        url: productListUrl,
        data: {
          method: 'queryById',
          data: {
            id: id
          }
        }
      }
    },
    queryByClassify(classify) {
      return {
        method: 'post',
        url: productListUrl,
        data: {
          method: 'queryById',
          data: {
            classify: classify,
            lang: LANG
          }
        }
      }
    },
    insert(data) {
      data.lang = LANG
      return {
        method: 'post',
        url: productListUrl,
        data: {
          method: 'insert',
          data: data
        }
      }
    },
    update(data) {
      return {
        method: 'post',
        url: productListUrl,
        data: {
          method: 'update',
          data: data
        }
      }
    },
    delete(id) {
      return {
        method: 'post',
        url: productListUrl,
        data: {
          method: 'delete',
          data: {
            id: id.toString()
          }
        }
      }
    }
  },
  // productClassify
  productClassify: {
    query() {
      return queryFun(productClassifyUrl)
    },
    queryById(id) {
      return {
        method: 'post',
        url: productClassifyUrl,
        data: {
          method: 'queryById',
          data: {
            id: id
          }
        }
      }
    },
    delete(id) {
      return {
        method: 'post',
        url: productClassifyUrl,
        data: {
          method: 'delete',
          data: {
            id: id.toString()
          }
        }
      }
    },
    insert(data) {
      data.lang = LANG
      return {
        method: 'post',
        url: productClassifyUrl,
        data: {
          method: 'insert',
          data: data
        }
      }
    },
    update(data) {
      return {
        method: 'post',
        url: productClassifyUrl,
        data: {
          method: 'update',
          data: data
        }
      }
    }
  },
  // productBannerUrl
  productBanner: {
    query() {
      return queryFun(productBannerUrl)
    },
    update(data) {
      return {
        method: 'post',
        url: productBannerUrl,
        data: {
          method: 'update',
          data: data
        }
      }
    }
  }
}
export default api
</script>
