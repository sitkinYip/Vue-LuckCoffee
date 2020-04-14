export const user = {
	namespaced: true,
	state: {
		
		//用户购物车数据
		shopcart:[],
		shopping:[],
		//用户收藏商品
		likearr:[],
		//购物车懒加载
		  //触底加载完成，没有数据可加载
		  isFinished: false,
		   //每次加载10条数据
		    count: 10,
		  
		    // 开始截取下标
		    start: 0,

	},
	getters: {
	
	},
	mutations: {
		//修改购物车数据
		datashop(state,data){
			state.shopcart=data;
			state.shopcart.forEach(v=>{
				v.check=false
			})
			state.shopping=state.shopcart
			// this.$options.methods.loadShopcartData(state)
			// commit('loadShopcartData')
			// console.log(state.shopping)
		},
	
		//修改购物车内容选中方法
		modshop(state,i){
			state.shopping.forEach(v=>{
				v.check=i
			})
			console.log(state.shopping)
		},
		//修改懒加载数据
		loadShopcartData(state) {
		   //每次获取10条数据
		    state.shopping.push(...state.shopcart.slice(state.start, state.count + state.start));
		
		    state.start = state.count;
		  },
		    changeData(state, data) {
		      state[data.key] = data.value;
		    },
		//删除购物车中的数据
		delshop(state){
			// console.log(state.shopping)
			let is=[]
			state.shopping.forEach((v,i)=>{
				if(v.check){
					// console.log(v)
					is.push(i)
					
					// console.log(state.shopping)
				}
			})
			// console.log(is)
			if(is.length==state.shopping.length){
				state.shopping=[]
				return
			}
			for(let j=0;j<is.length;j++){
				state.shopping.splice(is[j],1)
			}
			
		},
		//修改收藏内容
		modelike(state,data){
			state.likearr=data
			// console.log(state.likearr)
		},
		//删除收藏内容
		dellike(state,i){
			state.likearr.splice(i,1)
		}

	},
	actions: {},
	modules: {}
}
