<template>
	<div class="box">
		<van-nav-bar
		  title="收货地址"
		  fixed
		  left-arrow
		  @click-left="onClickLeft"
		  
		/>
		<van-address-list
		  v-model="chosenAddressId"
		  :list="list"
		  default-tag-text="默认"
		  @add="onAdd"
		  @edit="onEdit"
		  @click-item='onsele'
		/>
	</div>
</template>

<script>
	import { Toast } from 'vant';
	import { utils } from '../../untlis/utils.js';
	export default {
		name:'addres',
	  data() {
	    return {
	      chosenAddressId: '1',
	      list: [
	    //     {
	    //       id: '1',
	    //       name: '张三',
	    //       tel: '13000000000',
	    //       address: '浙江省杭州市西湖区文三路 138 号东方通信大厦 7 楼 501 室',
			  // isDefault:true
			  
	    //     },
	    //     {
	    //       id: '2',
	    //       name: '李四',
	    //       tel: '1310000000',
	    //       address: '浙江省杭州市拱墅区莫干山路 50 号'
	    //     }
	      ],
	      
	    }
	  },
	  methods: {
	    onAdd() {
			this.$router.push({
				name:'Newadd'
			})
	      // Toast('新增地址');
	    },
		//编辑地址
	    onEdit(item, index) {
	      // Toast('编辑地址:' + index);
		  // console.log(item)
		  this.$router.push({
			  name:'Newadd',
			  query:{
				  id:item.id,
			  }
		  })
	    },
		//人员地址点击
		onsele(){
			// this.$router.push({
			// 	name:'Pay'
			// })
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
				this.list=[]
				// console.log(res.data.result)
				if(res.data.code==20000){
					let data=res.data.result
					data.forEach(v=>{
						let obj={}
						obj.id=v.id
						obj.name=v.name
						obj.tel=v.tel
						obj.address=v.province+v.city+v.county+v.addressDetail
						obj.isDefault=v.isDefault==1
						this.list.push(obj)
						if(v.isDefault==1){
							this.chosenAddressId=v.id
						}
					})
				}
			})	  
		},	
		//返回按钮
		onClickLeft(){
			this.$router.go(-1)
		}
	  },
	  created() {
		 this.getadd() 
	  }
	}
</script>

<style lang="less" scoped>
	/deep/.van-button--danger{
		background-color: #172194;
		border-color: #172194;
	}
	/deep/ .van-address-item .van-radio__icon--checked .van-icon{
		background-color: #172194;
		border-color: #172194;
	}
	
	.van-button--round{
		border-radius: 0;
	}
	
	.box{
		padding-top: 46px;
	}
</style>
