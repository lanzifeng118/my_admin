<script>
const LANG = 'en'
let userUrl = '/api/admin/users'
let basicInfoUrl = '/api/admin/basicinfo'
let bannerUrl = '/api/admin/banner'
let productListUrl = '/api/admin/product/list'
let productClassifyUrl = '/api/admin/product/classify'
let productBannerUrl = '/api/admin/product/banner'
let productVideoUrl = '/api/admin/video'
let aboutusUrl = '/api/admin/aboutus'
let aboutusBannerUrl = '/api/admin/aboutus/banner'
let experienceListUrl = '/api/admin/experience/list'
let experienceClassifyUrl = '/api/admin/experience/classify'
let experienceBannerUrl = '/api/admin/experience/banner'
let friendlinkUrl = '/api/admin/friendlink'
let supportUrl = '/api/admin/support'
let supportBannerUrl = '/api/admin/support/banner'
let supportClassifyUrl = '/api/admin/support/classify'
let newsListUrl = '/api/admin/news/list'
let newsClassifyUrl = '/api/admin/news/classify'
let newsBannerUrl = '/api/admin/news/banner'

let queryFun = (url, pageData) => {
  let data = {
    lang: LANG
  }
  if (pageData) {
    for (var key in pageData) {
      data[key] = pageData[key]
    }
  }
  return {
    method: 'post',
    url: url,
    data: {
      method: 'query',
      data: data
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
let updateForDisplayFun = (url, data) => {
  return {
    method: 'post',
    url: url,
    data: {
      method: 'updateForDisplay',
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
  user: {
    query(data) {
      return queryFun(userUrl)
    },
    update(data) {
      return updateFun(userUrl, data)
    },
    updateByPassword(data) {
      return {
        method: 'post',
        url: userUrl,
        data: {
          method: 'updateByPassword',
          data: data
        }
      }
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
  banner: {
    query() {
      return queryFun(bannerUrl)
    },
    queryById(id) {
      return queryByIdFun(bannerUrl, id)
    },
    insert(data) {
      return insertFun(bannerUrl, data)
    },
    update(data) {
      return updateFun(bannerUrl, data)
    },
    updateForDisplay(data) {
      return updateForDisplayFun(bannerUrl, data)
    },
    delete(id) {
      return deleteFun(bannerUrl, id)
    }
  },
  // product
  productList: {
    query(pageData) {
      return queryFun(productListUrl, pageData)
    },
    queryById(id) {
      return queryByIdFun(productListUrl, id)
    },
    queryByClassify(classify) {
      return queryByClassifyFun(productListUrl, classify)
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
  },
  // aboutusBannerUrl
  aboutusBanner: {
    query() {
      return queryFun(aboutusBannerUrl)
    },
    update(data) {
      return updateFun(aboutusBannerUrl, data)
    }
  },
  // experience
  experienceList: {
    query() {
      return queryFun(experienceListUrl)
    },
    queryById(id) {
      return queryByIdFun(experienceListUrl, id)
    },
    insert(data) {
      return insertFun(experienceListUrl, data)
    },
    update(data) {
      return updateFun(experienceListUrl, data)
    },
    delete(id) {
      return deleteFun(experienceListUrl, id)
    }
  },
  // experienceClassify
  experienceClassify: {
    query() {
      return queryFun(experienceClassifyUrl)
    },
    queryById(id) {
      return queryByIdFun(experienceClassifyUrl, id)
    },
    delete(id) {
      return deleteFun(experienceClassifyUrl, id)
    },
    insert(data) {
      return insertFun(experienceClassifyUrl, data)
    },
    update(data) {
      return updateFun(experienceClassifyUrl, data)
    }
  },
  // experienceBannerUrl
  experienceBanner: {
    query() {
      return queryFun(experienceBannerUrl)
    },
    update(data) {
      return updateFun(experienceBannerUrl, data)
    }
  },
  // friendlink
  friendlink: {
    query() {
      return queryFun(friendlinkUrl)
    },
    queryById(id) {
      return queryByIdFun(friendlinkUrl, id)
    },
    delete(id) {
      return deleteFun(friendlinkUrl, id)
    },
    insert(data) {
      return insertFun(friendlinkUrl, data)
    },
    update(data) {
      return updateFun(friendlinkUrl, data)
    }
  },
  // support
  support: {
    query() {
      return queryFun(supportUrl)
    },
    queryById(id) {
      return queryByIdFun(supportUrl, id)
    },
    update(data) {
      return updateFun(supportUrl, data)
    },
    delete(id) {
      return deleteFun(supportUrl, id)
    }
  },
  // supportBannerUrl
  supportBanner: {
    query() {
      return queryFun(supportBannerUrl)
    },
    update(data) {
      return updateFun(supportBannerUrl, data)
    }
  },
  // supportClassify
  supportClassify: {
    query() {
      return queryFun(supportClassifyUrl)
    },
    queryById(id) {
      return queryByIdFun(supportClassifyUrl, id)
    },
    delete(id) {
      return deleteFun(supportClassifyUrl, id)
    },
    insert(data) {
      return insertFun(supportClassifyUrl, data)
    },
    update(data) {
      return updateFun(supportClassifyUrl, data)
    }
  },
  // news
  newsList: {
    query(pageData) {
      return queryFun(newsListUrl, pageData)
    },
    queryById(id) {
      return queryByIdFun(newsListUrl, id)
    },
    queryByClassify(classify) {
      return queryByClassifyFun(newsListUrl, classify)
    },
    insert(data) {
      return insertFun(newsListUrl, data)
    },
    update(data) {
      return updateFun(newsListUrl, data)
    },
    delete(id) {
      return deleteFun(newsListUrl, id)
    }
  },
  // newsClassify
  newsClassify: {
    query() {
      return queryFun(newsClassifyUrl)
    },
    queryById(id) {
      return queryByIdFun(newsClassifyUrl, id)
    },
    delete(id) {
      return deleteFun(newsClassifyUrl, id)
    },
    insert(data) {
      return insertFun(newsClassifyUrl, data)
    },
    update(data) {
      return updateFun(newsClassifyUrl, data)
    }
  },
  // newBannerUrl
  newsBanner: {
    query() {
      return queryFun(newsBannerUrl)
    },
    update(data) {
      return updateFun(newsBannerUrl, data)
    }
  }
}
export default api
</script>
