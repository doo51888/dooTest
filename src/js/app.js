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
        let chainIds=  await ethereum.request({ method: 'eth_chainId'});
     $("#chain").text(chainIds);
     $("#mon_main").text(addr_Trans(App.accounts[0]));
     
       ethereum.on('chainChanged',(chainID)=>{
       App.chainIdd=chainID;
      $("#chain").text(chainID);

   if (chainID!='0x61'){
     
     try {
          ethereum.request({
     method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x61' }],

     });
     window.location.reload();
     } catch(switchError) {
         if (switchError.code==4902) {

           ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
          {
            chainId: '0x61',
            chainName: 'BSC-TEST',
            rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'] ,
          },
        ]
           });

         }
         console.log(e);
     }

    }
    window.location.reload();
    });

   web3=new Web3();
   web3.setProvider(App.web3Provider); 
     

      $.getJSON('./artifacts/test.json',  function(data){
       App.instance = new web3.eth.Contract(data.abi,App.contract_Addr,{from:App.accounts[0]});
      firstGetInfor();
      get_mon();
      get_approve_edu();
      getNotic();
      });
         $.getJSON('./artifacts/fml.json',  function(data){
       App.fml_instance =  new web3.eth.Contract(data.abi,App.contract_usdtd,{from:App.accounts[0]});
      });
  }
    

     
    return App.initBingEvent(); 
   
  }

  },

//chain_select 
 initBingEvent: function (){

  //选择仓改变时 timeStampToTime(res[5])
       $("#sel8").change(function () {
    let localTime=  Date.parse(new Date())/1000;
        let type=  $('#sel8 option:selected').val();
        if (type==4){
         $("#infor_notic").text("");
        }else if(type==5) {
 if (localTime>App.infor.limiteTime) {
    $("#infor_notic").text("当前可转出，"+"基本仓最大可转出："+App.infor.base_mon+"USDT");
 }else {
     $("#infor_notic").text("当前处于锁仓期，"+"释放时间："+ timeStampToTime(App.infor.limiteTime)+","+"共计USDT数量："+App.infor.base_mon);
 }
           
        }else if (type==6) {
          if (App.infor.porfit_mon>=10) {

        $("#infor_notic").text("利润仓可转出："+App.infor.porfit_mon);
          }else {
             $("#infor_notic").text("利润仓不可转出，"+"原因是：当前利润仓USDT数量"+App.infor.porfit_mon+"<10");
          }
           
        } else if(type==7) {
           if (App.infor.mem_mon>=5) {

        $("#infor_notic").text("推荐仓可转出："+App.infor.mem_mon);
          }else {
             $("#infor_notic").text("推荐仓不可转出，"+"原因是：当前利润仓USDT数量"+App.infor.mem_mon+"<5");
          }
          
        }
       
         App.instance.methods.balanceOfFromFML(_get).call(function (err,res) {
           $('#balance').text(web3.utils.fromWei(res,'ether'));
          });
         App.instance.methods.balanceOfFromFML(App.accounts[0]).call(function (err,res) {
          $("#usdt_cu").text(web3.utils.fromWei(res,'ether'));

          });
         //approve_edu 剩余授权额度
            App.fml_instance.methods.allowance(_get,App.contract_Addr).call(function (err,res) {

             $("#approve_edu").text( web3.utils.fromWei(res));
            })

          
     });

//transout 日志 刷新按钮 infor_notic
     // 转出事件
     $("#monsout").on('click',  function () {
          let mn= document.getElementById("value_trainout").value+"000000000000000000";
         let type=  $('#sel8 option:selected').val();
         let localTime=  Date.parse(new Date())/1000;
         if (type==5) {
         if (App.infor.base_mon>0) {
            if (localTime>App.infor.limiteTime) {
    App.instance.methods.transferoutFromFML(mn,type).send({from:App.accounts[0]})
          .on('receipt',function(receipt){
          firstGetInfor();
          UpdateLog();
            }) 

         }else {
              alert("基本仓处于锁仓期,不能转出！");
            }

        }else {
           alert("基本仓USDT数量为0,不能转出！")
         }
      };
         if (type==6) {
            if (App.infor.porfit_mon<=10) {
               alert("利润仓USDT数量大于10后可转出！")
            }else {
              App.instance.methods.transferoutFromFML(mn,type).send({from:App.accounts[0]})
          .on('receipt',function(receipt){
          firstGetInfor();
          UpdateLog();
          })
          }
          
      
        };
         if (type==7) {
          if (App.infor.mem_mon<=5 ) {
            alert("推荐仓USDT数量大于5后可转出！")
          }else {
              App.instance.methods.transferoutFromFML(mn,type).send({from:App.accounts[0]})
          .on('receipt',function(receipt){
          firstGetInfor();
          UpdateLog();
          })
          }
          

        }

         // let mn= $("value_trainout").val();
       
        
      });
      //transin 转入事件
       $("#transin").on('click',  function () {
        let mn= $('#sel4 option:selected').val();
            if (!App.infor.isExist) {
              alert("请先完善doo仓信息！");
              return;
            }
            else {
              if (App.infor.approv>mn) {
                 App.instance.methods.transferInFromFML(mn+"000000000000000000").send({from:App.accounts[0]})
          .on('receipt',function(receipt){
               get_mon();
           get_approve_edu();
           updateSelInfor();
           UpdateLog();
           //更新基本仓
       
          })
              }
              else {
                alert("授权额度不足，请先授权！");
              }
               
         
            }
    
         
      
    
       
         // let mn=Number($('#sel4').val().split(":")[1]);
        
      });
        $("#_copy").on('click', function () {
   
     copyContent();
       });

       //添加一个刷新按钮
        $('#refresh').on('click', function () {
       updateSelInfor();
       getNotic();
      
      });
      $("#dropdownMenuButton1").on('click',  function () {
         App.instance.methods.balanceOfFromFML(App.accounts[0]).call(function (err,res) {
           $('#balance').text(Str_inof(web3.utils.fromWei(res,'ether'),5) +"USDT");
          });


    
          // App.chainIdd=chainID;
         
         // let mn= $('#sel4 option:selected').val()+"000000000000000000";
         // alert(mn);
         //  App.fml_instance.methods.approve(App.contract_Addr,mn).send({from:App.accounts[0]})
         //  .on('receipt',function(receipt){
         //   console.log(receipt); 
         //  })
      
      });
      $("#fmlApprove").on('click',  function () {
        if (!App.infor.isExist){
         alert("请先检查doo仓是否已经创建！");
        }else {
            let mn= $('#sel4 option:selected').val();
          App.fml_instance.methods.approve(App.contract_Addr,mn+"000000000000000000").send({from:App.accounts[0]})
          .on('receipt',function(receipt){
        
           get_approve_edu();
          
          })
        }
       
       });
         



       $(".dropdown-item").on('click', function () {
       let mn=$(this).find("img").attr("src");
         $("#img01").attr("src",mn);
         $("#dropdownMenuButton1").text($(this).text());
         //addr_Trans
          $("#mon_main").text(addr_Trans(App.accounts[0]));
           get_mon();
           get_approve_edu();
    });

       


 }



}

