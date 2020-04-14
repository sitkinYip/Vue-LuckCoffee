<template>
	<div class="box">
		<van-nav-bar title="收货地址" fixed left-arrow @click-left="onClickLeft" />

		<van-address-edit
			:area-list="areaList"
			show-postal
			:show-delete='adid?true:false'
			show-set-default
			show-search-result
			:search-result="searchResult"
			:area-columns-placeholder="['请选择', '请选择', '请选择']"
			detail-maxlength="40"
			@save="onSave"
			@delete="onDelete"
			@change-detail="onChangeDetail"
			:address-info="info"
		/>
	</div>
</template>

<script>
import addlis from '../../untlis/addressList.js';
import { utils } from '../../untlis/utils.js';
export default {
	created() {

		if(this.$route.query.id){
			this.adid=this.$route.query.id
			this.getadd()
		}
		
	},
	data() {
		return {
			//中国地址选择的数据
			areaList: addlis,
			//详细地址会保存在这里
			searchResult: [],
			//初始填入地址，这个修改地址时可用
			info: {
				// 每条地址的唯一标识
				id: '',
				name: '',
				tel: '',
				province: '',
				city: '',
				county: '',
				addressDetail: '',
				areaCode: '',
				postalCode: '',
				//是否为默认地址
				isDefault: true
			},
			//如果是修改地址需要传入id过来
			adid:'',
			
		};
	},
	methods: {
		//返回
		onClickLeft() {
			this.$router.go(-1);
		},
		//点击保存
		onSave(val) {
			// console.log(val);
			// console.log(this.searchResult);
			
			if(this.adid){
				this.modadds(val)
			}else{
				this.newadds(val)
			}
			setTimeout(()=>{
				this.$router.go(-1)
			},1000)
		},
		//点击删除
		onDelete() {
			if(this.adid){
				this.deladds()
			}
			setTimeout(()=>{
				this.$router.push({
					name:'Addres'
				})
			},1000)
			
			// Toast('delete');
		},
		// 修改详细地址时触发
		onChangeDetail(val) {
			if (val) {
				this.searchResult = [
					{
						name: '凤凰街道',
						address: '柯木塱社区'
					}
				];
			} else {
				this.searchResult = [];
			}
		},
		// 新增地址时
		newadds(info){
			// console.log(this.info)
			this.axios({
				url: '/addAddress',
				method: 'POST',
				data: {
					appkey: this.appkey,
					tokenString: utils.token(this),
					name: info.name,
					tel: info.tel,
					province: info.province,
					city: info.city,
					county: info.county,
					addressDetail: info.addressDetail,
					areaCode: info.areaCode,
					postalCode: info.postalCode,
					isDefault: info.isDefault?1:0
				},
				//在请求之前将参数序列化
				transformRequest: utils.transformRequest
			}).then(res => {
				this.$toast(res.data.msg);
			});
		},
		//修改地址方法
		modadds(info){
			this.axios({
				url:'/editAddress',
				method: 'POST',
					data: {
						appkey: this.appkey,
						tokenString: utils.token(this),
						aid: info.aid,
						name: info.name,
						tel: info.tel,
						province: info.province,
						city: info.city,
						county: info.county,
						addressDetail: info.addressDetail,
						areaCode: info.areaCode,
						postalCode: info.postalCode,
						isDefault: info.isDefault?1:0
					},
					//在请求之前将参数序列化
						transformRequest: utils.transformRequest
			}).then(res=>{
				this.$toast(res.data.msg);
			})
			
		},
		//删除地址
		deladds(){
			this.axios({
				url:'/deleteAddress',
				method:'POST',
				data:{
					appkey: this.appkey,
					tokenString: utils.token(this),
					aid:this.info.aid,
				},
				//在请求之前将参数序列化
					transformRequest: utils.transformRequest
			}).then(res=>{
				// console.log(res)
				this.$toast(res.data.msg);
			})
		},
		//查询用户地址
		getadd(){
			this.axios({
				url:'/findAddress',
				method:'GET',
				params:{
					appkey:this.appkey,
					tokenString: utils.token(this)
				}
			}).then(res=>{
				// console.log(res.data)
				if(res.data.code==20000){
					let data=res.data.result
					data.forEach(v=>{
						if(v.id==this.adid){
							// console.log(v)
							// console.log(v.id)
							this.info.id=v.id
							this.info.name=v.name
							this.info.tel=v.tel
							this.info.province=v.province
							this.info.city=v.city
							this.info.county=v.county
							this.info.addressDetail=v.addressDetail
							this.info.areaCode=v.areaCode
							this.info.postalCode=v.postalCode
							//是否为默认地址
							this.info.isDefault=v.isDefault==1
							this.info.aid=v.aid
						}
						
					})
				}
			})	  
		},
	}
};
</script>

<style lang="less" scoped>
.box {
	padding-top: 46px;
}

/deep/.van-button--danger {
	background-color: #172194;
	border: 0;
	border-radius: 0;
}
/deep/ .van-button--default {
	border-radius: 0;
}
</style>
