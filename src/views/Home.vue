<!-- 底栏和顶栏 -->
<template>
  <div class="home">
	  <van-nav-bar
	    title="luckin coffee"
	    left-arrow
		color="#172194"
		@click-left="onClickLeft"
	  />
	  
	  <keep-alive include="page">
	  <router-view/>
	  </keep-alive>
	  
   <van-tabbar
     v-model="active"
     active-color="#172194"
     inactive-color="#000"
	 class='nav'
   >
     <van-tabbar-item icon="qr" to='/page'>菜单</van-tabbar-item>
     <van-tabbar-item icon="orders-o" to='/order'>订单</van-tabbar-item>
     <van-tabbar-item icon="comment-o" to='/shopping'>购物车</van-tabbar-item>
     <van-tabbar-item icon="circle" to='/portfile'>我的</van-tabbar-item>
   </van-tabbar>
  </div>
</template>

<script>


export default {
  data() {
     return {
       active: 0
     }
   },
   computed:{
	   cd(){
		   return this.$store.state.user
	   }
   },
	 methods:{
		 onClickLeft(){
			 // history.go(-1)
			 this.$router.go(-1)
		 }
	 }
}
</script>
<style lang="less" scoped>
	.nav{
		box-shadow: 0 2px 8px 2px rgba(0,0,0,.3);
	}
	
</style>