/**
 * 
 *  公共函数
 **/ 
    function copyContent() {
             var Url=document.getElementById(x);
             Url.select(); // 选择对象
             document.execCommand("Copy"); // 执行浏览器复制命令
             alert("复制成功");
     }

// 获取当前余额
  async function  UpdateLog(){
      let  tb= await web3.eth.getBlockNumber();
      let mmm =tb-App.originalBlock;
      if (mmm<4000) {
      App.instance.getPastEvents ('inRecord',{filter: {"_from":App.accounts[0]}, fromBlock: App.originalBlock, toBlock: 'latest'},function (error,result) {
 return result;
  })
.then(x=>{
   UpdateInLog(x);
  });
      }else {
        let _mmm=Math.floor(mmm/4000);
        for (let i = 0; i <=_mmm; i++) {
          if (i==0) {
       App.instance.getPastEvents ('inRecord',{filter: {"_from":App.accounts[0]}, fromBlock: App.originalBlock, toBlock:App.originalBlock+4000},function (error,result) {
 return result;
  }).then(x=>{
   UpdateInLog(x);
  });
          }
          else {
            if (App.originalBlock+(i+1)*4000>=tb) {
                   App.instance.getPastEvents ('inRecord',{filter: {"_from":App.accounts[0]}, fromBlock: App.originalBlock+4000*i, toBlock: 'latest'},function (error,result) {
  
 return result;
  }).then(x=>{
   UpdateInLog(x);
  });
            }
            else {
                   App.instance.getPastEvents ('inRecord',{filter: {"_from":App.accounts[0]}, fromBlock: App.originalBlock+i*4000, toBlock: App.originalBlock+(i+1)*4000},function (error,result) {
  
 return result;
  }).then(x=>{
   UpdateInLog(x);
  });
            }

          }

        }

      }


//-------------------
  if (mmm<4000) {
      App.instance.getPastEvents ('outRecord',{filter: {"_to":App.accounts[0]}, fromBlock: App.originalBlock, toBlock: 'latest'},function (error,result) {
 return result;
  })
.then(x=>{
   UpdateOutLog(x);
  });
      }else {
       let _mmm=Math.floor(mmm/4000);
        for (let i = 0; i <=_mmm; i++) {
          if (i==0) {
       App.instance.getPastEvents ('outRecord',{filter: {"_to":App.accounts[0]}, fromBlock: App.originalBlock, toBlock: App.originalBlock+4000},function (error,result) {
 return result;
  }).then(x=>{
   UpdateOutLog(x);
  });
          }
          else {
            if (App.originalBlock+(i+1)*4000>=tb) {
                   App.instance.getPastEvents ('outRecord',{filter: {"_to":App.accounts[0]}, fromBlock: App.originalBlock+4000*i, toBlock: 'latest'},function (error,result) {
 return result;
  }).then(x=>{
   UpdateOutLog(x);
  });
            }
            else {
                   App.instance.getPastEvents ('outRecord',{filter: {"_to":App.accounts[0]}, fromBlock: App.originalBlock+i*4000, toBlock: App.originalBlock+(i+1)*4000},function (error,result) {
 return result;
  }).then(x=>{
   UpdateOutLog(x);
  });
            }

          }

        }

      }
    
  }


