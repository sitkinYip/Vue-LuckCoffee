export const routes = [
	{
		path:'/',
		name:'Advertising',
		component: ()=>import('../views/Advertising.vue')
	},
  {
    path: '/register',
    name: 'Register',
    component: ()=>import('../views/Register.vue')
  },
  {
    path: '/logging',
    name: 'Logging',
    component: ()=>import('../views/logging.vue')
  },
  {
	  //底栏与通知栏
    path: '/home',
    name: 'Home',
    component: ()=>import('../views/Home.vue'),
	children:[{
		//首页
		path:'/page',
		name:'Page',
		component: ()=>import('../views/homechil/Page.vue'),
		
	},{
		//购物车
		path:'/shopping',
		name:'Shopping',
		component: ()=>import('../views/homechil/Shopping.vue')
	},{
		//我的
		path:'/portfile',
		name:'Portfile',
		component: ()=>import('../views/homechil/portfile.vue')
	},{
		//商品详情
		path:'/kaga',
		name:'Kaga',
		component:()=>import('../views/homechil/Kaga.vue')
	},{
		//订单
		path:'/order',
		name:'Order',
		component:()=>import('../views/homechil/Order.vue')
	}]
  },
  {
	  //支付界面
	path:'/pay',
	name:'Pay',
	component:()=>import('../views/Pay'),
	
  },{
	  //地址管理
	path:'/addres',
	name:'Addres',
	component:()=>import('../views/paychil/Addres'),
	
  }, {
	  //地址编辑
	path:'/newadd',
	name:'Newadd',
	component:()=>import('../views/paychil/Newadd'),
	
  },{
	  //收藏页
    path: '/like',
    name: 'Like',
    component: ()=>import('../views/Like.vue')
  },{
	  //个人信息管理页
    path: '/my',
    name: 'My',
    component: ()=>import('../views/My.vue')
  },
  {
	  path: '*',
	  redirect:{
		  name:'Register',
	  }
  }
 
]