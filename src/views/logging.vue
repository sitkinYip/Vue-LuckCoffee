<template>
	<!-- 登录界面 -->
	<div class="box">
		<div class="logo"><img src="../assets/img/log.png" alt="" /></div>
		<van-form @submit="onSubmit">
			<van-field v-model="username" name="账号" label="账号" placeholder="请填写手机号码" :rules="[{ required: true, message: ' ' }]" />

			<van-field v-model="password" type="password" name="密码" label="密码" placeholder="请填写密码" :rules="[{ required: true, message: ' ' }]" />
			<div style="margin: 16px;" class="btn">
				<van-button block type="info" native-type="submit">立即登录</van-button>
				<br />
				<van-button plain type="info" size="small" class="dlbtn" @click='rebtn'>没有账号？去注册</van-button>
			</div>
		</van-form>
	</div>
</template>

<script>
	import {utils} from '../untlis/utils.js'
export default {
	data() {
		return {
			username: '',
			password: ''
		};
	},
	computed: {
		
	},
	methods: {
		onSubmit(values) {
			//发送ajax请求,判断用户是否存在，不存在则让其注册
			let reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
			if (!reg.test(this.username)) {
				this.$toast('请输入正确手机号码');
			}else{
				//加载提示
				       this.$toast.loading({
				         
				         //是否禁止背景点击
				         forbidClick: true,
								
				         //禁止自动关闭
				         duration: 0,
								
				         message: '登录中...'
								
				       })
				//ajax请求
				this.axios({
					method: 'POST',
					url: '/login',
					data:{
						appkey: this.appkey,
						password: this.password,
						phone: this.username
					},
					//在请求之前将参数序列化
					transformRequest:utils.transformRequest,
				}).then(res=>{
					//关闭加载提示
					this.$toast.clear();
					
					// console.log(res)
					if(res.data.code==200){
						// console.log(cook)
						let cook=res.data.token.split('.')
						// console.log(cook)
						for(let i=0;i<cook.length;i++){
							this.$cookies.set("t"+i,cook[i],"30d")
						}
						this.$router.replace({
							name:'Page'
						})
					}else{
						this.$toast(res.data.msg);
					}
				}).catch(err => {
						// console.log('err ==> ', err);
					});
			}
			
		},
		rebtn(){
			this.$router.push({
				name:'Register'
			})
		}
	}
};
</script>

<style lang="less" scoped>
html,
body,
.box {
	width: 100%;
	height: 100%;
}
.box {
	
}

.logo {
	width: 100%;
	text-align: center;
	height: 200px;
	padding: 50px 0;
}

.btn {
	padding: 20px;
}

.dlbtn {
	width: 100%;
	height: 44px;
}
</style>
