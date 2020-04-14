<template>
	<!-- 注册界面 -->
	<div class="box">
		<div class="logo"><img src="../assets/img/log.png" alt="" /></div>
		<van-form @submit="onSubmit">
			<van-field v-model="username" name="账号" label="账号" placeholder="请填写手机号码" :rules="[{ required: true, message: ' ' }]" />
			<van-field v-model="nickname" name="昵称" label="昵称" placeholder="请填写昵称" :rules="[{ required: true, message: ' ' }]" />

			<van-field v-model="password" type="password" name="密码" label="密码" placeholder="请填写密码" :rules="[{ required: true, message: ' ' }]" />
			<div style="margin: 16px;" class="btn">
				<van-button block type="info" native-type="submit">注册账号</van-button>
				<br />
				<van-button plain type="info" size="small" class="dlbtn" @click="logbtn">已有账号？去登录</van-button>
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
			nickname: '',
			password: ''
		};
	},
	computed: {
		
	},
	methods: {
		onSubmit(values) {
			
			// console.log(this.user);
			let reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
			if (!reg.test(this.username)) {
				this.$toast('请输入正确手机号码');
			} else if (this.nickname.trim().length < 2) {
				this.$toast('昵称太短，稍微长一点吧');
			} else if (!/^[A-Za-z0-9]{6,12}$/.test(this.password)) {
				this.$toast('请输入6-12位英文和数字作为密码');
			} else {
				 //加载提示
				        this.$toast.loading({
				          
				          //是否禁止背景点击
				          forbidClick: true,
				
				          //禁止自动关闭
				          duration: 0,
				
				          message: '注册中...'
				
				        })
				//ajax请求
				this.axios({
					method: 'POST',
					url: '/register',
					data:{
						appkey: this.appkey,
						    nickName: this.nickname,
						    password: this.password,
						    phone: this.username
					},
					//在请求之前将参数序列化
					transformRequest:utils.transformRequest,
				})
					.then(res => {
						//关闭加载提示
						this.$toast.clear();
						// console.log('res ==> ', res);
						 if (res.data.code == 100){
							 this.$router.replace({
							 	name: 'Logging'
							 });
						 }else{
							 //如果注册·失败，告诉其原因
							 this.$toast({
							               message: res.data.msg
							             })
						 }
					})
					.catch(err => {
						// console.log('err ==> ', err);
					});
				
			}
		},
		logbtn() {
			this.$router.replace({
				name: 'Logging'
			});
			
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
	// background: url(../assets/img/dlbg.jpg) no-repeat;
	// background-size: 100%;
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
