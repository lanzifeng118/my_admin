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
import ProductEdit from 'components/p-product/edit/edit'
import ProductClassify from 'components/p-product/classify/classify'
import ProductClassifyEdit from 'components/p-product/classify-edit/classify-edit'
import ProductVideo from 'components/p-product/video/video'
import ProductVideoEdit from 'components/p-product/video-edit/video-edit'
import ProductBanner from 'components/p-product/banner/banner'
import ProductBannerEdit from 'components/p-product/banner-edit/banner-edit'
// experience
import Experience from 'components/p-experience/experience'
import ExperienceList from 'components/p-experience/list/list'
import ExperienceEdit from 'components/p-experience/edit/edit'
import ExperienceClassify from 'components/p-experience/classify/classify'
import ExperienceClassifyEdit from 'components/p-experience/classify-edit/classify-edit'
import ExperienceBanner from 'components/p-experience/banner/banner'
import ExperienceBannerEdit from 'components/p-experience/banner-edit/banner-edit'
// aboutus
import Aboutus from 'components/p-aboutus/aboutus'
import AboutusList from 'components/p-aboutus/list/list'
import AboutusEdit from 'components/p-aboutus/edit/edit'
import AboutusBanner from 'components/p-aboutus/banner/banner'
import AboutusBannerEdit from 'components/p-aboutus/banner-edit/banner-edit'

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
            {path: 'enedit', component: BasicInfoEnEdit}
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
            {path: 'add', component: ProductEdit},
            { path: 'edit',
              component: ProductEdit,
              children: [
                {path: ':id'}
              ]
            },
            {path: 'list/en', component: ProductList},
            {path: 'classify', component: ProductClassify},
            {
              path: 'classifyedit',
              component: ProductClassifyEdit,
              children: [
                {path: ':id'}
              ]
            },
            {path: 'classifyadd', component: ProductClassifyEdit},
            {path: 'classify/en', component: ProductClassify},
            {path: 'banner', component: ProductBanner},
            {path: 'banneredit', component: ProductBannerEdit},
            {path: 'video', component: ProductVideo},
            {
              path: 'videoedit',
              component: ProductVideoEdit,
              children: [
                {path: ':id'}
              ]
            },
            {path: 'videoadd', component: ProductVideoEdit},
            {path: 'video/en', component: ProductVideo}
          ]
        },
        // experience
        {
          path: 'experience',
          component: Experience,
          redirect: {name: 'experienceList'},
          children: [
            {path: 'list', component: ExperienceList, name: 'experienceList'},
            {path: 'add', component: ExperienceEdit},
            { path: 'edit',
              component: ExperienceEdit,
              children: [
                {path: ':id'}
              ]
            },
            {path: 'list/en', component: ExperienceList},
            {path: 'classify', component: ExperienceClassify},
            {
              path: 'classifyedit',
              component: ExperienceClassifyEdit,
              children: [
                {path: ':id'}
              ]
            },
            {path: 'classifyadd', component: ExperienceClassifyEdit},
            {path: 'classify/en', component: ExperienceClassify},
            {path: 'banner', component: ExperienceBanner},
            {path: 'banneredit', component: ExperienceBannerEdit, children: [{path: ':id'}]}
          ]
        },
        // news
        {
          path: 'news',
          component: Home
        },
        // feedback
        {
          path: 'feedback',
          component: Home
        }
      ]
    }
  ]
})
