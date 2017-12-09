import Vue from 'vue'
import Router from 'vue-router'
import Login from 'components/p-login/login'
import ErrorPage from 'components/p-error/error'
import Admin from 'components/p-admin/admin'
import Home from 'components/p-home/home'
import BasicInfo from 'components/p-home/basicInfo/basicInfo'
import BasicInfoEn from 'components/p-home/basicInfo-en/basicInfo-en'
import BasicInfoEdit from 'components/p-home/basicInfoEdit/basicInfoEdit'
import BasicInfoEnEdit from 'components/p-home/basicInfoEnEdit/basicInfoEnEdit'
// product
import Product from 'components/p-product/product'
import ProductList from 'components/p-product/list/list'
import ProductListEn from 'components/p-product/list-en/list'
import ProductEdit from 'components/p-product/edit/edit'
import ProductEditEn from 'components/p-product/edit-en/edit'
import ProductClassify from 'components/p-product/classify/classify'
import ProductClassifyEn from 'components/p-product/classify-en/classify'
import ProductClassifyEdit from 'components/p-product/classify-edit/classify-edit'
import ProductClassifyEditEn from 'components/p-product/classify-edit-en/classify-edit'
import ProductVideo from 'components/p-product/video/video'
import ProductVideoEn from 'components/p-product/video-en/video'
import ProductVideoEdit from 'components/p-product/video-edit/video-edit'
import ProductVideoEditEn from 'components/p-product/video-edit-en/video-edit'
import ProductBanner from 'components/p-product/banner/banner'
import ProductBannerEn from 'components/p-product/banner-en/banner'
import ProductBannerEdit from 'components/p-product/banner-edit/banner-edit'
import ProductBannerEditEn from 'components/p-product/banner-edit-en/banner-edit'
// experience
import Experience from 'components/p-experience/experience'
import ExperienceList from 'components/p-experience/list/list'
import ExperienceListEn from 'components/p-experience/list-en/list'
import ExperienceEdit from 'components/p-experience/edit/edit'
import ExperienceEditEn from 'components/p-experience/edit-en/edit'
import ExperienceClassify from 'components/p-experience/classify/classify'
import ExperienceClassifyEn from 'components/p-experience/classify-en/classify'
import ExperienceClassifyEdit from 'components/p-experience/classify-edit/classify-edit'
import ExperienceClassifyEditEn from 'components/p-experience/classify-edit-en/classify-edit'
import ExperienceBanner from 'components/p-experience/banner/banner'
import ExperienceBannerEn from 'components/p-experience/banner-en/banner'
import ExperienceBannerEdit from 'components/p-experience/banner-edit/banner-edit'
import ExperienceBannerEditEn from 'components/p-experience/banner-edit-en/banner-edit'
// aboutus
import Aboutus from 'components/p-aboutus/aboutus'
import AboutusList from 'components/p-aboutus/list/list'
import AboutusEdit from 'components/p-aboutus/edit/edit'
import AboutusBanner from 'components/p-aboutus/banner/banner'
import AboutusBannerEdit from 'components/p-aboutus/banner-edit/banner-edit'
// friendlink
import Friendlink from 'components/p-friendlink/friendlink'
import FriendlinkList from 'components/p-friendlink/list/list'
import FriendlinkEdit from 'components/p-friendlink/edit/edit'

// support
import Support from 'components/p-support/support'
import SupportList from 'components/p-support/list/list'
import SupportDetail from 'components/p-support/detail/detail'
import SupportBanner from 'components/p-support/banner/banner'
import SupportBannerEdit from 'components/p-support/banner-edit/banner-edit'

// news
import News from 'components/p-news/news'
import NewsList from 'components/p-news/list/list'
import NewsEdit from 'components/p-news/edit/edit'
import NewsClassify from 'components/p-news/classify/classify'
import NewsClassifyEdit from 'components/p-news/classify-edit/classify-edit'
import NewsBanner from 'components/p-news/banner/banner'
import NewsBannerEdit from 'components/p-news/banner-edit/banner-edit'

// config
import Config from 'components/p-config/config'
import ConfigList from 'components/p-config/list/list'
import ConfigEdit from 'components/p-config/edit/edit'
import ConfigPassword from 'components/p-config/password/password'

Vue.use(Router)