function get_mon () {
 App.instance.methods.balanceOfFromFML(App.accounts[0]).call(function (err,res) {
           $('#balance').text(Str_inof(web3.utils.fromWei(res,'ether'),5) +"USDT");
          }); 
}

//获取授权额度
function get_approve_edu() {
   App.fml_instance.methods.allowance(App.accounts[0],App.contract_Addr).call(function (err,res) {

             App.infor.approv=web3.utils.fromWei(res,'ether');
             $("#approve_edu").text( Str_inof(web3.utils.fromWei(res,'ether'),5)+"USDT");
            })
}


 function Str_inof(x,y) {
  return x.substring(0,x.indexOf(".") + y)
 }


 function UpdateOutLog(x){
 for (let i = 0; i < x.length; i++){
if (!inArry(App.logArrOut,x[i].returnValues._time)){

       App.logArrOut.push(x[i]);
      var row= document.createElement('tr');
        $('#tables_in').append(row);  // jq 没有appendChild
         var c1= document.createElement('td');
         var c2= document.createElement('td');
         var c3= document.createElement('td');
         var c4= document.createElement('td');
         row.appendChild(c1);
         row.appendChild(c2);
         row.appendChild(c3);
         row.appendChild(c4);
         c1.innerText =timeStampToTime(x[i].returnValues._time) ;
 c3.innerText = web3.utils.fromWei(x[i].returnValues._value,'ether')+"USDT";
         if (x[i].returnValues._type==1) {
            c2.innerText ="+:基本仓";
         }
         else if (x[i].returnValues._type==2) {
           c2.innerText ="+:基本仓";
         }
           else if (x[i].returnValues._type==3) {
           c2.innerText ="+:利润仓(3)";//管理员划拨
         }
           else if (x[i].returnValues._type==4) {
            c2.innerText ="+:推荐仓(4)";//管理员划拨
         }
           else if (x[i].returnValues._type==5) {
            c2.innerText ="-:基本仓";
         }
          else if (x[i].returnValues._type==6) {
            c2.innerText ="-:利润仓";
         }
         else if (x[i].returnValues._type==7) {
           c2.innerText ="-:推荐仓";
         }
         else if (x[i].returnValues._type==8) {
           c2.innerText ="+:基本仓(8)"; //管理员划拨
         }
          else if (x[i].returnValues._type==13) {
           c2.innerText ="+:推荐仓(13)";// 推荐返
         }
         else if (x[i].returnValues._type==14) {
           c2.innerText ="+:推荐仓(14)"; // 推荐返
         }
         else if (x[i].returnValues._type==15) {
           c2.innerText ="+:推荐仓(15)"; //充值返

         }
        c4.innerText =web3.utils.fromWei(x[i].returnValues.total_account,'ether')+"USDT";
      

}
 }

   }
   function UpdateInLog(x) {
       for ( let i= 0; i < x.length; i++){
       if (!inArry(App.logArrIn,x[i].returnValues._time)){
      App.logArrIn.push(x[i]);
      var row= document.createElement('tr');
        $('#tables_out').append(row);  // jq 没有appendChild
         var c1= document.createElement('td');
         var c2= document.createElement('td');
         var c3= document.createElement('td');
         var c4= document.createElement('td');
         row.appendChild(c1);
         row.appendChild(c2);
         row.appendChild(c3);
         row.appendChild(c4);
         c1.innerText = timeStampToTime(x[i].returnValues._time) ;
         c2.innerText ="-"+ web3.utils.fromWei(x[i].returnValues._value,'ether')+"USDT";
         c3.innerText =web3.utils.fromWei(x[i].returnValues.total_account,'ether')+"USDT";

         if (x[i].returnValues.total_account==0) {
           c4.innerText =0;
         }else {
            c4.innerText = timeStampToTime(x[i].returnValues._limit_time);
         }
        
}
 }
   }

    async  function UpdateCustomLog() {
         let mn=0;
         App.instance.methods.get_Length_acters().call(function  (err,res) {
          mn=res;
          console.log(res);
              for ( let i= 1; i <= mn; i++){
          App.instance.methods.getAddrFromIndex(i).call(function  (err,res) {
           
             App.instance.methods.getActorAdmin(res).call(function  (err,res) {
             // 的手写一个 JS 数组 遍历函数
        var row= document.createElement('tr');
        $('#customs_table').append(row);  // jq 没有appendChild
         var c1= document.createElement('td');
         var c2= document.createElement('td');
         var c3= document.createElement('td');
         var c4= document.createElement('td');
          var c5= document.createElement('td');
         var c6= document.createElement('td');
         var c7= document.createElement('td');
         var c8= document.createElement('td');
          var c9= document.createElement('td');
         var c10= document.createElement('td');
         var c11= document.createElement('td');
         var c12= document.createElement('td');
         row.appendChild(c1);
         row.appendChild(c2);
         row.appendChild(c3);
         row.appendChild(c4);
         row.appendChild(c5);
         row.appendChild(c6);
         row.appendChild(c7);
         row.appendChild(c8);
         row.appendChild(c9);
         row.appendChild(c10);
         row.appendChild(c11);
         row.appendChild(c12);
         c1.innerText=res.name;
          c2.innerText=addr_Trans(res.sigin_addr);
           c3.innerText=addr_Trans(res.addr);
            c4.innerText=addr_Trans(res._mrAr);
            c5.innerText=addr_Trans(res._orr);
             c6.innerText=web3.utils.fromWei(res._baAt,'ether');
              c7.innerText=web3.utils.fromWei(res._ptAt,'ether');
               c8.innerText=web3.utils.fromWei(res._mAt,'ether');
                c9.innerText=res._mrCs;
                 c10.innerText=res._orCs;
                  c11.innerText=res.deep_level;
                   c12.innerText=res.team_number;

        });
          

        });
         

  
        };
        });
         
     

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
           App.infor.base_mon=web3.utils.fromWei(res[6],'ether');
          App.infor.porfit_mon=web3.utils.fromWei(res[7],'ether');
          App.infor.mem_mon=web3.utils.fromWei(res[8],'ether');
            App.infor.limiteTime=res[5];
             App.infor.mem_mon.isExist=res[9];
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
           App.infor.mem_mon.isExist=res[9];
          updateSelInfor();
          UpdateLog();
     });
 }

  function updateSelInfor() {
          if (typeof App.infor.out_addr) {
            if ( App.infor.isExist) {
             $('#doo_account1').text(addr_Trans(App.infor.out_addr));
             $('#doo_account2').text(addr_Trans(App.infor.out_addr));
          if (typeof App.infor.base_mon) {

            $('#base_mon').text(Str_inof(App.infor.base_mon,5)+"USDT");
           }
            if (typeof App.infor.porfit_mon) {

            $('#porfit_mon').text(Str_inof(App.infor.porfit_mon,5)+"USDT");
           }
            if (typeof App.infor.mem_mon) {
            $('#mem_mon').text(Str_inof(App.infor.mem_mon,5)+"USDT");
            
           }
                  }else {
               $('#doo_account1').text("注：请先创建doo账户！");
               $('#doo_account1').css('color','red')
                 $('#doo_account2').text("注：请先创建doo账户！");
               $('#doo_account2').css('color','red')
           }

           }else{
                 $('#doo_account1').text("注：请先创建doo账户！");
               $('#doo_account1').css('color','red')
                 $('#doo_account2').text("注：请先创建doo账户！");
               $('#doo_account2').css('color','red')
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
    }


function getBalanceOfMainOnly () {
         App.instance.methods.balanceOfFromFML(App.accounts[0]).call(function (err,res) {
       $("#usdt_cu").text(web3.utils.fromWei(res,'ether'));
       // let n= net_Ids.is
       // $("#chain").text( App.net_Names.App.chainIdd);
     });
}

   function getNotic () {
            App.instance.methods._notic().call(function (err,res) {
             $("#_notic").val(res);
          });
         
    
       }
       //字符串 截取函数，取前4位和 后4位，中间用3个小点
       function addr_Trans( str_in) {
       return str_in.slice(0,4)+"...."+str_in.slice(37,42);
       }

  $(function() {
  $(window).load(function() {
    App.ininWebs();
     });
});