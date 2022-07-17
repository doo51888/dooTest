Web3 = require('web3');
fs= require('fs');
App={

  logArrIn:[],
  logArrOut:[],
  logCustoms:[],
  web3Provider: null,
  accounts:null,
  instance:{},
  fml_instance:{},
  contract_Addr:'0xaD4d8cAbb9D2C6B495Fb5EeFeEf871dE356c0ee7',
  contract_usdtd:'0xB8AfDC29EC2A48e253023384F2ee22874875448A',
  originalBlock:20964943,
  chainIdd:"0x61",
  infor:{},
  isRunIn:false,
  isRunOut:false,
  ininWebs:async function (){

 if (typeof window.ethereum !== 'undefined'){
     if (window.ethereum){
        App.web3Provider = window.ethereum;
        App.accounts=  await ethereum.request({ method: 'eth_requestAccounts' });
        App.chainIdd=  await ethereum.request({ method: 'eth_chainId'});
        web3=new Web3();
         web3.setProvider(App.web3Provider); 
     

      $.getJSON('./artifacts/test.json',  function(data){
       App.instance = new web3.eth.Contract(data.abi,App.contract_Addr,{from:App.accounts[0]});
      firstGetInfor();

      });
         $.getJSON('./artifacts/fml.json',  function(data){
       App.fml_instance =  new web3.eth.Contract(data.abi,App.contract_usdtd,{from:App.accounts[0]});
      });
  }
        $("#re").on('click', function () {
          firstGetInfor();
        });
    return App.initBingEvent(); 
   
  }

  },

//chain_select 
 initBingEvent: function (){

  //选择仓改变时 timeStampToTime(res[5])


//transout 日志 刷新按钮 infor_notic
     // 转出事件
  

       //添加一个刷新按钮
        $('#refresh').on('click', function () {
       updateSelInfor();
       getNotic();
      
      });
       $("#reset").on('click', async function () {
          
        // 新判断是否存在
            let sig1=$('#dooaddress').val();
            let sig2=$("#fireds").val();
            let sig3=$("#home_names").val();
          if (sig2!=null) {
          let re=   await  App.instance.methods.members_addr(sig2);
          if (re) {
           App.instance.methods.UpDateInfor(sig3,sig2,sig1).send({from:App.accounts[0]})
           .on('receipt',function(receipt){
                alert("修改信息成功！");
          })
         }
          }else {
            alert("推荐地址无效！");
          }


       });



       


 }



}

/**
 * 
 *  公共函数
 **/ 
// 获取当前余额
 



 function Str_inof(x,y) {
  return x.substring(0,x.indexOf(".") + y)
 }



   
  function  inArry(arry,search) {
       for(let i in arry){
             if(arry[i].returnValues._time==search){

                return true;
             }
         

       }
    } 




function timeStampToTime (timestamp) {
    var date = new Date(timestamp * 1000);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + (date.getDate() ) : date.getDate()) + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes();
    return M + D + h + m;
  }


 function getInfor(){
  App.instance.methods.getSelfInfor().call(function (err,res) {
        App.infor.base_addr=res[0];
            App.infor.out_addr=res[3];
             App.infor.mem_addr=res[4];
              App.infor.name=res[1];
               App.infor.classs=res[11];
               App.infor.limiteTime=res[5];
               App.infor.deep_level=res[15];
               App.infor._number=res[16];
           App.infor.base_mon=web3.utils.fromWei(res[6],'ether');
          App.infor.porfit_mon=web3.utils.fromWei(res[7],'ether');
          App.infor.mem_mon=web3.utils.fromWei(res[8],'ether');
     });

 }
 function firstGetInfor() {
    App.instance.methods.getSelfInfor().call(function (err,res) {
           App.infor.base_addr=res[0];
            App.infor.out_addr=res[3];
             App.infor.mem_addr=res[4];
              App.infor.name=res[1];
               App.infor.classs=res[11];
               App.infor.limiteTime=res[5];
               App.infor.deep_level=res[15];
               App.infor._number=res[16];
           App.infor.base_mon=web3.utils.fromWei(res[6],'ether');
          App.infor.porfit_mon=web3.utils.fromWei(res[7],'ether');
          App.infor.mem_mon=web3.utils.fromWei(res[8],'ether');

          updateSelInforHome();

     });
 }

  function updateSelInforHome() {

          if (typeof App.infor.out_addr) {
            
             $('#dooaddress').val(App.infor.out_addr);
           }

          if (typeof App.infor.base_mon) {

            $('#home_base_mon').text(Str_inof(App.infor.base_mon,5)+"USDT");
           }
            if (typeof App.infor.porfit_mon) {

            $('#home_porfit_mon').text(Str_inof(App.infor.porfit_mon,5)+"USDT");
           }
            if (typeof App.infor.mem_mon) {
            $('#home_mem_mon').text(Str_inof(App.infor.mem_mon,5)+"USDT");
            
           }
            $("#moneyaddress").val(App.infor.base_addr);
            $("#fireds").val(App.infor.mem_addr);
            $("#home_levels").val(App.infor.classs);
            $("#home_names").val(App.infor.name);
           }

         
          //  App.infor.base_addr=res[0];
          //   App.infor.out_addr=res[3];
          //    App.infor.mem_addr=res[4];
          //     App.infor.name=res[1];
          //      App.infor.classs=res[11];
          //  App.infor.base_mon=web3.utils.fromWei(res[6],'ether');
          // App.infor.porfit_mon=web3.utils.fromWei(res[7],'ether');
          // App.infor.mem_mon=web3.utils.fromWei(res[8],'ether');
            // $('#base_addr').text(addr_Trans(res[0]));
            // $('#out_addr').val(addr_Trans(res[3]));
            // $('#mem_addr').val(addr_Trans(res[4]));
            // $('#name').val(res[1]);
            // $('#classs').text(res[11]);
            // $('#base_mon').text(web3.utils.fromWei(res[6],'ether'));
            // $('#porfit_mon').text(web3.utils.fromWei(res[7],'ether'));
            // $('#mem_mon').text(web3.utils.fromWei(res[8],'ether'));
  

       //字符串 截取函数，取前4位和 后4位，中间用3个小点
       function addr_Trans( str_in) {
       return str_in.slice(0,4)+"...."+str_in.slice(37,42);
       }

  $(function() {
  $(window).load(function() {
    App.ininWebs();
     });
});