export default new Router({
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      redirect: {name: 'admin'}
    },
    {
      path: '/login',
      component: Login,
      meta: {loginPage: true}
    },
    {
      path: '/error',
      component: ErrorPage
    },
    {
      path: '/admin',
      name: 'admin',
      meta: {requiresAuth: true}, // 需要登录
      component: Admin,
      redirect: {name: 'home'},
      children: [
        {
          path: 'home',
          name: 'home',
          component: Home,
          children: [
            // 中文
            {path: '/', component: BasicInfo},
            {path: 'edit', component: BasicInfoEdit},
            // 英文
            {path: 'en', component: BasicInfoEn},
            {path: 'edit/en', component: BasicInfoEnEdit}
          ]
        },
        {
          path: 'aboutus',
          component: Aboutus,
          children: [
            // 中文
            {path: '/', component: AboutusList},
            {path: 'add', component: AboutusEdit},
            {path: 'edit/:id', component: AboutusEdit},
            {path: 'banner', component: AboutusBanner},
            {path: 'banneredit', component: AboutusBannerEdit},
            // 英文
            {path: 'en', component: AboutusList}
          ]
        },
        // product
        {
          path: 'product',
          component: Product,
          redirect: {name: 'productList'},
          children: [
            {path: 'list', component: ProductList, name: 'productList'},
            {path: 'listen', component: ProductListEn},
            {path: 'add', component: ProductEdit},
            {path: 'adden', component: ProductEditEn},
            { path: 'edit',
              component: ProductEdit,
              children: [
                {path: ':id'}
              ]
            },
            { path: 'editen',
              component: ProductEditEn,
              children: [
                {path: ':id'}
              ]
            },
            {path: 'classify', component: ProductClassify},
            {path: 'classifyen', component: ProductClassifyEn},
            {
              path: 'classifyedit',
              component: ProductClassifyEdit,
              children: [
                {path: ':id'}
              ]
            },
            {
              path: 'classifyediten',
              component: ProductClassifyEditEn,
              children: [
                {path: ':id'}
              ]
            },
            {path: 'classifyadd', component: ProductClassifyEdit},
            {path: 'classifyadden', component: ProductClassifyEditEn},
            {path: 'banner', component: ProductBanner},
            {path: 'banneren', component: ProductBannerEn},
            {path: 'banneredit', component: ProductBannerEdit},
            {path: 'bannerediten', component: ProductBannerEditEn},
            {path: 'video', component: ProductVideo},
            {path: 'videoen', component: ProductVideoEn},
            {
              path: 'videoedit',
              component: ProductVideoEdit,
              children: [
                {path: ':id'}
              ]
            },
            {
              path: 'videoediten',
              component: ProductVideoEditEn,
              children: [
                {path: ':id'}
              ]
            },
            {path: 'videoadd', component: ProductVideoEdit},
            {path: 'videoadden', component: ProductVideoEditEn}
          ]
        },
        // experience
        {
          path: 'experience',
          component: Experience,
          redirect: {name: 'experienceList'},
          children: [
            {path: 'list', component: ExperienceList, name: 'experienceList'},
            {path: 'listen', component: ExperienceListEn, name: 'experienceList'},
            {path: 'add', component: ExperienceEdit},
            {path: 'adden', component: ExperienceEditEn},
            { path: 'edit',
              component: ExperienceEdit,
              children: [
                {path: ':id'}
              ]
            },
            { path: 'editen',
              component: ExperienceEditEn,
              children: [
                {path: ':id'}
              ]
            },
            {path: 'classify', component: ExperienceClassify},
            {path: 'classifyen', component: ExperienceClassifyEn},
            {
              path: 'classifyedit',
              component: ExperienceClassifyEdit,
              children: [
                {path: ':id'}
              ]
            },
            {
              path: 'classifyediten',
              component: ExperienceClassifyEditEn,
              children: [
                {path: ':id'}
              ]
            },
            {path: 'classifyadd', component: ExperienceClassifyEdit},
            {path: 'classifyadden', component: ExperienceClassifyEditEn},
            {path: 'banner', component: ExperienceBanner},
            {path: 'banneren', component: ExperienceBannerEn},
            {path: 'banneredit', component: ExperienceBannerEdit, children: [{path: ':id'}]},
            {path: 'bannerediten', component: ExperienceBannerEditEn, children: [{path: ':id'}]}
          ]
        },
        // friendlink
        {
          path: 'friendlink',
          component: Friendlink,
          children: [
            // 中文
            {path: '/', component: FriendlinkList},
            {path: 'add', component: FriendlinkEdit},
            {path: 'edit/:id', component: FriendlinkEdit},
            // 英文
            {path: 'en', component: FriendlinkList}
          ]
        },
        // news
        {
          path: 'news',
          component: News,
          redirect: {name: 'newsList'},
          children: [
            {path: 'list', component: NewsList, name: 'newsList'},
            {path: 'add', component: NewsEdit},
            { path: 'edit',
              component: NewsEdit,
              children: [
                {path: ':id'}
              ]
            },
            {path: 'list/en', component: NewsList},
            {path: 'classify', component: NewsClassify},
            {
              path: 'classifyedit',
              component: NewsClassifyEdit,
              children: [
                {path: ':id'}
              ]
            },
            {path: 'classifyadd', component: NewsClassifyEdit},
            {path: 'classify/en', component: NewsClassify},
            {path: 'banner', component: NewsBanner},
            {path: 'banneredit', component: NewsBannerEdit, children: [{path: ':id'}]}
          ]
        },
        // support
        {
          path: 'support',
          component: Support,
          children: [
            // 中文
            {path: '/', component: SupportList},
            {path: 'detail/:id', component: SupportDetail},
            {path: 'banner', component: SupportBanner},
            {path: 'banneredit', component: SupportBannerEdit, children: [{path: ':id'}]},
            // 英文
            {path: 'en', component: SupportList}
          ]
        },
        // config
        {
          path: 'config',
          component: Config,
          children: [
            // 中文
            {path: '/', component: ConfigList},
            {path: 'edit', component: ConfigEdit},
            {path: 'password', component: ConfigPassword}
          ]
        }
      ]
    }
  ]
})
