/*
建行全球支付Visa卡一元购商品库存监控

链接：https://github.com/Tyrone2333/ccb-visa-1yuan

cron:0 8-18 * * * ccb-visa-1yuan.js

*/


const axios = require('axios')
const sendNotify = require('../sendNotify')
// 需要监控的商品名称列表
const targetItems = ["20元善品公社代金券", "20元京东E卡", "信用卡微信立减金券包"]

// API 请求 URL
const apiUrl = 'https://vtravel.link2shops.com/vfuliApi/api/client/ypJyActivity/goodsList'

// 提醒发送 URL
const notifyUrl = ''

// 检查商品列表
async function checkGoodsList() {

  try {
    // 发送 POST 请求获取商品列表
    const response = await axios.post(apiUrl, {
      activityTag: 'ccbyyg',
      catagoryId: '',
    }, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    })

    // 处理响应数据
    const items = response.data.data.goodsList

    // 查找匹配的商品
    items.forEach(item => {
      if (targetItems.includes(item.name) && item.stockStatus === '0') {
        let title = '全球支付Visa卡一元购'
        let content = `商品 "${item.name}" 现货有库存!`

        console.log('title:', title, 'content:', content)
        // 发送提醒
        sendNotify.sendNotify(title, content)
        // axios.post(notifyUrl + `/${title}/${content}`, {}).catch(error => {
        //   console.error('Error sending notification:', error)
        // })
      }
    })

  } catch (error) {
    console.error('Error fetching goods list:', error)
  }
}

// 定时检查商品列表（例如每分钟检查一次）
checkGoodsList()
