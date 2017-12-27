import Vue from 'vue'
import Router from 'vue-router'
import Login from 'components/p-login/login'
import ErrorPage from 'components/p-error/error'
import Admin from 'components/p-admin/admin'
import Home from 'components/p-home/home'
import HomeBanner from 'components/p-home/banner/banner'
import HomeBannerEn from 'components/p-home/banner-en/banner'
import HomeBannerEdit from 'components/p-home/banner-edit/banner-edit'
import HomeBannerEditEn from 'components/p-home/banner-edit-en/banner-edit'
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
import AboutusListEn from 'components/p-aboutus/list-en/list'
import AboutusEditEn from 'components/p-aboutus/edit-en/edit'
import AboutusBannerEn from 'components/p-aboutus/banner-en/banner'
import AboutusBannerEditEn from 'components/p-aboutus/banner-edit-en/banner-edit'
// friendlink
import Friendlink from 'components/p-friendlink/friendlink'
import FriendlinkList from 'components/p-friendlink/list/list'
import FriendlinkEdit from 'components/p-friendlink/edit/edit'
import FriendlinkListEn from 'components/p-friendlink/list-en/list'
import FriendlinkEditEn from 'components/p-friendlink/edit-en/edit'

// support
import Support from 'components/p-support/support'
import SupportList from 'components/p-support/list/list'
import SupportDetail from 'components/p-support/detail/detail'
import SupportBanner from 'components/p-support/banner/banner'
import SupportBannerEdit from 'components/p-support/banner-edit/banner-edit'
import SupportClassify from 'components/p-support/classify/classify'
import SupportClassifyEdit from 'components/p-support/classify-edit/classify-edit'
// en
import SupportListEn from 'components/p-support/list-en/list'
import SupportDetailEn from 'components/p-support/detail-en/detail'
import SupportBannerEn from 'components/p-support/banner-en/banner'
import SupportBannerEditEn from 'components/p-support/banner-edit-en/banner-edit'
import SupportClassifyEn from 'components/p-support/classify-en/classify'
import SupportClassifyEditEn from 'components/p-support/classify-edit-en/classify-edit'

// news
import News from 'components/p-news/news'
import NewsList from 'components/p-news/list/list'
import NewsEdit from 'components/p-news/edit/edit'
import NewsClassify from 'components/p-news/classify/classify'
import NewsClassifyEdit from 'components/p-news/classify-edit/classify-edit'
import NewsBanner from 'components/p-news/banner/banner'
import NewsBannerEdit from 'components/p-news/banner-edit/banner-edit'
// en
import NewsListEn from 'components/p-news/list-en/list'
import NewsEditEn from 'components/p-news/edit-en/edit'
import NewsClassifyEn from 'components/p-news/classify-en/classify'
import NewsClassifyEditEn from 'components/p-news/classify-edit-en/classify-edit'
import NewsBannerEn from 'components/p-news/banner-en/banner'
import NewsBannerEditEn from 'components/p-news/banner-edit-en/banner-edit'

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
          redirect: 'homeList',
          component: Home,
          children: [
            // 中文
            {path: '/', component: BasicInfo, name: 'homeList'},
            {path: 'edit', component: BasicInfoEdit},
            {path: 'banner', component: HomeBanner},
            {path: 'banneradd', component: HomeBannerEdit},
            {path: 'banneredit/:id', component: HomeBannerEdit},
            // 英文
            {path: 'en', component: BasicInfoEn},
            {path: 'editen', component: BasicInfoEnEdit},
            {path: 'banneren', component: HomeBannerEn},
            {path: 'banneradden', component: HomeBannerEditEn},
            {path: 'bannerediten/:id', component: HomeBannerEditEn}
          ]
        },
        {
          path: 'aboutus',
          component: Aboutus,
          redirect: {name: 'aboutusList'},
          children: [
            // 中文
            {path: 'list', component: AboutusList, name: 'aboutusList'},
            {path: 'add', component: AboutusEdit},
            {path: 'edit/:id', component: AboutusEdit},
            {path: 'banner', component: AboutusBanner},
            {path: 'banneredit', component: AboutusBannerEdit},
            // 英文
            {path: 'listen', component: AboutusListEn},
            {path: 'adden', component: AboutusEditEn},
            {path: 'editen/:id', component: AboutusEditEn},
            {path: 'banneren', component: AboutusBannerEn},
            {path: 'bannerediten', component: AboutusBannerEditEn}
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
          redirect: {name: 'friendlinkList'},
          children: [
            // 中文
            {path: 'list', component: FriendlinkList, name: 'friendlinkList'},
            {path: 'add', component: FriendlinkEdit},
            {path: 'edit/:id', component: FriendlinkEdit},
            // 英文
            {path: 'listen', component: FriendlinkListEn},
            {path: 'adden', component: FriendlinkEditEn},
            {path: 'editen/:id', component: FriendlinkEditEn}
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
            {path: 'banner', component: NewsBanner},
            {path: 'banneredit', component: NewsBannerEdit, children: [{path: ':id'}]},
            // en
            {path: 'listen', component: NewsListEn, name: 'newsList'},
            {path: 'adden', component: NewsEditEn},
            { path: 'editen',
              component: NewsEditEn,
              children: [
                {path: ':id'}
              ]
            },
            {path: 'classifyen', component: NewsClassifyEn},
            {
              path: 'classifyediten',
              component: NewsClassifyEditEn,
              children: [
                {path: ':id'}
              ]
            },
            {path: 'classifyadden', component: NewsClassifyEditEn},
            {path: 'banneren', component: NewsBannerEn},
            {path: 'bannerediten', component: NewsBannerEditEn, children: [{path: ':id'}]}
          ]
        },
        // support
        {
          path: 'support',
          component: Support,
          redirect: {name: 'supportList'},
          children: [
            // 中文
            {path: 'list', component: SupportList, name: 'supportList'},
            {path: 'classify', component: SupportClassify},
            {path: 'classifyadd', component: SupportClassifyEdit},
            {
              path: 'classifyedit',
              component: SupportClassifyEdit,
              children: [
                {path: ':id'}
              ]
            },
            {path: 'detail/:id', component: SupportDetail},
            {path: 'banner', component: SupportBanner},
            {path: 'banneredit', component: SupportBannerEdit, children: [{path: ':id'}]},
            // 英文
            {path: 'listen', component: SupportListEn, name: 'supportList'},
            {path: 'classifyen', component: SupportClassifyEn},
            {path: 'classifyadden', component: SupportClassifyEditEn},
            {
              path: 'classifyediten',
              component: SupportClassifyEditEn,
              children: [
                {path: ':id'}
              ]
            },
            {path: 'detailen/:id', component: SupportDetailEn},
            {path: 'banneren', component: SupportBannerEn},
            {path: 'bannerediten', component: SupportBannerEditEn, children: [{path: ':id'}]}
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
