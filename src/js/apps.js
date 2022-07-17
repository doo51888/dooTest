Web3 = require('web3');
fs= require('fs');

App={
 // net_Ids:["0x1","0x38","0x80","0x42","0x89","0xa86a","0x141","0x61"];
 // net_Names:["以太坊主网","以太坊主网","火币生态链","OKExChain","Polygon(Matic)","Avalanche C-Chain","KCC Mainnet","币安测试链"];
 //  // 1.  基本仓官方入款  
      // 2.  基本仓代理模式入款
      // 3.  利润仓入款
      // 4.  推荐仓入款

      // 5.  基本仓提款
      // 6.  利润仓提款
      // 7.  推荐仓提款
      // 8.  管理员加基本仓
      // 9.
//成熟案列 0x74dBD8Cc858ab7891c7A56D8e9922B4521754C4B

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
  ininWebs:async function (){

  if (typeof window.ethereum !== 'undefined'){
     if (window.ethereum){
       App.web3Provider = window.ethereum;
        App.accounts=  await ethereum.request({ method: 'eth_requestAccounts' });
        let chainIds=  await ethereum.request({ method: 'eth_chainId'});
     $("#chain").text(chainIds);
     $("#mon_main").text(App.accounts[0]);
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
     
      $.getJSON('./artifacts/test.json', function(data){
       App.instance = new web3.eth.Contract(data.abi,App.contract_Addr,{from:App.accounts[0]});
      });
         $.getJSON('./artifacts/fml.json',  function(data){
       App.fml_instance =  new web3.eth.Contract(data.abi,App.contract_usdtd,{from:App.accounts[0]});
      });
  }
    
    return App.initBingEvent(); 
   
  }
},


   /************************************************************************************************
 *                           绑定事件开始
 * ***********************************************************************************************
 */


  initBingEvent: function (){

 //获取全部会员 customs_get
 $("#customs_get").on('click',  function () {
        UpdateCustomLog();
      });

//设置Class  
 $("#set_class").on('click',  function () {
         let _get=$("#sel5 option:selected").val().split(":")[1];
         let class_type=$("#class_type").val();
         let class_value=$("#class_value").val();
          App.instance.methods.setClass(_get,class_value,class_type).send({from:App.accounts[0]})
          .on('receipt',function(receipt){
             alert("设置Class");
          })
      });

  // 初始化
     $("#Initialize").on('click',  function () {
         
          let allow_min_profit=$("#allow_min_profit").val()+"000000000000000000";
          let allow_min_mem=$("#allow_min_mem").val()+"000000000000000000";
          App.instance.methods.setAllow_min_value(allow_min_profit,allow_min_mem).send({from:App.accounts[0]})
          .on('receipt',function(receipt){
             alert("初始化最小值");
          })
      });
    $("#set_new_addr").on('click',  function () {
          let addr_type=$("#addr_type").val();
          let new_addr=$("#new_addr_value").val();
           let _get=$("#sel5 option:selected").val().split(":")[1];
          App.instance.methods.setNewAddr(_get,new_addr,addr_type).send({from:App.accounts[0]})
          .on('receipt',function(receipt){
             alert("修改了推荐人/团队长");
          })
      });

   // 团队number tream_number set_team_number _tream_number
      $("#tream_number").on('click',  function () {
          let _tream_number=$("#_tream_number").val();
           let _get=$("#sel5 option:selected").val().split(":")[1];
          App.instance.methods.set_team_number(_get,_tream_number).send({from:App.accounts[0]})
          .on('receipt',function(receipt){
             alert("初始化最小值");
          })
      });

     $("#mag_member").on('click',  function () {
              
              let re=$("#class_type_member").val();
          let _get=$("#sel5 option:selected").val().split(":")[1];
          if (re==1) {
           App.instance.methods.UpdateMemberState(_get,true).send({from:App.accounts[0]})
          .on('receipt',function(receipt){
             alert("添加代理");
          })

          }else {
                App.instance.methods.UpdateMemberState(_get,false).send({from:App.accounts[0]})
          .on('receipt',function(receipt){
             alert("添加代理");
          })
            }
        
      });

  //admin_to_contract
          $("#admin_to_contract").on('click',  function () {
         let mn= $('#sel4').val()+"000000000000000000";
          App.instance.methods.AdminTransforToContract(mn).send({from:App.accounts[0]})
          .on('receipt',function(receipt){
           alert("管理员给合约转账成功，金额是："+mn+"USDT");
          })
      });  

//

 $("#rerel").on('click', function () {
   getBalanceOfMainOnly();
 });

            ethereum.on('accountsChanged', function () {
        $("#mon_main").text("dd:"+ethereum.selectedAddress);
        window.location.reload();
       
      });   


      $("#fmlApprove").on('click',  function () {
         let mn= $('#sel4 option:selected').val()+"000000000000000000";
         alert(mn);
          App.fml_instance.methods.approve(App.contract_Addr,mn).send({from:App.accounts[0]})
          .on('receipt',function(receipt){
           console.log(receipt); 
          })
      });


       $("#sel5").change(function () {
        let _get=$("#sel5 option:selected").val().split(":")[1];
       
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

        $("#mons_in").on('click',  function () {
         // let mn=Number($('#sel4').val().split(":")[1]);
         let mn= $('#sel4 option:selected').val()+"000000000000000000";
          App.instance.methods.transferInFromFML(mn).send({from:App.accounts[0]})
          .on('receipt',function(receipt){
            updateSelInfor();
          })
      });

       

            $("#main_addr").on('click',  function () {
          let _get=$("#sel5 option:selected").val().split(":")[1];
          App.instance.methods.setReceiptAddr(_get).send({from:App.accounts[0]})
          .on('receipt',function(receipt){
            alert('重新设定了收款地址！');
          })
      });

          $("#add_profit").on('click',  function () {
         let _get=$("#sel5 option:selected").val().split(":")[1];
             let mn= $('#sel4 option:selected').val()+"000000000000000000";
          App.instance.methods.addBaseAccount(_get,mn,13).send({from:App.accounts[0]})
          .on('receipt',function(receipt){
             updateSelInfor();
          })
      });
        $("#add_mem").on('click',  function () {
            let mn= $('#sel4 option:selected').val()+"000000000000000000";
            let _get=$("#sel5 option:selected").val().split(":")[1];
           App.instance.methods.addBaseAccount(_get,mn,14).send({from:App.accounts[0]})
          .on('receipt',function(receipt){
            updateSelInfor();
          })
      });
       $("#reset").on('click', async function () {
          
         let sig1=$("#out_addr").val();
         let sig2=$("#mem_addr").val();
         let sig3=$("#name").val();
         
          if (sig2!=null) {
         let re=   await  App.instance.methods.members_addr(sig2);
         if (re) {
           App.instance.methods.UpDateInfor(sig3,sig2,sig1).send({from:App.accounts[0]})
           .on('receipt',function(receipt){
             updateSelInfor();
          })
         }

          }else {
            alert("推荐人不存在！");
          }


       });
       //设置日志
       $("#setNotic").on('click', async function () {
          
          let sig1=$("#_notic").val();
          let mnc=  await App.instance.methods.setNotic(sig1).send({from:App.accounts[0]});
          console.log(mnc);
       });

       // usdt 直接划拨 usdt_trans
    $("#usdt_trans").on('click', async function () {
          let mn= $('#sel4 option:selected').val()+"000000000000000000";
          let _get=$("#sel5 option:selected").val().split(":")[1];
          let mnc=  await App.fml_instance.methods.transfer(_get,mn).send({from:App.accounts[0]});
          console.log(mnc);
       });

     // 获取基本信息 
     $('#refresh').on('click', function () {
       updateSelInfor();
       getNotic();
      
      });

      $("#getlog").on('click', async function  () {
        
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
      }) ;

      $("#newlog").on('click', async function () {
       let  tbsd= await web3.eth.getBlockNumber();
         App.instance.getPastEvents ('inRecord',{filter: {}, fromBlock: tbsd-4000, toBlock: 'latest'},function (error,result) {

 return result;
  })
.then(x=>{
   UpdateInLog(x);
  });



      }); 
    




  }
     /************************************************************************************************
 *                           绑定事件结束
 * ***********************************************************************************************
 */
   /************************************************************************************************
 *                           公共函数 开始
 * ***********************************************************************************************
 */
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




  function updateSelInfor() {
           App.instance.methods.getSelfInfor().call(function (err,res) {
            $('#base_addr').text(addr_Trans(res[0]));
            $('#out_addr').val(addr_Trans(res[3]));
            $('#mem_addr').val(addr_Trans(res[4]));
            $('#name').val(res[1]);
            $('#classs').text(res[11]);
            $('#base_mon').text(web3.utils.fromWei(res[6],'ether'));
            $('#porfit_mon').text(web3.utils.fromWei(res[7],'ether'));
            $('#mem_mon').text(web3.utils.fromWei(res[8],'ether'));
            
     });
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



  /************************************************************************************************
 *                           公共函数 结束
 * ***********************************************************************************************
 */



  
  $(function() {
  $(window).load(function() {
    App.ininWebs();
    // getBalanceOfMainOnly();
  });
});















