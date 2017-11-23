<script>
const LANG = 'cn'
// basicInfo
let basicInfoUrl = '/api/admin/basicinfo'
let productListUrl = '/api/admin/product/list'
let productClassifyUrl = '/api/admin/product/classify'
let productBannerUrl = '/api/admin/product/banner'
let productVideoUrl = 'api/admin/video'
let aboutusUrl = 'api/admin/aboutus'

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
let queryByIdFun = (url, id) => {
  return {
    method: 'post',
    url: url,
    data: {
      method: 'queryById',
      data: {
        id: id
      }
    }
  }
}
let queryByClassifyFun = (url, classify) => {
  return {
    method: 'post',
    url: url,
    data: {
      method: 'queryByClassify',
      data: {
        classify: classify,
        lang: LANG
      }
    }
  }
}
let updateFun = (url, data) => {
  return {
    method: 'post',
    url: url,
    data: {
      method: 'update',
      data: data
    }
  }
}
let deleteFun = (url, ids) => {
  return {
    method: 'post',
    url: url,
    data: {
      method: 'delete',
      data: {
        ids: ids.toString()
      }
    }
  }
}
let insertFun = (url, data) => {
  data.lang = LANG
  return {
    method: 'post',
    url: url,
    data: {
      method: 'insert',
      data: data
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
      return updateFun(basicInfoUrl, data)
    }
  },
  // product
  productList: {
    query() {
      return queryFun(productListUrl)
    },
    queryById(id) {
      return queryByIdFun(productListUrl, id)
    },
    queryByClassify(classify) {
      return queryByClassifyFun(productListUrl, classify)
    },
    queryBySearch(keyword, classify) {
      return {
        method: 'post',
        url: productListUrl,
        data: {
          method: 'queryBySearch',
          data: {
            name: keyword,
            classify: classify,
            lang: LANG
          }
        }
      }
    },
    insert(data) {
      return insertFun(productListUrl, data)
    },
    update(data) {
      return updateFun(productListUrl, data)
    },
    delete(id) {
      return deleteFun(productListUrl, id)
    }
  },
  // productClassify
  productClassify: {
    query() {
      return queryFun(productClassifyUrl)
    },
    queryById(id) {
      return queryByIdFun(productClassifyUrl, id)
    },
    delete(id) {
      return deleteFun(productClassifyUrl, id)
    },
    insert(data) {
      return insertFun(productClassifyUrl, data)
    },
    update(data) {
      return updateFun(productClassifyUrl, data)
    }
  },
  // productBannerUrl
  productBanner: {
    query() {
      return queryFun(productBannerUrl)
    },
    update(data) {
      return updateFun(productBannerUrl, data)
    }
  },
  // productVideo
  productVideo: {
    query() {
      return queryFun(productVideoUrl)
    },
    queryById(id) {
      return queryByIdFun(productVideoUrl, id)
    },
    queryByClassify(classify) {
      return queryByClassifyFun(productVideoUrl, classify)
    },
    delete(id) {
      return deleteFun(productVideoUrl, id)
    },
    insert(data) {
      return insertFun(productVideoUrl, data)
    },
    update(data) {
      return updateFun(productVideoUrl, data)
    }
  },
  // aboutus
  aboutus: {
    query() {
      return queryFun(aboutusUrl)
    },
    queryById(id) {
      return queryByIdFun(aboutusUrl, id)
    },
    delete(id) {
      return deleteFun(aboutusUrl, id)
    },
    insert(data) {
      return insertFun(aboutusUrl, data)
    },
    update(data) {
      return updateFun(aboutusUrl, data)
    }
  }
}
export default api
</script>
