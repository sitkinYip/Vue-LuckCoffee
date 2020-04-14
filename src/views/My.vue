<template>
	<div class="box">
		<van-nav-bar title="个人信息" fixed left-arrow @click-left="onClickLeft" />

		<van-cell-group>
			<van-cell>
				<template #title>
					<span class="custom-title">头像</span>
				</template>
				<!-- 使用 right-icon 插槽来自定义右侧图标 -->
				<template #right-icon>
					<div class="img"><van-image round width="100%" height="100%" :src="my.userImg" /></div>

					<van-uploader :after-read="afterRead" class="uplo" />
				</template>
			</van-cell>
			<van-cell title="用户名" :value="my.nickName" @click="showPopup('用户名', 'username')" />
			<van-cell title="手机号" :value="my.phone" />
			<van-cell title="简介" :value="my.desc" @click="showPopup('简介', 'desc')" />
			<van-cell title="修改密码" is-link @click="showPopup('旧密码', 'password')" />
			<van-cell title="退出登录" is-link @click="onquit()" />
			<van-cell title="注销账号" is-link @click="onwrite" />
		</van-cell-group>

		<van-popup v-model="show" position="bottom" :style="{ height: '30%' }">
			<van-nav-bar :title="'修改' + title" />

			<van-cell-group>
				<van-field v-model="value" :placeholder="'请输入' + title" />
				<van-field v-model="pas" placeholder="请输入新密码" v-show="pashow" />
			</van-cell-group>
			<van-button type="primary" size="large" class="btn" @click="ondata">立即修改</van-button>
		</van-popup>
	</div>
</template>

<script>
import { utils } from '&/utils.js';
import { Dialog } from 'vant';
export default {
	created() {
		this.getmy();
	},
	data() {
		return {
			my: {
				nickName: '',
				userImg: '',
				userBg: '',
				desc: '',
				phone: ''
			},
			//弹窗显示隐藏
			show: false,
			//弹窗显示标题
			title: '用户信息',
			//弹窗输入内容
			value: '',
			//判断修改用户名还是简介
			type: '',
			//判断是否修改密码显示密码框
			pashow: false,
			//新密码
			pas: ''
		};
	},
	methods: {
		onClickLeft() {
			this.$router.go(-1);
		},
		//文件上传点击事件
		afterRead(file) {
			// 此时可以自行将文件上传至服务器
			// console.log(file);
			let big = 1024 * 300;
			// console.log(file.file.size);
			// if()
			if (file.file.size > big) {
				this.$toast('请上传小于300kb的图片！');
				return;
			}
			//data:image\/[A-Za-z]+;base64,
			let serverBase64Img = file.content.replace(/data:image\/[A-Za-z]+;base64,/, '');
			// console.log(serverBase64Img)
			let type = file.file.type.split('/')[1];
			// console.log(type)
			this.getuserimg(type, serverBase64Img);
		},
		//获取用户数据
		getmy() {
			this.axios({
				method: 'GET',
				url: '/findAccountInfo',
				params: {
					appkey: this.appkey,
					tokenString: utils.token(this)
				}
			}).then(res => {
				// console.log(res)
				if (res.data.code == 'B001') {
					let data = res.data.result;
					// console.log(data)
					this.my.nickName = data[0].nickName;
					this.my.userImg = data[0].userImg;
					this.my.userBg = data[0].userBg;
					this.my.desc = data[0].desc;
					this.my.phone = data[0].phone;
					// console.log(this.my);
				} else {
					this.$toast('请登录！');
					this.$router.push({
						name: 'Logging'
					});
				}
			});
		},
		//修改头像请求方法
		getuserimg(imgType, serverBase64Img) {
			this.axios({
				method: 'POST',
				url: '/updateAvatar',
				data: {
					appkey: this.appkey,
					tokenString: utils.token(this),
					imgType,
					serverBase64Img
				},
				//在请求之前将参数序列化
				transformRequest: utils.transformRequest
			}).then(res => {
				// console.log(res)
				this.$toast(res.data.msg);
				if (res.data.code == 'H001') {
					this.getmy();
				}
			});
		},
		//弹出窗口
		showPopup(title, type) {
			this.pashow = false;
			this.title = title;
			this.show = true;

			this.type = type;
			if (this.type == 'password') {
				// console.log(111);
				this.pashow = true;
			}
		},
		//修改按钮点击
		ondata() {
			if (this.value == '') {
				this.$toast('请输入内容！');
				return;
			}

			if (this.type == 'username') {
				// console.log('user');
				let nickName = this.value;
				this.getdata('/updateNickName', nickName, 'nickName');
				return;
			}
			if (this.type == 'desc') {
				// console.log('desc');
				this.getdata('/updateDesc', this.value, 'desc');
				return;
			}
			if (this.type == 'password') {
				if (!/^[A-Za-z0-9]{6,12}$/.test(this.pas)) {
					this.$toast('请输入6-12位英文和数字作为密码');
					return;
				}
				this.getpasword();
			}
		},
		//修改数据
		getdata(url, type, name) {
			this.axios({
				method: 'POST',
				url: url,
				data: {
					appkey: this.appkey,
					tokenString: utils.token(this),
					[name]: type
				},
				//在请求之前将参数序列化
				transformRequest: utils.transformRequest
			}).then(res => {
				this.$toast(res.data.msg);
				this.value = '';
				this.show = false;
				if ((res.data.code = 'C001')) {
					this.my[name] = type;
				}
			});
		},
		//退出登录点击
		onquit() {
			Dialog.confirm({
				title: '退出登录',
				message: '是否退出登录？'
			})
				.then(() => {
					// on confirm
					this.getquit('/logout');
				})
				.catch(() => {
					// on cancel
				});
		},
		//注销账号点击
		onwrite() {
			Dialog.confirm({
				title: '注销账户',
				message: '是否注销账户？'
			})
				.then(() => {
					// on confirm
					this.getquit('/destroyAccount');
				})
				.catch(() => {
					// on cancel
				});
		},
		//退出及注销请求
		getquit(url) {
			this.axios({
				method: 'POST',
				url: url,
				data: {
					appkey: this.appkey,
					tokenString: utils.token(this)
				},
				//在请求之前将参数序列化
				transformRequest: utils.transformRequest
			}).then(res => {
				// console.log(res);
				this.$toast(res.data.msg);
				if ((res.data.code = 'F001')) {
					this.$router.replace({
						name: 'Page'
					});
					return;
				}
				// console.log(res);
			});
		},
		//修改密码请求
		getpasword() {
			this.axios({
				method: 'POST',
				url: '/updatePassword',
				data: {
					appkey: this.appkey,
					tokenString: utils.token(this),
					password: this.pas,
					oldPassword: this.value
				},
				//在请求之前将参数序列化
				transformRequest: utils.transformRequest
			}).then(res => {
				// console.log(res);

				if (res.data.code == 'E001') {
					this.show = false;
					this.$toast(res.data.msg);
				}else{
					this.$router.push({
						name: 'Logging'
					});
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
.box {
	padding-top: 46px;
	overflow: hidden;
	width: 100%;
	.custom-title {
		display: inline-block;
		line-height: 50px;
	}

	.img {
		width: 50px;
		height: 50px;
		border-radius: 5px;
		img {
			width: 100%;
			height: 100%;
		}
	}
	.uplo {
		position: absolute;
		right: 0px;
		bottom: 0px;
		opacity: 0;
	}
	.van-nav-bar__title {
		color: #172194;
	}
	.btn {
		position: absolute;
		bottom: 0;
		background-color: #172194;
	}
}
</style>
