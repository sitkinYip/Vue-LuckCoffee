import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vuex from 'vuex'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueCookies from 'vue-cookies'
import {
	Tabbar,
	TabbarItem,
	Swipe,
	SwipeItem,
	Form,
	Field,
	Button,
	Toast,
	NavBar,
	Sidebar,
	SidebarItem,
	Card,
	SubmitBar,
	Checkbox,
	CheckboxGroup,
	 Cell, 
	 CellGroup,
	 Icon,
	 RadioGroup,
	 Radio,
	 Tag,
	 Image,
	 Stepper,
	 GoodsAction,
	 GoodsActionIcon, 
	 GoodsActionButton,
	 List,
	 AddressList,
	  AddressEdit,
	  ActionSheet,
	  Tab, 
	  Tabs,
	   Uploader,
	   Popup,
	   Dialog
} from 'vant';
import 'lib-flexible'
Vue.use(Vuex)
Vue.use(VueAxios, axios)
Vue.use(VueCookies)
Vue.use(Tabbar)
	.use(TabbarItem)
	.use(Swipe)
	.use(SwipeItem)
	.use(Form)
	.use(Field)
	.use(Button)
	.use(Toast)
	.use(NavBar)
	.use(Sidebar)
	.use(SidebarItem)
	.use(Card)
	.use(SubmitBar)
	.use(Checkbox)
	.use(CheckboxGroup)
	.use(Cell)
	.use(CellGroup)
	.use(Icon)
	.use(Radio)
	.use(RadioGroup)
	.use(Tag)
	.use(Image)
	.use(Stepper)
	.use(GoodsAction)
	.use(GoodsActionButton)
	.use(GoodsActionIcon)
	.use(List)
	.use(AddressList)
	.use(AddressEdit)
	.use(ActionSheet)
	.use(Tab)
	.use(Tabs)
	.use(Uploader)
	.use(Popup)
	.use(Dialog)

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
axios.defaults.baseURL='http://www.kangliuyong.com:10002'
Vue.prototype.appkey='U2FsdGVkX18XCnA1EI8dlekuPGrwWdFrLRh+F1S+xng='
// Vue.prototype.appkey='U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA='

Vue.config.productionTip = false

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
