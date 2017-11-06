<script>
let lang = 'cn'
// basicInfo
let basicInfoUrl = '/api/admin/basicinfo'
let productClassifyUrl = '/api/admin/product/classify'
let productBannerUrl = '/api/admin/product/banner'

let queryFun = (url) => {
  return {
    method: 'post',
    url: url,
    data: {
      method: 'query',
      data: {
        lang: lang
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
      data.lang = lang
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
