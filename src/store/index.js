import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import { user } from './module/user.js'
import { shop } from './module/shop.js'

export default new Vuex.Store({
  modules: {
	  shop,
	  user,
  }
})
