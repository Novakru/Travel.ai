import json

str = '''
{
  "第一天": {
    "早上": [
      {
        "时间": "8:00-9:30",
        "地点": "天安门广场"
      },
      {
        "时间": "9:30-11:00",
        "地点": "毛主席纪念堂"
      }
    ],
    "中午": [
      {
        "时间": "11:00-12:30",
        "地点": "四季民福烤鸭店"
      }
    ],
    "下午": [
      {
        "时间": "13:00-16:00",
        "地点": "故宫博物院"
      },
      {
        "时间": "16:30-18:00",
        "地点": "景山公园"
      }
    ],
    "晚上": [
      {
        "时间": "18:30-20:00",
        "地点": "王府井步行街"
      },
      {
        "时间": "20:30-21:30",
        "地点": "天安门广场"
      }
    ]
  },
  "第二天": {
    "早上": [
      {
        "时间": "8:00-10:00",
        "地点": "颐和园"
      },
      {
        "时间": "10:30-12:00",
        "地点": "圆明园"
      }
    ],
    "中午": [
      {
        "时间": "12:00-13:30",
        "地点": "餐馆（豆汁、焦圈）"
      }
    ],
    "下午": [
      {
        "时间": "14:00-16:30",
        "地点": "八达岭长城"
      },
      {
        "时间": "17:00-18:30",
        "地点": "明十三陵"
      }
    ],
    "晚上": [
      {
        "时间": "19:00-21:00",
        "地点": "奥林匹克公园"
      }
    ]
  },
  "第三天": {
    "早上": [
      {
        "时间": "8:00-10:00",
        "地点": "天坛公园"
      },
      {
        "时间": "10:30-12:00",
        "地点": "中国美术馆"
      }
    ],
    "中午": [
      {
        "时间": "12:00-13:30",
        "地点": "餐馆（炸酱面）"
      }
    ],
    "下午": [
      {
        "时间": "14:00-16:00",
        "地点": "北京动物园"
      },
      {
        "时间": "16:30-18:00",
        "地点": "北京植物园"
      }
    ],
    "晚上": [
      {
        "时间": "18:30-20:00",
        "地点": "南锣鼓巷"
      },
      {
        "时间": "20:30-22:00",
        "地点": "什刹海"
      }
    ]
  }
}
'''
print(str)
