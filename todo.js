//案例用localStorage保存数据
//先封装方法
var locs ={
    save(key,value){     //保存
        localStorage.setItem(key,JSON.stringify(value));
    },
    fetch(key){    //获取(没取到就返回空数组)
        return JSON.parse(localStorage.getItem(key)) || [];
    }
}
//调用上面的方法 取值, 为了显示本地数据 localStorage
var list = locs.fetch('my_pc');

//假数据, 为了前期测试样式和功能
// var list=[
//     {
//         title:'吃饭',
//         isChecked:true  //  表示完成 勾选
//     },
//     {
//         title:'睡觉',
//         isChecked:false //  表示未完成 未勾选
//     }
// ]

//\new\ 过滤的时候有三种情况 all finished unfinished
// var filter = {
// 	all:function(list){
// 		return list;
// 	},
// 	finished:function(list){
// 		return list.filter(function(item){
// 			return item.isChecked;
// 		})
// 	},
// 	unfinished:function(list){
// 		return list.filter(function(item){
// 			return !item.isChecked;
// 		})
// 	}
// }

//实例化
var vm = new Vue({
    el:'#container',
    data:{
        list:list,
        editing:'',  //记录正在编辑的数据
        beforeEdit:'',  //记录正在编辑的数据 开始时的数据title
        visibility: "all", //\new\通过这个属性值的变化对数据进行筛选
        todo:"",
    },
    //监控  (深度监控可以监控list第二层的属性 isChecked)
    watch:{
        // list:function () {  //监控list属性
        //     locs.save('my_pc',this.list);
        // }
        list:{
            //localStorage的 存
            handler:function () {  
                locs.save('my_pc',this.list);
            },
            deep:true
        }
    },
    //计算属性
    computed:{
        //list中未勾选的数据个数
        noCheckedLength: function () {
            return this.list.filter(function (item) {
                return !item.isChecked
            }).length
        },
        //\new\ 找到了过滤函数，就返回过滤后的数据；如果没有返回所有数据
        // filteredList:function(){			
		// 	return filter[this.visibility] ? filter[this.visibility](list) : list;
		// }
    },
    //方法
    methods:{
        //添加任务
        addTodo(ev) {
            if(ev.keyCode===13&&ev.target.value!==""&&ev.target.value!==" "){    //回车键不为空或者空格
                this.list.push({    //不是原生的方法
                    title:ev.target.value,//当前输入框的value
                    isChecked:false
                })
                //清空input框里的值
                ev.target.value = ''
            }
            
        },
        //删除任务
        deleteTodo(todo){
            var index = this.list.indexOf(todo);//找到当前行
            this.list.splice(index,1);//删除 //不是原生的方法
        },
        //删除 所有任务
        deleteAll(todo){
            // debugger
            // console.log(this.list.length)
            if(confirm('缺定要删除所有任务吗 ? ')){
                for(let i=0;i<this.list.length;i++){
                    this.list.splice(i);
                }
            }else{
                return false;
            }
        },
        //双击编辑
        editTodo(todo){
            //保存编辑前的数据title
            this.beforeEdit = todo.title;
            //添加 编辑中的样式,通过有值->true,为空->false触发
            this.editing = todo;
        },
        //失去焦点或者按enter就保存(修改成功)
        editDone(todo){
            //去掉 编辑中的样式
            this.editing = '';
        },
        //取消编辑 按esc (不作修改)
        cancelEdit(todo){
            todo.title = this.beforeEdit;

            this.beforeEdit='';
            //去掉 编辑中的样式
            this.editing = '';
        }
    },
    //自定义指令. 双击编辑获取焦点 对应html里的v-focus
    directives:{
        "focus":{   //自定义指令
            update(el,binding){
                if(binding.value){
                    el.focus();//原生方法
                }
            }
        }
    }
});

//\new\
// function watchHashChange(){
// 	var hash = window.location.hash.slice(1);

// 	vm.visibility = hash;
	
// }

// watchHashChange();

// window.addEventListener("hashchange",watchHashChange);